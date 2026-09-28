import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { createChatHandler } from './chat.mjs'
import { validateAttachment, MAX_IMAGE_BYTES } from './attachments.mjs'

const png = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aHZkAAAAASUVORK5CYII='
const image = { type: 'image', name: 'sample.png', data: `data:image/png;base64,${png}` }
test('strict image size, image formats and file-link validation', () => {
  const bytes = Buffer.alloc(MAX_IMAGE_BYTES)
  Buffer.from(png, 'base64').copy(bytes)
  assert.throws(() => validateAttachment({ ...image, data: `data:image/png;base64,${bytes.toString('base64')}` }), /smaller than 5 MB/)
  assert.equal(validateAttachment({ ...image, data: `data:image/png;base64,${bytes.subarray(0, -1).toString('base64')}` }).size, MAX_IMAGE_BYTES - 1)
  assert.throws(() => validateAttachment({ type: 'file', name: 'report.pdf' }), /files as links/)
  assert.throws(() => validateAttachment({ ...image, data: `data:image/png;base64,${Buffer.from('<html>bad file</html>').toString('base64')}` }), /not a supported image/)
  assert.throws(() => validateAttachment({ ...image, data: 'data:image/svg+xml;base64,PHN2Zz4=' }), /PNG/)
  for (const url of ['javascript:alert(1)', 'file:///secret', 'data:text/html,test', 'https://user:password@example.com']) assert.throws(() => validateAttachment({ type: 'link', url }), /valid HTTP/)
  assert.equal(validateAttachment({ type: 'link', url: 'https://example.com/report.pdf' }).url, 'https://example.com/report.pdf')
})

test('private image delivery, persistent receipts, file links and unread boundaries', async () => {
  const directory = mkdtempSync(path.join(tmpdir(), 'chat-media-'))
  const password = 'private-test-password-123'
  let now = Date.now()
  const options = { directory, password, clock: () => now }
  let handler = createChatHandler(options)
  const server = createServer((req, res) => handler(req, res))
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
  const base = `http://127.0.0.1:${server.address().port}/api/chat/`
  const call = async (route, body, cookie) => {
    const response = await fetch(base + route, { method: body === undefined ? 'GET' : 'POST', headers: { 'Content-Type': 'application/json', ...(cookie ? { Cookie: cookie } : {}) }, body: body === undefined ? undefined : JSON.stringify(body) })
    return { status: response.status, data: await response.json(), cookie: response.headers.get('set-cookie')?.split(';')[0] }
  }
  try {
    const admin = await call('login', { password })
    const visitor = await call('request', { name: 'Media test' })
    const other = await call('request', { name: 'Other' })
    assert.equal((await call('admin/typing', { id: visitor.data.id, typing: true }, visitor.cookie)).status, 401)
    await call('typing', { typing: true }, visitor.cookie)
    await call('admin/typing', { id: visitor.data.id, typing: true }, admin.cookie)
    const typingChat = (await call('visitor', undefined, visitor.cookie)).data
    assert.equal(typingChat.adminTyping, true)
    assert.equal(typingChat.visitorTyping, true)
    assert.equal(typingChat.updatedAt, visitor.data.updatedAt)
    assert.equal(typingChat.messages.length, visitor.data.messages.length)
    assert.equal((await call('visitor', undefined, other.cookie)).data.adminTyping, false)
    now += 5001
    assert.equal((await call('visitor', undefined, visitor.cookie)).data.visitorTyping, false)
    assert.equal((await call('visitor', undefined, visitor.cookie)).data.adminTyping, false)
    await call('typing', { typing: true }, visitor.cookie)
    await call('typing', { typing: false }, visitor.cookie)
    assert.equal((await call('visitor', undefined, visitor.cookie)).data.visitorTyping, false)
    await call('typing', { typing: true }, visitor.cookie)
    const sent = await call('message', { attachment: image }, visitor.cookie)
    assert.equal(sent.status, 200)
    assert.equal(sent.data.visitorTyping, false)
    const picture = sent.data.messages.at(-1)
    assert.equal(picture.attachment.data, undefined)
    const imageUrl = `${base}image/${picture.attachment.id}`
    assert.equal((await fetch(imageUrl)).status, 404)
    assert.equal((await fetch(imageUrl, { headers: { Cookie: other.cookie } })).status, 404)
    for (const cookie of [visitor.cookie, admin.cookie]) {
      const response = await fetch(imageUrl, { headers: { Cookie: cookie } })
      assert.equal(response.status, 200)
      assert.equal(response.headers.get('content-type'), 'image/png')
      assert.deepEqual(Buffer.from(await response.arrayBuffer()), Buffer.from(png, 'base64'))
    }
    const listed = await call('admin', undefined, admin.cookie)
    assert.equal(listed.data.find(c => c.id === visitor.data.id).adminReadCount, undefined)
    assert.equal((await call('admin/read', { id: visitor.data.id, messageId: picture.id }, visitor.cookie)).status, 401)
    assert.equal((await call('read', { messageId: picture.id }, other.cookie)).status, 400)
    await call('admin/read', { id: visitor.data.id, messageId: picture.id }, admin.cookie)
    const next = await call('message', { text: 'Another unread message' }, visitor.cookie)
    assert.equal(next.data.adminReadCount, sent.data.messages.length)
    // Reading an older snapshot never marks a newer message as seen.
    await call('admin/read', { id: visitor.data.id, messageId: visitor.data.messages[0].id }, admin.cookie)
    const reply = await call('admin/reply', { id: visitor.data.id, attachment: { type: 'link', name: 'Report', url: 'https://example.com/report.pdf' } }, admin.cookie)
    assert.equal(reply.status, 200)
    assert.equal(reply.data.messages.at(-1).attachment.type, 'link')
    assert.equal(reply.data.visitorReadCount, undefined)
    await call('visitor', undefined, visitor.cookie)
    assert.equal((await call('visitor', undefined, visitor.cookie)).data.visitorReadCount, undefined)
    const read = await call('read', { messageId: reply.data.messages.at(-1).id }, visitor.cookie)
    assert.equal(read.data.visitorReadCount, reply.data.messages.length)
    const activity = reply.data.updatedAt
    now += 14 * 60000
    await call('read', { messageId: reply.data.messages.at(-1).id }, visitor.cookie)
    assert.equal((await call('visitor', undefined, visitor.cookie)).data.updatedAt, activity)
    handler = createChatHandler(options)
    const restored = await call('visitor', undefined, visitor.cookie)
    assert.equal(restored.data.visitorReadCount, reply.data.messages.length)
    assert.equal(restored.data.adminReadCount, sent.data.messages.length)
    assert.equal((await fetch(imageUrl, { headers: { Cookie: visitor.cookie } })).status, 200)
    assert.equal((await call('message', { attachment: { type: 'file', name: 'report.pdf' } }, visitor.cookie)).status, 400)
  } finally { await new Promise(resolve => server.close(resolve)); rmSync(directory, { recursive: true, force: true }) }
})
