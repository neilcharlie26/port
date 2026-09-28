import { useEffect, type RefObject } from 'react'
import { chatApi, type Conversation } from './chat'

// A conversation is read only while its newest message is visible in a foreground tab.
export default function useReadReceipt(chat: Conversation | null | undefined, reader: 'admin' | 'visitor', enabled: boolean, bottom: RefObject<HTMLDivElement | null>, onRead: (count: number, id: string) => void) {
  const lastId = chat?.messages.at(-1)?.id
  const readCount = (reader === 'admin' ? chat?.adminReadCount : chat?.visitorReadCount) || 0
  const count = chat?.messages.length || 0
  useEffect(() => {
    if (!enabled || !chat || !lastId || readCount >= count || !bottom.current) return
    let visible = false, alive = true, pending = false, done = false
    async function mark() {
      if (!visible || document.visibilityState !== 'visible' || pending || done) return
      pending = true
      try {
        const result = await chatApi<{ adminReadCount?: number; visitorReadCount?: number }>(reader === 'admin' ? 'admin/read' : 'read', { id: chat!.id, messageId: lastId })
        done = true
        if (alive) onRead((reader === 'admin' ? result.adminReadCount : result.visitorReadCount) || count, chat!.id)
      } catch { /* Retry on the next interval without changing delivery state. */ } finally { pending = false }
    }
    const observer = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; void mark() })
    observer.observe(bottom.current)
    const timer = setInterval(mark, 3000)
    document.addEventListener('visibilitychange', mark)
    return () => { alive = false; observer.disconnect(); clearInterval(timer); document.removeEventListener('visibilitychange', mark) }
  }, [chat?.id, lastId, readCount, count, reader, enabled, bottom, onRead])
}
