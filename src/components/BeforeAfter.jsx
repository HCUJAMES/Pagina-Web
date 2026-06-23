import { useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
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

// Comparador antes/después con soporte total para móvil (toque) y escritorio (mouse)
function CompareSlider({ before, after, title }) {
  const [pos, setPos] = useState(50);
  const containerRef = useRef(null);
  const dragging = useRef(false);

  const updateFromClientX = useCallback((clientX) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    let p = ((clientX - rect.left) / rect.width) * 100;
    p = Math.max(0, Math.min(100, p));
    setPos(p);
  }, []);

  const onPointerDown = (e) => {
    dragging.current = true;
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* noop */ }
    updateFromClientX(e.clientX);
  };
  const onPointerMove = (e) => {
    if (!dragging.current) return;
    updateFromClientX(e.clientX);
  };
  const endDrag = () => { dragging.current = false; };

  return (
    <div
      ref={containerRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      className="relative rounded-2xl overflow-hidden shadow-soft select-none cursor-ew-resize"
      style={{ aspectRatio: '3 / 4', touchAction: 'pan-y' }}
    >
      {/* Imagen "antes" (capa base, completa) */}
      <img
        src={before}
        alt={`Antes - ${title}`}
        draggable={false}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      />
      {/* Imagen "después" (recortada a la derecha del divisor) */}
      <img
        src={after}
        alt={`Después - ${title}`}
        draggable={false}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        style={{ clipPath: `inset(0 0 0 ${pos}%)` }}
      />

      {/* Divisor + tirador */}
      <div
        className="absolute top-0 bottom-0 pointer-events-none"
        style={{ left: `${pos}%`, transform: 'translateX(-50%)' }}
      >
        <div className="relative w-[2px] h-full bg-white/90 mx-auto">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white shadow-soft-lg border border-gray-100 flex items-center justify-center">
            <MoveHorizontal className="w-4 h-4 text-primary" />
          </div>
        </div>
      </div>

      {/* Etiquetas */}
      <div className="absolute top-4 left-4 bg-dark/60 backdrop-blur-sm text-white text-[10px] uppercase tracking-[0.12em] font-semibold rounded-full px-3 py-1.5 z-10 pointer-events-none">
        Antes
      </div>
      <div className="absolute top-4 right-4 bg-primary text-white text-[10px] uppercase tracking-[0.12em] font-semibold rounded-full px-3 py-1.5 z-10 pointer-events-none">
        Después
      </div>
    </div>
  );
}

export default function BeforeAfter() {
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
              <CompareSlider before={pair.before} after={pair.after} title={pair.title} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
