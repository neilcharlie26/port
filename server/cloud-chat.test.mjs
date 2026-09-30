import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { createCloudChatHandler } from './cloud-chat.mjs'

function memoryStore() {
  const chats = new Map(), sessions = new Map(), uploads = new Map(), images = new Map()
  return {
    chats, images,
    async find(field, value) { return structuredClone([...chats.values()].find(row => row[field] === value) || null) },
    async list() { return structuredClone([...chats.values()]) },
    async insert(row) { const existing = await this.find('secret', row.secret); if (existing) return existing; chats.set(row.id, structuredClone(row)); return structuredClone(row) },
    async compareAndSwap(row, payload) {
      if (chats.get(row.id).version !== row.version) return null
      const saved = { ...row, version: row.version + 1, payload: structuredClone(payload) }
      chats.set(row.id, saved); return structuredClone(saved)
    },
    async session(id, now) { return (sessions.get(id) || 0) > now },
    async login(id, expiry) { sessions.set(id, expiry) },
    async logout(id) { sessions.delete(id) },
    async rateLimit() { return true },
    async addUpload(row) { uploads.set(row.id, row) },
    async upload(id) { return uploads.get(id) || null },
    async signUpload(id) { return `https://storage.example/upload/${id}?token=test` },
    async readImage(id) { return images.get(id) },
    async signImage(id) { return `https://storage.example/image/${id}?token=test` },
  }
}

test('cloud chats survive handler replacement, isolate visitors, and retain handoff/read/typing state', async t => {
  const store = memoryStore(), password = 'test-password-long-enough'
  let now = Date.now(), generate = async () => 'A real provider result'
  const options = { store, password, clock: () => now, ai: messages => generate(messages) }
  let handler = createCloudChatHandler(options)
  const server = createServer((req, res) => handler(req, res))
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
  t.after(() => new Promise(resolve => server.close(resolve)))
  const call = async (route, body, cookie, status = 200, extra = {}) => {
    const r = await fetch(`http://127.0.0.1:${server.address().port}/api/chat/${route}`, {
      method: body === undefined ? 'GET' : 'POST', redirect: 'manual',
      headers: { 'Content-Type': 'application/json', ...(cookie ? { Cookie: cookie } : {}), ...extra },
      body: body === undefined ? undefined : JSON.stringify(body),
    })
    const data = r.status === 302 ? r.headers.get('location') : await r.json()
    assert.equal(r.status, status, JSON.stringify(data))
    return { data, cookie: r.headers.get('set-cookie')?.split(';')[0] }
  }
  await call('admin', undefined, undefined, 401)
  await call('login', { password: 'wrong' }, undefined, 401)
  await call('login', { password }, undefined, 403, { Origin: 'https://attacker.example' })
  const admin = await call('login', { password })
  const first = await call('visitor')
  const cookie = first.cookie
  assert.equal(first.data, null)
  const requested = await call('request', { text: 'talk to neil' }, cookie)
  const id = requested.data.id
  assert.equal(requested.data.status, 'waiting')
  assert.match(requested.data.messages.at(-1).text, /Directing/)
  assert.equal('secret' in requested.data, false)
  assert.equal((await call('visitor')).data, null)
  assert.equal((await call('message', { text: 'Hi' }, cookie)).data.messages.at(-1).from, 'user')
  handler = createCloudChatHandler(options)
  assert.equal((await call('session', undefined, admin.cookie)).data.authenticated, true)
  assert.equal((await call('visitor', undefined, cookie)).data.id, id)
  const replies = await Promise.all(['first', 'second', 'third'].map(text => call('admin/reply', { id, text }, admin.cookie)))
  const saved = (await call('visitor', undefined, cookie)).data
  for (const text of ['first', 'second', 'third']) assert(saved.messages.some(m => m.text === text))
  assert.equal(replies.length, 3)
  const activity = saved.updatedAt
  await call('typing', { typing: true }, cookie)
  assert.equal((await call('admin', undefined, admin.cookie)).data[0].visitorTyping, true)
  await call('admin/read', { id, messageId: saved.messages.at(-1).id }, admin.cookie)
  await call('admin/read', { id, messageId: saved.messages[0].id }, admin.cookie)
  assert.equal((await call('visitor', undefined, cookie)).data.adminReadCount, saved.messages.length)
  now += 5001
  assert.equal((await call('admin', undefined, admin.cookie)).data[0].visitorTyping, false)
  assert.equal((await call('visitor', undefined, cookie)).data.updatedAt, activity)
  now = activity + 15 * 60000 - 1
  assert.equal((await call('visitor', undefined, cookie)).data.status, 'active')
  now++
  const expired = (await call('visitor', undefined, cookie)).data
  assert.equal(expired.status, 'assistant')
  assert.equal((await call('visitor', undefined, cookie)).data.messages.length, expired.messages.length)
  assert.equal((await call('message', { text: 'What can Neil build?' }, cookie)).data.messages.at(-1).text, 'A real provider result')
  // A slow provider result must not reply after Neil takes over in another function.
  let finish, started
  const ready = new Promise(resolve => { started = resolve })
  generate = () => { started(); return new Promise(resolve => { finish = resolve }) }
  const pending = call('message', { text: 'More details?' }, cookie)
  await ready
  await call('admin/reply', { id, text: 'Neil here' }, admin.cookie)
  finish('Discard me')
  assert.equal((await pending).data.messages.some(m => m.text === 'Discard me'), false)
  now += 15 * 60000
  generate = async () => { throw new Error('Provider temporarily unavailable') }
  assert.match((await call('message', { text: 'AI again?' }, cookie)).data.aiError, /Provider/)
  generate = async () => 'Recovered reply'
  assert.equal((await call('retry', {}, cookie)).data.messages.at(-1).text, 'Recovered reply')
  assert.equal((await call('message', { text: 'talk to Neil' }, cookie)).data.status, 'waiting')
  // Direct uploads: enforce 5 MB, check actual bytes, and authorize downloads.
  await call('upload', { mime: 'image/png', size: 5000000 }, cookie, 400)
  const bytes = Buffer.from([137,80,78,71,13,10,26,10,0])
  const upload = (await call('upload', { mime: 'image/png', size: bytes.length, name: 'photo.png' }, cookie)).data
  store.images.set(upload.id, bytes)
  const other = await call('request', {}, (await call('visitor')).cookie)
  await call('message', { attachment: { type: 'image', id: upload.id } }, other.cookie, 403)
  await call(`image/${upload.id}`, undefined, cookie, 404)
  const photo = await call('message', { attachment: { type: 'image', id: upload.id } }, cookie)
  assert.equal(photo.data.messages.at(-1).attachment.id, upload.id)
  assert.equal('data' in photo.data.messages.at(-1).attachment, false)
  await call(`image/${upload.id}`, undefined, other.cookie, 404)
  assert.match((await call(`image/${upload.id}`, undefined, cookie, 302)).data, /storage.example/)
  await call(`image/${upload.id}`, undefined, admin.cookie, 302)
  await call('message', { attachment: { type: 'link', url: 'javascript:alert(1)' } }, cookie, 400)
  await call('logout', {}, admin.cookie)
  assert.equal((await call('session', undefined, admin.cookie)).data.authenticated, false)
})
