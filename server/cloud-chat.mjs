import { randomBytes, createHash, timingSafeEqual } from 'node:crypto'
import { createAI } from './ai.mjs'
import { createSupabaseStore } from './supabase-store.mjs'
import { validateAttachment, MAX_IMAGE_BYTES } from './attachments.mjs'
import { wantsAdmin } from '../src/lib/assistant.mjs'

const token = () => randomBytes(32).toString('hex')
const hash = value => createHash('sha256').update(value).digest('hex')
const validToken = value => typeof value === 'string' && /^[a-f0-9]{64}$/.test(value)
const idleTimeout = 15 * 60 * 1000
const directing = 'Directing you to Neil. I will pause my replies while you wait for him.'
const message = (from, text, at) => ({ id: token(), from, text, at })
const fail = (status, text) => { throw Object.assign(new Error(text), { status }) }

export function createCloudChatHandler({ store = createSupabaseStore(), password = process.env.ADMIN_PASSWORD, ai = createAI(), clock = Date.now } = {}) {
  const publicChat = row => {
    const { adminTypingUntil, visitorTypingUntil, ...chat } = row.payload
    return { ...chat, adminTyping: adminTypingUntil > clock(), visitorTyping: visitorTypingUntil > clock() }
  }
  function expire(chat) {
    if (['waiting', 'active'].includes(chat.status) && clock() - chat.updatedAt >= idleTimeout) {
      chat.status = 'assistant'
      chat.messages.push(message('assistant', 'There have been no messages for 15 minutes, so I am back to help. Type "talk to Neil" whenever you want to speak with him.', chat.updatedAt + idleTimeout))
      return true
    }
    return false
  }
  // Optimistic updates prevent parallel functions from overwriting messages/read receipts.
  async function mutate(row, change) {
    for (let attempt = 0; attempt < 12; attempt++) {
      if (!row) fail(404, 'Conversation not found.')
      const chat = structuredClone(row.payload)
      const expired = expire(chat)
      const changed = change(chat)
      if (changed === false && !expired) return row
      const saved = await store.compareAndSwap(row, chat)
      if (saved) return saved
      row = await store.find('id', row.id)
    }
    fail(409, 'Another message arrived. Please try again.')
  }
  async function answer(row) {
    const last = row.payload.messages.at(-1)
    if (row.payload.status !== 'assistant' || last?.from !== 'user') return row
    let text, error
    try { text = await ai(row.payload.messages) } catch (e) { error = e.message }
    // Re-read after the provider call: Neil may have replied or the visitor requested him.
    return mutate(await store.find('id', row.id), chat => {
      if (chat.status !== 'assistant' || chat.messages.at(-1)?.id !== last.id) return false
      if (error) chat.aiError = error
      else { chat.messages.push(message('assistant', text, clock())); delete chat.aiError }
    })
  }
  async function makeMessage(body, from, row, owner) {
    const text = typeof body.text === 'string' ? body.text.trim() : ''
    if (text.length > 2000 || (!text && !body.attachment)) fail(400, 'Enter a message of up to 2,000 characters, an image, or a file link.')
    const result = message(from, text, clock())
    if (body.attachment?.type === 'image') {
      const id = body.attachment.id
      if (!validToken(id)) fail(400, 'Upload this image again before sending.')
      const upload = await store.upload(id)
      if (!upload || upload.chat_id !== row.id || upload.owner !== owner) fail(403, 'This upload does not belong to this conversation.')
      const bytes = await store.readImage(id)
      if (bytes.length !== upload.size) fail(400, 'The uploaded image size does not match. Please upload again.')
      // Validate the actual bytes; browser MIME and extensions cannot be trusted.
      const { bytes: ignored, ...metadata } = validateAttachment({ type: 'image', name: upload.name, data: `data:${upload.mime};base64,${bytes.toString('base64')}` })
      result.attachment = { ...metadata, id }
    } else {
      const attachment = validateAttachment(body.attachment)
      if (attachment) result.attachment = attachment
    }
    return result
  }
  return async (req, res, next = () => {}) => {
    const url = new URL(req.url, 'http://localhost')
    if (!url.pathname.startsWith('/api/chat/')) return next()
    const route = url.pathname.slice('/api/chat/'.length)
    const send = (status, data) => { res.writeHead(status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }); res.end(JSON.stringify(data)) }
    const cookie = (name, value, age) => res.setHeader('Set-Cookie', `${name}=${value}; HttpOnly; SameSite=Strict; Path=/api/chat; Max-Age=${age}${process.env.NODE_ENV === 'production' || process.env.VERCEL ? '; Secure' : ''}`)
    try {
      if (!['GET', 'POST'].includes(req.method)) return send(405, { error: 'Method not allowed.' })
      const cookies = Object.fromEntries((req.headers.cookie || '').split(';').map(v => v.trim().split('=')))
      let body = {}
      if (req.method === 'POST') {
        if (req.headers.origin && new URL(req.headers.origin).host !== req.headers.host) fail(403, 'Request origin is not allowed.')
        if (!req.headers['content-type']?.startsWith('application/json')) fail(415, 'JSON is required.')
        // Vercel may parse JSON before calling the handler; Vite exposes a stream.
        if (req.body !== undefined) {
          if (Buffer.byteLength(typeof req.body === 'string' ? req.body : JSON.stringify(req.body)) > 150000) fail(413, 'Message is too large. Upload images using the image button.')
          body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
        } else {
          let raw = '', size = 0
          for await (const chunk of req) { size += chunk.length; if (size > 150000) fail(413, 'Message is too large.'); raw += chunk }
          body = JSON.parse(raw || '{}')
        }
        if (!body || typeof body !== 'object' || Array.isArray(body)) fail(400, 'Invalid request.')
        const ip = process.env.VERCEL ? (req.headers['x-vercel-forwarded-for'] || req.headers['x-forwarded-for'] || req.socket?.remoteAddress) : req.socket?.remoteAddress
        const category = route === 'login' ? 'login' : route.endsWith('upload') ? 'upload' : route === 'ai' || route === 'retry' ? 'ai' : 'write'
        const maximum = { login: 8, upload: 10, ai: 20, write: 120 }[category]
        if (!await store.rateLimit(hash(`${ip}:${category}`), maximum)) fail(429, 'Too many requests. Please wait a minute.')
      }
      const sessionId = validToken(cookies.admin_session) ? hash(`${cookies.admin_session}:${password}`) : null
      const isAdmin = sessionId ? await store.session(sessionId, clock()) : false
      if (route === 'login' && req.method === 'POST') {
        if (!password || password.length < 12) fail(503, 'Admin login is not configured. Set ADMIN_PASSWORD on Vercel (at least 12 characters).')
        if (typeof body.password !== 'string' || !timingSafeEqual(Buffer.from(hash(body.password)), Buffer.from(hash(password)))) fail(401, 'Incorrect password.')
        const id = token()
        await store.login(hash(`${id}:${password}`), clock() + 8 * 3600000)
        cookie('admin_session', id, 8 * 3600)
        return send(200, { ok: true })
      }
      if (route === 'logout' && req.method === 'POST') {
        if (sessionId) await store.logout(sessionId)
        cookie('admin_session', '', 0); return send(200, { ok: true })
      }
      if (route === 'session' && req.method === 'GET') return send(200, { authenticated: isAdmin })
      if (route === 'ai' && req.method === 'POST') {
        const messages = Array.isArray(body.messages) ? body.messages.slice(-24).filter(m => m && ['user', 'assistant'].includes(m.from) && typeof m.text === 'string').map(m => ({ from: m.from, text: m.text.slice(0, 2000) })) : []
        if (!messages.length || messages.at(-1).from !== 'user') fail(400, 'A user message is required.')
        try { return send(200, { text: await ai(messages) }) } catch (e) { fail(503, e.message) }
      }
      const adminRoute = route === 'admin' || route.startsWith('admin/')
      if (adminRoute && !isAdmin) fail(401, 'Please sign in again.')
      if (route === 'admin' && req.method === 'GET') {
        const rows = await store.list()
        const result = []
        for (const row of rows) result.push(publicChat(await mutate(row, () => false)))
        return send(200, result.sort((a, b) => b.updatedAt - a.updatedAt))
      }
      let visitor = cookies.visitor_session
      if (!validToken(visitor)) visitor = token()
      const secret = hash(visitor)
      let row = adminRoute ? (validToken(body.id) ? await store.find('id', body.id) : null) : await store.find('secret', secret)
      if (route.startsWith('image/') && req.method === 'GET') {
        const id = route.slice(6)
        const upload = validToken(id) ? await store.upload(id) : null
        if (!upload) fail(404, 'Image not found.')
        const owner = await store.find('id', upload.chat_id)
        if (!owner || (!isAdmin && owner.secret !== secret) || !owner.payload.messages.some(m => m.attachment?.id === id)) fail(404, 'Image not found.')
        res.writeHead(302, { Location: await store.signImage(id), 'Cache-Control': 'private, no-store', 'Referrer-Policy': 'no-referrer' }); res.end(); return
      }
      if (row) row = await mutate(row, () => false)
      if (!adminRoute) cookie('visitor_session', visitor, 365 * 86400)
      if (route === 'visitor' && req.method === 'GET') return send(200, row ? publicChat(row) : null)
      if (route === 'request' && req.method === 'POST') {
        if (!password || password.length < 12) fail(503, 'Live chat is not available yet. Please email Neil at neilcharlie26@gmail.com.')
        if (!row) {
          const history = Array.isArray(body.messages) ? body.messages.slice(-30).filter(m => m && ['user', 'assistant'].includes(m.from) && typeof m.text === 'string').map(m => message(m.from, m.text.slice(0, 2000), clock())) : []
          const id = token()
          row = await store.insert({ id, secret, version: 0, updated_at: clock(), payload: {
            id, name: typeof body.name === 'string' ? body.name.trim().slice(0, 60) || 'Visitor' : 'Visitor', status: 'assistant', updatedAt: clock(), messages: history,
          } })
        }
        row = await mutate(row, chat => {
          if (['waiting', 'active'].includes(chat.status)) return false
          if (typeof body.text === 'string' && body.text.trim()) chat.messages.push(message('user', body.text.trim().slice(0, 2000), clock()))
          chat.messages.push(message('assistant', directing, clock()))
          chat.status = 'waiting'; chat.updatedAt = clock(); delete chat.aiError
        })
        return send(200, publicChat(row))
      }
      if (!row) fail(404, 'Conversation not found.')
      const role = adminRoute ? 'admin' : 'visitor'
      if (['upload', 'admin/upload'].includes(route) && req.method === 'POST') {
        if (!['image/png', 'image/jpeg', 'image/gif', 'image/webp'].includes(body.mime) || !Number.isInteger(body.size) || body.size < 1 || body.size >= MAX_IMAGE_BYTES) fail(400, 'Choose a PNG, JPEG, GIF or WebP smaller than 5 MB.')
        const id = token()
        await store.addUpload({ id, chat_id: row.id, owner: role === 'admin' ? sessionId : secret, name: typeof body.name === 'string' ? body.name.slice(0, 100) : 'Image', mime: body.mime, size: body.size, created_at: clock() })
        return send(200, { id, url: await store.signUpload(id) })
      }
      if (['typing', 'admin/typing'].includes(route) && req.method === 'POST') {
        await mutate(row, chat => { chat[`${role}TypingUntil`] = body.typing === true ? clock() + 5000 : 0 })
        return send(200, { ok: true })
      }
      if (['read', 'admin/read'].includes(route) && req.method === 'POST') {
        const field = `${role}ReadCount`
        row = await mutate(row, chat => {
          const index = chat.messages.findIndex(m => m.id === body.messageId)
          if (index < 0) fail(400, 'Message not found.')
          if ((chat[field] || 0) >= index + 1) return false
          chat[field] = index + 1
        })
        return send(200, { [field]: row.payload[field] })
      }
      if (route === 'retry' && req.method === 'POST') return send(200, publicChat(await answer(row)))
      if (['message', 'admin/reply'].includes(route) && req.method === 'POST') {
        let incoming
        try { incoming = await makeMessage(body, adminRoute ? 'admin' : 'user', row, adminRoute ? sessionId : secret) }
        catch (e) { fail(e.status || 400, e.message) }
        row = await mutate(row, chat => {
          chat.messages.push(incoming); chat.updatedAt = Math.max(chat.updatedAt, incoming.at); chat[`${role}TypingUntil`] = 0
          if (adminRoute) { chat.status = 'active'; delete chat.aiError }
          else if (wantsAdmin(incoming.text)) {
            chat.status = 'waiting'; delete chat.aiError
            chat.messages.push(message('assistant', directing, clock()))
          }
        })
        if (!adminRoute) row = await answer(row)
        return send(200, publicChat(row))
      }
      return send(404, { error: 'Unknown action.' })
    } catch (error) {
      return send(error.status || (error instanceof SyntaxError ? 400 : 503), { error: error instanceof SyntaxError ? 'Invalid request.' : error.message || 'Could not load chat. Please try again.' })
    }
  }
}
