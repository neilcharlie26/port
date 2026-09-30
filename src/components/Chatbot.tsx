import useTyping from '../lib/useTyping'
import chatbotIcon from '../../chatbot.png'
import { wantsAdmin } from '../lib/assistant.mjs'
import { useCallback, useEffect, useRef, useState } from "react"
import { ArrowUp, ChevronDown, RotateCcw, Sparkles, X } from "lucide-react"
import { chatApi, type Conversation, type ChatMessage, type Attachment } from '../lib/chat'
import AttachmentPicker from './AttachmentPicker'
import ChatContent from './ChatContent'
import useReadReceipt from '../lib/useReadReceipt'

type Message = ChatMessage
const assistantHistoryKey = 'neil-assistant-history-after-reset-20260928'

function restoreAssistantHistory(): Message[] {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(assistantHistoryKey) || '[]')
    return Array.isArray(saved) ? saved.filter((message): message is Message =>
      !!message && ['assistant', 'user'].includes(message.from) && typeof message.text === 'string') : []
  } catch { return [] }
}

const suggestions = ["Who is Neil?", "What can Neil build?", "Tell me about his best project", "How can I contact him?"]

function AssistantMark({ size = 32 }: { size?: number }) {
  return <span aria-hidden="true" className="relative block shrink-0 overflow-hidden rounded-full" style={{ width: size, height: size }}><img src={chatbotIcon} alt="" className="absolute max-w-none object-cover" style={{ width: '114%', height: '114%', left: '-7%', top: '-6%' }} /></span>
}

