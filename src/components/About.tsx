import { GraduationCap, Globe, Database, Network, Wrench, FileText } from "lucide-react"
import SectionHeading from "./SectionHeading"

const facts = [
  { icon: GraduationCap, label: "Education", value: "BS Information Systems Graduate", color: "#818cf8" },
  { icon: Globe, label: "Web Development", value: "PHP, HTML5, CSS3, JS", color: "var(--accent)" },
  { icon: Database, label: "Database", value: "MySQL & Supabase", color: "#f59e0b" },
  { icon: Globe, label: "Mobile Development", value: "React Native & Expo", color: "#38bdf8" },
  { icon: Network, label: "Networking", value: "LAN, WiFi, Troubleshooting", color: "#22d3a0" },
  { icon: Wrench, label: "IT Support", value: "Technical Assistance", color: "#f472b6" },
]

export default function About() {
  return (
    <section id="about" className="py-24" style={{ backgroundColor: "var(--bg-secondary)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image side */}
          <div className="relative order-2 lg:order-1">
            <div
              className="rounded-2xl overflow-hidden"
              style={{ border: "1px solid var(--border-solid)" }}
            >
              <img
                src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=450&fit=crop&auto=format"
                alt="Developer workspace"
                className="w-full h-72 object-cover"
                style={{ opacity: 0.85 }}
              />
              <div className="p-6" style={{ backgroundColor: "var(--bg-card)" }}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="font-bold text-lg" style={{ fontFamily: "Outfit, sans-serif", color: "var(--text)" }}>Neil Charlie Rebenque</div>
                    <div className="text-sm" style={{ color: "var(--accent)" }}>PHP Full-Stack Developer</div>
                  </div>
                  <div
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{ backgroundColor: "rgba(34,211,160,0.1)", border: "1px solid rgba(34,211,160,0.2)", color: "var(--green)" }}
                  >
                    Open to Work
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 pt-4" style={{ borderTop: "1px solid var(--border-solid)" }}>
                  {[["5+", "Projects"], ["4+", "Certificates"], ["2026", "Graduate"]].map(([n, l]) => (
                    <div key={l} className="text-center">
                      <div className="text-xl font-bold" style={{ fontFamily: "Outfit, sans-serif", color: "var(--accent)" }}>{n}</div>
                      <div className="text-xs" style={{ color: "var(--text-muted)" }}>{l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Text side */}
          <div className="order-1 lg:order-2">
            <SectionHeading tag="Who I Am" title="About Me" />
            <div className="mt-6 space-y-4 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
              <p>
                I am <strong style={{ color: "var(--text)" }}>Neil Charlie Rebenque</strong>, a BS Information Systems graduate and PHP full-stack developer based in the Philippines.
                My passion lies in creating practical, efficient, and user-friendly technology solutions that make a real difference.
              </p>
              <p>
                I have built a strong foundation in web development using PHP, HTML5, CSS3, JavaScript, and Bootstrap 5,
                complemented by database management skills with MySQL and Supabase. I also build mobile applications using React Native and Expo. I am also familiar with networking fundamentals
                and IT support practices.
              </p>
              <p>
                I am driven by curiosity and a genuine love for technology. I am constantly learning, growing,
                and seeking opportunities where I can contribute meaningfully to real-world projects while
                developing my professional skills.
              </p>
            </div>

            {/* Quick facts */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {facts.map(({ icon: Icon, label, value, color }) => (
                <div
                  key={label}
                  className="flex items-center gap-3 p-3 rounded-xl card-hover"
                  style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-solid)" }}
                >
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${color}15`, border: `1px solid ${color}30` }}>
                    <Icon size={16} style={{ color }} />
                  </div>
                  <div>
                    <div className="text-xs" style={{ color: "var(--text-muted)" }}>{label}</div>
                    <div className="text-sm font-medium" style={{ color: "var(--text)" }}>{value}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <a
                href="#"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200"
                style={{ backgroundColor: "var(--accent-dim)", border: "1px solid var(--border)", color: "var(--accent)" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.backgroundColor = "var(--accent-hover)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.backgroundColor = "var(--accent-dim)")}
              >
                <FileText size={16} />
                View Full Resume
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
