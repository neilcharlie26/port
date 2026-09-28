import { useState } from "react"
import { AlertCircle, Lightbulb, Layers, Zap, Cpu, Trophy, ChevronDown, ChevronUp } from "lucide-react"
import SectionHeading from "./SectionHeading"

const cases = [
  {
    id: 1,
    title: "Multi-Branch Motorcycle Shop POS & Management System",
    category: "System Development",
    duration: "6 months",
    role: "Lead Developer",
    techs: ["PHP", "MySQL", "Bootstrap 5", "JavaScript", "AJAX", "HTML5", "CSS3"],
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=400&fit=crop&auto=format",
    color: "var(--accent)",
    problem: {
      heading: "The Problem",
      text: "A motorcycle shop owner managing 3 branches relied on manual paperwork and spreadsheets to track inventory, sales, repairs, and customers. Data was inconsistent across branches, managers had no visibility into other branches, and monthly reports took 2–3 days to compile manually.",
    },
    solution: {
      heading: "The Solution",
      text: "I designed and built a centralized web-based management system accessible from all branches. The system provides real-time inventory sync, a POS terminal, repair job tracking, customer records, role-based access control, and automated reports — replacing every manual process.",
    },
    process: [
      "Interviewed the shop owner to map all business workflows and pain points",
      "Designed the database schema to support multi-branch data segregation",
      "Built the PHP backend with session-based authentication and role middleware",
      "Implemented AJAX-powered POS terminal for fast, reload-free transactions",
      "Created automated report generation with date-range filtering",
      "Tested across all branches and iterated based on staff feedback",
    ],
    features: [
      "Multi-Branch Dashboard",
      "POS with Barcode Support",
      "Real-time Inventory Sync",
      "Repair Job Queue & Status",
      "Customer History Records",
      "Role-Based Access Control",
      "Sales, Expense & Budget Reports",
      "Activity Audit Logs",
    ],
    challenges: "The hardest challenge was designing a database schema that allowed branch-specific data without duplicating core product records. I solved this with a branch_inventory junction table that links products to branches with individual stock quantities. Another challenge was implementing AJAX live search for the POS without slowing down the page — solved by debouncing requests and caching results client-side.",
    lessons: "I learned how much database design decisions affect everything downstream — a good schema saved months of refactoring. I also gained real appreciation for role-based access control patterns and how to structure middleware in PHP without a framework.",
    results: "The system reduced monthly report preparation from 2–3 days to minutes. Inventory discrepancies between branches dropped to near zero. The shop owner gained live visibility into all three branches from a single dashboard.",
  },
  {
    id: 2,
    title: "Library Management System",
    category: "Academic Project",
    duration: "3 months",
    role: "Developer",
    techs: ["PHP", "MySQL", "Bootstrap 5", "HTML5", "CSS3"],
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=400&fit=crop&auto=format",
    color: "#818cf8",
    problem: {
      heading: "The Problem",
      text: "The school library tracked book borrowing manually using index cards. Finding a book's availability, tracking overdue returns, and generating reports required staff to manually search through stacks of cards — time-consuming and error-prone.",
    },
    solution: {
      heading: "The Solution",
      text: "Built a full-featured library management system with a searchable digital catalog, borrower records, due-date tracking with overdue alerts, and printable reports — replacing the card-based system entirely.",
    },
    process: [
      "Analyzed the existing manual system with the librarian",
      "Designed normalized database tables for books, borrowers, and transactions",
      "Built a full-text search system with PHP for fast book lookup",
      "Implemented due-date calculation and overdue flagging logic",
      "Created printable report views for the librarian",
    ],
    features: [
      "Searchable Book Catalog",
      "Borrower Management",
      "Borrow & Return Logging",
      "Overdue Alerts",
      "Printable Reports",
      "Admin Dashboard",
    ],
    challenges: "Optimizing the book search across a catalog of thousands of records while keeping the UI fast. Solved by adding a full-text index on the book title and author columns in MySQL.",
    lessons: "Learned the value of MySQL FULLTEXT indexing for search performance. Also learned how to design UIs for non-technical users — simplicity and clear labeling matter more than feature density.",
    results: "Librarians reported a 90% reduction in time spent looking up book availability. Overdue tracking became automatic, eliminating manual reminders.",
  },
  {
    id: 3,
    title: "School Event Management System",
    category: "Academic Project",
    duration: "2 months",
    role: "Developer",
    techs: ["PHP", "MySQL", "Bootstrap 5"],
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop&auto=format",
    color: "#22d3a0",
    problem: {
      heading: "The Problem",
      text: "School events were announced via bulletin boards and group chats. Students had no centralized place to register, organizers had no way to track attendance capacity, and event history was lost after the event ended.",
    },
    solution: {
      heading: "The Solution",
      text: "Created a web-based event portal where organizers can post events, manage registrations, and track attendees, while students can browse and register in one place.",
    },
    process: [
      "Mapped out event organizer and student workflows separately",
      "Designed dual-role access system for organizers and students",
      "Built event CRUD with image upload for event thumbnails",
      "Implemented registration system with capacity limits",
      "Created admin panel for event approval and reporting",
    ],
    features: [
      "Event Listings with Filter",
      "Student Registration",
      "Capacity Management",
      "Admin Approval Workflow",
      "Registration Confirmation",
      "Event History Archive",
    ],
    challenges: "Building a dual-role permission system (admin/student) cleanly in PHP without a framework required careful session management and function-level access checks.",
    lessons: "Learned how to design for two different user types within one application, and the importance of capacity validation to prevent over-registration edge cases.",
    results: "Event registration became fully digital. Organizers had real-time attendee counts, and student interest in events noticeably increased due to easier visibility.",
  },
]