export default function Chatbot() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState("")
  const [attachment, setAttachment] = useState<Attachment | null>(null)
  const [typing, setTyping] = useState(false)
  const [error, setError] = useState("")
  const [messages, setMessages] = useState<Message[]>(restoreAssistantHistory)
  const [conversation, setConversation] = useState<Conversation | null>(null)
  const [handoff, setHandoff] = useState(false)
  const [name, setName] = useState('')
  const [sending, setSending] = useState(false)
  const [restoring, setRestoring] = useState(true)
  const [restoreAttempt, setRestoreAttempt] = useState(0)
  const [restoreFailed, setRestoreFailed] = useState(false)
  const typingSignal = useTyping(conversation?.id, 'visitor', open && !sending && !handoff)
  const assistantMode = !conversation || conversation.status === 'assistant'
  const generation = useRef(0)
  const pending = useRef(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const onRead = useCallback((count: number, id: string) => {
    setConversation(current => current?.id === id ? { ...current, visitorReadCount: Math.max(current.visitorReadCount || 0, count) } : current)
  }, [])
  useReadReceipt(conversation, 'visitor', open, bottomRef, onRead)
  useEffect(() => {
    let alive = true
    setRestoring(true)
    setRestoreFailed(false)
    chatApi<Conversation | null>('visitor').then(chat => {
      if (!alive) return
      if (chat) { setConversation(chat); setMessages(chat.messages) }
      else { setConversation(null); setMessages(restoreAssistantHistory()) }
      setError(chat?.aiError || '')
    }).catch((error: Error) => {
      if (alive) { setRestoreFailed(true); setError(error.message) }
    }).finally(() => { if (alive) setRestoring(false) })
    return () => { alive = false; generation.current++ }
  }, [restoreAttempt])
  useEffect(() => {
    if (conversation || restoring || restoreFailed) return
    try { localStorage.setItem(assistantHistoryKey, JSON.stringify(messages)) } catch { /* The server still retains admin conversations when browser storage is unavailable. */ }
  }, [messages, conversation, restoring, restoreFailed])
  useEffect(() => {
    if (!open || !conversation) return
    let alive = true
    const timer = setInterval(async () => {
      if (pending.current) return
      const current = generation.current
      try {
        const chat = await chatApi<Conversation | null>('visitor')
        if (alive && current === generation.current) { setConversation(chat); setMessages(chat?.messages || []); setError(chat?.aiError || '') }
      } catch { if (alive) setError('Connection interrupted. Reconnecting…') }
    }, 2500)
    return () => { alive = false; clearInterval(timer) }
  }, [open, conversation?.id, conversation?.status])

  const requestAdmin = async (text?: string) => {
    if (pending.current || restoring || restoreFailed) return
    pending.current = true; generation.current++; setTyping(false); setSending(true); setError('')
    try {
      const chat = await chatApi<Conversation>('request', { name, messages, text })
      generation.current++; setConversation(chat); setMessages(chat.messages); setHandoff(false); setInput('')
    } catch (e) { setError((e as Error).message) }
    finally { pending.current = false; setSending(false) }
  }

  useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 180) }, [open])
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }) }, [messages.length, typing, open])

  const sendMessage = async (value: string) => {
    const text = value.trim()
    typingSignal.stop()
    if ((!text && !attachment) || typing || pending.current || restoring || restoreFailed) return
    if (conversation || attachment) {
      pending.current = true; generation.current++; setSending(true); setError('')
      try {
        if (!conversation) {
          const initial = await chatApi<Conversation>('request', { name, messages })
          setConversation(initial); setMessages(initial.messages)
        }
        const chat = await chatApi<Conversation>('message', { text, attachment })
        generation.current++; setConversation(chat); setMessages(chat.messages); setInput(''); setAttachment(null); setError(chat.aiError || '')
      } catch (e) { setError((e as Error).message) }
      finally { pending.current = false; setSending(false) }
      return
    }
    if (wantsAdmin(text)) { await requestAdmin(text); return }
    const current = ++generation.current
    const nextMessages: Message[] = [...messages, { from: "user", text }]
    setMessages(nextMessages)
    setInput("")
    setError("")
    setTyping(true)

    try {
      const reply = await chatApi<{ text: string }>('ai', { messages: nextMessages })
      if (current === generation.current) setMessages(previous => [...previous, { from: 'assistant', text: reply.text }])
    } catch (e) { if (current === generation.current) setError((e as Error).message) }
    finally { if (current === generation.current) setTyping(false) }
  }

  const resetChat = () => {
    generation.current++
    setConversation(null)
    setHandoff(false)
    setMessages([])
    setTyping(false)
    setInput("")
    setError("")
    inputRef.current?.focus()
    setAttachment(null)
  }

  const retryAI = async () => {
    if (pending.current || typing) return
    pending.current = true; setTyping(true); setError('')
    const current = ++generation.current
    try {
      if (conversation) {
        const chat = await chatApi<Conversation>('retry', {})
        if (current === generation.current) { setConversation(chat); setMessages(chat.messages); setError(chat.aiError || '') }
      } else {
        const reply = await chatApi<{ text: string }>('ai', { messages })
        if (current === generation.current) setMessages(previous => [...previous, { from: 'assistant', text: reply.text }])
      }
    } catch (e) { if (current === generation.current) setError((e as Error).message) }
    finally { pending.current = false; setTyping(false) }
  }

  return (
    <>
      {!open && (
        <button type="button" onClick={() => setOpen(true)} className="group fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center overflow-hidden rounded-full bg-[#101218] p-0 text-white shadow-[0_16px_48px_rgba(0,0,0,.34)] transition-[width,transform] duration-300 hover:w-40 hover:-translate-y-1 focus-visible:w-40 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-400 motion-reduce:transition-none sm:bottom-6 sm:right-6" aria-label="Open Neil AI assistant">
          <AssistantMark size={56} />
          <span className="ml-3 whitespace-nowrap text-sm font-medium opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">Ask Neil</span>
        </button>
      )}

      {open && (
          <section className="fixed inset-x-3 bottom-3 z-50 flex h-[min(650px,calc(100dvh-24px))] flex-col overflow-hidden rounded-[28px] border border-white/10 bg-[#101218] text-[#e3e3e3] shadow-[0_28px_90px_rgba(0,0,0,.48)] sm:inset-x-auto sm:bottom-6 sm:right-6 sm:h-[620px] sm:w-[430px]" aria-label="Neil portfolio assistant">
          <header className="flex h-16 shrink-0 items-center justify-between px-5">
            <div className="flex items-center gap-2.5"><AssistantMark /><div><h2 className="text-[15px] font-semibold leading-tight text-white">{assistantMode ? 'Neil Assistant' : 'Chat with Neil'}</h2><p className="text-[11px] text-[#9aa0a6]">{assistantMode ? 'Portfolio assistant' : 'Admin conversation'}</p></div></div>
            <div className="flex items-center gap-1">
              <button type="button" disabled={sending || restoring || restoreFailed || !!conversation} onClick={resetChat} className="rounded-full p-2.5 text-[#9aa0a6] transition hover:bg-white/10 hover:text-white disabled:opacity-30" aria-label="New assistant conversation"><RotateCcw size={17} /></button>
              <button type="button" onClick={() => setOpen(false)} className="rounded-full p-2.5 text-[#9aa0a6] transition hover:bg-white/10 hover:text-white" aria-label="Close assistant"><X size={19} /></button>
            </div>
          </header>
          <div className="mx-4 mb-3 rounded-2xl border border-blue-300/15 bg-blue-300/5 p-3">
            {conversation ? <div role="status"><p className="text-sm font-medium text-blue-200">{conversation.status === 'waiting' ? 'Waiting for Neil' : conversation.status === 'active' ? 'Chatting with Neil · Admin' : 'Assistant is back'}</p><p className="mt-1 text-xs leading-5 text-slate-400">{conversation.status === 'assistant' ? 'I can help again. Type talk to Neil to switch back to admin.' : 'The assistant is paused. After 15 minutes without messages, it will help again.'}</p>{conversation.status === 'assistant' && <button disabled={sending || restoring || restoreFailed} onClick={() => requestAdmin()} className="mt-2 text-sm text-blue-200 underline disabled:opacity-40">{sending ? 'Connecting…' : 'Talk to Neil'}</button>}</div> : <><div className="flex items-center justify-between gap-3"><span className="text-xs text-slate-400">Prefer to talk to Neil?</span><button disabled={restoring || restoreFailed || sending} onClick={() => { generation.current++; setTyping(false); setHandoff(!handoff) }} className="rounded-lg bg-blue-300/15 px-3 py-2 text-xs font-medium text-blue-200 disabled:opacity-40">Talk to admin</button></div>{handoff && <form onSubmit={e => { e.preventDefault(); void requestAdmin() }} className="mt-3 space-y-3"><p className="text-xs leading-5 text-slate-400">Your conversation will be shared with Neil. Replies appear here when he is available.</p><input aria-label="Your name (optional)" maxLength={60} value={name} onChange={e => setName(e.target.value)} placeholder="Your name (optional)" className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-blue-300" /><button disabled={sending} className="w-full rounded-lg bg-blue-200 py-2 text-sm font-medium text-slate-950 disabled:opacity-50">{sending ? 'Connecting…' : 'Request admin chat'}</button></form>}</>}
          </div>

          <div className="flex-1 overflow-y-auto px-5 pb-4">
            {messages.length === 0 && !conversation ? (
              <div className="flex min-h-full flex-col justify-center py-4">
                <AssistantMark size={48} />
                <h3 className="gemini-text mt-5 text-[30px] font-medium tracking-tight">Hello, I'm Neil's assistant</h3>
                <p className="mt-2 max-w-sm text-[15px] leading-6 text-[#aeb4bc]">I can help you explore Neil's work, skills, experience, and the ideas behind his projects.</p>
                <div className="mt-7 grid grid-cols-2 gap-2.5">
                  {suggestions.map((suggestion, index) => (
                    <button key={suggestion} type="button" onClick={() => sendMessage(suggestion)} className="group min-h-24 rounded-2xl border border-white/[.06] bg-[#1b1d23] p-3.5 text-left text-[13px] leading-5 text-[#d6d9de] transition hover:border-[#7c9eff]/40 hover:bg-[#22252c]">
                      <Sparkles size={15} className={`mb-3 ${index % 2 ? "text-[#f3a6c8]" : "text-[#8ab4f8]"}`} />{suggestion}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div role="log" aria-live="polite" aria-label="Conversation messages" className="space-y-6 pt-3">
                {messages.length === 0 && <p className="py-8 text-center text-sm text-slate-400">Tell Neil what you need help with below.</p>}
                {messages.map((message, index) => (
                  <div key={`${message.text}-${index}`} className={`flex gap-3 ${message.from === "user" ? "justify-end" : "justify-start"}`}>
                    {message.from === "assistant" && <AssistantMark size={32} />}
                    <div className={message.from === "user" ? "max-w-[82%] break-words rounded-[22px] bg-[#282a2f] px-4 py-3 text-[14px] leading-6" : "max-w-[86%] break-words text-[14px] leading-6 text-[#d9dce1]"}>{message.from === 'admin' && <p className="mb-1 text-xs font-medium text-blue-300">Neil · Admin</p>}<ChatContent message={message} />{message.from === 'user' && conversation && <p className="mt-1 text-right text-[10px] text-slate-400">{(conversation.adminReadCount || 0) > index ? 'Seen by Neil' : 'Sent'}</p>}</div>
                  </div>
                ))}
                {(typing || (sending && assistantMode)) && <div className="flex items-center gap-3"><AssistantMark size={22} /><div className="flex gap-1.5">{[0, 1, 2].map((dot) => <span key={dot} className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#8ab4f8]" style={{ animationDelay: `${dot * 120}ms` }} />)}</div></div>}
                <div ref={bottomRef} className="h-px" />
              </div>
            )}
          </div>

          <div className="shrink-0 px-4 pb-4">
            {error && !restoreFailed && assistantMode && messages.at(-1)?.from === 'user' && <button type="button" disabled={typing || sending} onClick={retryAI} className="mb-2 text-xs text-blue-300 underline disabled:opacity-40">Retry AI reply</button>}
            {error && <div role="alert" className="mb-2 rounded-xl bg-red-400/10 p-3 text-xs text-red-200">{error}{restoreFailed && <button type="button" onClick={() => setRestoreAttempt(value => value + 1)} className="ml-2 font-medium underline">Retry</button>}</div>}
            <p role="status" className="min-h-5 text-xs text-blue-300">{conversation?.adminTyping ? 'Neil is typing…' : ''}</p><AttachmentPicker value={attachment} onChange={setAttachment} disabled={sending || typing || restoring || restoreFailed || handoff} />
            {attachment && !conversation && <p className="mb-2 text-xs text-slate-400">Sending an attachment will start a conversation with Neil.</p>}
            <div className="rounded-[24px] border border-white/[.08] bg-[#1b1d23] p-2 shadow-inner">
              <div className="flex items-end gap-2">
                <input ref={inputRef} maxLength={2000} disabled={sending || restoring || restoreFailed || handoff} value={input} onBlur={typingSignal.stop} onChange={(event) => { setInput(event.target.value); typingSignal.change(event.target.value) }} onKeyDown={(event) => event.key === "Enter" && !event.nativeEvent.isComposing && sendMessage(input)} placeholder={restoring ? 'Loading conversation…' : !assistantMode ? 'Message Neil…' : "Ask about Neil's portfolio"} className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm text-white outline-none placeholder:text-[#858b94]" aria-label={assistantMode ? 'Message Neil assistant' : 'Message Neil'} />
                <button type="button" onClick={() => sendMessage(input)} disabled={(!input.trim() && !attachment) || typing || sending || restoring || restoreFailed || handoff} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#a8c7fa] text-[#062e6f] transition hover:bg-[#c2d7fa] disabled:bg-[#33363d] disabled:text-[#777d87]" aria-label="Send message"><ArrowUp size={18} strokeWidth={2.4} /></button>
              </div>
            </div>
            <div className="mt-2 flex items-center justify-center gap-1 text-[10px] text-[#7f858e]"><span>{!assistantMode ? 'Replies from Neil appear here automatically' : "Answers use Neil's portfolio"}</span><ChevronDown size={11} /></div>
          </div>
        </section>
      )}
    </>
  )
}



