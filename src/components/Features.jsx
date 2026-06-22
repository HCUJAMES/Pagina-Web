import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Scan, Syringe, Sun, Zap, Gem, ArrowUpRight, ChevronRight } from 'lucide-react';

const services = [
  {
    icon: Syringe,
    image: '/Imagenes/tratamientoDisenoLabios.JPG',
    title: 'Diseño de Labios',
    description: 'Armonización y definición de labios con técnicas avanzadas para resultados naturales.',
    tag: 'Popular',
  },
  {
    icon: Sparkles,
    image: '/Imagenes/tratamientobabybotox.JPG',
    title: 'Baby Botox',
    description: 'Toxina botulínica en microdosis para prevenir arrugas manteniendo la expresividad natural.',
    tag: 'Tendencia',
  },
  {
    icon: Zap,
    image: '/Imagenes/tratamientocarboxiterapia.JPG',
    title: 'Carboxiterapia',
    description: 'Terapia con CO₂ medicinal para mejorar circulación, celulitis y rejuvenecimiento.',
    tag: null,
  },
  {
    icon: Scan,
    image: '/Imagenes/tratamientoemslim.JPG',
    title: 'EM Slim',
    description: 'Tecnología electromagnética para tonificar músculos y reducir grasa sin cirugía.',
    tag: 'Nuevo',
  },
  {
    icon: Sun,
    image: '/Imagenes/tratamientohifufacial.JPG',
    title: 'HIFU Facial',
    description: 'Ultrasonido focalizado de alta intensidad para lifting facial sin cirugía.',
    tag: 'Premium',
  },
  {
    icon: Gem,
    image: '/Imagenes/tratamientoproyecciondementon.JPG',
    title: 'Proyección de Mentón',
    description: 'Armonización del perfil facial con rellenos dérmicos para definir el mentón.',
    tag: null,
  },
];

function ServiceCard({ service, index }) {
  const Icon = service.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.6 }}
      className="group relative rounded-3xl overflow-hidden cursor-pointer"
    >
      {/* Image background */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={service.image}
          alt={service.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[800ms] ease-out"
          loading="lazy"
        />

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/40 to-dark/10 group-hover:from-dark group-hover:via-dark/50 transition-all duration-500" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Tag badge */}
        {service.tag && (
          <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-primary text-white text-[9px] font-bold uppercase tracking-[0.15em] shadow-lg shadow-primary/30">
            {service.tag}
          </div>
        )}

        {/* Icon circle */}
        <div className="absolute top-4 right-4 w-11 h-11 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center group-hover:bg-primary group-hover:border-primary/50 group-hover:shadow-lg group-hover:shadow-primary/20 transition-all duration-400">
          <Icon className="w-4.5 h-4.5 text-white/80 group-hover:text-white transition-colors duration-300" />
        </div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          {/* Divider line */}
          <div className="w-8 h-[2px] bg-primary-light mb-4 group-hover:w-12 transition-all duration-400" />

          <h3 className="font-serif text-xl lg:text-[1.4rem] font-semibold text-white mb-2 leading-tight">
            {service.title}
          </h3>

          {/* Description - slides up on hover */}
          <div className="max-h-0 group-hover:max-h-24 overflow-hidden transition-all duration-500 ease-out">
            <p className="text-[13px] text-white/65 leading-relaxed mb-4">
              {service.description}
            </p>
          </div>

          {/* CTA link */}
          <div className="flex items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
            <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-primary-light">Más info</span>
            <ChevronRight className="w-3 h-3 text-primary-light group-hover:translate-x-1 transition-transform duration-300" />
          </div>
        </div>

        {/* Hover border glow */}
        <div className="absolute inset-0 rounded-3xl ring-1 ring-white/10 group-hover:ring-primary/30 transition-all duration-400" />
      </div>
    </motion.div>
  );
}

export default function Services() {
  return (
    <section id="services" className="relative bg-cream overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 left-0 w-72 h-72 bg-primary/5 rounded-full blur-[80px]" />
      <div className="absolute bottom-20 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px]" />

      <div className="container-fluid py-20 md:py-28 2xl:py-36 relative">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-14 md:mb-18">
          <div className="max-w-xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 mb-5"
            >
              <div className="w-10 h-[2px] bg-primary" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-primary">
                Nuestros servicios
              </span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-serif font-semibold text-dark tracking-tight leading-[1.1] text-4xl md:text-5xl"
            >
              Tratamientos de{' '}
              <span className="italic text-primary">excelencia</span>
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="text-gray-500 text-[15px] max-w-md lg:text-right"
          >
            Procedimientos estéticos de última generación adaptados a tus necesidades, con tecnología avanzada y resultados naturales.
          </motion.p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 2xl:gap-6">
          {services.map((service, i) => (
            <ServiceCard key={service.title} service={service} index={i} />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-14"
        >
          <a
            href="https://wa.me/51974212114?text=Hola%2C%20me%20gustaría%20consultar%20sobre%20sus%20tratamientos"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 text-[12px] font-semibold uppercase tracking-[0.15em] text-white bg-accent rounded-full hover:bg-dark transition-colors duration-300 shadow-lg shadow-accent/20"
          >
            Consultar todos los tratamientos
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
