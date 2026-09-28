import useTyping from '../lib/useTyping'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowLeft, CheckCheck, MessageCircle, Search, Send } from 'lucide-react'
import { chatApi, unreadCount, type Conversation, type Attachment } from '../lib/chat'
import ChatContent from './ChatContent'
import AttachmentPicker from './AttachmentPicker'
import useReadReceipt from '../lib/useReadReceipt'

export default function AdminInbox() {
  const [authenticated, setAuthenticated] = useState(false)
  const [checking, setChecking] = useState(true)
  const [password, setPassword] = useState('')
  const [chats, setChats] = useState<Conversation[]>([])
  const [selected, setSelected] = useState('')
  const [drafts, setDrafts] = useState<Record<string, string>>({})
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [search, setSearch] = useState('')
  const [onlyUnread, setOnlyUnread] = useState(false)
  const [attachments, setAttachments] = useState<Record<string, Attachment | null>>({})
  const version = useRef(0)
  const bottom = useRef<HTMLDivElement>(null)
  const chat = chats.find(c => c.id === selected)
  const typingSignal = useTyping(chat?.id, 'admin', authenticated && !busy)
  const onRead = useCallback((count: number, id: string) => {
    setChats(current => current.map(c => c.id === id ? { ...c, adminReadCount: Math.max(c.adminReadCount || 0, count) } : c))
  }, [])
  useReadReceipt(chat, 'admin', authenticated, bottom, onRead)
  const visibleChats = chats.filter(c => (!onlyUnread || unreadCount(c) > 0) && `${c.name} ${c.id.slice(0, 6)}`.toLowerCase().includes(search.toLowerCase()))
  const field = 'w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none focus:border-blue-400'
  useEffect(() => { chatApi<{ authenticated: boolean }>('session').then(s => setAuthenticated(s.authenticated)).catch(e => setError(e.message)).finally(() => setChecking(false)) }, [])
  useEffect(() => {
    if (!authenticated) return
    let alive = true
    const refresh = async () => {
      const current = version.current
      try {
        const data = await chatApi<Conversation[]>('admin')
        if (alive && current === version.current) { setChats(data); setError('') }
      } catch (e) { if (alive) setError((e as Error).message) }
    }
    void refresh(); const timer = setInterval(refresh, 3000)
    return () => { alive = false; clearInterval(timer) }
  }, [authenticated])
  useEffect(() => { bottom.current?.scrollIntoView({ behavior: 'smooth' }) }, [selected, chat?.messages.length])
  async function login(event: React.FormEvent) {
    event.preventDefault(); setBusy(true); setError('')
    try { await chatApi('login', { password }); setPassword(''); setAuthenticated(true) }
    catch (e) { setError((e as Error).message) } finally { setBusy(false) }
  }
  async function update() {
    if (!chat || busy) return
    const id = chat.id
    typingSignal.stop(); setBusy(true); setError(''); version.current++
    try {
      const updated = await chatApi<Conversation>('admin/reply', { id, text: drafts[id] || '', attachment: attachments[id] })
      version.current++; setChats(current => current.map(c => c.id === id ? updated : c))
      { setDrafts(current => ({ ...current, [id]: '' })); setAttachments(current => ({ ...current, [id]: null })) }
    } catch (e) { setError((e as Error).message) } finally { setBusy(false) }
  }

  return <main className="min-h-screen bg-[#0b0e14] p-3 text-white sm:p-6">
    <div className="mx-auto max-w-7xl">
      <header className="mb-5 flex items-center justify-between gap-4">
        <div><a href="#home" className="text-xs text-slate-400 hover:text-white">← Back to portfolio</a><h1 className="mt-2 text-2xl font-semibold tracking-tight">Neil's inbox<span className="ml-3 align-middle text-xs font-normal text-blue-300">Admin</span></h1></div>
        {authenticated && <button className="rounded-xl border border-white/10 px-4 py-2 text-sm text-slate-300" onClick={async () => { try { await chatApi('logout', {}); setAuthenticated(false); setChats([]); setSelected(''); setDrafts({}); setAttachments({}); setError('') } catch (e) { setError((e as Error).message) } }}>Sign out</button>}
      </header>
      {error && <p role="alert" className="mb-3 rounded-xl bg-red-400/10 p-3 text-sm text-red-200">{error}</p>}
      {checking ? <p>Loading…</p> : !authenticated ? <form onSubmit={login} className="mx-auto mt-16 max-w-sm space-y-5 rounded-3xl border border-white/10 bg-[#171b25] p-7"><MessageCircle className="text-blue-400" size={32} /><h2 className="text-xl font-semibold">Admin sign in</h2><p className="text-sm text-slate-400">Your conversations, all in one place.</p><label className="block text-sm">Password<input type="password" autoComplete="current-password" required value={password} onChange={e => setPassword(e.target.value)} className={`${field} mt-2`} /></label><button disabled={busy} className="w-full rounded-xl bg-blue-500 py-3 font-medium disabled:opacity-50">{busy ? 'Signing in…' : 'Sign in'}</button></form> :
      <div className="grid h-[calc(100dvh-125px)] min-h-[520px] overflow-hidden rounded-2xl border border-white/10 bg-[#11151e] md:grid-cols-[310px_1fr] lg:grid-cols-[350px_1fr]">
        <aside className={`${selected ? 'hidden md:flex' : 'flex'} min-h-0 flex-col border-r border-white/10`}>
          <div className="p-5 pb-3"><div className="mb-4 flex items-center justify-between"><h2 className="text-xl font-semibold">Chats</h2><span className="rounded-full bg-blue-500/15 px-2.5 py-1 text-xs text-blue-300">{chats.reduce((total, c) => total + unreadCount(c), 0)} unread</span></div>
            <div className="flex items-center gap-2 rounded-xl bg-white/5 px-3"><Search size={16} className="text-slate-500" /><input aria-label="Search conversations" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search people…" className="w-full bg-transparent py-2.5 text-sm outline-none" /></div>
            <div className="mt-3 flex gap-2">{[false, true].map(unread => <button key={String(unread)} onClick={() => setOnlyUnread(unread)} className={`rounded-full px-3 py-1.5 text-xs ${onlyUnread === unread ? 'bg-blue-500/20 text-blue-300' : 'text-slate-400 hover:bg-white/5'}`}>{unread ? 'Unread' : 'All conversations'}</button>)}</div>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto p-2">
            {!visibleChats.length && <p className="p-6 text-center text-sm text-slate-500">{chats.length ? 'No matching conversations.' : 'New conversations will appear here.'}</p>}
            {visibleChats.map(c => {
              const unread = unreadCount(c), last = c.messages.at(-1)
              const preview = last?.attachment?.type === 'image' ? 'Sent an image' : last?.attachment?.type === 'link' ? 'Shared a file link' : last?.text || 'Requested a conversation'
              return <button key={c.id} onClick={() => setSelected(c.id)} className={`mb-1 flex w-full items-center gap-3 rounded-xl p-3 text-left transition ${selected === c.id ? 'bg-blue-500/15' : 'hover:bg-white/5'}`}>
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500/40 to-violet-500/30 text-sm font-semibold text-blue-100">{c.name.slice(0, 2).toUpperCase()}</span>
                <span className="min-w-0 flex-1"><span className="flex items-center justify-between gap-2"><span className={`truncate text-sm ${unread ? 'font-bold text-white' : 'font-medium text-slate-200'}`}>{c.name === 'Visitor' ? `Visitor · ${c.id.slice(0, 6)}` : c.name}</span><span className="shrink-0 text-[10px] text-slate-500">{new Date(c.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></span><span className={`mt-1 block truncate text-xs ${unread ? 'text-white' : 'text-slate-500'}`}>{c.visitorTyping ? 'Typing…' : `${last?.from === 'admin' ? 'You: ' : last?.from === 'assistant' ? 'Assistant: ' : ''}${preview}`}</span><span className="mt-1.5 block text-[10px] text-slate-500">{c.status === 'waiting' ? 'Waiting for you' : c.status === 'assistant' ? 'Assistant is replying' : 'Admin conversation'}</span></span>
                {unread > 0 && <span aria-label={`${unread} unread messages`} className="flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-500 px-1 text-[10px] font-semibold">{unread}</span>}
              </button>
            })}
          </div>
        </aside>
        <section className={`${selected ? 'flex' : 'hidden md:flex'} min-h-0 min-w-0 flex-col bg-[#141923]`}>
          {chat ? <><header className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-4 sm:px-6"><div className="flex min-w-0 items-center gap-3"><button className="md:hidden" onClick={() => setSelected('')} aria-label="Back to all conversations"><ArrowLeft size={20} /></button><span className="hidden h-10 w-10 items-center justify-center rounded-full bg-blue-500/20 text-blue-200 sm:flex">{chat.name.slice(0, 2).toUpperCase()}</span><div className="min-w-0"><h2 className="truncate font-semibold">{chat.name}</h2><p className="text-xs text-slate-400">{chat.status === 'waiting' ? 'Waiting for your reply' : chat.status === 'active' ? 'You are handling this conversation' : 'Assistant is replying · Reply to take over'}</p></div></div></header>
          <div role="log" aria-live="polite" className="min-h-0 flex-1 space-y-4 overflow-y-auto p-5 sm:p-6">
            <p className="mb-6 text-center text-xs text-slate-500">Conversation history is saved</p>
            {chat.messages.map((m, i) => <div key={m.id || i} className={`flex flex-col ${m.from === 'admin' ? 'items-end' : 'items-start'}`}><div className={`max-w-[90%] rounded-2xl px-4 py-3 text-sm sm:max-w-[75%] ${m.from === 'admin' ? 'rounded-br-md bg-blue-600 text-white' : m.from === 'assistant' ? 'border border-white/10 bg-white/[.025] text-slate-300' : 'rounded-bl-md bg-[#252d3b] text-slate-100'}`}><p className="mb-1.5 text-[10px] font-medium opacity-60">{m.from === 'admin' ? 'You' : m.from === 'assistant' ? 'Assistant' : chat.name}</p><ChatContent message={m} /></div><div className="mt-1.5 flex items-center gap-1 px-1 text-[10px] text-slate-500">{m.at && <span>{new Date(m.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>}{m.from === 'admin' && <span className={(chat.visitorReadCount || 0) > i ? 'ml-1 flex items-center gap-1 text-blue-300' : 'ml-1'}>{(chat.visitorReadCount || 0) > i && <CheckCheck size={12} />}{(chat.visitorReadCount || 0) > i ? 'Seen by client' : 'Not seen yet'}</span>}</div></div>)}<div ref={bottom} className="h-px" />
          </div>
          <form onSubmit={e => { e.preventDefault(); void update() }} className="border-t border-white/10 px-4 pb-4 pt-2 sm:px-6">
            <p role="status" className="min-h-5 text-xs text-blue-300">{chat.visitorTyping ? `${chat.name} is typing…` : ''}</p><AttachmentPicker key={chat.id} value={attachments[chat.id] || null} onChange={value => setAttachments(current => ({ ...current, [chat.id]: value }))} disabled={busy} />
            <div className="flex gap-3"><input aria-label="Reply to visitor" maxLength={2000} disabled={busy} value={drafts[chat.id] || ''} onBlur={typingSignal.stop} onChange={e => { setDrafts({ ...drafts, [chat.id]: e.target.value }); typingSignal.change(e.target.value) }} placeholder="Write a reply…" className={field} /><button disabled={busy || (!drafts[chat.id]?.trim() && !attachments[chat.id])} aria-label="Send reply" className="rounded-xl bg-blue-500 px-4 text-white disabled:opacity-40"><Send size={18} /></button></div>
          </form></> : <div className="m-auto px-6 text-center"><MessageCircle size={44} className="mx-auto mb-4 text-blue-400/70" /><h2 className="text-lg font-medium">Your conversations</h2><p className="mt-2 text-sm text-slate-500">Choose someone on the left to read and reply.</p></div>}
        </section>
      </div>}
    </div>
  </main>
}

