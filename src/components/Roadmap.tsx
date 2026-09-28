import { CheckCircle2, Clock, Target } from "lucide-react"
import SectionHeading from "./SectionHeading"

const stages = [
  {
    phase: "Current",
    icon: CheckCircle2,
    color: "var(--green)",
    bgColor: "rgba(34,211,160,0.08)",
    borderColor: "rgba(34,211,160,0.25)",
    label: "What I Know",
    items: [
      { name: "HTML5 & CSS3", note: "Proficient" },
      { name: "PHP Backend", note: "Proficient" },
      { name: "MySQL Database", note: "Proficient" },
      { name: "JavaScript Basics", note: "Intermediate" },
      { name: "Bootstrap 5", note: "Proficient" },
      { name: "LAN / WiFi Setup", note: "Intermediate" },
      { name: "C++ Basics", note: "Beginner" },
      { name: "Arduino Programming", note: "Beginner" },
    ],
  },
  {
    phase: "Learning",
    icon: Clock,
    color: "var(--accent)",
    bgColor: "var(--accent-dim)",
    borderColor: "var(--border)",
    label: "In Progress",
    items: [
      { name: "Advanced PHP & OOP", note: "Active" },
      { name: "Modern JavaScript (ES6+)", note: "Active" },
      { name: "Responsive UI/UX Design", note: "Active" },
      { name: "Database Optimization", note: "Active" },
      { name: "Git & Version Control", note: "Active" },
      { name: "REST API Development", note: "Starting" },
    ],
  },
  {
    phase: "Future Goals",
    icon: Target,
    color: "#818cf8",
    bgColor: "rgba(129,140,248,0.08)",
    borderColor: "rgba(129,140,248,0.2)",
    label: "Planned",
    items: [
      { name: "React / Vue.js Framework", note: "Planned" },
      { name: "Node.js Backend", note: "Planned" },
      { name: "Mobile App Development", note: "Planned" },
      { name: "Cloud Services (AWS/GCP)", note: "Planned" },
      { name: "Docker & DevOps Basics", note: "Planned" },
      { name: "TypeScript", note: "Planned" },
    ],
  },
]

export default function Roadmap() {
  return (
    <section id="roadmap" className="py-24" style={{ backgroundColor: "var(--bg-secondary)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          tag="Career Path"
          title="Development Roadmap"
          subtitle="A visual overview of my skills today, what I am learning, and where I am headed."
          centered
        />

        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {stages.map(({ phase, icon: Icon, color, bgColor, borderColor, label, items }) => (
            <div
              key={phase}
              className="rounded-2xl overflow-hidden"
              style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-solid)" }}
            >
              {/* Header */}
              <div className="px-6 py-5" style={{ backgroundColor: bgColor, borderBottom: `1px solid ${borderColor}` }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "var(--bg-card)", border: `1px solid ${borderColor}` }}>
                    <Icon size={20} style={{ color }} />
                  </div>
                  <div>
                    <div className="text-xs font-mono mb-0.5" style={{ color, fontFamily: "JetBrains Mono, monospace" }}>{label}</div>
                    <div className="text-lg font-bold" style={{ fontFamily: "Outfit, sans-serif", color: "var(--text)" }}>{phase}</div>
                  </div>
                </div>
              </div>

              {/* Items */}
              <div className="p-4 space-y-2">
                {items.map(({ name, note }) => (
                  <div
                    key={name}
                    className="flex items-center justify-between px-3 py-2.5 rounded-xl"
                    style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border-solid)" }}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                      <span className="text-sm" style={{ color: "var(--text)" }}>{name}</span>
                    </div>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: bgColor, color, border: `1px solid ${borderColor}` }}
                    >
                      {note}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Timeline connector visual */}
        <div className="mt-10 flex items-center justify-center gap-2">
          <div className="h-px flex-1 max-w-48" style={{ background: "linear-gradient(to right, transparent, var(--green))" }} />
          <div className="flex items-center gap-3 text-xs font-mono px-4" style={{ color: "var(--text-dim)", fontFamily: "JetBrains Mono, monospace" }}>
            <span style={{ color: "var(--green)" }}>current</span>
            <span>→</span>
            <span style={{ color: "var(--accent)" }}>learning</span>
            <span>→</span>
            <span style={{ color: "#818cf8" }}>future</span>
          </div>
          <div className="h-px flex-1 max-w-48" style={{ background: "linear-gradient(to left, transparent, #818cf8)" }} />
        </div>
      </div>
    </section>
  )
}
