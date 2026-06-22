import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';

function AnimatedCounter({ end, suffix = '', duration = 1.5 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const step = end / (duration * 30);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 1000 / 30);
    return () => clearInterval(timer);
  }, [isInView, end, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}

const stats = [
  { value: 7, suffix: '', label: 'Años de experiencia' },
  { value: 5000, suffix: '+', label: 'Pacientes atendidos' },
  { value: 15, suffix: '+', label: 'Tratamientos' },
  { value: 90, suffix: '%', label: 'Satisfacción' },
  { value: 5, suffix: '', label: 'Especialistas' },
];

const features = [
  'Equipo multidisciplinario de especialistas',
  'Tecnología de vanguardia certificada',
  'Atención personalizada a cada paciente',
];

export default function About() {
  return (
    <section id="about" className="bg-white">
      {/* About content */}
      <div className="container-fluid py-20 md:py-28 2xl:py-36">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-[2px] bg-primary" />
              <span className="text-[12px] font-semibold uppercase tracking-[0.2em] text-primary">
                ¿Por qué elegirnos?
              </span>
            </div>

            <h2 className="font-serif font-semibold text-dark tracking-tight leading-[1.1] mb-6">
              ShowClinic, donde la ciencia y el arte se encuentran
            </h2>

            <p className="text-gray-500 leading-[1.8] mb-8">
              Somos una clínica de estética avanzada con un equipo multidisciplinario de especialistas formados internacionalmente. Combinamos experiencia, innovación y tecnología de última generación para ofrecer tratamientos integrales que realzan tu belleza natural con resultados seguros y duraderos.
            </p>

            <div className="space-y-4 mb-10">
              {features.map((f, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <span className="text-[15px] text-gray-600 font-medium">{f}</span>
                </div>
              ))}
            </div>

            <a
              href="#services"
              className="inline-flex items-center justify-center px-8 py-4 text-[13px] font-semibold uppercase tracking-[0.12em] text-white bg-accent rounded-full hover:bg-dark transition-colors duration-300"
            >
              Conocer más
            </a>
          </motion.div>

          {/* Right: Stacked images (Dermal style) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative">
              {/* Decorative gradient blob behind */}
              <div className="absolute -top-6 -right-6 w-[70%] h-[70%] bg-gradient-to-br from-primary/20 via-primary/10 to-transparent rounded-full blur-[60px]" />
              <div className="absolute -bottom-8 -left-8 w-[50%] h-[50%] bg-gradient-to-tr from-primary/15 to-transparent rounded-full blur-[50px]" />

              {/* Main image with custom shape */}
              <div className="relative rounded-[2rem] rounded-tl-[4rem] overflow-hidden shadow-xl shadow-primary/15 ring-1 ring-primary/10">
                <img
                  src="/Imagenes/fotoporqueelegirnosgrande.jpg"
                  alt="Equipo ShowClinic"
                  className="w-full object-cover aspect-[3/4]"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-accent/30 via-transparent to-primary/10" />
              </div>

              {/* Overlapping smaller image with different shape */}
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="absolute -bottom-10 -left-6 w-[50%]"
              >
                <div className="rounded-[1.5rem] rounded-br-[3rem] overflow-hidden shadow-2xl shadow-accent/25 ring-2 ring-white/80">
                  <img
                    src="/Imagenes/salaesperafoto.jpg"
                    alt="Sala de espera ShowClinic"
                    className="w-full aspect-[3/4] object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/20" />
                </div>
              </motion.div>

              {/* Decorative accent dots */}
              <div className="absolute -top-3 -left-3 w-16 h-16 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #8B6F4E 1.5px, transparent 1.5px)', backgroundSize: '8px 8px' }} />
              <div className="absolute -bottom-3 -right-3 w-20 h-20 opacity-15" style={{ backgroundImage: 'radial-gradient(circle, #8B6F4E 1.5px, transparent 1.5px)', backgroundSize: '8px 8px' }} />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="bg-accent">
        <div className="container-fluid py-14 md:py-16">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 md:gap-0">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className={`text-center ${i > 0 ? 'md:border-l md:border-white/10' : ''}`}
              >
                <p className="font-serif text-4xl md:text-5xl font-bold text-white mb-1">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-[11px] md:text-[12px] text-white/50 uppercase tracking-[0.12em] font-medium">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
