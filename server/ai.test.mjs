import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createAI } from './ai.mjs'

test('Groq receives chat context and returns a generated response', async () => {
  const ai = createAI({ apiKey: 'test-key', fetcher: async (url, options) => {
    assert.equal(url, 'https://api.groq.com/openai/v1/chat/completions')
    assert.equal(options.headers.Authorization, 'Bearer test-key')
    const body = JSON.parse(options.body)
    assert.equal(body.model, 'openai/gpt-oss-20b')
    assert.equal(body.messages[0].role, 'system')
    assert.equal(body.messages.at(-1).content, 'Can you explain that in Tagalog?')
    assert.equal(body.messages[2].role, 'assistant')
    return new Response(JSON.stringify({ choices: [{ message: { content: 'Oo, ipapaliwanag ko.' } }] }))
  } })
  assert.equal(await ai([{ from: 'user', text: 'What is a POS?' }, { from: 'assistant', text: 'A point of sale system.' }, { from: 'user', text: 'Can you explain that in Tagalog?' }]), 'Oo, ipapaliwanag ko.')
})

test('missing key, provider errors and empty replies never produce canned answers', async () => {
  await assert.rejects(createAI({ apiKey: '' })([]), /not configured/)
  await assert.rejects(createAI({ apiKey: 'test', fetcher: async () => new Response('{}', { status: 429 }) })([]), /usage limit/)
  await assert.rejects(createAI({ apiKey: 'test', fetcher: async () => new Response('{}') })([]), /did not return/)
})
