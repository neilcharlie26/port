export type Attachment = { type: 'image'; name: string; id?: string; data?: string; mime?: string; size?: number } | { type: 'link'; name: string; url: string }
export type ChatMessage = { id?: string; from: 'assistant' | 'user' | 'admin'; text: string; at?: number; attachment?: Attachment }
export type Conversation = { id: string; name: string; status: 'waiting' | 'active' | 'assistant'; updatedAt: number; messages: ChatMessage[]; aiError?: string; adminTyping?: boolean; visitorTyping?: boolean; adminReadCount?: number; visitorReadCount?: number }
export const unreadCount = (chat: Conversation) => chat.messages.slice(chat.adminReadCount || 0).filter(m => m.from === 'user').length
export async function chatApi<T>(route: string, body?: unknown): Promise<T> {
  const response = await fetch(`${import.meta.env.BASE_URL}api/chat/${route}`, {
    method: body === undefined ? 'GET' : 'POST', credentials: 'same-origin',
    headers: body === undefined ? {} : { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body), signal: AbortSignal.timeout(35000),
  })
  const data = await response.json().catch(() => { throw new Error('Live chat is unavailable. Please try again later.') })
  if (!response.ok) throw new Error(data.error || 'Could not connect. Please try again.')
  return data
}
