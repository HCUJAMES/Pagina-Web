import { useEffect, useState } from 'react';

/**
 * Elementos decorativos de la campaña de primavera.
 * Todo está dibujado (SVG), así no suma peso de descarga.
 */

// ---- Flor de cerezo, con pétalos suaves y corazón dorado ----
export function Blossom({ className = '', tono = 'blush' }) {
  const paletas = {
    blush: { a: '#F7DED8', b: '#EFC4BC', centro: '#E8C48C' },
    crema: { a: '#FBF2E6', b: '#F0E2CE', centro: '#D9B67E' },
    rosa: { a: '#F6D2D2', b: '#E9B3B3', centro: '#E0B583' },
  };
  const p = paletas[tono] || paletas.blush;
  const id = `pet-${tono}`;

  return (
    <svg viewBox="0 0 100 100" fill="none" className={className} aria-hidden="true">
      <defs>
        <radialGradient id={id} cx="50%" cy="78%" r="72%">
          <stop offset="0%" stopColor={p.b} />
          <stop offset="62%" stopColor={p.a} />
          <stop offset="100%" stopColor={p.a} stopOpacity="0.92" />
        </radialGradient>
      </defs>
      {[0, 72, 144, 216, 288].map((a) => (
        <g key={a} transform={`rotate(${a} 50 50)`}>
          {/* pétalo con muesca superior, como el cerezo */}
          <path
            d="M50 50 C36 44 30 30 34 19 C37 10 45 6 50 12 C55 6 63 10 66 19 C70 30 64 44 50 50 Z"
            fill={`url(#${id})`}
          />
          <path
            d="M50 50 C42 44 38 32 40 23"
            stroke="#fff"
            strokeOpacity="0.5"
            strokeWidth="1.1"
            strokeLinecap="round"
          />
        </g>
      ))}
      <circle cx="50" cy="50" r="7.5" fill={p.centro} fillOpacity="0.85" />
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <circle
          key={a}
          cx={50 + Math.cos((a * Math.PI) / 180) * 11}
          cy={50 + Math.sin((a * Math.PI) / 180) * 11}
          r="1.9"
          fill={p.centro}
        />
      ))}
    </svg>
  );
}

// ---- Rama con hojas y capullos ----
export function Branch({ className = '', flip = false }) {
  return (
    <svg viewBox="0 0 220 340" fill="none" aria-hidden="true"
      className={`${className} ${flip ? 'scale-x-[-1]' : ''}`}>
      <path d="M112 340 C110 258 104 186 94 108 C89 68 80 34 68 6"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      {[
        { x: 100, y: 268, r: -30 }, { x: 104, y: 216, r: 28 },
        { x: 96, y: 172, r: -36 }, { x: 90, y: 128, r: 30 },
        { x: 83, y: 88, r: -28 }, { x: 76, y: 50, r: 26 },
      ].map((h, i) => (
        <ellipse key={i}
          cx={h.x + (h.r < 0 ? -24 : 24)} cy={h.y} rx="23" ry="10"
          stroke="currentColor" strokeWidth="1.4"
          transform={`rotate(${h.r} ${h.x + (h.r < 0 ? -24 : 24)} ${h.y})`} />
      ))}
      {[{ x: 128, y: 190 }, { x: 62, y: 138 }, { x: 120, y: 70 }].map((f, i) => (
        <g key={`f${i}`} transform={`translate(${f.x} ${f.y})`}>
          {[0, 72, 144, 216, 288].map((a) => (
            <ellipse key={a} cx="0" cy="-10" rx="5.5" ry="10.5"
              stroke="currentColor" strokeWidth="1.3" transform={`rotate(${a})`} />
          ))}
          <circle cx="0" cy="0" r="2.6" fill="currentColor" fillOpacity="0.5" />
        </g>
      ))}
    </svg>
  );
}

