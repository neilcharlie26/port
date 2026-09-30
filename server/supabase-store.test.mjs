import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createSupabaseStore } from './supabase-store.mjs'

test('Supabase REST uses server credentials, atomic version filters, and signed private storage URLs', async () => {
  const calls = [], results = []
  const store = createSupabaseStore({ url: 'https://project.supabase.co/', key: 'sb_secret_test', fetchImpl: async (url, options) => {
    calls.push({ url, ...options }); return new Response(JSON.stringify(results.shift()), { status: 200 })
  } })
  results.push([{ id: 'one', version: 2 }])
  await store.compareAndSwap({ id: 'one', version: 1 }, { updatedAt: 123, messages: [] })
  assert.match(calls[0].url, /id=eq.one&version=eq.1/)
  assert.equal(calls[0].headers.apikey, 'sb_secret_test')
  assert.equal(calls[0].headers.Authorization, undefined)
  assert.equal(JSON.parse(calls[0].body).version, 2)
  results.push({ url: '/object/upload/sign/portfolio-chat/file?token=upload' })
  assert.equal(await store.signUpload('file'), 'https://project.supabase.co/storage/v1/object/upload/sign/portfolio-chat/file?token=upload')
  results.push({ signedURL: '/object/sign/portfolio-chat/file?token=read' })
  assert.equal(await store.signImage('file'), 'https://project.supabase.co/storage/v1/object/sign/portfolio-chat/file?token=read')
  assert.equal(JSON.parse(calls[2].body).expiresIn, 60)
  await assert.rejects(createSupabaseStore({ url: '', key: '' }).find('id', 'one'), /not configured/)
})

test('Supabase accepts empty insert responses for sessions and upload metadata', async () => {
  const store = createSupabaseStore({ url: 'https://project.supabase.co', key: 'legacy-jwt', fetchImpl: async (url, options) => {
    assert.equal(options.headers.Authorization, 'Bearer legacy-jwt')
    return new Response(null, { status: 201 })
  } })
  await store.login('session', Date.now() + 1000)
  await store.addUpload({ id: 'upload' })
})
