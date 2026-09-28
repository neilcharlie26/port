import { BookOpen, Clock, ArrowRight } from "lucide-react"
import SectionHeading from "./SectionHeading"

const categories = ["All", "Web Development", "PHP", "JavaScript", "MySQL", "Networking", "Learning Journey"]

const placeholderPosts = [
  {
    title: "Building a Multi-Branch POS System with PHP and MySQL",
    category: "PHP",
    date: "Coming Soon",
    summary: "A behind-the-scenes look at the design decisions, database architecture, and challenges of building a full-featured POS system from scratch.",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=360&fit=crop&auto=format",
    readTime: "10 min",
    color: "#818cf8",
  },
  {
    title: "MySQL Full-Text Search: A Practical Guide for Beginners",
    category: "MySQL",
    date: "Coming Soon",
    summary: "How to use MySQL FULLTEXT indexing to add fast, relevant search to your web app — with real examples from a library management project.",
    image: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600&h=360&fit=crop&auto=format",
    readTime: "7 min",
    color: "#f59e0b",
  },
  {
    title: "JavaScript ES6+ Features I Actually Use Every Day",
    category: "JavaScript",
    date: "Coming Soon",
    summary: "A practical rundown of the ES6+ features that genuinely improved my code: destructuring, optional chaining, array methods, and async/await.",
    image: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=600&h=360&fit=crop&auto=format",
    readTime: "8 min",
    color: "#f7df1e",
  },
  {
    title: "My Journey from Zero to Building Full-Stack Web Apps",
    category: "Learning Journey",
    date: "Coming Soon",
    summary: "Honest reflection on learning web development as a student — the resources, the struggles, the breakthroughs, and what I'd do differently.",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=360&fit=crop&auto=format",
    readTime: "6 min",
    color: "var(--accent)",
  },
  {
    title: "Setting Up a Local PHP Development Environment in 2026",
    category: "Web Development",
    date: "Coming Soon",
    summary: "Step-by-step guide to setting up XAMPP, configuring virtual hosts, and getting a PHP + MySQL dev environment running smoothly.",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=360&fit=crop&auto=format",
    readTime: "5 min",
    color: "#22d3a0",
  },
  {
    title: "Basic Networking Concepts Every Developer Should Know",
    category: "Networking",
    date: "Coming Soon",
    summary: "IP addressing, DNS, HTTP/S, and how web requests actually travel from browser to server — explained plainly for developers, not network engineers.",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=360&fit=crop&auto=format",
    readTime: "9 min",
    color: "#fb923c",
  },
]

export default function Blog() {
  return (
    <section id="blog" className="py-24" style={{ backgroundColor: "var(--bg)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          tag="Learning Journey"
          title="Blog & Articles"
          subtitle="Articles I plan to write about web development, PHP, JavaScript, MySQL, networking, and my learning journey."
          centered
        />

        {/* Category filters */}
        <div className="flex flex-wrap justify-center gap-2 mt-10 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              className="px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200"
              style={{
                backgroundColor: cat === "All" ? "var(--accent-dim)" : "var(--bg-card)",
                border: `1px solid ${cat === "All" ? "var(--accent)" : "var(--border-solid)"}`,
                color: cat === "All" ? "var(--accent)" : "var(--text-muted)",
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Coming soon banner */}
        <div
          className="flex items-center gap-3 px-5 py-4 rounded-2xl mb-8 text-sm"
          style={{ backgroundColor: "var(--accent-dim)", border: "1px solid var(--border)" }}
        >
          <BookOpen size={18} style={{ color: "var(--accent)", flexShrink: 0 }} />
          <span style={{ color: "var(--text-muted)" }}>
            Blog posts are <strong style={{ color: "var(--accent)" }}>coming soon</strong> — previewing planned articles below.
          </span>
        </div>

        {/* Post cards grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {placeholderPosts.map((post) => (
            <div
              key={post.title}
              className="rounded-2xl overflow-hidden card-hover"
              style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-solid)", opacity: 0.85 }}
            >
              <div className="relative">
                <img src={post.image} alt={post.title} className="w-full h-44 object-cover" style={{ opacity: 0.5 }} />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 40%, var(--bg-card) 100%)" }} />
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span
                    className="px-2.5 py-1 rounded-full text-xs font-medium"
                    style={{ backgroundColor: `${post.color}20`, color: post.color, border: `1px solid ${post.color}35` }}
                  >
                    {post.category}
                  </span>
                  <span
                    className="px-2 py-1 rounded-full text-xs font-medium"
                    style={{ backgroundColor: "rgba(6,13,31,0.7)", color: "var(--text-dim)", backdropFilter: "blur(4px)" }}
                  >
                    Draft
                  </span>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-3 mb-3 text-xs" style={{ color: "var(--text-dim)" }}>
                  <span className="flex items-center gap-1"><Clock size={11} /> {post.readTime} read</span>
                  <span>·</span>
                  <span>{post.date}</span>
                </div>
                <h4 className="text-sm font-bold leading-snug mb-3" style={{ fontFamily: "Outfit, sans-serif", color: "var(--text)" }}>
                  {post.title}
                </h4>
                <p className="text-xs leading-relaxed mb-4 line-clamp-3" style={{ color: "var(--text-muted)" }}>{post.summary}</p>
                <button
                  disabled
                  className="flex items-center gap-1.5 text-xs font-medium"
                  style={{ color: "var(--text-dim)", cursor: "not-allowed" }}
                >
                  Coming Soon <ArrowRight size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
