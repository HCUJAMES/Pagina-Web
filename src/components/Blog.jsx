import { motion } from 'framer-motion';
import { Calendar, ArrowRight } from 'lucide-react';
import RevealText from './RevealText';
import RevealImage from './RevealImage';

export default function Blog() {
  const posts = [
    {
      image: '/Imagenes/imagenmodelo.jpg',
      date: '15 Enero 2026',
      title: 'Cómo cuidar tu piel después de un tratamiento',
      excerpt: 'Consejos esenciales para maximizar los resultados de tu tratamiento estético.'
    },
    {
      image: '/Imagenes/imagenmodelo2.jpg',
      date: '10 Enero 2026',
      title: 'Entendiendo las causas del acné y cómo tratarlo',
      excerpt: 'Descubre las causas principales del acné y los tratamientos más efectivos.'
    },
    {
      image: '/Imagenes/imagenmodelo3.jpg',
      date: '5 Enero 2026',
      title: 'Por qué son importantes los chequeos regulares de la piel',
      excerpt: 'La prevención es clave para mantener una piel sana y radiante.'
    }
  ];

  return (
    <section className="bg-[#FFF8F0] py-[clamp(4rem,8vw,8rem)]">
      <div className="container-fluid">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <RevealText as="div" className="flex items-center justify-center gap-3 mb-5">
            <div className="w-8 h-px bg-[#C8A96E]" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#C8A96E]">
              BLOG
            </span>
            <div className="w-8 h-px bg-[#C8A96E]" />
          </RevealText>
          <RevealText as="h2" className="font-serif font-semibold text-[#5D4037] tracking-tight leading-[1.1]">
            Últimas publicaciones de cuidado de la piel
          </RevealText>
        </div>

        {/* Posts grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {posts.map((post, index) => (
            <motion.article
              key={post.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-6">
                <RevealImage
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Date */}
              <div className="flex items-center gap-2 text-sm text-[#6B5547] mb-3">
                <Calendar className="w-4 h-4" />
                <time>{post.date}</time>
              </div>

              {/* Title */}
              <h3 className="font-serif text-xl font-semibold text-[#3D342E] mb-3 group-hover:text-[#C8A96E] transition-colors">
                {post.title}
              </h3>

              {/* Excerpt */}
              <p className="text-[#6B5547] leading-relaxed mb-4">
                {post.excerpt}
              </p>

              {/* Read more link */}
              <a
                href="#"
                className="inline-flex items-center gap-2 text-[#C8A96E] hover:text-[#B08D52] font-semibold transition-colors"
              >
                Leer más
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
