import { motion } from 'framer-motion';
import { Phone } from 'lucide-react';

const steps = [
  {
    number: '01',
    title: 'Consulta personalizada',
    description: 'Evaluamos tu caso de forma individual, escuchamos tus objetivos y realizamos un diagnóstico completo para entender exactamente lo que necesitas.',
  },
  {
    number: '02',
    title: 'Plan de tratamiento a medida',
    description: 'Diseñamos un protocolo específico adaptado a tus necesidades, combinando las mejores técnicas y tecnologías disponibles.',
  },
  {
    number: '03',
    title: 'Seguimiento continuo',
    description: 'Monitoreamos tu evolución paso a paso y ajustamos el tratamiento según tus resultados para garantizar la mejor experiencia.',
  },
];

export default function HowWeWork() {
  return (
    <section className="bg-white">
      <div className="container-fluid py-20 md:py-28 2xl:py-36">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: Steps */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-[2px] bg-primary" />
              <span className="text-[12px] font-semibold uppercase tracking-[0.2em] text-primary">
                Nuestro proceso
              </span>
            </div>

            <h2 className="font-serif font-semibold text-dark tracking-tight leading-[1.1] mb-12">
              Cómo trabajamos con cada paciente
            </h2>

            <div className="space-y-10">
              {steps.map((step, index) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex gap-6 group"
                >
                  <div className="flex-shrink-0">
                    <span className="font-serif text-5xl md:text-6xl font-bold text-primary/15 group-hover:text-primary/30 transition-colors duration-300">
                      {step.number}
                    </span>
                  </div>
                  <div className="pt-3 border-t border-gray-100 flex-1">
                    <h3 className="font-semibold text-dark text-lg mb-2">{step.title}</h3>
                    <p className="text-gray-500 text-sm leading-[1.7]">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right: Image with floating card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <img
              src="/Imagenes/fotoconpacientes.jpg"
              alt="Proceso ShowClinic"
              className="w-full aspect-[4/5] object-cover rounded-2xl shadow-soft"
              loading="lazy"
            />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm p-5 rounded-xl shadow-soft-lg"
            >
              <p className="text-dark font-semibold text-sm mb-2">¿Tienes dudas? Escríbenos</p>
              <a
                href="https://wa.me/51974212114"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-primary hover:text-primary-dark transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span className="font-semibold text-sm">974 212 114</span>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
