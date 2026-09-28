import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { createChatHandler } from './chat.mjs'

test('15-minute inactivity, durable AI replies and explicit handoff', async () => {
  const directory = mkdtempSync(path.join(tmpdir(), 'chat-timeout-'))
  const password = 'test-private-password-123'
  let now = Date.now()
  let generate = async () => 'Generated test reply about PHP'
  const options = { directory, password, clock: () => now, ai: messages => generate(messages) }
  let handler = createChatHandler(options)
  const server = createServer((req, res) => handler(req, res))
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
  const call = async (route, body, cookie) => {
    const r = await fetch(`http://127.0.0.1:${server.address().port}/api/chat/${route}`, {
      method: body === undefined ? 'GET' : 'POST',
      headers: { 'Content-Type': 'application/json', ...(cookie ? { Cookie: cookie } : {}) },
      body: body === undefined ? undefined : JSON.stringify(body),
    })
    assert.equal(r.ok, true)
    return { data: await r.json(), cookie: r.headers.get('set-cookie')?.split(';')[0] }
  }
  try {
    const admin = await call('login', { password })
    const visitor = await call('request', { text: 'talk to Neil' })
    assert.equal(visitor.data.messages[0].text, 'talk to Neil')
    assert.match(visitor.data.messages[1].text, /Directing you to Neil/)
    const get = async () => (await call('visitor', undefined, visitor.cookie)).data
    const message = async text => (await call('message', { text }, visitor.cookie)).data
    now += 14 * 60000
    assert.equal((await get()).status, 'waiting')
    // A user message restarts the inactivity window, but receives no AI reply.
    const waiting = await message('Hello?')
    assert.equal(waiting.messages.at(-1).from, 'user')
    now += 14 * 60000
    assert.equal((await get()).status, 'waiting')
    await call('admin/reply', { id: visitor.data.id, text: 'Hi there' }, admin.cookie)
    now += 15 * 60000 - 1
    assert.equal((await get()).status, 'active')
    now += 1
    const timeout = await get()
    assert.equal(timeout.status, 'assistant')
    assert.match(timeout.messages.at(-1).text, /15 minutes/)
    assert.equal((await get()).messages.length, timeout.messages.length)
    const answer = await message('What can Neil build?')
    assert.equal(answer.messages.at(-1).from, 'assistant')
    assert.match(answer.messages.at(-1).text, /PHP/)
    handler = createChatHandler(options)
    assert.deepEqual((await get()).messages, answer.messages)
    const handoff = await message('Please TALK TO NEIL')
    assert.equal(handoff.status, 'waiting')
    assert.match(handoff.messages.at(-1).text, /Directing you to Neil/)
    assert.equal((await message('What can Neil build?')).messages.at(-1).from, 'user')
    // Timeout is also reconciled on return after the server/browser was closed.
    now += 15 * 60000
    handler = createChatHandler(options)
    assert.equal((await get()).status, 'assistant')
    const requested = await call('request', {}, visitor.cookie)
    assert.equal(requested.data.status, 'waiting')
    assert.equal(requested.data.id, visitor.data.id)
    assert.match(requested.data.messages.at(-1).text, /Directing you to Neil/)
    now += 15 * 60000
    // A message arriving at expiry must be answered by the assistant.
    assert.equal((await message('Tell me about his project')).messages.at(-1).from, 'assistant')
    const login = await call('login', { password })
    const takeover = await call('admin/reply', { id: visitor.data.id, text: 'Neil here' }, login.cookie)
    assert.equal(takeover.data.status, 'active')
    assert.equal((await message('Thanks')).messages.at(-1).from, 'user')
    now += 15 * 60000
    assert.equal((await get()).status, 'assistant')
    // Repeated admin replies start a fresh 15-minute window every time.
    await call('admin/reply', { id: visitor.data.id, text: 'I am back again' }, login.cookie)
    now += 15 * 60000 - 1
    assert.equal((await get()).status, 'active')
    now += 1
    assert.equal((await get()).status, 'assistant')
    assert.equal((await message('talk to neil')).status, 'waiting')
    now += 15 * 60000
    let finish, started
    const ready = new Promise(resolve => { started = resolve })
    generate = () => { started(); return new Promise(resolve => { finish = resolve }) }
    const slowReply = message('Explain the project')
    await ready
    await call('admin/reply', { id: visitor.data.id, text: 'I will answer this myself' }, login.cookie)
    finish('This late AI reply must be discarded')
    const result = await slowReply
    assert.equal(result.status, 'active')
    assert.equal(result.messages.at(-1).from, 'admin')
    assert.equal(result.messages.some(m => m.text === 'This late AI reply must be discarded'), false)
  } finally { await new Promise(resolve => server.close(resolve)); rmSync(directory, { recursive: true, force: true }) }
})
