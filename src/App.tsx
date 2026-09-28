import { useState, useEffect } from "react"
import Navbar from "./components/Navbar"
import Hero from "./components/Hero"
import About from "./components/About"
import CareerObjective from "./components/CareerObjective"
import Skills from "./components/Skills"
import Projects from "./components/Projects"
import Certifications from "./components/Certifications"
import Education from "./components/Education"
import Experience from "./components/Experience"
import Testimonials from "./components/Testimonials"
import Achievements from "./components/Achievements"
import Blog from "./components/Blog"
import CurrentlyLearning from "./components/CurrentlyLearning"
import Services from "./components/Services"
import Stats from "./components/Stats"
import CaseStudies from "./components/CaseStudies"
import Interests from "./components/Interests"
import Roadmap from "./components/Roadmap"
import Resume from "./components/Resume"
import Contact from "./components/Contact"
import FAQ from "./components/FAQ"
import Footer from "./components/Footer"
import Chatbot from "./components/Chatbot"
import BackToTop from "./components/BackToTop"
import AdminInbox from "./components/AdminInbox"

export default function App() {
  const [darkMode, setDarkMode] = useState(true)
  const [admin, setAdmin] = useState(window.location.hash === '#admin')
  useEffect(() => {
    const update = () => setAdmin(window.location.hash === '#admin')
    window.addEventListener('hashchange', update)
    return () => window.removeEventListener('hashchange', update)
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light")
    document.querySelector("body")?.setAttribute("data-theme", darkMode ? "dark" : "light")
  }, [darkMode])

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "dark")
  }, [])

  if (admin) return <AdminInbox />
  return (
    <div data-theme={darkMode ? "dark" : "light"} className="min-h-screen" style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}>
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
      <main>
        <Hero />
        <About />
        <CareerObjective />
        <Stats />
        <Skills />
        <Projects />
        <Certifications />
        <Education />
        <Experience />
        
        <Testimonials />
        <Achievements />
        
        <CurrentlyLearning />
        <Services />
        <Interests />
        
        <Resume />
        <Contact />
        <FAQ />
      </main>
      <Footer />
      <Chatbot />
      <BackToTop />
    </div>
  )
}
