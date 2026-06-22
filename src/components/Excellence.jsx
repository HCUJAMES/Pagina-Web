import { motion } from 'framer-motion';
import { Award, Zap, Heart, Layers, Shield, Home } from 'lucide-react';
import RevealText from './RevealText';

export default function Excellence() {
  const benefits = [
    { icon: Award, title: 'Especialistas certificados', description: 'Profesionales con formación internacional' },
    { icon: Zap, title: 'Tecnología avanzada', description: 'Equipos de última generación' },
    { icon: Heart, title: 'Atención personalizada', description: 'Cada paciente es único para nosotros' },
    { icon: Layers, title: 'Servicios integrales', description: 'Soluciones completas para tu bienestar' },
    { icon: Shield, title: 'Altos estándares de seguridad', description: 'Protocolos certificados y rigurosos' },
    { icon: Home, title: 'Ambiente confortable', description: 'Instalaciones diseñadas para tu comodidad' }
  ];

  return (
    <section className="bg-[#3D342E] py-[clamp(4rem,8vw,8rem)] relative overflow-hidden">
      <div className="container-fluid">
        <RevealText as="h2" className="font-serif font-semibold text-[#FFF8F0] tracking-tight leading-[1.1] text-center mb-16">
          Excelencia en cada paso
        </RevealText>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-12 lg:gap-16 items-center max-w-7xl mx-auto">
          {/* Left column - 3 benefits */}
          <div className="space-y-8">
            {benefits.slice(0, 3).map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-start gap-4"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#C8A96E] flex items-center justify-center">
                  <benefit.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#FFF8F0] mb-1">{benefit.title}</h3>
                  <p className="text-sm text-[#FFF8F0]/70 leading-relaxed">{benefit.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Center - Patient image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden lg:block"
          >
            <div className="w-64 h-64 rounded-full overflow-hidden border-4 border-[#C8A96E] shadow-warm-xl">
              <img
                src="/Imagenes/imagenmodelo.jpg"
                alt="Paciente satisfecho"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          {/* Right column - 3 benefits */}
          <div className="space-y-8">
            {benefits.slice(3, 6).map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-start gap-4"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#C8A96E] flex items-center justify-center">
                  <benefit.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#FFF8F0] mb-1">{benefit.title}</h3>
                  <p className="text-sm text-[#FFF8F0]/70 leading-relaxed">{benefit.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
