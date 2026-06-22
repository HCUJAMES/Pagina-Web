import { motion } from 'framer-motion';
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';
import { MoveHorizontal } from 'lucide-react';

const beforeAfterPairs = [
  {
    title: 'Rinomodelación',
    before: '/Imagenes/fotorinoantes1.jpg',
    after: '/Imagenes/fotorinodespues1.jpg',
  },
  {
    title: 'Diseño de Labios',
    before: '/Imagenes/antes1Labios.jpg',
    after: '/Imagenes/despues1Labios .jpg',
  },
];

export default function BeforeAfter() {
  const CustomHandle = () => (
    <div className="flex flex-col items-center gap-2">
      <div className="w-[2px] h-full bg-white/80" />
      <div className="absolute top-1/2 -translate-y-1/2 flex items-center justify-center w-11 h-11 rounded-full bg-white shadow-soft-lg border border-gray-100">
        <MoveHorizontal className="w-4 h-4 text-primary" />
      </div>
      <div className="w-[2px] h-full bg-white/80" />
    </div>
  );

  return (
    <section id="resultados" className="bg-cream">
      <div className="container-fluid py-20 md:py-28 2xl:py-36">
        <div className="text-center max-w-2xl mx-auto mb-14 md:mb-18">
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="w-10 h-[2px] bg-primary" />
            <span className="text-[12px] font-semibold uppercase tracking-[0.2em] text-primary">
              Resultados reales
            </span>
            <div className="w-10 h-[2px] bg-primary" />
          </div>
          <h2 className="font-serif font-semibold text-dark tracking-tight leading-[1.1] mb-4">
            Antes y <span className="italic text-primary">después</span>
          </h2>
          <p className="text-gray-500">
            Desliza para ver la transformación
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {beforeAfterPairs.map((pair, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <h3 className="font-serif text-lg font-semibold text-dark text-center mb-4">
                {pair.title}
              </h3>
              <div className="relative rounded-2xl overflow-hidden shadow-soft" style={{ aspectRatio: '3 / 4' }}>
                <ReactCompareSlider
                  itemOne={
                    <ReactCompareSliderImage
                      src={pair.before}
                      alt={`Antes - ${pair.title}`}
                      style={{ objectFit: 'cover', objectPosition: 'center', width: '100%', height: '100%' }}
                    />
                  }
                  itemTwo={
                    <ReactCompareSliderImage
                      src={pair.after}
                      alt={`Después - ${pair.title}`}
                      style={{ objectFit: 'cover', objectPosition: 'center', width: '100%', height: '100%' }}
                    />
                  }
                  handle={<CustomHandle />}
                  position={50}
                  style={{ width: '100%', height: '100%' }}
                />
                <div className="absolute top-4 left-4 bg-dark/60 backdrop-blur-sm text-white text-[10px] uppercase tracking-[0.12em] font-semibold rounded-full px-3 py-1.5 z-10 pointer-events-none">
                  Antes
                </div>
                <div className="absolute top-4 right-4 bg-primary text-white text-[10px] uppercase tracking-[0.12em] font-semibold rounded-full px-3 py-1.5 z-10 pointer-events-none">
                  Después
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
