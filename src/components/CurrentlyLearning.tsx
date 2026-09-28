import { BookOpen, Zap } from "lucide-react"
import SectionHeading from "./SectionHeading"

const learning = [
  { name: "Advanced PHP", progress: 95, color: "#7c3aed" },
  { name: "Modern JavaScript (ES6+)", progress: 85, color: "#f7df1e" },
  { name: "Responsive Web Design", progress: 98, color: "var(--accent)" },
  { name: "Database Optimization", progress: 95, color: "#f59e0b" },
  { name: "gimini ai", progress: 85, color: "#f472b6" },
  { name: "Mobile App Development", progress: 89, color: "#22d3a0" },
]

export default function CurrentlyLearning() {
  return (
    <section id="learning" className="py-24" style={{ backgroundColor: "var(--bg-secondary)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading tag="In Progress" title="Currently Learning" subtitle="Technologies and subjects I am actively studying and improving." centered />

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {learning.map(({ name, progress, color }) => (
            <div
              key={name}
              className="rounded-2xl p-5 card-hover"
              style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-solid)" }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: color }} />
                  <span className="text-sm font-medium" style={{ color: "var(--text)" }}>{name}</span>
                </div>
                <span className="text-xs font-mono" style={{ color: "var(--text-dim)", fontFamily: "JetBrains Mono, monospace" }}>{progress}%</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "var(--bg-card-2)" }}>
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${progress}%`, background: `linear-gradient(90deg, ${color}, ${color}80)` }}
                />
              </div>
              <div className="mt-2 flex items-center gap-1">
                <Zap size={10} style={{ color }} />
                <span className="text-xs" style={{ color: "var(--text-dim)" }}>Active</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
