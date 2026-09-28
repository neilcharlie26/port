import { createServer } from 'node:http'
import { existsSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'
import { createChatHandler } from './chat.mjs'

if (existsSync('.env.local')) process.loadEnvFile('.env.local')
const handler = createChatHandler()
const root = path.resolve('dist')
if (!existsSync(path.join(root, 'index.html'))) throw new Error('Run npm run build first.')
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2' }
createServer((req, res) => {
  void handler(req, res, () => {
    if (!['GET', 'HEAD'].includes(req.method)) { res.writeHead(405); res.end(); return }
    try {
      const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname)
      let file = path.resolve(root, '.' + pathname)
      if (file !== root && !file.startsWith(root + path.sep)) { res.writeHead(403); res.end(); return }
      if (!existsSync(file) || !statSync(file).isFile()) file = path.join(root, 'index.html')
      res.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream', 'X-Content-Type-Options': 'nosniff' })
      res.end(req.method === 'HEAD' ? undefined : readFileSync(file))
    } catch { res.writeHead(400); res.end() }
  })
}).listen(Number(process.env.PORT || 8443), '0.0.0.0', () => console.log('Portfolio and chat server are ready.'))
