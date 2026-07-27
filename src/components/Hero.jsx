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

            {/* Banner animado → lleva a las promociones */}
            <motion.a
              href="#promociones"
              initial={{ opacity: 0, y: -18, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.45, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ scale: 1.03, y: -3 }}
              whileTap={{ scale: 0.985 }}
              className="group relative block w-full max-w-[430px] mb-8 rounded-[1.5rem] overflow-hidden"
              aria-label="Ver promociones de Fiestas Patrias, hasta 30% de descuento"
            >
              {/* Resplandor exterior que respira */}
              <motion.span
                className="absolute -inset-3 rounded-[2rem] bg-[#D91023]/30 blur-2xl pointer-events-none"
                animate={{ opacity: [0.35, 0.85, 0.35], scale: [0.96, 1.04, 0.96] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
              />

              {/* Flotación continua */}
              <motion.span
                className="relative block"
                animate={{ y: [0, -7, 0] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <span className="relative block rounded-[1.5rem] bg-white/92 backdrop-blur-xl ring-1 ring-[#D91023]/30 shadow-[0_22px_55px_-12px_rgba(217,16,35,0.5)] overflow-hidden">
                  {/* Cinta tricolor superior */}
                  <span className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#D91023] via-white to-[#D91023]" />
                  {/* Destello que barre */}
                  <motion.span
                    className="absolute top-0 bottom-0 w-28 -skew-x-12 bg-gradient-to-r from-transparent via-white/90 to-transparent pointer-events-none"
                    animate={{ x: ['-140%', '620%'] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 1.4, ease: 'easeInOut' }}
                  />

                  <span className="relative flex items-center gap-4 sm:gap-5 p-3.5 sm:p-4 pt-4 sm:pt-5">
                    {/* Bloque del descuento */}
                    <motion.span
                      className="relative flex flex-col items-center justify-center w-[74px] h-[74px] sm:w-[86px] sm:h-[86px] rounded-2xl bg-gradient-to-br from-[#E11B2D] to-[#960c18] shadow-lg shadow-[#D91023]/40 flex-shrink-0"
                      animate={{ rotate: [-2.5, 2.5, -2.5] }}
                      transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      <PeruFlag className="w-6 h-4 sm:w-7 sm:h-[18px] mb-1" />
                      <span className="font-serif text-[26px] sm:text-[31px] font-black text-white leading-none tracking-tight drop-shadow">
                        30%
                      </span>
                      <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.22em] text-white/80 font-bold mt-0.5">
                        Dscto
                      </span>
                    </motion.span>

                    {/* Texto */}
                    <span className="flex flex-col min-w-0 flex-1">
                      <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-[#D91023] font-black mb-1.5">
                        <motion.span
                          className="w-1.5 h-1.5 rounded-full bg-[#D91023]"
                          animate={{ scale: [1, 1.7, 1], opacity: [1, 0.4, 1] }}
                          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
                        />
                        Fiestas Patrias
                      </span>
                      <span className="font-serif text-[19px] sm:text-[23px] font-bold text-dark leading-[1.15] mb-1">
                        Promociones del mes
                      </span>
                      <span className="text-[11px] sm:text-[12px] text-gray-500 font-medium mb-2.5">
                        Válidas del 20 al 28 de julio
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-[11px] sm:text-[12px] font-bold uppercase tracking-[0.12em] text-accent group-hover:text-[#D91023] transition-colors">
                        Ver promociones
                        <motion.span
                          animate={{ x: [0, 4, 0] }}
                          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
                        >
                          <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.5} />
                        </motion.span>
                      </span>
                    </span>

                    {/* Flecha circular */}
                    <motion.span
                      className="flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-accent text-white flex-shrink-0 shadow-lg group-hover:bg-[#D91023] transition-colors self-center"
                      animate={{ y: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      <ChevronDown className="w-5 h-5" strokeWidth={2.5} />
                    </motion.span>
                  </span>
                </span>

                {/* Chispas */}
                <motion.span
                  className="absolute -top-2 -right-1 text-primary pointer-events-none"
                  animate={{ scale: [0.7, 1.3, 0.7], opacity: [0.4, 1, 0.4], rotate: [0, 25, 0] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Sparkles className="w-5 h-5" />
                </motion.span>
                <motion.span
                  className="absolute -bottom-1.5 left-8 text-[#D91023] pointer-events-none"
                  animate={{ scale: [0.6, 1.15, 0.6], opacity: [0.3, 0.9, 0.3], rotate: [0, -20, 0] }}
                  transition={{ duration: 2.6, repeat: Infinity, delay: 0.7, ease: 'easeInOut' }}
                >
                  <Sparkles className="w-4 h-4" />
                </motion.span>
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
