import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown, Sparkles } from 'lucide-react';

// Bandera del Perú en miniatura (mismo trazo que la sección de promociones)
function PeruFlag({ className = 'w-6 h-4' }) {
  return (
    <span className={`relative inline-block overflow-hidden rounded-[2px] ring-1 ring-black/10 align-middle ${className}`} aria-hidden="true">
      <span className="absolute inset-0 grid grid-cols-3">
        <span className="bg-[#D91023]" />
        <span className="bg-white" />
        <span className="bg-[#D91023]" />
      </span>
      <span className="absolute inset-0 bg-gradient-to-b from-white/35 via-transparent to-black/15" />
    </span>
  );
}

export default function Hero() {
  return (
    <section id="hero" className="relative min-h-[600px] lg:min-h-screen overflow-hidden">
      {/* Full-width background image */}
      <div className="absolute inset-0">
        <img
          src="/Imagenes/primeraimagenweb.jpg"
          alt="Showclinic - Estética Avanzada"
          className="w-full h-full object-cover object-top"
          loading="eager"
          fetchPriority="high"
        />
        {/* Gradient overlay — strong left for text, fades quickly to show image center/right */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to right, #FAF7F3 0%, rgba(250,247,243,0.88) 22%, rgba(250,247,243,0.35) 42%, transparent 58%)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-cream/40 via-transparent to-transparent lg:hidden" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full px-6 sm:px-10 md:px-16 lg:px-20 xl:px-28 2xl:px-36 h-full">
        <div className="flex items-center min-h-[600px] lg:min-h-screen">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="pt-28 pb-12 lg:pt-0 lg:pb-0 max-w-xl xl:max-w-2xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-[2px] bg-primary" />
              <span className="text-[12px] font-semibold uppercase tracking-[0.2em] text-primary">
                Estética avanzada en Arequipa
              </span>
            </div>

            {/* Aviso animado → lleva a las promociones */}
            <motion.a
              href="#promociones"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              whileHover={{ scale: 1.035 }}
              whileTap={{ scale: 0.98 }}
              className="group relative inline-flex items-center gap-3 sm:gap-3.5 pl-2 pr-3 sm:pr-4 py-2 mb-7 rounded-full bg-white/85 backdrop-blur-md ring-1 ring-[#D91023]/25 shadow-[0_10px_30px_-8px_rgba(217,16,35,0.35)] overflow-hidden"
              aria-label="Ver promociones de Fiestas Patrias"
            >
              {/* Halo latiendo */}
              <motion.span
                className="absolute inset-0 rounded-full bg-[#D91023]/12 pointer-events-none"
                animate={{ opacity: [0, 0.65, 0], scale: [0.94, 1.06, 0.94] }}
                transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
              />
              {/* Destello que barre de lado a lado */}
              <motion.span
                className="absolute top-0 bottom-0 w-16 -skew-x-12 bg-gradient-to-r from-transparent via-white/85 to-transparent pointer-events-none"
                animate={{ x: ['-120%', '520%'] }}
                transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 1.6, ease: 'easeInOut' }}
              />

              {/* Insignia con el descuento */}
              <span className="relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-gradient-to-br from-[#D91023] to-[#a80d1b] shadow-sm flex-shrink-0">
                <PeruFlag className="w-4 h-2.5" />
                <span className="text-[11px] sm:text-[12px] font-black text-white tracking-tight">30%</span>
              </span>

              <span className="relative flex flex-col leading-none min-w-0">
                <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.18em] text-[#D91023] font-bold mb-0.5">
                  Fiestas Patrias
                </span>
                <span className="text-[12px] sm:text-[13.5px] font-semibold text-dark truncate">
                  Hasta 30% en tratamientos
                </span>
              </span>

              {/* Flecha que rebota */}
              <motion.span
                className="relative flex items-center justify-center w-7 h-7 rounded-full bg-accent text-white flex-shrink-0 group-hover:bg-[#D91023] transition-colors"
                animate={{ y: [0, 3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <ChevronDown className="w-3.5 h-3.5" strokeWidth={2.5} />
              </motion.span>

              {/* Chispa decorativa */}
              <motion.span
                className="absolute -top-1 -right-0.5 text-primary pointer-events-none"
                animate={{ scale: [0.8, 1.15, 0.8], opacity: [0.5, 1, 0.5], rotate: [0, 18, 0] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Sparkles className="w-3.5 h-3.5" />
              </motion.span>
            </motion.a>

            <h1 className="font-serif font-semibold text-dark leading-[1.08] tracking-tight mb-6">
              Cuidado integral para tu{' '}
              <span className="italic text-primary">salud</span> y belleza
            </h1>

            <p className="text-gray-600 leading-[1.8] max-w-lg mb-10">
              Especialistas internacionales y tecnología de vanguardia al servicio
              de tu bienestar. Resultados naturales que hablan por sí solos.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="https://wa.me/51974212114?text=Hola%2C%20vengo%20de%20la%20p%C3%A1gina%20web%20y%20me%20gustar%C3%ADa%20agendar%20una%20consulta"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-[13px] font-semibold uppercase tracking-[0.12em] text-white bg-accent rounded-full hover:bg-dark transition-colors duration-300"
              >
                Agendar cita
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#services"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-[13px] font-semibold uppercase tracking-[0.12em] text-accent border-2 border-accent/20 rounded-full hover:bg-accent hover:text-white transition-all duration-300 backdrop-blur-sm"
              >
                Ver servicios
              </a>
            </div>
          </motion.div>
        </div>
      </div>

    </section>
  );
}
