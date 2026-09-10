import { useState, useEffect, lazy, Suspense } from 'react'
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
import AdminAccountBar from './components/AdminAccountBar'

// Se descargan solo cuando hacen falta: así el visitante normal
// no baja el panel de administración ni el modal de acceso.
const ClientAccountBar = lazy(() => import('./components/ClientAccountBar'))
const LoginModal = lazy(() => import('./components/LoginModal'))
const AdminDashboard = lazy(() => import('./components/AdminDashboard'))
const AdminPanel = lazy(() => import('./components/AdminPanel'))

// Pantalla breve mientras se descarga el panel
function Cargando() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cream">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-full border-2 border-primary/25 border-t-primary animate-spin" />
        <p className="text-[13px] text-gray-500 tracking-wide">Cargando panel…</p>
      </div>
    </div>
  )
}

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
    import('./lib/supabase').then(({ supabase }) => supabase.auth.signOut()).catch(() => {})
  }

  if (isOldAdmin) {
    return (
      <Suspense fallback={<Cargando />}>
        <AdminPanel
          onBack={() => {
            window.location.hash = ''
            setIsOldAdmin(false)
          }}
        />
      </Suspense>
    )
  }

  if (session?.role === 'admin' && !viewingSite) {
    return (
      <Suspense fallback={<Cargando />}>
        <AdminDashboard session={session} onBack={() => setViewingSite(true)} />
      </Suspense>
    )
  }

  const isClient = session?.role === 'client'
  const isAdmin = session?.role === 'admin'
  const showAccountBar = isClient || isAdmin

  return (
    <div className="min-h-screen bg-white overflow-x-hidden w-full" style={{ scrollBehavior: 'smooth' }}>
      {isClient && <Suspense fallback={null}><ClientAccountBar session={session} onLogout={handleLogout} /></Suspense>}
      {isAdmin && <AdminAccountBar onBackToPanel={() => setViewingSite(false)} onLogout={handleLogout} />}
      <div className={isClient ? 'pt-16 md:pt-20' : isAdmin ? 'pt-12' : ''}>
        <Navbar onLoginClick={showAccountBar ? null : () => { setLoginMode('login'); setShowLogin(true); }} session={session} onLogout={handleLogout} accountBar={isClient ? 'client' : isAdmin ? 'admin' : null} />
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
      {showLogin && (
        <Suspense fallback={null}>
          <LoginModal
            isOpen={showLogin}
            initialMode={loginMode}
            onClose={() => { setShowLogin(false); if (window.location.hash === '#registro' || window.location.hash === '#registrarse') window.location.hash = '' }}
            onLogin={(s) => setSession(s)}
          />
        </Suspense>
      )}
    </div>
  )
}

export default App
