import { useState } from "react"
import { GitFork, ExternalLink, X, ChevronRight, Star } from "lucide-react"
import SectionHeading from "./SectionHeading"
import ntapImage from "../../ntap1.png"
import prettyboyImage from "../../prettyboy.png"
import dongImage from "../../dong.png"
import hraImage from "../../hra.png"

const filters = ["All", "Web Development", "Academic", "Personal", "System"]

const ntapTechnologies = [
  { name: "HTML5", use: "Webpage structure." },
  { name: "CSS3 & Tailwind CSS", use: "Design, themes, and responsive layouts." },
  { name: "JavaScript", use: "Modals, live theme previews, QR generation, and interactive features." },
  { name: "PHP", use: "Backend, authentication, card registration, payments, and admin functions." },
  { name: "MariaDB / MySQL-compatible database", use: "Stores users, profiles, NFC cards, themes, orders, and earnings." },
  { name: "XAMPP / Apache", use: "Local web server." },
  { name: "NFC & QR Code", use: "Opens a digital profile through a tap or scan." },
  { name: "Service Worker / Cache API", use: "Limited offline access to previously viewed profiles." },
  { name: "Node.js & esbuild", use: "Builds frontend assets." },
  { name: "Playwright", use: "Automated browser and responsive-layout testing." },
]

const projects = [
  // Keep the featured project first; NTAP appears in the project grid below.
  {
    id: 1,
    title: "PrettyBoy Motorshop Management System",
    description: "A comprehensive POS, Inventory, Customer, Repair, and Management System for multi-branch motorcycle shops.",
    longDesc: "A full-featured business management system designed specifically for multi-branch motorcycle shops. The system handles everything from point-of-sale transactions to complex inventory management across multiple branches.",
    image: prettyboyImage,
    category: "System",
    status: "Completed",
    featured: true,
    techs: ["PHP", "MySQL", "HTML5", "CSS3", "JavaScript", "Bootstrap 5", "AJAX"],
    features: ["Multi-Branch Management", "POS System", "Inventory Control", "Customer Management", "Repair Tracking", "Sales & Expense Reports", "Role-Based Access"],
    problem: "Motorcycle shop owners struggled to manage multiple branches, track inventory, and handle repairs efficiently without a unified system.",
    solution: "Built a web-based management system with real-time data synchronization across all branches, reducing manual work by 70%.",
    challenges: "Implementing real-time inventory sync across branches and building a flexible role-based access control system.",
    lessons: "Gained deep experience with complex database relationships, AJAX for real-time updates, and enterprise-level access control patterns.",
  },
  {
    id: 2,
    title: "DON G PISTALAN ORDERING MANAGEMENT SYSTEM",
    description: "Designed and implemented a digital ordering system to improve request processing using HTML5, CSS3, JavaScript, PHP, and MySQL.",
    image: dongImage,
    category: "Academic",
    status: "Completed",
    featured: false,
    techs: ["HTML5", "CSS3", "JavaScript","PHP","MySQL"],
    features: ["Responsive Design", "Ordering Management", "Inventory Management","Sales and Product Management"],
    problem: "Struglled to manage orders and stocks",
    solution: "Designed and built a clean, responsive  website from scratch.",
    challenges: "Creating an engaging design without using frameworks.",
    lessons: "Strengthened understanding of vanilla CSS animations and responsive layouts.",
  },
  {
    id: 3,
    title: "HRA Library Management System",
    description: "A PHP and MySQL based library management system for tracking books, borrowers, and due dates.",
    image: hraImage,
    category: "Academic",
    status: "Completed",
    featured: false,
    techs: ["HTML","CSS","JAVASCRIPT","PHP", "MySQL", "Bootstrap 5", "HTML5"],
    features: ["Book Catalog", "Borrower Management", "Due Date Tracking", "Reports"],
    problem: "Manual library management was error-prone and time-consuming.",
    solution: "Built a web-based system to digitize library operations.",
    challenges: "Implementing an efficient search system for large book catalogs.",
    lessons: "Learned about database indexing and search optimization techniques.",
  },
  {
    id: 5,
    title: "NTAP",
    description: "My NFC digital business card business, connecting physical cards to digital profiles through a tap or QR scan.",
    longDesc: "NTAP is my own business: an NFC digital business card platform with customizable profiles and themes. Users can open profiles by tapping a card or scanning a QR code. The platform includes authentication, card registration, payments, orders, earnings, and admin functions, with limited offline access to previously viewed profiles.",
    image: ntapImage,
    category: "Web Development",
    status: "",
    featured: false,
    techs: ntapTechnologies.map(({ name }) => name),
    techDetails: ntapTechnologies,
    features: ["NFC & QR Profile Sharing", "Customizable Digital Profiles", "Live Theme Preview", "Card Registration", "Payments & Orders", "Admin Management", "Limited Offline Profile Access"],
    problem: "",
    solution: "Connect a physical NFC card to a digital profile for easy sharing.",
    challenges: "",
    lessons: "",
  },
  {
    id: 4,
    title: "Arduino Sensor Dashboard",
    description: "Real-time sensor data dashboard built with Arduino and a web interface for IoT monitoring.",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop&auto=format",
    category: "Personal",
    status: "In Progress",
    featured: false,
    techs: ["Arduino", "C++", "HTML5", "JavaScript"],
    features: ["Real-time Data", "Sensor Monitoring", "Visual Dashboard"],
    problem: "Needed a way to monitor sensor data remotely.",
    solution: "Combined Arduino hardware with a web-based dashboard for remote monitoring.",
    challenges: "Serial communication between Arduino and web interface.",
    lessons: "Gained experience in hardware-software integration and real-time data streaming.",
  },
  
]

