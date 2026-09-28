import { useRef, useState } from 'react'
import { ImagePlus, Link, X } from 'lucide-react'
import type { Attachment } from '../lib/chat'

export default function AttachmentPicker({ value, onChange, disabled }: { value: Attachment | null; onChange: (value: Attachment | null) => void; disabled?: boolean }) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [linkOpen, setLinkOpen] = useState(false)
  const [url, setUrl] = useState('')
  const [error, setError] = useState('')
  const [reading, setReading] = useState(false)
  async function pick(file?: File) {
    if (!file) return
    setError('')
    if (file.size >= 5_000_000) { setError('Choose an image smaller than 5 MB.'); return }
    if (!['image/png', 'image/jpeg', 'image/webp', 'image/gif'].includes(file.type)) { setError('PNG, JPEG, GIF or WebP only. Send other files using a link.'); return }
    setReading(true)
    try {
      const data = await new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.onerror = reject; reader.readAsDataURL(file) })
      onChange({ type: 'image', data, name: file.name, size: file.size })
    } catch { setError('Could not read this image. Try another file.') } finally { setReading(false) }
  }
  function addLink() {
    try {
      const parsed = new URL(url.trim())
      if (!['http:', 'https:'].includes(parsed.protocol) || parsed.username || parsed.password || url.length > 2048) throw new Error()
      onChange({ type: 'link', name: 'File link', url: parsed.href }); setLinkOpen(false); setUrl(''); setError('')
    } catch { setError('Enter a valid HTTP or HTTPS link to your file.') }
  }
  return <div className="text-xs">
    <div className="flex flex-wrap items-center gap-3 py-2 text-blue-300">
      <button type="button" disabled={disabled || reading} onClick={() => fileRef.current?.click()} className="flex items-center gap-1.5 disabled:opacity-40"><ImagePlus size={17} /> Image</button>
      <button type="button" disabled={disabled || reading} onClick={() => { setLinkOpen(!linkOpen); setError('') }} className="flex items-center gap-1.5 disabled:opacity-40"><Link size={17} /> File link</button>
      <span className="text-slate-500">{reading ? 'Reading image…' : 'Images < 5 MB · Other files: link only'}</span>
      <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/gif,image/webp" className="hidden" aria-label="Choose image smaller than 5 MB" onChange={e => { void pick(e.target.files?.[0]); e.target.value = '' }} />
    </div>
    {linkOpen && <div className="mb-2 flex gap-2"><input aria-label="File URL" value={url} onChange={e => setUrl(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addLink() } }} placeholder="https://drive.google.com/…" className="min-w-0 flex-1 rounded-lg border border-white/15 bg-white/5 p-2 text-white" /><button type="button" disabled={disabled} onClick={addLink} className="rounded-lg bg-blue-400/15 px-3 text-blue-200">Attach link</button></div>}
    {value && <div className="mb-2 flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-2">{value.type === 'image' && value.data && <img src={value.data} alt="Selected image preview" className="h-12 w-12 rounded-lg object-cover" />}<span className="min-w-0 flex-1 truncate text-slate-300">{value.type === 'image' ? value.name : value.url}</span><button type="button" disabled={disabled} onClick={() => onChange(null)} aria-label="Remove attachment"><X size={16} /></button></div>}
    {error && <p role="alert" className="mb-2 text-red-300">{error}</p>}
  </div>
}
