import { GitFork, Briefcase, Users, Mail, Code2, Heart, LockKeyhole } from "lucide-react"

const quickLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Certifications", href: "#certifications" },
  { label: "Contact", href: "#contact" },
]

const socials = [
  { icon: GitFork, href: "#", label: "GitHub" },
  { icon: Briefcase, href: "#", label: "LinkedIn" },
  { icon: Users, href: "#", label: "Facebook" },
  { icon: Mail, href: "#contact", label: "Email" },
]

export default function Footer() {
  return (
    <footer style={{ backgroundColor: "var(--bg-card)", borderTop: "1px solid var(--border-solid)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: "var(--accent-dim)", border: "1px solid var(--border)" }}>
                <Code2 size={16} style={{ color: "var(--accent)" }} />
              </div>
              <div>
                <div className="text-sm font-bold" style={{ fontFamily: "Outfit, sans-serif", color: "var(--text)" }}>Neil Charlie Rebenque</div>
                <div className="text-xs" style={{ color: "var(--accent)", fontFamily: "JetBrains Mono, monospace" }}>Portfolio</div>
              </div>
            </div>
            <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--text-muted)" }}>
              PHP Full-Stack Developer
            </p>
            <div className="flex items-center gap-1 mb-4">
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: "var(--green)" }} />
              <span className="text-xs" style={{ color: "var(--green)" }}>Available for Opportunities</span>
            </div>
            <div className="flex gap-2">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  title={label}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200"
                  style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border-solid)", color: "var(--text-muted)" }}
                  onMouseEnter={(e) => {
                    ;(e.currentTarget as HTMLAnchorElement).style.color = "var(--accent)"
                    ;(e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--accent)"
                  }}
                  onMouseLeave={(e) => {
                    ;(e.currentTarget as HTMLAnchorElement).style.color = "var(--text-muted)"
                    ;(e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--border-solid)"
                  }}
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
           
          </div>

          {/* Contact info */}
          <div>
            <h4 className="text-sm font-bold mb-4" style={{ fontFamily: "Outfit, sans-serif", color: "var(--text)" }}>Get In Touch</h4>
            <div className="space-y-2 text-sm" style={{ color: "var(--text-muted)" }}>
              <div>neilcharlie26@email.com</div>
              <div>0991-688-2192</div>
              <div>Philippines</div>
            </div>
            <div className="mt-4">
              <a
                href="#contact"
                className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all duration-200"
                style={{ backgroundColor: "var(--accent-dim)", border: "1px solid var(--border)", color: "var(--accent)" }}
              >
                Send a Message →
              </a>
            </div>
          </div>
        </div>

        <div
          className="mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs"
          style={{ borderTop: "1px solid var(--border-solid)", color: "var(--text-dim)" }}
        >
          <span>© 2026 Neil Charlie Rebenque. All Rights Reserved.</span>
          <a href="#admin" aria-label="Admin login" title="Admin login" className="inline-flex h-9 w-9 items-center justify-center rounded-full opacity-40 transition hover:bg-white/5 hover:opacity-100 focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">
            <LockKeyhole size={13} />
          </a>
        </div>
      </div>
    </footer>
  )
}
