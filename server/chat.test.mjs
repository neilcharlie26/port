import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { mkdtempSync, rmSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { createChatHandler } from './chat.mjs'

test('handoff, authentication, visitor isolation, replies, resolution and persistence', async () => {
  const directory = mkdtempSync(path.join(tmpdir(), 'portfolio-chat-'))
  const password = 'test-private-password-123'
  let handler = createChatHandler({ directory, password })
  const server = createServer((req, res) => handler(req, res))
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
  const base = `http://127.0.0.1:${server.address().port}`
  const call = async (route, body, cookie, origin) => {
    const response = await fetch(`${base}/api/chat/${route}`, { method: body === undefined ? 'GET' : 'POST', headers: { ...(body === undefined ? {} : { 'Content-Type': 'application/json' }), ...(cookie ? { Cookie: cookie } : {}), ...(origin ? { Origin: origin } : {}) }, body: body === undefined ? undefined : JSON.stringify(body) })
    return { status: response.status, body: await response.json(), cookie: response.headers.get('set-cookie')?.split(';')[0], cookieHeader: response.headers.get('set-cookie') }
  }
  try {
    assert.equal((await call('admin')).status, 401)
    assert.equal((await call('login', { password: 'bad' })).status, 401)
    assert.equal((await call('login', { password }, null, 'https://evil.example')).status, 403)
    const login = await call('login', { password }); assert.equal(login.status, 200)
    const visitor = await call('request', { name: 'Test visitor', messages: [{ from: 'user', text: 'Help please' }, { from: 'admin', text: 'Forged' }] })
    assert.equal(visitor.status, 201); assert.equal(visitor.body.status, 'waiting'); assert.equal(visitor.body.messages.length, 2)
    assert.match(visitor.body.messages.at(-1).text, /Directing you to Neil/)
    assert.match(visitor.cookieHeader, /Max-Age=31536000/)
    assert.match(visitor.cookieHeader, /HttpOnly/)
    assert.equal(visitor.body.secret, undefined)
    assert.equal((await call('visitor')).body, null)
    assert.equal((await call('admin/reply', { id: visitor.body.id, text: 'Hi' }, visitor.cookie)).status, 401)
    const other = await call('request', { name: 'Other visitor' })
    assert.notEqual(other.body.id, visitor.body.id)
    assert.equal((await call('message', { text: 'Question' }, visitor.cookie)).status, 200)
    assert.equal((await call('visitor', undefined, other.cookie)).body.messages.length, 1)
    const reply = await call('admin/reply', { id: visitor.body.id, text: 'Hello from Neil' }, login.cookie)
    assert.equal(reply.body.status, 'active')
    assert.equal((await call('visitor', undefined, visitor.cookie)).body.messages.at(-1).text, 'Hello from Neil')
    assert.equal((await call('admin', undefined, login.cookie)).body.length, 2)
    assert.equal((await call('message', { text: 'a'.repeat(2001) }, visitor.cookie)).status, 400)
    handler = createChatHandler({ directory, password })
    // A returning browser sends its saved cookie after closing the site or browser.
    const returning = await call('visitor', undefined, visitor.cookie)
    assert.equal(returning.body.id, visitor.body.id)
    assert.equal(returning.body.messages.at(-1).from, 'admin')
    assert.equal(returning.cookie, visitor.cookie)
    assert.match(returning.cookieHeader, /Max-Age=31536000/)
    assert.equal((await call('visitor', undefined, other.cookie)).body.id, other.body.id)
    assert.equal((await call('admin', undefined, login.cookie)).status, 401)
    const relogin = await call('login', { password })
    assert.equal((await call('admin/resolve', { id: visitor.body.id }, relogin.cookie)).status, 404)
    // Migrate old closed threads without losing any history or visitor identity.
    const storedFile = path.join(directory, 'conversations.json')
    const stored = JSON.parse(readFileSync(storedFile, 'utf8'))
    stored.find(c => c.id === visitor.body.id).status = 'resolved'
    writeFileSync(storedFile, JSON.stringify(stored))
    handler = createChatHandler({ directory, password })
    const migrated = (await call('visitor', undefined, visitor.cookie)).body
    assert.equal(migrated.status, 'assistant')
    assert.deepEqual(migrated.messages, returning.body.messages)
    const continued = await call('request', {}, visitor.cookie)
    assert.equal(continued.body.id, visitor.body.id)
    assert.equal(continued.body.status, 'waiting')
    assert.deepEqual(continued.body.messages.slice(0, -1), returning.body.messages)
    assert.equal((await call('message', { text: 'I am back' }, visitor.cookie)).status, 200)
    assert.equal((await call('visitor', undefined, visitor.cookie)).body.messages.at(-1).text, 'I am back')
    await call('logout', {}, relogin.cookie)
    assert.equal((await call('admin', undefined, relogin.cookie)).status, 401)
  } finally { await new Promise(resolve => server.close(resolve)); rmSync(directory, { recursive: true, force: true }) }
})
