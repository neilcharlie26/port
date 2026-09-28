import { existsSync, readFileSync, appendFileSync } from 'node:fs'
import { randomBytes } from 'node:crypto'
const file = '.env.local'
const text = existsSync(file) ? readFileSync(file, 'utf8') : ''
if (/^ADMIN_PASSWORD=.+/m.test(text)) console.log('Admin password is already configured in .env.local.')
else {
  appendFileSync(file, `\nADMIN_PASSWORD=${randomBytes(24).toString('base64url')}\n`, { mode: 0o600 })
  console.log('Created an admin password in .env.local. Open that file to retrieve it. Restart the server if it is running.')
}
