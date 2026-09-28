import { Target } from "lucide-react"

export default function CareerObjective() {
  return (
    <section id="objective" className="py-20 grid-bg" style={{ backgroundColor: "var(--bg)" }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: "var(--accent-dim)", border: "1px solid var(--border)" }}>
          <Target size={24} style={{ color: "var(--accent)" }} />
        </div>
        <div
          className="text-xs font-semibold tracking-widest uppercase mb-4 inline-block px-3 py-1 rounded-full"
          style={{ color: "var(--accent)", backgroundColor: "var(--accent-dim)", border: "1px solid var(--border)", fontFamily: "JetBrains Mono, monospace" }}
        >
          Career Objective
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold mb-8" style={{ color: "var(--text)" }}>
          My Professional Goal
        </h2>

        <div
          className="relative rounded-2xl p-8 sm:p-10 text-left"
          style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-solid)" }}
        >
          {/* Accent line */}
          <div className="absolute left-0 top-8 bottom-8 w-1 rounded-full" style={{ backgroundColor: "var(--accent)" }} />

          <p className="text-lg sm:text-xl leading-relaxed pl-6" style={{ color: "var(--text-muted)" }}>
            I am seeking an opportunity to join a dynamic and growth-oriented organization where I can{" "}
            <span style={{ color: "var(--text)", fontWeight: 600 }}>apply my technical skills</span>,{" "}
            <span style={{ color: "var(--text)", fontWeight: 600 }}>gain professional experience</span>, and{" "}
            <span style={{ color: "var(--text)", fontWeight: 600 }}>continue learning</span>. I aim to contribute meaningfully to
            technology projects, grow as an IT professional, and become a valuable member of a team that
            drives innovation and practical solutions.
          </p>

          <div className="mt-8 pl-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              "Apply Technical Skills",
              "Gain Professional Experience",
              "Continue Learning",
              "Contribute to Projects",
              "Develop as IS Professional",
              "Build Real Solutions",
            ].map((goal) => (
              <div key={goal} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: "var(--accent)" }} />
                <span className="text-sm" style={{ color: "var(--text-muted)" }}>{goal}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
