import { Globe, Palette, Code2, Database, Wrench, Network, ArrowRight, Smartphone } from "lucide-react"
import SectionHeading from "./SectionHeading"

const services = [
  { icon: Globe, title: "Web Development", desc: "Full-stack web applications built with PHP, MySQL, HTML5, CSS3, and Bootstrap 5.", color: "var(--accent)" },
  { icon: Smartphone, title: "Mobile App Development", desc: "Mobile applications built with React Native and Expo, using Supabase or MySQL for data management.", color: "#38bdf8" },
  { icon: Palette, title: "Website UI Design", desc: "Clean, modern, and responsive UI designs using Figma and Bootstrap.", color: "#f472b6" },
  { icon: Code2, title: "PHP Development", desc: "Custom PHP backend logic, APIs, and server-side scripting solutions.", color: "#818cf8" },
  { icon: Database, title: "MySQL Database Design", desc: "Efficient database schema design, queries, and optimization for web apps.", color: "#f59e0b" },
  { icon: Wrench, title: "Basic IT Support", desc: "Technical troubleshooting, hardware/software diagnosis, and PC maintenance.", color: "#22d3a0" },
  { icon: Network, title: "Basic Networking", desc: "LAN setup, WiFi configuration, cable crimping, and network troubleshooting.", color: "#fb923c" },
]

const pricing = [
  {
    title: "Web Development",
    icon: Globe,
    plans: [
      { name: "Capstone / Student Project", price: "₱10,000–₱15,000" },
      { name: "Small Business", price: "₱15,000–₱20,000" },
      { name: "Large Business", price: "₱25,000–₱40,000" },
    ],
    note: "Free deployment, domain, and hosting included with all web development packages.",
  },
  {
    title: "Mobile Applications",
    icon: Smartphone,
    plans: [
      { name: "Student Project", price: "₱15,000–₱20,000" },
      { name: "Business", price: "₱22,000–₱35,000" },
    ],
    note: "Pricing depends on the scope of the system. Deployment may be free or paid, depending on the project requirements.",
  },
]

export default function Services() {
  return (
    <section id="services" className="py-24" style={{ backgroundColor: "var(--bg)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading tag="What I Offer" title="What I Can Help With" centered />

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map(({ icon: Icon, title, desc, color }) => (
            <div
              key={title}
              className="rounded-2xl p-6 card-hover"
              style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-solid)" }}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: `${color}12`, border: `1px solid ${color}25` }}>
                <Icon size={22} style={{ color }} />
              </div>
              <h4 className="text-base font-bold mb-2" style={{ fontFamily: "Outfit, sans-serif", color: "var(--text)" }}>{title}</h4>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-16">
          <h3 className="text-center text-2xl font-bold" style={{ fontFamily: "Outfit, sans-serif", color: "var(--text)" }}>Project Pricing</h3>
          <p className="mt-3 text-center text-sm" style={{ color: "var(--text-muted)" }}>Price ranges in Philippine pesos. Let&apos;s discuss your project requirements.</p>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {pricing.map(({ title, icon: Icon, plans, note }) => (
              <article key={title} className="flex flex-col rounded-2xl p-6 sm:p-8" style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-solid)" }}>
                <h4 className="mb-6 flex items-center gap-3 text-lg font-bold" style={{ color: "var(--text)" }}><Icon size={22} style={{ color: "var(--accent)" }} />{title}</h4>
                <dl className="flex-1 space-y-5">
                  {plans.map(({ name, price }) => <div key={name} className="flex flex-wrap items-center justify-between gap-2 border-b pb-4" style={{ borderColor: "var(--border-solid)" }}><dt className="text-sm" style={{ color: "var(--text-muted)" }}>{name}</dt><dd className="text-lg font-semibold" style={{ color: "var(--accent)" }}>{price}</dd></div>)}
                </dl>
                <p className="mt-6 rounded-xl p-4 text-sm leading-relaxed" style={{ backgroundColor: "var(--accent-dim)", color: "var(--text-muted)" }}>{note}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-12 text-center">
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold transition-all duration-200 accent-glow"
            style={{ backgroundColor: "var(--accent)", color: "#060d1a" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.opacity = "0.9")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.opacity = "1")}
          >
            Let&apos;s Work Together <ArrowRight size={18} />
          </a>
        </div>
      </div>
    </section>
  )
}
