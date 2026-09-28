import { GraduationCap, MapPin } from "lucide-react"
import SectionHeading from "./SectionHeading"

const education = [
  {
    degree: "Bachelor of Science in Information Systems",
    school: "Dr. Filemon C. Aguilar Memorial College of Las Piñas",
    location: "Philippines",
    period: "2022 – 2026",
    status: "Completed",
    subjects: ["Web Development", "Database Management", "Networking", "System Analysis", "Programming", "IT Support"],
    achievements: ["Dean's List Candidate", "Active in IS Projects"],
    color: "var(--accent)",
  },
  {
    degree: "Senior High School — EPAS Strand",
    school: "CAA National Senior High School",
    location: "Philippines",
    period: "2020 – 2022",
    status: "Completed",
    subjects: ["Electronics", "Rizal", "Philosophy"],
    achievements: ["EPAS Track Graduate"],
    color: "#818cf8",
  },
  {
    degree: "Junior High School",
    school: "CAA National High School",
    location: "Philippines",
    period: "2016 – 2020",
    status: "Completed",
    subjects: ["Research", "Science"],
    achievements: ["I'm Happy"],
    color: "#22d3a0",
  },
]

export default function Education() {
  return (
    <section id="education" className="py-24" style={{ backgroundColor: "var(--bg)" }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading tag="Academic Background" title="Education" />

        <div className="mt-12 relative">
          {/* Timeline line */}
          <div className="absolute left-5 top-0 bottom-0 w-px" style={{ backgroundColor: "var(--border-solid)" }} />

          <div className="space-y-8">
            {education.map((edu, i) => (
              <div key={i} className="relative flex gap-8">
                {/* Timeline dot */}
                <div
                  className="relative z-10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${edu.color}15`, border: `2px solid ${edu.color}`, boxShadow: `0 0 12px ${edu.color}30` }}
                >
                  <GraduationCap size={16} style={{ color: edu.color }} />
                </div>

                {/* Content */}
                <div
                  className="flex-1 rounded-2xl p-6 card-hover mb-2"
                  style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-solid)" }}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                    <div>
                      <h3 className="text-lg font-bold" style={{ fontFamily: "Outfit, sans-serif", color: "var(--text)" }}>{edu.degree}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-sm font-medium" style={{ color: edu.color }}>{edu.school}</span>
                        <span className="flex items-center gap-1 text-xs" style={{ color: "var(--text-dim)" }}>
                          <MapPin size={10} /> {edu.location}
                        </span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-sm font-mono" style={{ color: "var(--text-muted)", fontFamily: "JetBrains Mono, monospace" }}>{edu.period}</div>
                      <span
                        className="text-xs px-2 py-0.5 rounded-full mt-1 inline-block"
                        style={{
                          backgroundColor: edu.status === "Ongoing" ? "rgba(0,212,255,0.1)" : "rgba(34,211,160,0.1)",
                          color: edu.status === "Ongoing" ? "var(--accent)" : "var(--green)",
                          border: `1px solid ${edu.status === "Ongoing" ? "rgba(0,212,255,0.2)" : "rgba(34,211,160,0.2)"}`,
                        }}
                      >
                        {edu.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4 mt-4 pt-4" style={{ borderTop: "1px solid var(--border-solid)" }}>
                    <div>
                      <div className="text-xs font-semibold mb-2" style={{ color: "var(--text-muted)" }}>Relevant Subjects</div>
                      <div className="flex flex-wrap gap-1.5">
                        {edu.subjects.map((s) => (
                          <span key={s} className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: "var(--bg-secondary)", color: "var(--text-muted)" }}>{s}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold mb-2" style={{ color: "var(--text-muted)" }}>Achievements</div>
                      <div className="flex flex-wrap gap-1.5">
                        {edu.achievements.map((a) => (
                          <span key={a} className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: `${edu.color}10`, color: edu.color }}>{a}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
