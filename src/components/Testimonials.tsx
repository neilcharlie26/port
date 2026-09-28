import { Star, Quote } from "lucide-react"
import SectionHeading from "./SectionHeading"

const testimonials = [
  {
    name: "DRAYAN SARSA",
    position: "BS IS Student",
    org: "DFCAMCLP",
    text: "Neil is a hardworking and motivated individual who is eager to learn and improve his technical skills. He consistently delivers quality work in group projects and brings creative solutions to technical challenges.",
    stars: 5,
    avatar: "PC",
    color: "var(--accent)",
  },
  {
    name: "IT INSTRUCTOR",
    position: "IT Instructor",
    org: "DFCAMCLP",
    text: "Neil demonstrates strong dedication to his studies and a genuine passion for technology. His project work, especially his motorcycle shop management system, showed a level of complexity and polish beyond what is typically expected.",
    stars: 5,
    avatar: "PI",
    color: "#818cf8",
  },
  {
    name: "JAMES WILSON",
    position: "Project Teammate",
    org: "Academic Project",
    text: "Working with Neil on our project was a great experience. He is reliable, detail-oriented, and always willing to help teammates understand technical concepts. His problem-solving approach helped the team overcome several critical challenges.",
    stars: 5,
    avatar: "PP",
    color: "#22d3a0",
  },
]

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-24" style={{ backgroundColor: "var(--bg)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading tag="Social Proof" title="What Others Say" subtitle="Placeholder testimonials — real ones coming soon." centered />

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="rounded-2xl p-6 flex flex-col card-hover"
              style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-solid)" }}
            >
              <Quote size={24} className="mb-4" style={{ color: t.color, opacity: 0.5 }} />
              <p className="text-sm leading-relaxed flex-1 mb-6" style={{ color: "var(--text-muted)" }}>&ldquo;{t.text}&rdquo;</p>
              <div className="flex items-center gap-3 pt-4" style={{ borderTop: "1px solid var(--border-solid)" }}>
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{ backgroundColor: `${t.color}15`, border: `1px solid ${t.color}30`, color: t.color }}
                >
                  {t.avatar}
                </div>
                <div>
                  <div className="text-sm font-semibold" style={{ color: "var(--text)" }}>{t.name}</div>
                  <div className="text-xs" style={{ color: "var(--text-muted)" }}>{t.position} · {t.org}</div>
                </div>
                <div className="ml-auto flex gap-0.5">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <Star key={j} size={12} fill="#f59e0b" style={{ color: "#f59e0b" }} />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm" style={{ color: "var(--text-dim)" }}>
            These are placeholder testimonials. Real testimonials will be added when available.
          </p>
        </div>
      </div>
    </section>
  )
}
