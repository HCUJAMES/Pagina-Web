import { useState } from 'react';
import { motion } from 'framer-motion';
import { PartyPopper, Sparkles, Crown, Gift, Cake, Trophy, ArrowRight, ArrowLeft } from 'lucide-react';

const slides = [
  { icon: PartyPopper, grad: 'from-amber-400 via-primary to-amber-700', glow: 'bg-amber-400/40', title: (f) => `¡Bienvenido/a al Club${f ? ', ' + f : ''}!`, text: 'Acabas de unirte al programa de fidelización de Showclinic. Te mostramos en unos pasos todo lo que ganas. ✨' },
  { icon: Sparkles, grad: 'from-primary to-amber-700', glow: 'bg-primary/40', title: () => '1. Gana puntos', text: 'Por cada S/ 1 que inviertes en tus tratamientos, ganas 1 punto Showclinic. ¡Cada visita suma!' },
  { icon: Crown, grad: 'from-yellow-400 to-amber-600', glow: 'bg-yellow-400/40', title: () => '2. Sube de nivel', text: 'Avanza por 5 niveles — Bronce, Plata, Oro, Platinium y Diamante. Mientras más acumulas, mejores tus beneficios.' },
  { icon: Gift, grad: 'from-rose-400 to-pink-600', glow: 'bg-rose-400/40', title: () => '3. Canjea por descuentos', text: 'Convierte tus puntos en descuento directo (hasta 7%). Y lo mejor: tu nivel se mantiene aunque canjees.' },
  { icon: Cake, grad: 'from-violet-400 to-purple-600', glow: 'bg-violet-400/40', title: () => '4. Bonos de regalo', text: 'Recibe puntos extra de regalo en tu cumpleaños 🎂 y por cada persona que refieras a Showclinic.' },
  { icon: Trophy, grad: 'from-emerald-400 to-teal-600', glow: 'bg-emerald-400/40', title: (f) => `¡Todo listo${f ? ', ' + f : ''}!`, text: 'Empieza a acumular puntos en tu próxima visita. Bienvenido/a al Showclinic Club. 💛' },
];

const sparkles = [
  { top: '-6%', left: '10%', d: 2.4, delay: 0 },
  { top: '4%', left: '86%', d: 2.9, delay: 0.4 },
  { top: '78%', left: '-4%', d: 2.2, delay: 0.8 },
  { top: '84%', left: '92%', d: 3.1, delay: 0.2 },
  { top: '40%', left: '104%', d: 2.6, delay: 1 },
];

export default function WelcomeTour({ name, onFinish }) {
  const first = (name || '').split(' ')[0] || '';
  const [step, setStep] = useState(0);
  const isLast = step === slides.length - 1;
  const s = slides[step];
  const Icon = s.icon;

  return (
    <div className="relative text-center">
      {/* Progreso */}
      <div className="flex items-center justify-center gap-1.5 mb-9">
        {slides.map((_, i) => (
          <span key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? 'w-7 bg-primary' : i < step ? 'w-1.5 bg-primary/40' : 'w-1.5 bg-gray-200'}`} />
        ))}
      </div>

      <motion.div key={step} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
          {/* Icono con brillo + destellos */}
          <div className="relative w-28 h-28 mx-auto mb-7">
            <motion.div
              className={`absolute inset-0 rounded-full ${s.glow} blur-2xl`}
              animate={{ scale: [1, 1.25, 1], opacity: [0.6, 0.3, 0.6] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              initial={{ scale: 0.4, opacity: 0, rotate: -12 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ type: 'spring', damping: 11, stiffness: 190 }}
              className={`relative w-28 h-28 rounded-[2rem] bg-gradient-to-br ${s.grad} flex items-center justify-center shadow-xl shadow-black/10 ring-1 ring-white/40`}
            >
              {/* brillo diagonal */}
              <div className="absolute inset-0 rounded-[2rem] overflow-hidden pointer-events-none">
                <div className="absolute -top-1/2 -left-1/4 w-1/2 h-[200%] bg-white/25 rotate-12 blur-md" />
              </div>
              <Icon className="w-12 h-12 text-white drop-shadow relative" strokeWidth={1.8} />
            </motion.div>
            {/* destellos flotantes */}
            {sparkles.map((sp, i) => (
              <motion.span
                key={i}
                className="absolute w-2 h-2 rounded-full bg-primary-light"
                style={{ top: sp.top, left: sp.left }}
                animate={{ opacity: [0, 1, 0], scale: [0, 1, 0], y: [0, -6, 0] }}
                transition={{ duration: sp.d, repeat: Infinity, delay: sp.delay, ease: 'easeInOut' }}
              />
            ))}
          </div>

          <h3 className="font-serif text-[26px] leading-tight font-bold text-dark mb-3 px-2">{s.title(first)}</h3>
          <p className="text-gray-500 text-[15px] leading-relaxed px-3 min-h-[72px]">{s.text}</p>
      </motion.div>

      {/* Controles */}
      <div className="flex items-center gap-3 mt-9">
        {step > 0 && (
          <motion.button whileTap={{ scale: 0.96 }} onClick={() => setStep(step - 1)}
            className="inline-flex items-center justify-center gap-2 px-5 py-4 text-[13px] font-semibold text-gray-500 bg-gray-100 rounded-2xl hover:bg-gray-200 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </motion.button>
        )}
        {!isLast ? (
          <motion.button whileTap={{ scale: 0.97 }} onClick={() => setStep(step + 1)}
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 text-[13px] font-bold uppercase tracking-[0.1em] text-white bg-gradient-to-r from-accent to-dark rounded-2xl shadow-lg shadow-accent/20 hover:shadow-xl transition-all">
            {step === 0 ? 'Empezar' : 'Siguiente'} <ArrowRight className="w-4 h-4" />
          </motion.button>
        ) : (
          <motion.button whileTap={{ scale: 0.97 }} onClick={onFinish}
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 text-[13px] font-bold uppercase tracking-[0.1em] text-white bg-gradient-to-r from-primary to-amber-700 rounded-2xl shadow-lg shadow-primary/25 hover:shadow-xl transition-all">
            Entrar a mi cuenta <ArrowRight className="w-4 h-4" />
          </motion.button>
        )}
      </div>

      {!isLast && (
        <button onClick={onFinish} className="mt-4 text-[12px] text-gray-300 hover:text-gray-500 transition-colors">
          Saltar
        </button>
      )}
    </div>
  );
}
