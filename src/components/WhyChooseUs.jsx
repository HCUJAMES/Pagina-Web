import { motion } from 'framer-motion';
import { Check, Users } from 'lucide-react';
import RevealText from './RevealText';
import RevealImage from './RevealImage';

export default function WhyChooseUs() {
  const benefits = [
    {
      title: 'Atención personalizada',
      description: 'Cada tratamiento es diseñado específicamente para tus necesidades y objetivos.'
    },
    {
      title: 'Tecnología de vanguardia',
      description: 'Equipos de última generación para resultados seguros y efectivos.'
    }
  ];

  return (
    <section className="bg-[#FFF8F0] py-[clamp(4rem,8vw,8rem)]">
      <div className="container-fluid">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-7xl mx-auto">
          {/* Left: Images collage */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <RevealImage
                src="/Imagenes/EQUIPO 2.jpg"
                alt="Equipo ShowClinic"
                className="w-full aspect-[3/4] object-cover rounded-2xl shadow-warm"
              />
              <div className="space-y-4 pt-8">
                <RevealImage
                  src="/Imagenes/imagenmodelo.jpg"
                  alt="Tratamiento ShowClinic"
                  className="w-full aspect-square object-cover rounded-2xl shadow-warm"
                />
                <RevealImage
                  src="/Imagenes/imagenmodelo2.jpg"
                  alt="Resultados ShowClinic"
                  className="w-full aspect-square object-cover rounded-2xl shadow-warm"
                />
              </div>
            </div>
          </div>

          {/* Right: Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <RevealText as="div" className="flex items-center gap-3 mb-5">
              <div className="w-8 h-px bg-[#C8A96E]" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#C8A96E]">
                SOBRE NOSOTROS
              </span>
            </RevealText>

            <RevealText as="h2" className="font-serif font-semibold text-[#5D4037] tracking-tight leading-[1.1] mb-6">
              ¿Por qué elegirnos?
            </RevealText>

            <RevealText as="p" delay={0.2} className="text-[#6B5547] leading-[1.9] max-w-[65ch] mb-8">
              En ShowClinic combinamos experiencia médica, tecnología avanzada y atención personalizada para ofrecerte los mejores resultados en medicina estética.
            </RevealText>

            {/* Benefits */}
            <div className="space-y-6 mb-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#C8A96E] flex items-center justify-center mt-1">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#3D342E] mb-1">{benefit.title}</h3>
                    <p className="text-sm text-[#6B5547] leading-relaxed">{benefit.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="inline-flex items-center gap-3 px-6 py-3 bg-[#C8A96E] text-white rounded-full shadow-warm"
            >
              <Users className="w-5 h-5" />
              <span className="font-semibold">5+ Especialistas Certificados</span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
