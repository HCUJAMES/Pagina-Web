import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LogIn } from 'lucide-react';

const navLinks = [
  { name: 'Inicio', href: '#hero' },
  { name: 'Nosotros', href: '#about' },
  { name: 'Servicios', href: '#services' },
  { name: 'Equipo', href: '#doctor' },
  { name: 'Resultados', href: '#gallery' },
  { name: 'Contacto', href: '#contact' },
];

export default function Navbar({ onLoginClick, session, onLogout, accountBar }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isClient = session?.role === 'client';

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className={`fixed left-0 right-0 z-50 transition-all duration-400 ${
        accountBar ? 'top-12' : 'top-0'
      } ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-[0_1px_10px_rgba(0,0,0,0.04)] py-2'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="container-fluid">
        <div className="flex items-center justify-between h-14 lg:h-16">
          <a href="#hero" className="flex items-center flex-shrink-0">
            <img src="/Imagenes/logosinfondo.png" alt="ShowClinic" className="h-14 lg:h-18 w-auto object-contain" />
          </a>

          <div className="hidden lg:flex items-center gap-9">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`text-[13px] font-medium tracking-[0.05em] transition-colors duration-300 hover:text-primary ${
                  scrolled ? 'text-gray-500' : 'text-accent'
                }`}
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            {!isClient && onLoginClick && (
              <button
                onClick={onLoginClick}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-[12px] font-semibold uppercase tracking-[0.12em] text-accent border border-accent/20 rounded-full hover:bg-accent hover:text-white transition-all duration-300"
              >
                <LogIn className="w-3.5 h-3.5" />
                Login
              </button>
            )}
            <a
              href="https://wa.me/51974212114?text=Hola%2C%20me%20gustaría%20agendar%20una%20consulta"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 text-[12px] font-semibold uppercase tracking-[0.12em] text-white bg-accent rounded-full hover:bg-dark transition-colors duration-300"
            >
              Agendar cita
            </a>
          </div>

          <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden p-2">
            {isOpen ? <X className="w-6 h-6 text-dark" /> : <Menu className="w-6 h-6 text-dark" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="px-6 py-6 space-y-1">
              {navLinks.map((link, i) => (
                <motion.a key={link.name} href={link.href} onClick={() => setIsOpen(false)}
                  initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                  className="block px-4 py-3 text-[15px] font-medium text-gray-600 hover:text-primary hover:bg-cream rounded-xl transition-all"
                >{link.name}</motion.a>
              ))}
              <div className="pt-4 space-y-3">
                {!isClient && onLoginClick && (
                  <button
                    onClick={() => { setIsOpen(false); onLoginClick(); }}
                    className="w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold uppercase tracking-wider text-accent border border-accent/20 rounded-full hover:bg-accent hover:text-white transition-all"
                  >
                    <LogIn className="w-4 h-4" />
                    Login
                  </button>
                )}
                <a href="https://wa.me/51974212114" target="_blank" rel="noopener noreferrer" onClick={() => setIsOpen(false)}
                  className="block py-3 text-sm font-semibold uppercase tracking-wider text-center text-white bg-accent rounded-full"
                >Agendar cita</a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
