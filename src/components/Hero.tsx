import { useState, useEffect } from "react"
import { GitFork, Briefcase, Users, Mail, ChevronDown, Download, Eye, ArrowRight } from "lucide-react"

const titles = [
  "PHP Full-Stack Developer",
  "IS Professional",
  "Technology Enthusiast",
]

export default function Hero() {
  const [titleIndex, setTitleIndex] = useState(0)
  const [displayText, setDisplayText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const full = titles[titleIndex]
    let timer: ReturnType<typeof setTimeout>

    if (!isDeleting && displayText === full) {
      timer = setTimeout(() => setIsDeleting(true), 2000)
    } else if (isDeleting && displayText === "") {
      setIsDeleting(false)
      setTitleIndex((i) => (i + 1) % titles.length)
    } else {
      const delay = isDeleting ? 40 : 80
      timer = setTimeout(() => {
        setDisplayText(isDeleting ? full.slice(0, displayText.length - 1) : full.slice(0, displayText.length + 1))
      }, delay)
    }

    return () => clearTimeout(timer)
  }, [displayText, isDeleting, titleIndex])

  return (
    <section id="home" className="relative min-h-screen flex items-center pt-16 grid-bg overflow-hidden">
      {/* Ambient blobs */}
      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full pointer-events-none pulse-slow"
        style={{ background: "radial-gradient(circle, rgba(0,212,255,0.06) 0%, transparent 70%)", filter: "blur(40px)" }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full pointer-events-none pulse-slow"
        style={{ background: "radial-gradient(circle, rgba(14,165,233,0.05) 0%, transparent 70%)", filter: "blur(40px)", animationDelay: "1.5s" }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left content */}
          <div>
            {/* Available badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-8"
              style={{ backgroundColor: "rgba(34, 211, 160, 0.1)", border: "1px solid rgba(34, 211, 160, 0.2)", color: "var(--green)" }}>
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: "var(--green)" }} />
              Available for Opportunities
            </div>

            <div className="text-sm font-mono mb-3" style={{ color: "var(--accent)", fontFamily: "JetBrains Mono, monospace" }}>
              HELLO, I&apos;M
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-4" style={{ color: "var(--text)" }}>
              Neil Charlie
              <br />
              <span style={{ color: "var(--accent)" }}>Rebenque</span>
            </h1>

            <div className="text-xl sm:text-2xl font-medium mb-6 h-8" style={{ color: "var(--text-muted)" }}>
              {displayText}
              <span className="cursor-blink inline-block w-0.5 h-6 ml-0.5 align-middle" style={{ backgroundColor: "var(--accent)" }} />
            </div>

            <p className="text-base leading-relaxed mb-8 max-w-lg" style={{ color: "var(--text-muted)" }}>
              I am a PHP full-stack developer building web applications and mobile apps
              with React Native and Expo, using Supabase or MySQL for data management.
            </p>

            {/* Code snippet decoration */}
            <div className="mb-8 rounded-xl p-4 font-mono text-xs max-w-sm" style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-solid)", fontFamily: "JetBrains Mono, monospace" }}>
              <div className="flex items-center gap-1.5 mb-3">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#ff5f57" }} />
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#febc2e" }} />
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#28c840" }} />
              </div>
              <div style={{ color: "var(--text-dim)" }}><span style={{ color: "#c792ea" }}>const</span> <span style={{ color: "var(--accent)" }}>developer</span> = {"{"}</div>
              <div className="ml-4"><span style={{ color: "#82aaff" }}>name</span>: <span style={{ color: "#c3e88d" }}>"Neil Charlie"</span>,</div>
              <div className="ml-4"><span style={{ color: "#82aaff" }}>role</span>: <span style={{ color: "#c3e88d" }}>"PHP Full-Stack Developer"</span>,</div>
              <div className="ml-4"><span style={{ color: "#82aaff" }}>status</span>: <span style={{ color: "var(--green)" }}>"open_to_work"</span></div>
              <div style={{ color: "var(--text-dim)" }}>{"}"}</div>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-3 mb-8">
              <a
                href="#projects"
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 accent-glow"
                style={{ backgroundColor: "var(--accent)", color: "#060d1a" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.opacity = "0.9")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.opacity = "1")}
              >
                <Eye size={16} />
                View My Work
              </a>
              <a
                href="#"
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200"
                style={{ backgroundColor: "var(--accent-dim)", border: "1px solid var(--border)", color: "var(--accent)" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.backgroundColor = "var(--accent-hover)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.backgroundColor = "var(--accent-dim)")}
              >
                <Download size={16} />
                Download Resume
              </a>
              <a
                href="#contact"
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200"
                style={{ border: "1px solid var(--border-solid)", color: "var(--text-muted)" }}
                onMouseEnter={(e) => {
                  ;(e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--accent)"
                  ;(e.currentTarget as HTMLAnchorElement).style.color = "var(--accent)"
                }}
                onMouseLeave={(e) => {
                  ;(e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--border-solid)"
                  ;(e.currentTarget as HTMLAnchorElement).style.color = "var(--text-muted)"
                }}
              >
                <ArrowRight size={16} />
                Contact Me
              </a>
            </div>

            {/* Social links */}
            <div className="flex items-center gap-4">
              <span className="text-xs" style={{ color: "var(--text-dim)" }}>Find me on</span>
              {[
                { icon: GitFork, label: "GitHub", href: "https://github.com/neilcharlie26" },
                { icon: Users, label: "Facebook", href: "https://www.facebook.com/charlierebenque26" },
                { icon: Mail, label: "Email", href: "neilcharlie26@gmail.com" },
              ].map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  title={label}
                  className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200"
                  style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-solid)", color: "var(--text-muted)" }}
                  onMouseEnter={(e) => {
                    ;(e.currentTarget as HTMLAnchorElement).style.color = "var(--accent)"
                    ;(e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--accent)"
                    ;(e.currentTarget as HTMLAnchorElement).style.backgroundColor = "var(--accent-dim)"
                  }}
                  onMouseLeave={(e) => {
                    ;(e.currentTarget as HTMLAnchorElement).style.color = "var(--text-muted)"
                    ;(e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--border-solid)"
                    ;(e.currentTarget as HTMLAnchorElement).style.backgroundColor = "var(--bg-card)"
                  }}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Right: Profile image placeholder */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              {/* Outer ring */}
              <div className="absolute -inset-4 rounded-full opacity-20 float" style={{ border: "1px solid var(--accent)" }} />
              <div className="absolute -inset-8 rounded-full opacity-10 float" style={{ border: "1px dashed var(--accent)", animationDelay: "0.5s" }} />

              {/* Profile image */}
              <div
                className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full flex items-center justify-center overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, var(--bg-card) 0%, var(--bg-card-2) 100%)",
                  border: "2px solid var(--border-solid)",
                  boxShadow: "0 0 60px rgba(0,212,255,0.12), inset 0 0 60px rgba(0,212,255,0.03)",
                }}
              >
                <img
                  src="./profpic.png"
                  alt="Neil Charlie Rebenque"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Tech badges floating */}
              <div className="absolute -top-2 -right-4 px-3 py-1.5 rounded-full text-xs font-semibold float" style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-solid)", color: "var(--accent)", fontFamily: "JetBrains Mono, monospace", animationDelay: "0.3s" }}>
                {"<PHP />"}
              </div>
              <div className="absolute -bottom-2 -left-4 px-3 py-1.5 rounded-full text-xs font-semibold float" style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-solid)", color: "#f7df1e", fontFamily: "JetBrains Mono, monospace", animationDelay: "1s" }}>
                JS
              </div>
              <div className="absolute top-1/2 -right-8 px-3 py-1.5 rounded-full text-xs font-semibold float" style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-solid)", color: "#e34f26", fontFamily: "JetBrains Mono, monospace", animationDelay: "0.7s" }}>
                HTML5
              </div>
              <div className="absolute top-8 -left-8 px-3 py-1.5 rounded-full text-xs font-semibold float" style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-solid)", color: "#3178c6", fontFamily: "JetBrains Mono, monospace", animationDelay: "1.4s" }}>
                MySQL
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-40">
        <span className="text-xs" style={{ color: "var(--text-muted)", fontFamily: "JetBrains Mono, monospace" }}>scroll</span>
        <ChevronDown size={16} style={{ color: "var(--text-muted)" }} className="animate-bounce" />
      </div>
    </section>
  )
}