// ---- Margarita amarilla (foto recortada, con fondo transparente) ----
export function Margarita({ className = '' }) {
  return (
    <img
      src="/Imagenes/margarita.webp"
      alt=""
      aria-hidden="true"
      width="220"
      height="220"
      loading="eager"
      decoding="async"
      className={`block w-full h-full object-contain ${className}`}
    />
  );
}

// ---- Pétalo suelto, para la lluvia ----
function Petalo({ tono }) {
  const colores = {
    blush: ['#F7DED8', '#EDBFB6'],
    crema: ['#FBF2E6', '#EFDFC7'],
    rosa: ['#F6D2D2', '#E7ADAD'],
  };
  const [a, b] = colores[tono] || colores.blush;
  return (
    <svg viewBox="0 0 24 30" fill="none" className="w-full h-full" aria-hidden="true">
      <path d="M12 30 C3 22 0 12 4 5 C7 0 12 1 12 6 C12 1 17 0 20 5 C24 12 21 22 12 30 Z"
        fill={a} />
      <path d="M12 28 C7 21 5 13 7 8" stroke={b} strokeWidth="1" strokeLinecap="round" opacity="0.7" />
    </svg>
  );
}

/**
 * Lluvia de pétalos y margaritas sobre toda la web.
 * Capa fija: caen desde arriba a lo ancho de la pantalla y acompañan al
 * visitante mientras baja. No estorba el clic ni tapa el menú, y respeta
 * a quien pidió menos animaciones en su dispositivo.
 */
export function LluviaDePetalos({ cantidad = 20 }) {
  const [animar, setAnimar] = useState(true);

  useEffect(() => {
    const menosMovimiento =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (menosMovimiento) setAnimar(false);
  }, []);

  if (!animar) return null;

  const tonos = ['blush', 'crema', 'rosa'];
  // Valores fijos (no aleatorios) para que el resultado sea siempre el mismo.
  // Una de cada tres piezas es una margarita amarilla, y va algo más grande.
  const petalos = Array.from({ length: cantidad }, (_, i) => {
    const esMargarita = i % 3 === 0;
    return {
      izquierda: ((i * 37) % 100),
      tam: esMargarita ? 34 + ((i * 5) % 20) : 20 + ((i * 7) % 18),
      demora: (i * 0.9) % 12,
      caida: 12 + ((i * 5) % 7),
      vaiven: 3.5 + ((i * 3) % 4),
      giro: i % 2 === 0 ? 1 : -1,
      tono: tonos[i % tonos.length],
      opacidad: esMargarita ? 0.75 + ((i * 7) % 20) / 100 : 0.5 + ((i * 13) % 30) / 100,
      esMargarita,
    };
  });

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-[45] pointer-events-none overflow-hidden"
    >
      <style>{`
        @keyframes sc-caer {
          0%   { transform: translate3d(0, -15vh, 0); opacity: 0; }
          6%   { opacity: 1; }
          90%  { opacity: 1; }
          100% { transform: translate3d(0, 108vh, 0); opacity: 0; }
        }
        @keyframes sc-vaiven {
          0%, 100% { transform: translateX(-16px) rotate(0deg); }
          50%      { transform: translateX(16px) rotate(180deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          .sc-petalo, .sc-petalo > span { animation: none !important; }
        }
      `}</style>

      {petalos.map((p, i) => (
        <span
          key={i}
          className="sc-petalo absolute top-0"
          style={{
            left: `${p.izquierda}%`,
            width: `${p.tam}px`,
            height: `${p.esMargarita ? p.tam : p.tam * 1.25}px`,
            opacity: p.opacidad,
            animation: `sc-caer ${p.caida}s linear ${p.demora}s infinite`,
            willChange: 'transform',
          }}
        >
          <span
            className="block w-full h-full"
            style={{
              animation: `sc-vaiven ${p.vaiven}s ease-in-out ${p.demora}s infinite`,
              animationDirection: p.giro === 1 ? 'normal' : 'reverse',
              willChange: 'transform',
            }}
          >
            {p.esMargarita ? <Margarita /> : <Petalo tono={p.tono} />}
          </span>
        </span>
      ))}
    </div>
  );
}
