export const MAX_IMAGE_BYTES = 5_000_000
export function validateAttachment(value) {
  if (value == null) return null
  if (value.type === 'link') {
    if (typeof value.url !== 'string' || value.url.length > 2048) throw new Error('Enter a valid HTTP or HTTPS file link.')
    let url
    try { url = new URL(value.url) } catch { throw new Error('Enter a valid HTTP or HTTPS file link.') }
    if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password) throw new Error('Enter a valid HTTP or HTTPS file link.')
    return { type: 'link', url: url.href, name: typeof value.name === 'string' ? value.name.slice(0, 100) : 'Open file link' }
  }
  if (value.type !== 'image' || typeof value.data !== 'string') throw new Error('Only images can be uploaded. Send other files as links.')
  const match = /^data:(image\/(?:png|jpeg|gif|webp));base64,([A-Za-z0-9+/]+={0,2})$/.exec(value.data)
  if (!match) throw new Error('Choose a PNG, JPEG, GIF or WebP image.')
  const bytes = Buffer.from(match[2], 'base64')
  if (!bytes.length || bytes.length >= MAX_IMAGE_BYTES) throw new Error('Images must be smaller than 5 MB.')
  const mime = bytes.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10])) ? 'image/png'
    : bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255 ? 'image/jpeg'
    : ['GIF87a', 'GIF89a'].includes(bytes.subarray(0, 6).toString()) ? 'image/gif'
    : bytes.subarray(0, 4).toString() === 'RIFF' && bytes.subarray(8, 12).toString() === 'WEBP' ? 'image/webp' : null
  if (mime !== match[1]) throw new Error('This file is not a supported image.')
  return { type: 'image', mime, bytes, size: bytes.length, name: typeof value.name === 'string' ? value.name.slice(0, 100) : 'Image' }
}
