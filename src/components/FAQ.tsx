import { useState } from "react"
import { ChevronDown } from "lucide-react"
import SectionHeading from "./SectionHeading"

const faqs = [
  {
    q: "How much does web development cost?",
    a: "Capstone or student projects cost ₱10,000–₱15,000, small business systems cost ₱15,000–₱20,000, and large business systems cost ₱25,000–₱40,000. All web packages include free deployment, domain, and hosting.",
  },
  {
    q: "How much does a mobile application cost?",
    a: "Student mobile apps cost ₱15,000–₱20,000. Business mobile apps cost ₱22,000–₱35,000, depending on the scope of the system. Deployment may be free or paid depending on the project requirements. I use React Native and Expo, with Supabase or MySQL for data management.",
  },
  {
    q: "What technologies do you use?",
    a: "I primarily work with PHP, MySQL, HTML5, CSS3, JavaScript, and Bootstrap 5 for web development. I also have experience with C++, Arduino for programming, and tools like VS Code, XAMPP, GitHub, Figma, and Adobe Photoshop.",
  },
  {
    q: "What projects have you developed?",
    a: "My featured project is a Multi-Branch Motorcycle Shop POS, Inventory, Customer, Repair, and Management System built with PHP, MySQL, and Bootstrap 5. I have also built academic and personal projects including library management systems, event management apps, and Arduino sensor projects.",
  },
  {
    q: "What certifications do you have?",
    a: "I have completed certifications in Web Development Fundamentals, Introduction to C++, JavaScript Development Mastery, and a Solar PV Installation Training Certificate from PHLSolar Academy (June 2026).",
  },
  {
    q: "Are you open to work?",
    a: "Yes! I am currently open to entry-level IT positions, web development opportunities, internship opportunities, and freelance projects. I am eager to apply my skills and gain professional experience.",
  },
  {
    q: "How can I contact you?",
    a: "You can reach me through the contact form on this page, by email at neil.rebenque@email.com, or through my social media profiles on GitHub, LinkedIn, and Facebook.",
  },
  {
    q: "Are you available for freelance projects?",
    a: "Yes, I am available for freelance web development projects. I can help with website development, PHP backend work, MySQL database design, and basic IT support. Feel free to reach out to discuss your project.",
  },
]

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section id="faq" className="py-24" style={{ backgroundColor: "var(--bg)" }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading tag="FAQ" title="Frequently Asked Questions" centered />

        <div className="mt-12 space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-2xl overflow-hidden transition-all duration-200"
              style={{ backgroundColor: "var(--bg-card)", border: `1px solid ${open === i ? "var(--accent)" : "var(--border-solid)"}` }}
            >
              <button
                className="w-full flex items-center justify-between px-6 py-4 text-left"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="text-sm font-semibold pr-4" style={{ color: "var(--text)" }}>{faq.q}</span>
                <ChevronDown
                  size={18}
                  className="flex-shrink-0 transition-transform duration-300"
                  style={{ color: "var(--accent)", transform: open === i ? "rotate(180deg)" : "rotate(0deg)" }}
                />
              </button>
              <div
                className="overflow-hidden transition-all duration-300"
                style={{ maxHeight: open === i ? 200 : 0 }}
              >
                <div className="px-6 pb-5 text-sm leading-relaxed" style={{ color: "var(--text-muted)", borderTop: "1px solid var(--border-solid)", paddingTop: 16 }}>
                  {faq.a}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
