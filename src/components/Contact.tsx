import { useState } from "react"
import { Mail, Phone, MapPin, GitFork, Briefcase, Users, Send, CheckCircle, AlertCircle } from "lucide-react"
import SectionHeading from "./SectionHeading"

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" })
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setStatus("success")
      setForm({ name: "", email: "", subject: "", message: "" })
      setTimeout(() => setStatus("idle"), 4000)
    }, 1500)
  }

  const inputStyle = {
    backgroundColor: "var(--bg-secondary)",
    border: "1px solid var(--border-solid)",
    color: "var(--text)",
    borderRadius: 12,
    padding: "12px 16px",
    width: "100%",
    fontSize: 14,
    outline: "none",
    transition: "border-color 0.2s ease",
  }

  return (
    <section id="contact" className="py-24" style={{ backgroundColor: "var(--bg-secondary)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          tag="Get In Touch"
          title="Let&apos;s Connect"
          subtitle="I am open to opportunities where I can apply my technical skills, gain experience, and contribute to meaningful technology projects."
          centered
        />

        <div className="mt-12 grid lg:grid-cols-5 gap-8">
          {/* Left info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl p-6" style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-solid)" }}>
              <h3 className="text-lg font-bold mb-4" style={{ fontFamily: "Outfit, sans-serif", color: "var(--text)" }}>Contact Details</h3>
              <div className="space-y-4">
                {[
                  { icon: Mail, label: "Email", value: "neil.rebenque@email.com", color: "var(--accent)" },
                  { icon: Phone, label: "Phone", value: "0991-688-2192", color: "#22d3a0" },
                  { icon: MapPin, label: "Location", value: "Philippines", color: "#818cf8" },
                ].map(({ icon: Icon, label, value, color }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${color}12`, border: `1px solid ${color}25` }}>
                      <Icon size={16} style={{ color }} />
                    </div>
                    <div>
                      <div className="text-xs" style={{ color: "var(--text-dim)" }}>{label}</div>
                      <div className="text-sm font-medium" style={{ color: "var(--text)" }}>{value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl p-6" style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-solid)" }}>
              <h3 className="text-sm font-bold mb-4" style={{ color: "var(--text)" }}>Professional Links</h3>
              <div className="space-y-3">
                {[
                  { icon: GitFork, label: "GitHub", href: "https://github.com", color: "var(--text-muted)" },
                  
                  { icon: Users, label: "Facebook", href: "https://www.facebook.com/charlierebenque26", color: "#1877f2" },
                  { icon: Mail, label: "Email", href: "neilcharlie26@gmail.com", color: "var(--accent)" },
                ].map(({ icon: Icon, label, href, color }) => (
                  <a
                    key={label}
                    href={href}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200"
                    style={{ border: "1px solid transparent" }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--border-solid)")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.borderColor = "transparent")}
                  >
                    <Icon size={18} style={{ color }} />
                    <span className="text-sm" style={{ color: "var(--text-muted)" }}>{label}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div className="rounded-2xl p-6" style={{ backgroundColor: "rgba(34,211,160,0.05)", border: "1px solid rgba(34,211,160,0.2)" }}>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ backgroundColor: "var(--green)" }} />
                <span className="text-sm font-semibold" style={{ color: "var(--green)" }}>Open to Work</span>
              </div>
              <div className="space-y-1.5">
                {["Entry-Level IS Positions", "Web Development Opportunities", "Internship Opportunities", "Freelance Projects"].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-xs" style={{ color: "var(--text-muted)" }}>
                    <span style={{ color: "var(--green)" }}>✓</span> {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact form */}
          <div className="lg:col-span-3">
            <div className="rounded-2xl p-8" style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-solid)" }}>
              <h3 className="text-lg font-bold mb-6" style={{ fontFamily: "Outfit, sans-serif", color: "var(--text)" }}>Send a Message</h3>

              {status === "success" && (
                <div className="flex items-center gap-3 p-4 rounded-xl mb-6" style={{ backgroundColor: "rgba(34,211,160,0.1)", border: "1px solid rgba(34,211,160,0.25)" }}>
                  <CheckCircle size={18} style={{ color: "var(--green)" }} />
                  <span className="text-sm" style={{ color: "var(--green)" }}>Message sent successfully! I will get back to you soon.</span>
                </div>
              )}

              {status === "error" && (
                <div className="flex items-center gap-3 p-4 rounded-xl mb-6" style={{ backgroundColor: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)" }}>
                  <AlertCircle size={18} style={{ color: "#ef4444" }} />
                  <span className="text-sm" style={{ color: "#ef4444" }}>Something went wrong. Please try again.</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium mb-2" style={{ color: "var(--text-muted)" }}>Full Name</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Your full name"
                      style={inputStyle}
                      onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
                      onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-solid)")}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-2" style={{ color: "var(--text-muted)" }}>Email Address</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="your@email.com"
                      style={inputStyle}
                      onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
                      onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-solid)")}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-2" style={{ color: "var(--text-muted)" }}>Subject</label>
                  <input
                    type="text"
                    required
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    placeholder="What is this about?"
                    style={inputStyle}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-solid)")}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-2" style={{ color: "var(--text-muted)" }}>Message</label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell me about your project or opportunity..."
                    style={{ ...inputStyle, resize: "vertical" }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-solid)")}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all duration-200"
                  style={{ backgroundColor: "var(--accent)", color: "#060d1a", opacity: loading ? 0.7 : 1 }}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor: "#060d1a", borderTopColor: "transparent" }} />
                      Sending...
                    </span>
                  ) : (
                    <>
                      <Send size={16} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
