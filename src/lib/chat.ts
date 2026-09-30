export type Attachment = { type: 'image'; name: string; id?: string; data?: string; mime?: string; size?: number } | { type: 'link'; name: string; url: string }
export type ChatMessage = { id?: string; from: 'assistant' | 'user' | 'admin'; text: string; at?: number; attachment?: Attachment }
export type Conversation = { id: string; name: string; status: 'waiting' | 'active' | 'assistant'; updatedAt: number; messages: ChatMessage[]; aiError?: string; adminTyping?: boolean; visitorTyping?: boolean; adminReadCount?: number; visitorReadCount?: number }
export const unreadCount = (chat: Conversation) => chat.messages.slice(chat.adminReadCount || 0).filter(m => m.from === 'user').length
export async function chatApi<T>(route: string, body?: unknown): Promise<T> {
  if (['message', 'admin/reply'].includes(route) && body && typeof body === 'object') {
    const draft = body as { id?: string; attachment?: Attachment }
    if (draft.attachment?.type === 'image' && draft.attachment.data) {
      const blob = await (await fetch(draft.attachment.data)).blob()
      const upload = await chatApi<{ inline?: boolean; id?: string; url?: string }>(route === 'admin/reply' ? 'admin/upload' : 'upload', {
        id: draft.id, name: draft.attachment.name, mime: blob.type, size: blob.size,
      })
      if (!upload.inline) {
        if (!upload.url || !upload.id) throw new Error('Could not prepare this image. Please try again.')
        let result: Response
        try {
          result = await fetch(upload.url, { method: 'PUT', body: blob, headers: { 'Content-Type': blob.type, 'x-upsert': 'false' }, signal: AbortSignal.timeout(60000) })
        } catch { throw new Error('Image upload interrupted. Please try again.') }
        if (!result.ok) throw new Error('Could not upload the image. Please try again.')
        body = { ...draft, attachment: { type: 'image', id: upload.id, name: draft.attachment.name } }
      }
    }
  }
  let response: Response
  try { response = await fetch(`${import.meta.env.BASE_URL}api/chat/${route}`, {
    method: body === undefined ? 'GET' : 'POST', credentials: 'same-origin',
    headers: body === undefined ? {} : { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body), signal: AbortSignal.timeout(65000),
  }) } catch { throw new Error('Cannot connect to chat. Check your connection and try again.') }
  if (!response.headers.get('content-type')?.includes('application/json')) {
    throw new Error('The chat server is unavailable on this website. Please contact Neil at neilcharlie26@gmail.com.')
  }
  const data = await response.json().catch(() => { throw new Error('The chat server returned an invalid response. Please try again later.') })
  if (!response.ok) throw new Error(data.error || 'Could not connect. Please try again.')
  return data
}
