import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, ZoomIn, Sparkles, ArrowRight } from 'lucide-react';

const galleryItems = [
  {
    title: 'Armonización Full Face',
    category: 'Facial',
    image: '/Imagenes/armonizacionfullface.jpg',
  },
  {
    title: 'Definición Tercio Superior',
    category: 'Facial',
    image: '/Imagenes/definicion tercio superior.jpg',
  },
  {
    title: 'Diseño de Labios',
    category: 'Facial',
    image: '/Imagenes/definiciondelabios.jpg',
  },
  {
    title: 'Rinomodelación',
    category: 'Facial',
    image: '/Imagenes/transformacionrinomodelacion.jpg',
  },
];

export default function Gallery() {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const closeModal = () => setSelectedIndex(null);
  const goNext = () => setSelectedIndex((prev) => (prev + 1) % galleryItems.length);
  const goPrev = () => setSelectedIndex((prev) => (prev - 1 + galleryItems.length) % galleryItems.length);

  return (
    <section id="gallery" className="relative bg-accent overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px]" />

      <div className="container-fluid py-20 md:py-28 2xl:py-36 relative">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-3 mb-5"
          >
            <div className="w-10 h-[1px] bg-primary-light/40" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-primary-light">
              Resultados comprobados
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
            Transformaciones <span className="italic text-primary-light">reales</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="text-white/50 text-[15px]"
          >
            Cada resultado habla por sí mismo. Descubre lo que nuestros especialistas pueden lograr.
          </motion.p>
        </div>

        {/* Gallery grid */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-7 lg:gap-8">
          {galleryItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              onClick={() => setSelectedIndex(index)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="group cursor-pointer relative"
            >
              <div className="relative rounded-2xl overflow-hidden aspect-square ring-1 ring-white/10">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  loading="lazy"
                />

                {/* Dark gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

                {/* Antes / Después line */}
                <div className="absolute top-0 left-1/2 w-[1px] h-full bg-white/20 group-hover:bg-primary-light/40 transition-colors duration-300" />
                <div className="absolute top-4 left-3 bg-white/10 backdrop-blur-md border border-white/15 px-2.5 py-1 rounded-full">
                  <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-white/80">Antes</span>
                </div>
                <div className="absolute top-4 right-3 bg-primary/80 backdrop-blur-md px-2.5 py-1 rounded-full shadow-lg shadow-primary/20">
                  <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-white">Después</span>
                </div>

                {/* Content overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Sparkles className="w-3 h-3 text-primary-light" />
                    <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary-light">{item.category}</span>
                  </div>
                  <h3 className="font-serif text-lg font-semibold text-white leading-tight mb-3">{item.title}</h3>
                  <div className="flex items-center gap-2 text-white/50 group-hover:text-primary-light transition-colors duration-300">
                    <span className="text-[11px] font-medium uppercase tracking-wider">Ver detalle</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>

                {/* Hover glow effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ boxShadow: 'inset 0 0 60px rgba(139, 111, 78, 0.15)' }} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-14"
        >
          <a
            href="https://wa.me/51974212114?text=Hola%2C%20estoy%20interesada%20en%20un%20tratamiento"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 text-[12px] font-semibold uppercase tracking-[0.15em] text-white border border-white/20 rounded-full hover:bg-white hover:text-accent transition-all duration-400"
          >
            Estoy interesada en un tratamiento
            <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-dark/95 backdrop-blur-xl flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              className="relative max-w-3xl w-full bg-accent rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-square">
                <img src={galleryItems[selectedIndex].image} alt={galleryItems[selectedIndex].title} className="w-full h-full object-cover" />
                <div className="absolute top-0 left-1/2 w-[1px] h-full bg-white/30" />
                <div className="absolute top-5 left-5 bg-white/15 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-white">Antes</span>
                </div>
                <div className="absolute top-5 right-5 bg-primary/90 backdrop-blur-md px-4 py-1.5 rounded-full shadow-lg">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-white">Después</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-accent via-transparent to-transparent" />
              </div>
              <div className="p-6 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="w-3 h-3 text-primary-light" />
                    <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary-light">{galleryItems[selectedIndex].category}</span>
                  </div>
                  <h4 className="font-serif text-xl font-semibold text-white">{galleryItems[selectedIndex].title}</h4>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={goPrev} className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                    <ChevronLeft className="w-4 h-4 text-white" />
                  </button>
                  <button onClick={goNext} className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                    <ChevronRight className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
              <button onClick={closeModal} className="absolute top-5 right-5 w-9 h-9 rounded-full bg-dark/60 backdrop-blur-sm hover:bg-dark/80 flex items-center justify-center transition-colors z-10">
                <X className="w-4 h-4 text-white" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
