import { motion } from 'framer-motion';

export default function RevealText({ children, className = '', as = 'h2', delay = 0 }) {
  const Component = motion[as];
  
  // Si es un título, dividir en palabras
  const isHeading = ['h1', 'h2', 'h3'].includes(as);
  
  if (isHeading && typeof children === 'string') {
    const words = children.split(' ');
    
    return (
      <Component className={className}>
        {words.map((word, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 24, filter: 'blur(4px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true }}
            transition={{
              duration: 0.6,
              delay: delay + i * 0.06,
              ease: [0.22, 1, 0.36, 1]
            }}
            style={{ display: 'inline-block' }}
          >
            {word}
            {i < words.length - 1 && '\u00A0'}
          </motion.span>
        ))}
      </Component>
    );
  }
  
  // Para párrafos y overlines, animar como un bloque
  return (
    <Component
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.7,
        delay: delay + 0.1,
        ease: [0.22, 1, 0.36, 1]
      }}
      className={className}
    >
      {children}
    </Component>
  );
}
