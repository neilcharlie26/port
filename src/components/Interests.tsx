import SectionHeading from "./SectionHeading"

const interests = [
  { emoji: "💻", label: "Technology", desc: "Staying up-to-date with the latest tech trends and innovations." },
  { emoji: "🌐", label: "Web Development", desc: "Building functional, beautiful websites and web applications." },
  { emoji: "🎨", label: "UI/UX Design", desc: "Crafting clean, user-friendly interfaces and digital experiences." },
  { emoji: "🗄️", label: "Database Systems", desc: "Designing efficient, well-structured data architectures." },
  { emoji: "📡", label: "Networking", desc: "Understanding how computer networks connect and communicate." },
  { emoji: "📱", label: "Mobile Development", desc: "Exploring cross-platform mobile application development." },
  { emoji: "🤖", label: "Learning New Tech", desc: "Continuously picking up new tools, frameworks, and languages." },
  { emoji: "⚡", label: "Open Source", desc: "Contributing to and learning from open-source communities." },
]

export default function Interests() {
  return (
    <section id="interests" className="py-24" style={{ backgroundColor: "var(--bg)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading tag="Personal" title="Interests" subtitle="Things I am genuinely passionate about outside of coursework." centered />

        <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {interests.map(({ emoji, label, desc }) => (
            <div
              key={label}
              className="rounded-2xl p-5 text-center card-hover"
              style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-solid)" }}
            >
              <div className="text-3xl mb-3">{emoji}</div>
              <div className="text-sm font-bold mb-1.5" style={{ fontFamily: "Outfit, sans-serif", color: "var(--text)" }}>{label}</div>
              <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
