import { motion } from 'framer-motion';

export default function RevealImage({ src, alt, className = '', aspectRatio = 'aspect-[4/5]' }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl ${aspectRatio} ${className}`}>
      {/* Overlay dorado que barre */}
      <motion.div
        initial={{ height: '100%' }}
        whileInView={{ height: '0%' }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-x-0 bottom-0 bg-[#C8A96E]/20 z-10"
      />
      
      {/* Imagen con clip-path y zoom */}
      <motion.img
        src={src}
        alt={alt}
        initial={{ clipPath: 'inset(0 0 100% 0)', scale: 1.08 }}
        whileInView={{ clipPath: 'inset(0 0 0% 0)', scale: 1 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="w-full h-full object-cover"
        loading="lazy"
      />
    </div>
  );
}
