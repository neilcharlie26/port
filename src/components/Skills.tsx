import { useState } from "react"
import { Globe, Terminal, Database, Network, Wrench, Lightbulb, Smartphone } from "lucide-react"
import SectionHeading from "./SectionHeading"

const categories = [
  {
    id: "mobile",
    label: "Mobile Apps",
    icon: Smartphone,
    color: "#38bdf8",
    skills: [
      { name: "React Native", level: null },
      { name: "Expo", level: null },
      { name: "Supabase", level: null },
      { name: "MySQL", level: null },
    ],
  },
  {
    id: "web",
    label: "Web Dev",
    icon: Globe,
    color: "var(--accent)",
    skills: [
      { name: "HTML5", level: 95 },
      { name: "CSS3", level: 90 },
      { name: "JavaScript", level: 90 },
      { name: "PHP", level: 95 },
      { name: "Bootstrap 5", level: 90 },
    ],
  },
  {
    id: "programming",
    label: "Programming",
    icon: Terminal,
    color: "#818cf8",
    skills: [
      { name: "C++", level: 90 },
      { name: "Arduino", level: 80 },
    ],
  },
  {
    id: "database",
    label: "Database",
    icon: Database,
    color: "#f59e0b",
    skills: [
      { name: "MySQL", level: 95 },
      { name: "Supabase", level: null },
      { name: "DB Management", level: 90 },
      { name: "phpMyAdmin", level: 95 },
    ],
  },
  {
    id: "networking",
    label: "Networking",
    icon: Network,
    color: "#22d3a0",
    skills: [
      { name: "LAN Setup", level: 80 },
      { name: "WiFi Setup", level: 100 },
      { name: "Troubleshooting", level: 80 },
      { name: "Cable Crimping", level: 95 },
      { name: "Router Config", level: 90 },
    ],
  },
  {
    id: "tools",
    label: "Tools",
    icon: Wrench,
    color: "#f472b6",
    skills: [
      { name: "VS Code", level: 85 },
      { name: "XAMPP", level: 80 },
      { name: "GitHub", level: 90 },
      { name: "Figma", level: 85 },
      { name: "Canva", level: 100 },
      { name: "Adobe PS", level: 90 },
      { name: "MS Office", level: 95 },
    ],
  },
  {
    id: "soft",
    label: "Soft Skills",
    icon: Lightbulb,
    color: "#fb923c",
    skills: [
      { name: "Critical Thinking", level: 90 },
      { name: "Problem Solving", level: 90 },
      { name: "Communication", level: 95 },
      { name: "Teamwork", level: 100 },
      { name: "Adaptability", level: 80 },
      { name: "Time Management", level: 95 },
      { name: "Attention to Detail", level: 82 },
      { name: "Works Under Pressure", level: 98 },
    ],
  },
]

export default function Skills() {
  const [active, setActive] = useState("web")
  const cat = categories.find((c) => c.id === active)!

  return (
    <section id="skills" className="py-24" style={{ backgroundColor: "var(--bg)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading tag="Expertise" title="Technical Skills" subtitle="A categorized overview of my technical knowledge and tools." centered />

        {/* Category tabs */}
        <div className="flex flex-wrap justify-center gap-2 mt-10 mb-12">
          {categories.map(({ id, label, icon: Icon, color }) => (
            <button
              key={id}
              onClick={() => setActive(id)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200"
              style={{
                backgroundColor: active === id ? "var(--accent-dim)" : "var(--bg-card)",
                border: `1px solid ${active === id ? "var(--accent)" : "var(--border-solid)"}`,
                color: active === id ? "var(--accent)" : "var(--text-muted)",
              }}
            >
              <Icon size={14} style={{ color: active === id ? color : "var(--text-dim)" }} />
              {label}
            </button>
          ))}
        </div>

        {/* Active category content */}
        <div
          className="rounded-2xl p-8"
          style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-solid)" }}
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${cat.color}15`, border: `1px solid ${cat.color}30` }}>
              <cat.icon size={20} style={{ color: cat.color }} />
            </div>
            <h3 className="text-xl font-bold" style={{ fontFamily: "Outfit, sans-serif", color: "var(--text)" }}>{cat.label}</h3>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {cat.skills.map(({ name, level }) => (
              <div key={name}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium" style={{ color: "var(--text)" }}>{name}</span>
                  {level !== null && <span className="text-xs font-mono" style={{ color: "var(--text-muted)", fontFamily: "JetBrains Mono, monospace" }}>{level}%</span>}
                </div>
                {level !== null && <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "var(--bg-card-2)" }}>
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${level}%`,
                      background: `linear-gradient(90deg, ${cat.color}, ${cat.color}80)`,
                    }}
                  />
                </div>}
              </div>
            ))}
          </div>
        </div>

        {/* Tech badges row */}
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {["PHP", "MySQL", "React Native", "Expo", "Supabase", "HTML5", "CSS3", "JavaScript", "Bootstrap 5", "C++", "Arduino", "GitHub", "VS Code", "Figma", "XAMPP"].map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 rounded-full text-xs font-medium"
              style={{ backgroundColor: "var(--accent-dim)", border: "1px solid var(--border)", color: "var(--accent)", fontFamily: "JetBrains Mono, monospace" }}
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
