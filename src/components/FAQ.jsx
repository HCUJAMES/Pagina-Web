import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const faqs = [
  {
    question: '¿Qué tratamientos ofrecen?',
    answer: 'Ofrecemos tratamientos de medicina estética, armonización facial, tratamientos dermatológicos y armonización orofacial. Cada tratamiento es personalizado según las necesidades de cada paciente.',
  },
  {
    question: '¿Necesito una consulta previa?',
    answer: 'Sí, recomendamos una consulta inicial donde evaluamos tu caso, discutimos tus objetivos y diseñamos un plan de tratamiento personalizado para ofrecerte los mejores resultados.',
  },
  {
    question: '¿Sus tratamientos son para todo tipo de piel?',
    answer: 'Sí, nuestros especialistas están capacitados para trabajar con todo tipo de piel. Durante la consulta evaluamos las características específicas de tu piel para adaptar el tratamiento.',
  },
  {
    question: '¿Ofrecen dermatología cosmética?',
    answer: 'Sí, contamos con especialistas en dermatología cosmética que ofrecen tratamientos para el cuidado y rejuvenecimiento de la piel, incluyendo tratamientos faciales avanzados.',
  },
  {
    question: '¿Qué debo esperar en mi primera cita?',
    answer: 'Realizaremos una evaluación completa, discutiremos tus expectativas, explicaremos las opciones de tratamiento disponibles y responderemos todas tus preguntas.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="bg-accent">
      <div className="container-fluid py-20 md:py-28 2xl:py-36">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-12 lg:gap-20">
          {/* Left: Title */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-[2px] bg-primary-light" />
              <span className="text-[12px] font-semibold uppercase tracking-[0.2em] text-primary-light">
                FAQ
              </span>
            </div>
            <h2 className="font-serif font-semibold text-white tracking-tight leading-[1.1] mb-6 lg:sticky lg:top-28">
              Preguntas frecuentes
            </h2>
            <p className="text-white/40 leading-relaxed lg:sticky lg:top-48 max-w-sm">
              Todo lo que necesitas saber antes de tu primera consulta.
            </p>
          </div>

          {/* Right: Accordion */}
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="bg-white rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full flex items-center justify-between p-5 lg:p-6 text-left hover:bg-cream/50 transition-colors"
                >
                  <span className="font-semibold text-dark text-[15px] pr-4">{faq.question}</span>
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    {openIndex === index ? (
                      <Minus className="w-4 h-4 text-white" />
                    ) : (
                      <Plus className="w-4 h-4 text-white" />
                    )}
                  </div>
                </button>
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-5 lg:px-6 pb-5 lg:pb-6 text-gray-500 text-sm leading-[1.7]">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
