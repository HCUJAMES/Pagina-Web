import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import RevealText from './RevealText';

const testimonials = [
  {
    name: 'Milagros Bolaños',
    treatment: 'Paciente frecuente',
    content:
      'Mi casa, mi refugio, mis sesiones sanadoras durante casi 4 años. Mi mejor y más maravillosa experiencia en ShowClinic y en manos del mejor doctor.',
    rating: 5,
    avatar: 'MB',
  },
  {
    name: 'Karina Quintanilla',
    treatment: 'Atención personalizada',
    content:
      'Me encanta este lugar… se siente como en casa. La atención siempre personalizada, productos de primera calidad y asesoría excelente de inicio a fin.',
    rating: 5,
    avatar: 'KQ',
  },
  {
    name: 'Andrea Quevedo',
    treatment: 'Tratamiento estético',
    content:
      'Excelente servicio. Muy cuidadosos desde la atención al cliente hasta el tratamiento. Indicaciones claras y mucha preocupación por el paciente.',
    rating: 5,
    avatar: 'AQ',
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-[clamp(4rem,8vw,8rem)] bg-[#FFF8F0] relative overflow-hidden">
      <div className="container-fluid">
        {/* Section header */}
        <div className="text-center mb-12 md:mb-16">
          <RevealText as="div" className="flex items-center justify-center gap-3 mb-5">
            <div className="w-8 h-px bg-[#C8A96E]" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#C8A96E]">
              TESTIMONIOS
            </span>
            <div className="w-8 h-px bg-[#C8A96E]" />
          </RevealText>
          <RevealText as="h2" className="font-serif font-semibold text-[#5D4037] tracking-tight leading-[1.1]">
            Historias reales de pacientes
          </RevealText>
        </div>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="group relative bg-[#E8DFD5] rounded-2xl p-8 lg:p-10 shadow-warm hover:shadow-warm-lg transition-all duration-500 hover:-translate-y-1"
            >
              {/* Quote icon */}
              <Quote className="w-8 h-8 text-[#C8A96E]/30 mb-5" />

              {/* Stars */}
              <div className="flex gap-1 mb-5">
                {[...Array(testimonial.rating)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 text-[#C8A96E] fill-[#C8A96E]" />
                ))}
              </div>

              {/* Content */}
              <p className="text-[#6B5547] leading-[1.8] mb-8 text-[15px] italic">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4 pt-6 border-t border-[#C8A96E]/20">
                <div className="w-12 h-12 rounded-full bg-[#C8A96E] flex items-center justify-center text-white font-bold text-sm">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-semibold text-[#3D342E] text-[15px]">
                    {testimonial.name}
                  </div>
                  <div className="text-[12px] text-[#6B5547] mt-0.5">
                    {testimonial.treatment}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
