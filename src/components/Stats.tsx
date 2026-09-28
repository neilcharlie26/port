import { useEffect, useRef, useState } from "react"
import { FolderOpen, Cpu, Award, BookOpen } from "lucide-react"

const stats = [
  { icon: FolderOpen, label: "Projects Completed", value: 5, suffix: "+" },
  { icon: Cpu, label: "Technologies Learned", value: 15, suffix: "+" },
  { icon: Award, label: "Certifications Earned", value: 4, suffix: "" },
  { icon: BookOpen, label: "Training Completed", value: 3, suffix: "" },
]

function Counter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          let start = 0
          const step = Math.ceil(target / 30)
          const timer = setInterval(() => {
            start += step
            if (start >= target) {
              setCount(target)
              clearInterval(timer)
            } else {
              setCount(start)
            }
          }, 40)
        }
      },
      { threshold: 0.5 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target])

  return <span ref={ref}>{count}{suffix}</span>
}

export default function Stats() {
  return (
    <section className="py-16" style={{ backgroundColor: "var(--bg-card)", borderTop: "1px solid var(--border-solid)", borderBottom: "1px solid var(--border-solid)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map(({ icon: Icon, label, value, suffix }) => (
            <div key={label} className="text-center p-6 rounded-2xl card-hover" style={{ backgroundColor: "var(--bg-card-2)", border: "1px solid var(--border-solid)" }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: "var(--accent-dim)", border: "1px solid var(--border)" }}>
                <Icon size={22} style={{ color: "var(--accent)" }} />
              </div>
              <div className="text-3xl font-bold mb-1" style={{ fontFamily: "Outfit, sans-serif", color: "var(--accent)" }}>
                <Counter target={value} suffix={suffix} />
              </div>
              <div className="text-sm" style={{ color: "var(--text-muted)" }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
