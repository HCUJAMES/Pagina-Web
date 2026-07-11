import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import ContactBar from './components/ContactBar'
import OffersClub from './components/OffersClub'
import About from './components/Visual'
import Doctor from './components/Specialists'
import Services from './components/Features'
import HowWeWork from './components/HowWeWork'
import Gallery from './components/Gallery'
import BeforeAfter from './components/BeforeAfter'
import CTA from './components/CTA'
import FAQ from './components/FAQ'
import Contact from './components/Contact'
import Marquee from './components/Marquee'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import WhatsAppFloat from './components/WhatsAppFloat'
import LoginModal from './components/LoginModal'
import AdminDashboard from './components/AdminDashboard'
import ClientAccountBar from './components/ClientAccountBar'
import AdminAccountBar from './components/AdminAccountBar'
import AdminPanel from './components/AdminPanel'
import { supabase } from './lib/supabase'

function App() {
  const [showLogin, setShowLogin] = useState(false)
  const [loginMode, setLoginMode] = useState('login')
  const [session, setSession] = useState(null)
  const [isOldAdmin, setIsOldAdmin] = useState(false)
  const [viewingSite, setViewingSite] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('showclinic_session')
    if (saved) {
      try {
        const s = JSON.parse(saved)
        // Validar la sesión: debe tener rol y, si es cliente, datos válidos.
        const valid = s && typeof s === 'object' &&
          (s.role === 'admin' || (s.role === 'client' && s.client && s.client.id))
        if (valid) setSession(s)
        else localStorage.removeItem('showclinic_session')
      } catch {
        localStorage.removeItem('showclinic_session')
      }
    }
  }, [])

  useEffect(() => {
    const checkHash = () => {
      const h = window.location.hash
      setIsOldAdmin(h === '#admin')
      // QR de registro: showclinic.com/#registro abre directo el formulario de registro
      if (h === '#registro' || h === '#registrarse') {
        setLoginMode('register')
        setShowLogin(true)
      }
    }
    checkHash()
    window.addEventListener('hashchange', checkHash)
    return () => window.removeEventListener('hashchange', checkHash)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('showclinic_session')
    setSession(null)
    supabase.auth.signOut().catch(() => {})
  }

  if (isOldAdmin) {
    return (
      <AdminPanel
        onBack={() => {
          window.location.hash = ''
          setIsOldAdmin(false)
        }}
      />
    )
  }

  if (session?.role === 'admin' && !viewingSite) {
    return <AdminDashboard session={session} onBack={() => setViewingSite(true)} />
  }

  const isClient = session?.role === 'client'
  const isAdmin = session?.role === 'admin'
  const showAccountBar = isClient || isAdmin

  return (
    <div className="min-h-screen bg-white overflow-x-hidden w-full" style={{ scrollBehavior: 'smooth' }}>
      {isClient && <ClientAccountBar session={session} onLogout={handleLogout} />}
      {isAdmin && <AdminAccountBar onBackToPanel={() => setViewingSite(false)} onLogout={handleLogout} />}
      <div className={showAccountBar ? 'pt-12' : ''}>
        <Navbar onLoginClick={showAccountBar ? null : () => { setLoginMode('login'); setShowLogin(true); }} session={session} onLogout={handleLogout} accountBar={showAccountBar} />
        <Hero />
        <ContactBar />
        <OffersClub />
        <About />
        <Services />
        <HowWeWork />
        <Doctor />
        <Gallery />
        <BeforeAfter />
        <FAQ />
        <CTA />
        <Contact />
        <Marquee />
        <Footer />
        <ScrollToTop />
        <WhatsAppFloat />
      </div>
      <LoginModal
        isOpen={showLogin}
        initialMode={loginMode}
        onClose={() => { setShowLogin(false); if (window.location.hash === '#registro' || window.location.hash === '#registrarse') window.location.hash = '' }}
        onLogin={(s) => setSession(s)}
      />
    </div>
  )
}

export default App