function Modal({ project, onClose }: { project: (typeof projects)[0]; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(6,13,31,0.85)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl"
        style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-solid)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <img src={project.image} alt={project.title} className="w-full h-48 object-cover rounded-t-2xl" style={{ opacity: 0.7 }} />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "var(--bg-card)", color: "var(--text-muted)" }}
          >
            <X size={18} />
          </button>
          <div className="absolute bottom-4 left-6">
            <span className="px-2 py-1 rounded text-xs font-semibold" style={{ backgroundColor: "var(--accent)", color: "#060d1a" }}>{project.category}</span>
          </div>
        </div>
        <div className="p-8">
          <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: "Outfit, sans-serif", color: "var(--text)" }}>{project.title}</h3>
          <p className="mb-6" style={{ color: "var(--text-muted)" }}>{project.longDesc || project.description}</p>

          <div className="grid sm:grid-cols-2 gap-6 mb-6">
            {[
              { label: "Problem", content: project.problem },
              { label: "Solution", content: project.solution },
              { label: "Challenges", content: project.challenges },
              { label: "Lessons Learned", content: project.lessons },
            ].filter(({ content }) => content).map(({ label, content }) => (
              <div key={label} className="rounded-xl p-4" style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border-solid)" }}>
                <div className="text-xs font-semibold mb-2" style={{ color: "var(--accent)", fontFamily: "JetBrains Mono, monospace" }}>{label}</div>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{content}</p>
              </div>
            ))}
          </div>

          <div className="mb-6">
            <div className="text-sm font-semibold mb-3" style={{ color: "var(--text)" }}>Key Features</div>
            <div className="flex flex-wrap gap-2">
              {project.features.map((f) => (
                <span key={f} className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full" style={{ backgroundColor: "rgba(34,211,160,0.08)", border: "1px solid rgba(34,211,160,0.2)", color: "var(--green)" }}>
                  <ChevronRight size={10} /> {f}
                </span>
              ))}
            </div>
          </div>

          {project.techs.length > 0 && <div>
            <div className="text-sm font-semibold mb-3" style={{ color: "var(--text)" }}>Technologies Used</div>
            <div className="flex flex-wrap gap-2">
              {project.techs.map((t) => (
                <span key={t} className="text-xs px-3 py-1 rounded-full font-mono" style={{ backgroundColor: "var(--accent-dim)", border: "1px solid var(--border)", color: "var(--accent)", fontFamily: "JetBrains Mono, monospace" }}>
                  {t}
                </span>
              ))}
            </div>
           
          </div>}
        </div>
      </div>
    </div>
  )
}

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState("All")
  const [selected, setSelected] = useState<(typeof projects)[0] | null>(null)

  const filtered = activeFilter === "All" ? projects : projects.filter((p) => p.category === activeFilter)
  const featured = projects[0]
  const rest = filtered.filter((p) => !p.featured || activeFilter !== "All")

  return (
    <section id="projects" className="py-24" style={{ backgroundColor: "var(--bg-secondary)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading tag="My Work" title="Featured Projects" subtitle="A showcase of projects I have built, from academic systems to personal experiments." centered />

        {/* Featured project */}
        {activeFilter === "All" && (
          <div
            className="mt-12 rounded-2xl overflow-hidden cursor-pointer card-hover"
            style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-solid)" }}
            onClick={() => setSelected(featured)}
          >
            <div className="grid lg:grid-cols-2">
              <div className="relative">
                <img src={featured.image} alt={featured.title} className="w-full h-64 lg:h-full object-cover" style={{ opacity: 0.7 }} />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to right, transparent, var(--bg-card))" }} />
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: "var(--accent)", color: "#060d1a" }}>
                    Featured
                  </span>
                  <Star size={14} style={{ color: "#f59e0b" }} fill="#f59e0b" />
                </div>
              </div>
              <div className="p-8 lg:p-10">
                <div className="text-xs font-mono mb-3" style={{ color: "var(--accent)", fontFamily: "JetBrains Mono, monospace" }}>
                  {featured.category} · {featured.status}
                </div>
                <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: "Outfit, sans-serif", color: "var(--text)" }}>{featured.title}</h3>
                <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--text-muted)" }}>{featured.description}</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {featured.techs.map((t) => (
                    <span key={t} className="text-xs px-2.5 py-1 rounded-full font-mono" style={{ backgroundColor: "var(--accent-dim)", border: "1px solid var(--border)", color: "var(--accent)", fontFamily: "JetBrains Mono, monospace" }}>
                      {t}
                    </span>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold" style={{ backgroundColor: "var(--accent)", color: "#060d1a" }}>
                    <ExternalLink size={14} /> View Details
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium" style={{ border: "1px solid var(--border-solid)", color: "var(--text-muted)" }}>
                    <GitFork size={14} /> GitHub
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mt-12 mb-8">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200"
              style={{
                backgroundColor: activeFilter === f ? "var(--accent-dim)" : "var(--bg-card)",
                border: `1px solid ${activeFilter === f ? "var(--accent)" : "var(--border-solid)"}`,
                color: activeFilter === f ? "var(--accent)" : "var(--text-muted)",
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Project grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rest.map((project) => (
            <div
              key={project.id}
              className="rounded-2xl overflow-hidden cursor-pointer card-hover"
              style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-solid)" }}
              onClick={() => setSelected(project)}
            >
              <div className="relative">
                <img src={project.image} alt={project.title} className="w-full h-44 object-cover" style={{ opacity: 0.7 }} />
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="px-2 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: "var(--bg-card)", color: "var(--accent)", border: "1px solid var(--border)" }}>
                    {project.category}
                  </span>
                  {project.status && <span
                    className="px-2 py-0.5 rounded text-xs font-medium"
                    style={{
                      backgroundColor: project.status === "Completed" ? "rgba(34,211,160,0.15)" : "rgba(251,146,60,0.15)",
                      color: project.status === "Completed" ? "var(--green)" : "#fb923c",
                    }}
                  >
                    {project.status}
                  </span>}
                </div>
              </div>
              <div className="p-5">
                <h4 className="font-bold mb-2 leading-snug" style={{ fontFamily: "Outfit, sans-serif", color: "var(--text)" }}>{project.title}</h4>
                <p className="text-xs leading-relaxed mb-4 line-clamp-2" style={{ color: "var(--text-muted)" }}>{project.description}</p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {project.techs.slice(0, 4).map((t) => (
                    <span key={t} className="text-xs px-2 py-0.5 rounded font-mono" style={{ backgroundColor: "var(--accent-dim)", color: "var(--accent)", fontFamily: "JetBrains Mono, monospace" }}>
                      {t}
                    </span>
                  ))}
                  {project.techs.length > 4 && (
                    <span className="text-xs px-2 py-0.5 rounded" style={{ color: "var(--text-dim)" }}>+{project.techs.length - 4}</span>
                  )}
                </div>
                <div className="flex gap-2" style={{ borderTop: "1px solid var(--border-solid)", paddingTop: 12 }}>
                  <button className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold" style={{ backgroundColor: "var(--accent-dim)", color: "var(--accent)", border: "1px solid var(--border)" }}>
                    <ExternalLink size={12} /> View Details
                  </button>
                  <button className="w-9 h-7 flex items-center justify-center rounded-lg" style={{ border: "1px solid var(--border-solid)", color: "var(--text-muted)" }}>
                    <GitFork size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selected && <Modal project={selected} onClose={() => setSelected(null)} />}
    </section>
  )
}
