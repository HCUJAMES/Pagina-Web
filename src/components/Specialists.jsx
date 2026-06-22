import { motion } from 'framer-motion';
import { GraduationCap, Award, Star, Crown, ArrowRight, MapPin } from 'lucide-react';

const specialists = [
  {
    name: 'Dra. Alicia Páez',
    role: 'Médico Estético',
    specialty: 'Medicina Estética',
    university: 'Fac. Medicina Humana UCSM',
    credential: 'CMP 73943',
    image: '/Imagenes/DOCTORA Alicia.jpg',
  },
  {
    name: 'Cosmiatra Romina Carbajal',
    role: 'Cosmiatra',
    specialty: 'Tratamientos Faciales',
    university: 'Exel Institute - Buenos Aires',
    credential: null,
    image: '/Imagenes/COSMIATRA romina.jpg',
  },
  {
    name: 'Dr. Erick Espetia',
    role: 'Director Clínico',
    specialty: 'Armonización Orofacial',
    university: 'Univ. São Leopoldo Mandic - SP',
    credential: 'COP 28003',
    image: '/Imagenes/DOCTOR ERICK 1.jpg',
    featured: true,
  },
  {
    name: 'Dra. Edith Carpio',
    role: 'Especialista Orofacial',
    specialty: 'Armonización Orofacial',
    university: 'UNINGA-Maringá · UCSM',
    credential: 'COP 43340',
    image: '/Imagenes/DOCTORA edith 1.jpg',
  },
  {
    name: 'Cosmiatra Carla Vargas',
    role: 'Cosmiatra',
    specialty: 'Cosmiatría Estética y Corporal',
    university: 'Univ. John F. Kennedy - Buenos Aires',
    credential: null,
    image: '/Imagenes/DOCTORA karla.jpg',
  },
];

function SpecialistCard({ specialist, index }) {
  const isFeatured = specialist.featured;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      className={`group relative ${isFeatured ? 'lg:-my-6 z-10' : ''}`}
    >
      <div className={`relative overflow-hidden rounded-2xl ${isFeatured ? 'ring-2 ring-primary/40 shadow-xl shadow-primary/10' : 'ring-1 ring-white/10'}`}>
        <div className={`relative overflow-hidden ${isFeatured ? 'aspect-[3/5]' : 'aspect-[3/4.5]'}`}>
          <img
            src={specialist.image}
            alt={specialist.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            loading="lazy"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/20 to-transparent" />

          {isFeatured && (
            <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary shadow-lg shadow-primary/30">
              <Crown className="w-3 h-3 text-white" />
              <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-white">Director Clínico</span>
            </div>
          )}

          <div className={`absolute bottom-0 left-0 right-0 ${isFeatured ? 'p-5' : 'p-4'}`}>
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 mb-2">
              <Star className="w-2 h-2 text-primary-light" />
              <span className="text-[8px] font-semibold uppercase tracking-[0.12em] text-primary-light">{specialist.role}</span>
            </div>

            <h3 className={`font-serif font-semibold text-white leading-tight mb-0.5 ${isFeatured ? 'text-lg' : 'text-[15px]'}`}>
              {specialist.name}
            </h3>
            <p className="text-[11px] text-white/50">{specialist.specialty}</p>

            <div className="max-h-0 group-hover:max-h-24 overflow-hidden transition-all duration-500 ease-out">
              <div className="space-y-1 pt-2">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-3 h-3 text-primary-light flex-shrink-0" />
                  <p className="text-[10px] text-white/50 leading-snug">{specialist.university}</p>
                </div>
                {specialist.credential && (
                  <div className="flex items-center gap-2">
                    <Award className="w-3 h-3 text-primary-light flex-shrink-0" />
                    <span className="text-[10px] font-semibold text-white/60">{specialist.credential}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Doctor() {
  return (
    <section id="doctor" className="relative bg-accent overflow-hidden">
      <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '48px 48px' }} />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/8 rounded-full blur-[120px]" />

      <div className="container-fluid py-20 md:py-28 2xl:py-36 relative">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 md:mb-18">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-3 mb-5"
          >
            <div className="w-10 h-[1px] bg-primary-light/40" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-primary-light">
              Equipo de élite
            </span>
            <div className="w-10 h-[1px] bg-primary-light/40" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-serif font-semibold text-white tracking-tight leading-[1.1] mb-5 text-4xl md:text-5xl"
          >
            Nuestros <span className="italic text-primary-light">especialistas</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="text-white/40 text-[15px]"
          >
            Profesionales con formación internacional y años de experiencia dedicados a tu bienestar
          </motion.p>
        </div>

        {/* 5 columns grid - Dr Erick in center is taller */}
        <div className="max-w-[90rem] mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5 lg:gap-6 items-center">
          {specialists.map((specialist, i) => (
            <SpecialistCard key={specialist.name} specialist={specialist} index={i} />
          ))}
        </div>

        {/* Bottom bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto mt-14 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-5"
        >
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
              <MapPin className="w-4.5 h-4.5 text-primary-light" />
            </div>
            <div>
              <p className="text-white font-serif text-[17px] font-semibold">ShowClinic Arequipa</p>
              <p className="text-white/40 text-[12px]">Formación internacional · Tecnología de vanguardia</p>
            </div>
          </div>
          <a
            href="https://wa.me/51974212114?text=Hola%2C%20me%20gustaría%20agendar%20una%20consulta"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.15em] text-accent bg-white rounded-full hover:bg-primary-light hover:text-white transition-all duration-300 shadow-lg flex-shrink-0"
          >
            Agendar consulta
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
