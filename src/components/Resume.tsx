import { Download, Eye, FileText, Briefcase, GraduationCap, Award, Code2, Wrench } from "lucide-react"
import SectionHeading from "./SectionHeading"

export default function Resume() {
  return (
    <section id="resume" className="py-24" style={{ backgroundColor: "var(--bg)" }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading tag="Credentials" title="Resume" subtitle="A professional summary of my education, skills, experience, and projects." centered />

        <div className="mt-12 rounded-2xl overflow-hidden" style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-solid)" }}>
          {/* Resume header */}
          <div className="px-8 py-8" style={{ background: "linear-gradient(135deg, var(--bg-card-2) 0%, var(--bg-card) 100%)", borderBottom: "1px solid var(--border-solid)" }}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-2xl font-bold" style={{ fontFamily: "Outfit, sans-serif", color: "var(--text)" }}>Neil Charlie Rebenque</h3>
                <div className="text-sm mt-1" style={{ color: "var(--accent)" }}>PHP Full-Stack Developer</div>
                <div className="flex flex-wrap gap-3 mt-3 text-xs" style={{ color: "var(--text-muted)" }}>
                  <span>neil.rebenque@email.com</span>
                  <span>·</span>
                  <span>0991-688-2192</span>
                  <span>·</span>
                  <span>Philippines</span>
                </div>
              </div>
              <div className="flex gap-3 flex-shrink-0">
                <a
                  href="#"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
                  style={{ backgroundColor: "var(--accent)", color: "#060d1a" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.opacity = "0.9")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.opacity = "1")}
                >
                  <Download size={15} /> Download PDF
                </a>
                <a
                  href="#"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium"
                  style={{ backgroundColor: "var(--accent-dim)", border: "1px solid var(--border)", color: "var(--accent)" }}
                >
                  <Eye size={15} /> View Full
                </a>
              </div>
            </div>
          </div>

          <div className="p-8 grid lg:grid-cols-3 gap-8">
            {/* Left column */}
            <div className="lg:col-span-1 space-y-6">
              {/* Summary */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <FileText size={14} style={{ color: "var(--accent)" }} />
                  <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--accent)", fontFamily: "JetBrains Mono, monospace" }}>Summary</span>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
                  PHP full-stack developer with hands-on experience building full-stack PHP/MySQL web applications and mobile applications using React Native, Expo, and Supabase.
                  Passionate about technology, problem solving, and delivering clean, functional digital solutions.
                </p>
              </div>

              {/* Core Skills */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Wrench size={14} style={{ color: "var(--accent)" }} />
                  <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--accent)", fontFamily: "JetBrains Mono, monospace" }}>Core Skills</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {["PHP", "MySQL", "React Native", "Expo", "Supabase", "HTML5", "CSS3", "JavaScript", "Bootstrap 5", "C++", "Arduino", "LAN Setup", "IT Support", "GitHub", "Figma"].map((s) => (
                    <span
                      key={s}
                      className="text-xs px-2 py-0.5 rounded font-mono"
                      style={{ backgroundColor: "var(--accent-dim)", border: "1px solid var(--border)", color: "var(--accent)", fontFamily: "JetBrains Mono, monospace" }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Certifications */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Award size={14} style={{ color: "var(--accent)" }} />
                  <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--accent)", fontFamily: "JetBrains Mono, monospace" }}>Certifications</span>
                </div>
                <div className="space-y-2">
                  {[
                    "Web Development Fundamentals",
                    "Introduction to C++",
                    "JavaScript Development Mastery",
                    "Solar PV Installation Training",
                  ].map((c) => (
                    <div key={c} className="flex items-start gap-2 text-xs" style={{ color: "var(--text-muted)" }}>
                      <span className="mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: "var(--green)" }} />
                      {c}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Education */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <GraduationCap size={14} style={{ color: "var(--accent)" }} />
                  <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--accent)", fontFamily: "JetBrains Mono, monospace" }}>Education</span>
                </div>
                <div className="rounded-xl p-4" style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border-solid)" }}>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-sm font-semibold" style={{ color: "var(--text)" }}>BS Information Systems</div>
                      <div className="text-xs mt-0.5" style={{ color: "var(--accent)" }}>DFCAMCLP · Philippines</div>
                    </div>
                    <span className="text-xs font-mono" style={{ color: "var(--text-dim)", fontFamily: "JetBrains Mono, monospace" }}>2022 – 2026</span>
                  </div>
                  <p className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>
                    Relevant subjects: Web Development, Database Management, Networking, System Analysis, IT Support
                  </p>
                </div>
              </div>

              {/* Experience */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Briefcase size={14} style={{ color: "var(--accent)" }} />
                  <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--accent)", fontFamily: "JetBrains Mono, monospace" }}>Experience</span>
                </div>
                <div className="space-y-3">
                  {[
                    { role: "Freelance Web Developer", org: "Self-Employed", period: "2024 – Present", desc: "Built PHP/MySQL web apps for clients; responsive UI with Bootstrap 5; database design and IT support." },
                    { role: "Solar PV Installation Trainee", org: "PHLSolar Academy", period: "June 2026", desc: "Completed solar PV system design and installation training with best practices certification." },
                  ].map(({ role, org, period, desc }) => (
                    <div key={role} className="rounded-xl p-4" style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border-solid)" }}>
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-sm font-semibold" style={{ color: "var(--text)" }}>{role}</div>
                          <div className="text-xs mt-0.5" style={{ color: "var(--accent)" }}>{org}</div>
                        </div>
                        <span className="text-xs font-mono flex-shrink-0" style={{ color: "var(--text-dim)", fontFamily: "JetBrains Mono, monospace" }}>{period}</span>
                      </div>
                      <p className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>{desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Projects */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Code2 size={14} style={{ color: "var(--accent)" }} />
                  <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--accent)", fontFamily: "JetBrains Mono, monospace" }}>Featured Project</span>
                </div>
                <div className="rounded-xl p-4" style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border-solid)" }}>
                  <div className="text-sm font-semibold mb-1" style={{ color: "var(--text)" }}>Prettyboy Motorshop Management System</div>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {["PHP", "MySQL", "Bootstrap 5", "AJAX", "JavaScript"].map((t) => (
                      <span key={t} className="text-xs px-1.5 py-0.5 rounded font-mono" style={{ backgroundColor: "var(--accent-dim)", color: "var(--accent)", fontFamily: "JetBrains Mono, monospace" }}>{t}</span>
                    ))}
                  </div>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                    Full-featured multi-branch business system with POS, inventory, customer management, repair tracking, role-based access, and comprehensive reporting.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
