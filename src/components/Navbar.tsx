import { useState, useEffect } from "react"
import { Sun, Moon, Download, Menu, X, Code2, ChevronDown } from "lucide-react"

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Certs", href: "#certifications" },
  { label: "Contact", href: "#contact" },
]

const moreLinks = [
  { label: "Testimonials", href: "#testimonials" },
  { label: "Currently Learning", href: "#learning" },
  { label: "Services", href: "#services" },
  { label: "Interests", href: "#interests" },
  { label: "Resume", href: "#resume" },
  { label: "FAQ", href: "#faq" },
]

export default function Navbar({ darkMode, setDarkMode }: { darkMode: boolean; setDarkMode: (v: boolean) => void }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          backgroundColor: scrolled ? "var(--bg-card)" : "transparent",
          borderBottom: scrolled ? "1px solid var(--border-solid)" : "1px solid transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <a href="#home" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: "var(--accent-dim)", border: "1px solid var(--border)" }}>
                <Code2 size={16} style={{ color: "var(--accent)" }} />
              </div>
              <div>
                <div className="text-sm font-semibold leading-none" style={{ fontFamily: "Outfit, sans-serif", color: "var(--text)" }}>
                  Neil Charlie
                </div>
                <div className="text-xs leading-none mt-0.5" style={{ color: "var(--accent)", fontFamily: "JetBrains Mono, monospace" }}>
                  Portfolio
                </div>
              </div>
            </a>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200"
                  style={{ color: "var(--text-muted)" }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.color = "var(--accent)"
                    ;(e.currentTarget as HTMLAnchorElement).style.backgroundColor = "var(--accent-dim)"
                  }}
                  onMouseLeave={(e) => {
                    ;(e.currentTarget as HTMLAnchorElement).style.color = "var(--text-muted)"
                    ;(e.currentTarget as HTMLAnchorElement).style.backgroundColor = "transparent"
                  }}
                >
                  {link.label}
                </a>
              ))}
              {/* More dropdown */}
              <div className="relative">
                <button
                  onClick={() => setMoreOpen(!moreOpen)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200"
                  style={{ color: moreOpen ? "var(--accent)" : "var(--text-muted)", backgroundColor: moreOpen ? "var(--accent-dim)" : "transparent" }}
                >
                  More <ChevronDown size={13} style={{ transform: moreOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
                </button>
                {moreOpen && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setMoreOpen(false)} />
                    <div
                      className="absolute top-full mt-2 left-0 w-48 rounded-xl overflow-hidden z-40 py-1"
                      style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-solid)", boxShadow: "0 8px 30px rgba(0,0,0,0.2)" }}
                    >
                      {moreLinks.map((link) => (
                        <a
                          key={link.href}
                          href={link.href}
                          onClick={() => setMoreOpen(false)}
                          className="block px-4 py-2 text-sm transition-all duration-150"
                          style={{ color: "var(--text-muted)" }}
                          onMouseEnter={(e) => {
                            ;(e.currentTarget as HTMLAnchorElement).style.color = "var(--accent)"
                            ;(e.currentTarget as HTMLAnchorElement).style.backgroundColor = "var(--accent-dim)"
                          }}
                          onMouseLeave={(e) => {
                            ;(e.currentTarget as HTMLAnchorElement).style.color = "var(--text-muted)"
                            ;(e.currentTarget as HTMLAnchorElement).style.backgroundColor = "transparent"
                          }}
                        >
                          {link.label}
                        </a>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Right actions */}
            <div className="hidden lg:flex items-center gap-3">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200"
                style={{ backgroundColor: "var(--accent-dim)", border: "1px solid var(--border)", color: "var(--accent)" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--accent-hover)")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--accent-dim)")}
              >
                {darkMode ? <Sun size={16} /> : <Moon size={16} />}
              </button>
              <a
                href="#"
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200"
                style={{ backgroundColor: "var(--accent)", color: "#060d1a" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.opacity = "0.9")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.opacity = "1")}
              >
                <Download size={14} />
                Resume
              </a>
            </div>

            {/* Mobile menu btn */}
            <div className="flex lg:hidden items-center gap-2">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: "var(--accent-dim)", border: "1px solid var(--border)", color: "var(--accent)" }}
              >
                {darkMode ? <Sun size={16} /> : <Moon size={16} />}
              </button>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: "var(--accent-dim)", border: "1px solid var(--border)", color: "var(--text)" }}
              >
                {menuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile off-canvas */}
      <div
        className="fixed inset-0 z-40 lg:hidden transition-opacity duration-300"
        style={{ pointerEvents: menuOpen ? "all" : "none", opacity: menuOpen ? 1 : 0 }}
        onClick={() => setMenuOpen(false)}
      >
        <div className="absolute inset-0" style={{ backgroundColor: "rgba(6, 13, 31, 0.7)", backdropFilter: "blur(4px)" }} />
      </div>
      <aside
        className="fixed top-0 right-0 bottom-0 z-50 w-72 lg:hidden transition-transform duration-300"
        style={{
          transform: menuOpen ? "translateX(0)" : "translateX(100%)",
          backgroundColor: "var(--bg-card)",
          borderLeft: "1px solid var(--border-solid)",
        }}
      >
        <div className="flex items-center justify-between p-4" style={{ borderBottom: "1px solid var(--border-solid)" }}>
          <span className="font-semibold" style={{ fontFamily: "Outfit, sans-serif", color: "var(--text)" }}>Navigation</span>
          <button onClick={() => setMenuOpen(false)} style={{ color: "var(--text-muted)" }}>
            <X size={20} />
          </button>
        </div>
        <div className="p-4 flex flex-col gap-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200"
              style={{ color: "var(--text-muted)" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = "var(--accent)"
                ;(e.currentTarget as HTMLAnchorElement).style.backgroundColor = "var(--accent-dim)"
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLAnchorElement).style.color = "var(--text-muted)"
                ;(e.currentTarget as HTMLAnchorElement).style.backgroundColor = "transparent"
              }}
            >
              {link.label}
            </a>
          ))}
          <div className="pt-2" style={{ borderTop: "1px solid var(--border-solid)" }}>
            <div className="text-xs font-semibold px-4 py-2" style={{ color: "var(--text-dim)", fontFamily: "JetBrains Mono, monospace" }}>More Sections</div>
            {moreLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 block"
                style={{ color: "var(--text-muted)" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color = "var(--accent)"
                  ;(e.currentTarget as HTMLAnchorElement).style.backgroundColor = "var(--accent-dim)"
                }}
                onMouseLeave={(e) => {
                  ;(e.currentTarget as HTMLAnchorElement).style.color = "var(--text-muted)"
                  ;(e.currentTarget as HTMLAnchorElement).style.backgroundColor = "transparent"
                }}
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="mt-4 pt-4" style={{ borderTop: "1px solid var(--border-solid)" }}>
            <a
              href="#"
              className="flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold"
              style={{ backgroundColor: "var(--accent)", color: "#060d1a" }}
            >
              <Download size={14} />
              Download Resume
            </a>
          </div>
        </div>
      </aside>
    </>
  )
}
