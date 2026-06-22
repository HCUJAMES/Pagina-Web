import { motion } from 'framer-motion';
import { MessageCircle, ArrowRight } from 'lucide-react';

export default function CTA() {
  return (
    <section className="bg-white">
      <div className="container-fluid py-20 md:py-28 2xl:py-36">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            {/* Decorative blobs */}
            <div className="absolute -top-6 -left-6 w-[60%] h-[60%] bg-gradient-to-br from-primary/15 to-transparent rounded-full blur-[50px]" />
            <div className="absolute -bottom-6 -right-6 w-[40%] h-[40%] bg-gradient-to-tl from-primary/10 to-transparent rounded-full blur-[40px]" />

            {/* Main image with creative shape */}
            <div className="relative rounded-[2rem] rounded-tr-[4rem] overflow-hidden shadow-xl shadow-primary/15 ring-1 ring-primary/10">
              <img
                src="/Imagenes/POST LA ESTETICA ESTA CAMBIANDO_Mesa de trabajo 1.jpg"
                alt="ShowClinic - Tu tratamiento ideal"
                className="w-full aspect-[3/4] object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-accent/40 via-transparent to-primary/5" />
            </div>

            {/* Experience badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="absolute -bottom-5 -right-5 bg-gradient-to-br from-accent to-dark text-white rounded-2xl rounded-tl-[2.5rem] p-6 shadow-2xl shadow-accent/30 ring-1 ring-white/10"
            >
              <p className="font-serif text-4xl font-bold">7</p>
              <p className="text-[11px] uppercase tracking-wider text-white/60">Años de experiencia</p>
            </motion.div>

            {/* Decorative dots */}
            <div className="absolute -top-3 -right-3 w-16 h-16 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #8B6F4E 1.5px, transparent 1.5px)', backgroundSize: '8px 8px' }} />
          </motion.div>

          {/* Right: Text */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-[2px] bg-primary" />
              <span className="text-[12px] font-semibold uppercase tracking-[0.2em] text-primary">
                Tu próximo paso
              </span>
            </div>

            <h2 className="font-serif font-semibold text-dark tracking-tight leading-[1.1] mb-6">
              Tu tratamiento ideal te espera
            </h2>

            <p className="text-gray-500 leading-[1.8] mb-8">
              Resultados excepcionales con tecnología de vanguardia y especialistas
              certificados internacionalmente. Agenda tu consulta de evaluación
              sin compromiso y descubre el plan perfecto para ti.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="https://wa.me/51974212114?text=Hola%2C%20me%20gustaría%20agendar%20una%20consulta"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-[13px] font-semibold uppercase tracking-[0.12em] text-white bg-accent rounded-full hover:bg-dark transition-colors duration-300"
              >
                <MessageCircle className="w-4 h-4" />
                Agendar cita
              </a>
              <a
                href="#services"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-[13px] font-semibold uppercase tracking-[0.12em] text-accent border-2 border-accent/20 rounded-full hover:bg-accent hover:text-white transition-all duration-300"
              >
                Ver tratamientos
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
