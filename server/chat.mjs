import { randomBytes, createHash, timingSafeEqual } from 'node:crypto'
import { mkdirSync, existsSync, readFileSync, writeFileSync, renameSync } from 'node:fs'
import path from 'node:path'
import { wantsAdmin } from '../src/lib/assistant.mjs'
import { createAI } from './ai.mjs'
import { validateAttachment } from './attachments.mjs'

const token = () => randomBytes(32).toString('hex')
const hash = value => createHash('sha256').update(value).digest()
const visitorCookieAge = 365 * 86400
const idleTimeout = 15 * 60 * 1000
const directingMessage = 'Directing you to Neil. I will pause my replies while you wait for him.'
// Chat history reset requested by the owner on 2026-09-28; private backup retained.
export function createChatHandler({ directory = process.env.CHAT_DATA_DIR || '.chat-data', password = process.env.ADMIN_PASSWORD, clock = Date.now, ai = createAI() } = {}) {
  mkdirSync(directory, { recursive: true })
  const file = path.join(directory, 'conversations.json')
  let chats = existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : []
  const sessions = new Map(), limits = new Map()
  const typing = new Map()
  const generating = new Map()
  const save = () => { writeFileSync(file + '.tmp', JSON.stringify(chats), { mode: 0o600 }); renameSync(file + '.tmp', file) }
  // Retain old histories while removing the retired closed-conversation state.
  if (chats.some(chat => chat.status === 'resolved')) {
    for (const chat of chats) if (chat.status === 'resolved') chat.status = 'assistant'
    save()
  }
  const publicChat = ({ secret, ...chat }) => ({ ...chat,
    adminTyping: (typing.get(`${chat.id}:admin`) || 0) > clock(),
    visitorTyping: (typing.get(`${chat.id}:visitor`) || 0) > clock(),
  })
  const makeMessage = (body, from, now) => {
    const text = typeof body.text === 'string' ? body.text.trim() : ''
    const attachment = validateAttachment(body.attachment)
    if (text.length > 2000 || (!text && !attachment)) throw new Error('Enter a message of up to 2,000 characters, an image, or a file link.')
    const message = { id: token(), from, text, at: now }
    if (attachment?.type === 'image') {
      const id = token()
      mkdirSync(path.join(directory, 'images'), { recursive: true })
      writeFileSync(path.join(directory, 'images', id), attachment.bytes, { mode: 0o600 })
      const { bytes, ...metadata } = attachment
      message.attachment = { ...metadata, id }
    } else if (attachment) message.attachment = attachment
    return message
  }
  const markRead = (chat, body, reader) => {
    const index = chat.messages.findIndex(message => message.id === body.messageId)
    if (index < 0) return false
    const field = reader === 'admin' ? 'adminReadCount' : 'visitorReadCount'
    chat[field] = Math.max(chat[field] || 0, index + 1)
    save()
    return true
  }
  const answer = async chat => {
    const last = chat.messages.at(-1)
    if (chat.status !== 'assistant' || last?.from !== 'user') return
    const existing = generating.get(chat.id)
    if (existing) { await existing; return answer(chat) }
    const task = (async () => {
      try {
        const text = await ai(chat.messages.slice())
        if (chat.status === 'assistant' && chat.messages.at(-1)?.id === last.id) {
          chat.messages.push({ id: token(), from: 'assistant', text, at: clock() }); delete chat.aiError; save()
        }
      } catch (error) {
        if (chat.status === 'assistant' && chat.messages.at(-1)?.id === last.id) { chat.aiError = error.message; save() }
      }
    })()
    generating.set(chat.id, task)
    try { await task } finally { generating.delete(chat.id) }
  }
  return async (req, res, next = () => {}) => {
    const url = new URL(req.url, 'http://localhost')
    if (!url.pathname.startsWith('/api/chat/')) return next()
    const send = (status, value) => { res.writeHead(status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }); res.end(JSON.stringify(value)) }
    const cookie = (name, value, age) => res.setHeader('Set-Cookie', `${name}=${value}; HttpOnly; SameSite=Strict; Path=/api/chat; Max-Age=${age}${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`)
    const cookies = Object.fromEntries((req.headers.cookie || '').split(';').map(v => v.trim().split('=')))
    const now = clock()
    for (const [key, expiry] of typing) if (expiry <= now) typing.delete(key)
    for (const [key, expiry] of sessions) if (expiry < now) sessions.delete(key)
    for (const [key, value] of limits) if (value.until < now) limits.delete(key)
    const isAdmin = sessions.has(cookies.admin_session)
    if (req.method !== 'GET') {
      if (req.headers.origin && new URL(req.headers.origin).host !== req.headers.host) return send(403, { error: 'Request origin is not allowed.' })
      if (!req.headers['content-type']?.startsWith('application/json')) return send(415, { error: 'JSON is required.' })
      const key = req.socket.remoteAddress + (url.pathname.endsWith('/login') ? ':login' : ':write')
      const limit = limits.get(key) || { count: 0, until: now + 60000 }
      limits.set(key, limit)
      if (++limit.count > (key.endsWith(':login') ? 8 : 80)) return send(429, { error: 'Too many requests. Please wait a minute.' })
    }
    try {
      if (url.pathname.startsWith('/api/chat/image/') && req.method === 'GET') {
        const id = url.pathname.slice('/api/chat/image/'.length)
        const owner = chats.find(c => c.messages.some(m => m.attachment?.type === 'image' && m.attachment.id === id))
        if (!owner || (!isAdmin && owner.secret !== cookies.visitor_session)) return send(404, { error: 'Image not found.' })
        const attachment = owner.messages.find(m => m.attachment?.id === id).attachment
        const bytes = readFileSync(path.join(directory, 'images', id))
        res.writeHead(200, { 'Content-Type': attachment.mime, 'Content-Length': bytes.length, 'Cache-Control': 'private, no-store', 'X-Content-Type-Options': 'nosniff', 'Content-Security-Policy': "default-src 'none'" })
        res.end(bytes); return
      }
      // Derive expiry from persisted activity, including after a restart or closed tab.
      // Reading/polling never counts as communication.
      let expired = false
      for (const chat of chats) {
        if (['waiting', 'active'].includes(chat.status) && now - chat.updatedAt >= idleTimeout) {
          chat.status = 'assistant'
          chat.messages.push({ id: token(), from: 'assistant', text: 'There have been no messages for 15 minutes, so I am back to help. Type "talk to Neil" whenever you want to speak with him.', at: chat.updatedAt + idleTimeout })
          expired = true
        }
      }
      if (expired) save()
      let body = {}
      if (req.method !== 'GET') {
        let raw = '', size = 0
        const limit = ['/api/chat/message', '/api/chat/admin/reply'].includes(url.pathname) ? 6_700_000 : 150_000
        for await (const chunk of req) { size += chunk.length; if (size > limit) return send(413, { error: 'Image or message is too large. Images must be smaller than 5 MB.' }); raw += chunk }
        try { body = JSON.parse(raw || '{}') } catch { return send(400, { error: 'Invalid request.' }) }
        if (!body || typeof body !== 'object') return send(400, { error: 'Invalid request.' })
      }
      const route = url.pathname.slice('/api/chat/'.length)
      if (route === 'ai' && req.method === 'POST') {
        const messages = Array.isArray(body.messages) ? body.messages.slice(-24).filter(m => m && ['user', 'assistant'].includes(m.from) && typeof m.text === 'string').map(m => ({ from: m.from, text: m.text.slice(0, 2000) })) : []
        if (!messages.length || messages.at(-1).from !== 'user') return send(400, { error: 'A user message is required.' })
        try { return send(200, { text: await ai(messages) }) } catch (error) { return send(503, { error: error.message }) }
      }
      if (route === 'login' && req.method === 'POST') {
        if (!password || password.length < 12) return send(503, { error: 'Admin login is not configured. Set ADMIN_PASSWORD on the server (at least 12 characters).' })
        if (typeof body.password !== 'string' || !timingSafeEqual(hash(body.password), hash(password))) return send(401, { error: 'Incorrect password.' })
        const id = token(); sessions.set(id, now + 8 * 3600000); cookie('admin_session', id, 8 * 3600)
        return send(200, { ok: true })
      }
      if (route === 'logout' && req.method === 'POST') { sessions.delete(cookies.admin_session); cookie('admin_session', '', 0); return send(200, { ok: true }) }
      if (route === 'session' && req.method === 'GET') return send(200, { authenticated: isAdmin })
      if (route.startsWith('admin')) {
        if (!isAdmin) return send(401, { error: 'Please sign in again.' })
        if (route === 'admin' && req.method === 'GET') return send(200, chats.map(publicChat).sort((a, b) => b.updatedAt - a.updatedAt))
        const chat = chats.find(c => c.id === body.id)
        if (!chat) return send(404, { error: 'Conversation not found.' })
        if (route === 'admin/upload' && req.method === 'POST') return send(200, { inline: true })
        if (route === 'admin/typing' && req.method === 'POST') {
          typing.set(`${chat.id}:admin`, body.typing === true ? now + 5000 : 0)
          return send(200, { ok: true })
        }
        if (route === 'admin/read' && req.method === 'POST') {
          if (!markRead(chat, body, 'admin')) return send(400, { error: 'Message not found.' })
          return send(200, { adminReadCount: chat.adminReadCount })
        }
        if (route === 'admin/reply' && req.method === 'POST') {
          let message
          try { message = makeMessage(body, 'admin', now) } catch (error) { return send(400, { error: error.message }) }
          chat.messages.push(message); chat.status = 'active'
          delete chat.aiError
          typing.delete(`${chat.id}:admin`)
        }
        else return send(404, { error: 'Unknown action.' })
        chat.updatedAt = now; save(); return send(200, publicChat(chat))
      }
      let chat = chats.find(c => c.secret === cookies.visitor_session)
      // Renew the same browser identity on every visit; never replace an existing thread.
      if (chat) cookie('visitor_session', chat.secret, visitorCookieAge)
      if (route === 'visitor' && req.method === 'GET') return send(200, chat ? publicChat(chat) : null)
      if (route === 'upload' && req.method === 'POST') return chat ? send(200, { inline: true }) : send(404, { error: 'Conversation not found.' })
      if (route === 'retry' && req.method === 'POST') {
        if (!chat) return send(404, { error: 'Conversation not found.' })
        await answer(chat); return send(200, publicChat(chat))
      }
      if (route === 'typing' && req.method === 'POST') {
        if (!chat) return send(404, { error: 'Conversation not found.' })
        typing.set(`${chat.id}:visitor`, body.typing === true ? now + 5000 : 0)
        return send(200, { ok: true })
      }
      if (route === 'read' && req.method === 'POST') {
        if (!chat) return send(404, { error: 'Conversation not found.' })
        if (!markRead(chat, body, 'visitor')) return send(400, { error: 'Message not found.' })
        return send(200, { visitorReadCount: chat.visitorReadCount })
      }
      if (route === 'request' && req.method === 'POST') {
        if (!password || password.length < 12) return send(503, { error: 'Live chat is not available yet. Please email Neil at neilcharlie26@gmail.com.' })
        if (chat && ['waiting', 'active'].includes(chat.status)) return send(200, publicChat(chat))
        if (chat) {
          if (typeof body.text === 'string' && body.text.trim()) chat.messages.push({ id: token(), from: 'user', text: body.text.trim().slice(0, 2000), at: now })
          chat.messages.push({ id: token(), from: 'assistant', text: directingMessage, at: now })
          delete chat.aiError
          chat.status = 'waiting'; chat.updatedAt = now; save()
          return send(200, publicChat(chat))
        }
        const history = Array.isArray(body.messages) ? body.messages.slice(-30).filter(m => m && ['user', 'assistant'].includes(m.from) && typeof m.text === 'string').map(m => ({ id: token(), from: m.from, text: m.text.slice(0, 2000), at: now })) : []
        chat = { id: token(), secret: token(), name: typeof body.name === 'string' ? body.name.trim().slice(0, 60) || 'Visitor' : 'Visitor', status: 'waiting', updatedAt: now, messages: history }
        if (typeof body.text === 'string' && body.text.trim()) chat.messages.push({ id: token(), from: 'user', text: body.text.trim().slice(0, 2000), at: now })
        chat.messages.push({ id: token(), from: 'assistant', text: directingMessage, at: now })
        chats.push(chat); save(); cookie('visitor_session', chat.secret, visitorCookieAge)
        return send(201, publicChat(chat))
      }
      if (route === 'message' && req.method === 'POST') {
        if (!chat) return send(404, { error: 'Request an admin conversation first.' })
        let message
        try { message = makeMessage(body, 'user', now) } catch (error) { return send(400, { error: error.message }) }
        const text = message.text
        chat.messages.push(message); chat.updatedAt = now
        typing.delete(`${chat.id}:visitor`)
        if (wantsAdmin(text)) {
          chat.status = 'waiting'
          delete chat.aiError
          chat.messages.push({ id: token(), from: 'assistant', text: directingMessage, at: now })
        }
        save()
        await answer(chat)
        return send(200, publicChat(chat))
      }
      return send(404, { error: 'Unknown action.' })
    } catch { return send(500, { error: 'Could not save or load this conversation. Please try again.' }) }
  }
}