const icons = {
  problem: AlertCircle,
  solution: Lightbulb,
  process: Layers,
  features: Zap,
  challenges: Cpu,
  results: Trophy,
}

function CaseCard({ c }: { c: (typeof cases)[0] }) {
  const [open, setOpen] = useState(false)

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-solid)" }}
    >
      {/* Hero image */}
      <div className="relative h-48 overflow-hidden">
        <img src={c.image} alt={c.title} className="w-full h-full object-cover" style={{ opacity: 0.65 }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, var(--bg-card) 20%, transparent 70%)" }} />
        <div className="absolute top-4 left-4 flex gap-2">
          <span className="px-2.5 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: `${c.color}20`, color: c.color, border: `1px solid ${c.color}35` }}>
            {c.category}
          </span>
        </div>
        <div className="absolute bottom-4 right-4 flex gap-3 text-xs" style={{ color: "var(--text-dim)" }}>
          <span className="font-mono" style={{ fontFamily: "JetBrains Mono, monospace" }}>{c.duration}</span>
          <span>·</span>
          <span>{c.role}</span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold mb-4 leading-snug" style={{ fontFamily: "Outfit, sans-serif", color: "var(--text)" }}>{c.title}</h3>

        {/* Tech stack */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {c.techs.map((t) => (
            <span key={t} className="text-xs px-2.5 py-1 rounded-full font-mono" style={{ backgroundColor: "var(--accent-dim)", border: "1px solid var(--border)", color: "var(--accent)", fontFamily: "JetBrains Mono, monospace" }}>
              {t}
            </span>
          ))}
        </div>

        {/* Quick Problem / Solution */}
        <div className="grid sm:grid-cols-2 gap-3 mb-5">
          {[c.problem, c.solution].map(({ heading, text }) => (
            <div key={heading} className="rounded-xl p-4" style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border-solid)" }}>
              <div className="text-xs font-semibold mb-2" style={{ color: c.color, fontFamily: "JetBrains Mono, monospace" }}>{heading}</div>
              <p className="text-xs leading-relaxed line-clamp-3" style={{ color: "var(--text-muted)" }}>{text}</p>
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="mb-5">
          <div className="text-xs font-semibold mb-2" style={{ color: "var(--text-muted)" }}>Key Features</div>
          <div className="flex flex-wrap gap-1.5">
            {c.features.map((f) => (
              <span key={f} className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: "rgba(34,211,160,0.07)", border: "1px solid rgba(34,211,160,0.18)", color: "var(--green)" }}>
                <Zap size={9} /> {f}
              </span>
            ))}
          </div>
        </div>

        {/* Expand toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
          style={{ backgroundColor: open ? "var(--accent-dim)" : "var(--bg-secondary)", border: `1px solid ${open ? "var(--accent)" : "var(--border-solid)"}`, color: open ? "var(--accent)" : "var(--text-muted)" }}
        >
          <span>{open ? "Hide Full Case Study" : "Read Full Case Study"}</span>
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {/* Expanded content */}
        {open && (
          <div className="mt-4 space-y-4">
            {/* Process */}
            <div className="rounded-xl p-4" style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border-solid)" }}>
              <div className="flex items-center gap-2 mb-3">
                <Layers size={14} style={{ color: c.color }} />
                <span className="text-xs font-bold uppercase tracking-wide" style={{ color: c.color, fontFamily: "JetBrains Mono, monospace" }}>Development Process</span>
              </div>
              <ol className="space-y-2">
                {c.process.map((step, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm" style={{ color: "var(--text-muted)" }}>
                    <span className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mt-0.5" style={{ backgroundColor: `${c.color}15`, color: c.color }}>
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            {/* Challenges + Lessons */}
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="rounded-xl p-4" style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border-solid)" }}>
                <div className="flex items-center gap-2 mb-2">
                  <Cpu size={14} style={{ color: "#f59e0b" }} />
                  <span className="text-xs font-bold uppercase tracking-wide" style={{ color: "#f59e0b", fontFamily: "JetBrains Mono, monospace" }}>Challenges</span>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>{c.challenges}</p>
              </div>
              <div className="rounded-xl p-4" style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border-solid)" }}>
                <div className="flex items-center gap-2 mb-2">
                  <Trophy size={14} style={{ color: "#22d3a0" }} />
                  <span className="text-xs font-bold uppercase tracking-wide" style={{ color: "#22d3a0", fontFamily: "JetBrains Mono, monospace" }}>Lessons Learned</span>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>{c.lessons}</p>
              </div>
            </div>

            {/* Results */}
            <div className="rounded-xl p-4" style={{ backgroundColor: "rgba(34,211,160,0.06)", border: "1px solid rgba(34,211,160,0.2)" }}>
              <div className="flex items-center gap-2 mb-2">
                <Trophy size={14} style={{ color: "var(--green)" }} />
                <span className="text-xs font-bold uppercase tracking-wide" style={{ color: "var(--green)", fontFamily: "JetBrains Mono, monospace" }}>Results</span>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{c.results}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function CaseStudies() {
  return (
    <section id="case-studies" className="py-24" style={{ backgroundColor: "var(--bg)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          tag="Deep Dive"
          title="Project Case Studies"
          subtitle="Detailed breakdowns of how I approached, built, and learned from my key projects."
          centered
        />
        <div className="mt-12 grid lg:grid-cols-3 gap-8">
          {cases.map((c) => <CaseCard key={c.id} c={c} />)}
        </div>
      </div>
    </section>
  )
}
