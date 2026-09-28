import { useState } from "react"
import { Award, Calendar, X, ZoomIn } from "lucide-react"
import SectionHeading from "./SectionHeading"

const certs = [
  {
    id: 1,
    name: "Web Development Fundamentals",
    type: "Certificate of Completion",
    issuer: "Online Learning Platform",
    date: "2025",
    description: "Completed a comprehensive course covering HTML5, CSS3, JavaScript fundamentals, and responsive web design principles.",
    color: "var(--accent)",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=400&fit=crop&auto=format",
  },
  {
    id: 2,
    name: "Introduction to C++",
    type: "Certificate of Participation",
    issuer: "Programming Workshop",
    date: "2025",
    description: "Participated in a C++ programming workshop covering object-oriented programming concepts, data structures, and algorithms.",
    color: "#818cf8",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop&auto=format",
  },
  {
    id: 3,
    name: "JavaScript Development Mastery",
    type: "Certificate of Completion",
    issuer: "Online Learning Platform",
    date: "2025",
    description: "Mastered modern JavaScript including ES6+, async programming, DOM manipulation, and API integration techniques.",
    color: "#f7df1e",
    image: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=600&h=400&fit=crop&auto=format",
  },
  {
    id: 4,
    name: "Solar PV Installation Training",
    type: "Certificate of Training",
    issuer: "PHLSolar Academy",
    date: "June 14, 2026",
    description: "Completed in-depth training on Solar PV system design, installation best practices, and roof-mounted solar system configuration.",
    color: "#f59e0b",
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&h=400&fit=crop&auto=format",
  },
]

function CertModal({ cert, onClose }: { cert: (typeof certs)[0]; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(6,13,31,0.9)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl overflow-hidden"
        style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-solid)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <img src={cert.image} alt={cert.name} className="w-full h-52 object-cover" style={{ opacity: 0.7 }} />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to bottom, transparent 50%, var(--bg-card) 100%)" }}
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "rgba(6,13,31,0.8)", color: "var(--text-muted)" }}
          >
            <X size={18} />
          </button>
          <div className="absolute top-4 left-4">
            <span className="px-2.5 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: `${cert.color}20`, color: cert.color, border: `1px solid ${cert.color}40` }}>
              {cert.type}
            </span>
          </div>
        </div>
        <div className="p-6">
          <h3 className="text-xl font-bold mb-1" style={{ fontFamily: "Outfit, sans-serif", color: "var(--text)" }}>{cert.name}</h3>
          <div className="flex items-center gap-4 mb-4">
            <span className="text-sm" style={{ color: cert.color }}>{cert.issuer}</span>
            <span className="flex items-center gap-1 text-xs" style={{ color: "var(--text-dim)" }}>
              <Calendar size={12} /> {cert.date}
            </span>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{cert.description}</p>
          <button
            onClick={onClose}
            className="mt-6 w-full py-2.5 rounded-xl text-sm font-semibold"
            style={{ backgroundColor: `${cert.color}15`, border: `1px solid ${cert.color}30`, color: cert.color }}
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Certifications() {
  const [selected, setSelected] = useState<(typeof certs)[0] | null>(null)

  return (
    <section id="certifications" className="py-24" style={{ backgroundColor: "var(--bg)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading tag="Credentials" title="Certifications & Training" subtitle="Certificates and training I have completed to enhance my professional knowledge." centered />

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {certs.map((cert) => (
            <div
              key={cert.id}
              className="rounded-2xl overflow-hidden cursor-pointer card-hover"
              style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-solid)" }}
              onClick={() => setSelected(cert)}
            >
              <div className="relative">
                <img src={cert.image} alt={cert.name} className="w-full h-36 object-cover" style={{ opacity: 0.6 }} />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                  <div className="flex items-center gap-2 text-white text-sm font-medium">
                    <ZoomIn size={16} /> Preview
                  </div>
                </div>
                <div className="absolute bottom-3 left-3">
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: `${cert.color}20`, color: cert.color, border: `1px solid ${cert.color}40` }}>
                    {cert.type}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: `${cert.color}15`, border: `1px solid ${cert.color}30` }}>
                  <Award size={16} style={{ color: cert.color }} />
                </div>
                <h4 className="text-sm font-bold leading-snug mb-2" style={{ fontFamily: "Outfit, sans-serif", color: "var(--text)" }}>{cert.name}</h4>
                <div className="text-xs mb-1" style={{ color: cert.color }}>{cert.issuer}</div>
                <div className="flex items-center gap-1 text-xs" style={{ color: "var(--text-dim)" }}>
                  <Calendar size={10} /> {cert.date}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selected && <CertModal cert={selected} onClose={() => setSelected(null)} />}
    </section>
  )
}
