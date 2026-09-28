import type { ChatMessage } from '../lib/chat'

export default function ChatContent({ message }: { message: ChatMessage }) {
  const attachment = message.attachment
  const text = message.from === 'assistant'
    ? message.text
      .replace(/^\s{0,3}(?:[-*_]\s*){3,}$/gm, '')
      .replace(/^\s*[-*•]\s+/gm, '')
      .replace(/\*\*([^\n]+?)\*\*/g, '$1')
      .replace(/\*([^*\n]+?)\*/g, '$1')
      .replace(/^#{1,6}\s+/gm, '')
      .trim()
    : message.text
  return <div className="space-y-2">
    {attachment?.type === 'image' && attachment.id && <a href={`${import.meta.env.BASE_URL}api/chat/image/${attachment.id}`} target="_blank" rel="noopener noreferrer" aria-label={`Open image: ${attachment.name}`}><img src={`${import.meta.env.BASE_URL}api/chat/image/${attachment.id}`} alt={attachment.name} className="max-h-72 max-w-full rounded-xl object-contain" loading="lazy" /></a>}
    {attachment?.type === 'link' && /^https?:\/\//i.test(attachment.url) && <a href={attachment.url} target="_blank" rel="noopener noreferrer" className="block rounded-xl border border-current/20 p-3 underline break-all"><span className="block font-medium">{attachment.name || 'Open file link'} ↗</span><span className="text-xs opacity-75">{attachment.url}</span></a>}
    {text && <p className="whitespace-pre-wrap break-words">{text.split(/(https?:\/\/[^\s]+)/g).map((part, i) => /^https?:\/\//i.test(part) ? <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="underline break-all">{part}</a> : part)}</p>}
  </div>
}
