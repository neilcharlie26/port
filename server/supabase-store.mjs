// Server-only REST client. Never import this module from src/.
export function createSupabaseStore({ url = process.env.SUPABASE_URL, key = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY, fetchImpl = fetch } = {}) {
  const base = url?.replace(/\/$/, '')
  async function request(route, { method = 'GET', body, headers = {}, binary = false } = {}) {
    if (!base || !key) throw new Error('Chat storage is not configured. Set SUPABASE_URL and SUPABASE_SECRET_KEY on Vercel.')
    const response = await fetchImpl(`${base}${route}`, {
      method, headers: { apikey: key, ...(!key.startsWith('sb_secret_') ? { Authorization: `Bearer ${key}` } : {}), 'Content-Type': 'application/json', ...headers },
      body: body === undefined ? undefined : JSON.stringify(body), signal: AbortSignal.timeout(10000),
    })
    if (!response.ok) throw new Error('Chat storage is unavailable. Check the Supabase project and run supabase/chat.sql.')
    if (binary) return Buffer.from(await response.arrayBuffer())
    const text = await response.text()
    return text ? JSON.parse(text) : null
  }
  const table = (name, query = '') => `/rest/v1/portfolio_${name}${query}`
  const eq = value => encodeURIComponent(value)
  return {
    async find(field, value) { return (await request(table('chats', `?${field}=eq.${eq(value)}&limit=1`)))[0] || null },
    async list() {
      const rows = []
      for (let offset = 0; ; offset += 500) {
        const page = await request(table('chats', `?order=id&limit=500&offset=${offset}`))
        rows.push(...page)
        if (page.length < 500) return rows
      }
    },
    async insert(row) {
      // The unique browser secret makes simultaneous first requests idempotent.
      const rows = await request(table('chats', '?on_conflict=secret'), { method: 'POST', body: row,
        headers: { Prefer: 'resolution=ignore-duplicates,return=representation' } })
      return rows[0] || this.find('secret', row.secret)
    },
    async compareAndSwap(row, payload) {
      const rows = await request(table('chats', `?id=eq.${eq(row.id)}&version=eq.${row.version}`), {
        method: 'PATCH', body: { payload, version: row.version + 1, updated_at: payload.updatedAt }, headers: { Prefer: 'return=representation' },
      })
      return rows[0] || null
    },
    async session(id, now) { return !!(await request(table('sessions', `?id=eq.${eq(id)}&expires_at=gt.${now}&limit=1`))).length },
    async login(id, expires_at) { await request(table('sessions'), { method: 'POST', body: { id, expires_at }, headers: { Prefer: 'return=minimal' } }) },
    async logout(id) { await request(table('sessions', `?id=eq.${eq(id)}`), { method: 'DELETE' }) },
    async rateLimit(id, maximum) { return request('/rest/v1/rpc/portfolio_rate_limit', { method: 'POST', body: { limit_key: id, maximum } }) },
    async addUpload(row) { await request(table('uploads'), { method: 'POST', body: row, headers: { Prefer: 'return=minimal' } }) },
    async upload(id) { return (await request(table('uploads', `?id=eq.${eq(id)}&limit=1`)))[0] || null },
    async signUpload(id) {
      const data = await request(`/storage/v1/object/upload/sign/portfolio-chat/${id}`, { method: 'POST', body: {} })
      return `${base}/storage/v1${data.url}`
    },
    async readImage(id) { return request(`/storage/v1/object/authenticated/portfolio-chat/${id}`, { binary: true }) },
    async signImage(id) {
      const data = await request(`/storage/v1/object/sign/portfolio-chat/${id}`, { method: 'POST', body: { expiresIn: 60 } })
      return `${base}/storage/v1${data.signedURL}`
    },
  }
}
