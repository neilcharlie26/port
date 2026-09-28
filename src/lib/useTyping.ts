import { useEffect, useRef } from 'react'
import { chatApi } from './chat'

export default function useTyping(id: string | undefined, role: 'admin' | 'visitor', enabled: boolean) {
  const last = useRef(0)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const active = useRef(false)
  const route = role === 'admin' ? 'admin/typing' : 'typing'
  const stop = () => {
    clearTimeout(timer.current)
    if (id && active.current) void chatApi(route, { id, typing: false }).catch(() => {})
    active.current = false; last.current = 0
  }
  useEffect(() => {
    const hide = () => { if (document.visibilityState !== 'visible') stop() }
    document.addEventListener('visibilitychange', hide)
    return () => { stop(); document.removeEventListener('visibilitychange', hide) }
  }, [id, role, enabled])
  const change = (value: string) => {
    if (!id || !enabled || !value.trim()) { stop(); return }
    clearTimeout(timer.current)
    if (Date.now() - last.current > 1500) {
      last.current = Date.now(); active.current = true
      void chatApi(route, { id, typing: true }).catch(() => {})
    }
    timer.current = setTimeout(stop, 2500)
  }
  return { change, stop }
}
