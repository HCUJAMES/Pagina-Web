import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <section id="hero" className="relative min-h-[600px] lg:min-h-screen overflow-hidden">
      {/* Full-width background image */}
      <div className="absolute inset-0">
        <img
          src="/Imagenes/primeraimagenweb.jpg"
          alt="ShowClinic - Estética Avanzada"
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
                href="https://wa.me/51974212114?text=Hola%2C%20me%20gustaría%20agendar%20una%20consulta"
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
