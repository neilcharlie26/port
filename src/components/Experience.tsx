import { Briefcase, MapPin } from "lucide-react"
import SectionHeading from "./SectionHeading"

const experiences = [
  {
    role: "Freelance Web Developer",
    org: "Independent / Self-Employed",
    location: "Remote",
    period: "2024 – Present",
    type: "Freelance",
    status: "Active",
    responsibilities: [
      "Designed and developed PHP/MySQL web applications for small clients",
      "Built responsive UIs using Bootstrap 5 and custom CSS",
      "Managed database design, optimization, and maintenance",
      "Provided technical support and troubleshooting services",
    ],
    skills: ["PHP", "MySQL", "HTML5", "CSS3", "Bootstrap 5"],
    color: "var(--accent)",
  },
  {
    role: "IS Student / Academic Projects Lead",
    org: "DFCAMCLP — BS Information Systems",
    location: "Philippines",
    period: "2022 – 2026",
    type: "Academic",
    status: "Active",
    responsibilities: [
      "Led development of Dong G Pastillan / HRA Library Management System",
      "Collaborated with team members on school software projects",
      "Applied web development and database management skills in real projects",
      "Presented and documented project solutions for academic evaluation",
    ],
    skills: ["PHP", "MySQL", "JavaScript", "Project Management", "Teamwork"],
    color: "#818cf8",
  },
  {
    role: "Solar PV Installation Trainee",
    org: "PHLSolar Academy Training",
    location: "Philippines",
    period: "June 2026",
    type: "Training",
    status: "Completed",
    responsibilities: [
      "Completed hands-on training in solar PV system design",
      "Learned roof-mounted solar installation best practices",
      "Studied solar PV components, wiring, and safety protocols",
      "Applied learned skills in practical simulation exercises",
    ],
    skills: ["Solar PV Design", "Installation Safety", "Technical Drawing"],
    color: "#f59e0b",
  },
  {
    role: "Personal Technology Projects",
    org: "Self-Initiated",
    location: "Philippines",
    period: "2023 – Present",
    type: "Personal",
    status: "Active",
    responsibilities: [
      "Developed Arduino-based sensor monitoring projects",
      "Experimented with C++ programming for embedded systems",
      "Explored networking concepts through home lab setup",
      "Built and documented personal portfolio and learning projects",
    ],
    skills: ["Arduino", "C++", "Networking", "Problem Solving"],
    color: "#22d3a0",
  },
]

export default function Experience() {
  return (
    <section id="experience" className="py-24" style={{ backgroundColor: "var(--bg-secondary)" }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading tag="Work & Projects" title="Experience" />

        <div className="mt-12 relative">
          <div className="absolute left-5 top-0 bottom-0 w-px" style={{ backgroundColor: "var(--border-solid)" }} />

          <div className="space-y-8">
            {experiences.map((exp, i) => (
              <div key={i} className="relative flex gap-8">
                <div
                  className="relative z-10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${exp.color}15`, border: `2px solid ${exp.color}`, boxShadow: `0 0 12px ${exp.color}30` }}
                >
                  <Briefcase size={16} style={{ color: exp.color }} />
                </div>

                <div
                  className="flex-1 rounded-2xl p-6 card-hover mb-2"
                  style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-solid)" }}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                    <div>
                      <h3 className="text-lg font-bold" style={{ fontFamily: "Outfit, sans-serif", color: "var(--text)" }}>{exp.role}</h3>
                      <div className="flex items-center gap-3 mt-1 flex-wrap">
                        <span className="text-sm font-medium" style={{ color: exp.color }}>{exp.org}</span>
                        <span className="flex items-center gap-1 text-xs" style={{ color: "var(--text-dim)" }}>
                          <MapPin size={10} /> {exp.location}
                        </span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-sm font-mono mb-1" style={{ color: "var(--text-muted)", fontFamily: "JetBrains Mono, monospace" }}>{exp.period}</div>
                      <div className="flex gap-2 justify-end">
                        <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: `${exp.color}10`, color: exp.color }}>{exp.type}</span>
                        <span
                          className="text-xs px-2 py-0.5 rounded"
                          style={{
                            backgroundColor: exp.status === "Active" ? "rgba(34,211,160,0.1)" : "rgba(100,116,139,0.1)",
                            color: exp.status === "Active" ? "var(--green)" : "var(--text-dim)",
                          }}
                        >
                          {exp.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <ul className="mt-3 space-y-1.5 mb-4">
                    {exp.responsibilities.map((r, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm" style={{ color: "var(--text-muted)" }}>
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: exp.color }} />
                        {r}
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap gap-1.5 pt-3" style={{ borderTop: "1px solid var(--border-solid)" }}>
                    {exp.skills.map((s) => (
                      <span key={s} className="text-xs px-2 py-0.5 rounded font-mono" style={{ backgroundColor: "var(--accent-dim)", border: "1px solid var(--border)", color: "var(--accent)", fontFamily: "JetBrains Mono, monospace" }}>
                        {s}
                      </span>
                    ))}
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
