import { Plus } from "lucide-react"
import SectionHeading from "./SectionHeading"

const achievements = [
  {
    emoji: "🏆",
    title: "Capstone Project Showcase",
    org: "DFCAMCLP — BS Information Systems",
    date: "2026",
    desc: "Presented the Multi-Branch Motorcycle Shop POS & Management System as a capstone project, demonstrating end-to-end system design and development.",
    type: "Academic",
    color: "var(--accent)",
  },
  {
    emoji: "⚡",
    title: "Solar PV Installation Training Completion",
    org: "PHLSolar Academy",
    date: "June 14, 2026",
    desc: "Earned a Certificate of Training for completing in-depth solar PV design and installation best practices at PHLSolar Academy.",
    type: "Training",
    color: "#f59e0b",
  },
  {
    emoji: "🌐",
    title: "Web Development Fundamentals Certificate",
    org: "Online Learning Platform",
    date: "2025",
    desc: "Completed a comprehensive web development course covering HTML5, CSS3, JavaScript, and responsive design principles.",
    type: "Certification",
    color: "#818cf8",
  },
  {
    emoji: "💻",
    title: "JavaScript Development Mastery",
    org: "Online Learning Platform",
    date: "2025",
    desc: "Mastered modern JavaScript including ES6+, async programming, DOM manipulation, and API integration.",
    type: "Certification",
    color: "#f7df1e",
  },
  {
    emoji: "🎓",
    title: "EPAS Strand Graduate",
    org: "Senior High School",
    date: "2022",
    desc: "Completed the ICT track in Senior High School, building a strong foundation in computer programming, web design, and hardware servicing.",
    type: "Academic",
    color: "#22d3a0",
  },
  {
    emoji: "🔧",
    title: "Introduction to C++ Certificate",
    org: "Programming Workshop",
    date: "2025",
    desc: "Participated in a C++ programming workshop covering object-oriented programming, data structures, and algorithm basics.",
    type: "Participation",
    color: "#fb923c",
  },
]

const typeColors: Record<string, { bg: string; text: string }> = {
  Academic:       { bg: "rgba(0,212,255,0.08)",        text: "var(--accent)" },
  Training:       { bg: "rgba(245,158,11,0.08)",       text: "#f59e0b" },
  Certification:  { bg: "rgba(129,140,248,0.08)",      text: "#818cf8" },
  Participation:  { bg: "rgba(251,146,60,0.08)",       text: "#fb923c" },
}

export default function Achievements() {
  return (
    <section id="achievements" className="py-24" style={{ backgroundColor: "var(--bg-secondary)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading tag="Recognition" title="Achievements & Awards" subtitle="Academic recognitions, certifications, and training milestones I have earned." centered />

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {achievements.map((a) => {
            const tc = typeColors[a.type] ?? { bg: "var(--accent-dim)", text: "var(--accent)" }
            return (
              <div
                key={a.title}
                className="rounded-2xl p-6 flex flex-col card-hover"
                style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-solid)" }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="text-3xl">{a.emoji}</div>
                  <span
                    className="text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0"
                    style={{ backgroundColor: tc.bg, color: tc.text }}
                  >
                    {a.type}
                  </span>
                </div>
                <h4 className="text-sm font-bold leading-snug mb-1.5 flex-1" style={{ fontFamily: "Outfit, sans-serif", color: "var(--text)" }}>
                  {a.title}
                </h4>
                <div className="text-xs mb-1 font-medium" style={{ color: a.color }}>{a.org}</div>
                <div className="text-xs mb-3 font-mono" style={{ color: "var(--text-dim)", fontFamily: "JetBrains Mono, monospace" }}>
                  {a.date}
                </div>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>{a.desc}</p>
              </div>
            )
          })}

          {/* Placeholder card */}
          <div
            className="rounded-2xl p-6 flex flex-col items-center justify-center text-center"
            style={{ backgroundColor: "var(--bg-card)", border: "1px dashed var(--border-solid)", minHeight: 200 }}
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
              style={{ backgroundColor: "var(--accent-dim)", border: "1px solid var(--border)" }}
            >
              <Plus size={20} style={{ color: "var(--accent)" }} />
            </div>
            <p className="text-sm font-medium mb-1" style={{ color: "var(--text-muted)" }}>More Coming</p>
            <p className="text-xs" style={{ color: "var(--text-dim)" }}>Future achievements will be added here as they are earned.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
