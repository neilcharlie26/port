import { useState, useEffect } from "react"
import { ArrowUp } from "lucide-react"

export default function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" })

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-6 left-6 z-50 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300"
      style={{
        backgroundColor: "var(--bg-card)",
        border: "1px solid var(--border-solid)",
        color: "var(--accent)",
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "all" : "none",
        transform: visible ? "translateY(0)" : "translateY(10px)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "var(--accent-dim)"
        e.currentTarget.style.borderColor = "var(--accent)"
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "var(--bg-card)"
        e.currentTarget.style.borderColor = "var(--border-solid)"
      }}
      title="Back to top"
    >
      <ArrowUp size={18} />
    </button>
  )
}
