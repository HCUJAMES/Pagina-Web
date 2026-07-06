import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Star, Crown, Gift, Calendar, Check, ArrowRight, ArrowLeft } from 'lucide-react';

export default function WelcomeTour({ name, onFinish }) {
  const first = (name || '').split(' ')[0] || '';
  const slides = [
    { icon: Sparkles, color: 'from-amber-500 to-orange-600', title: `¡Bienvenido/a al Showclinic Club!`, text: `Hola ${first}, ya eres parte de nuestro programa de fidelización. En unos pasos te contamos cómo aprovecharlo.` },
    { icon: Star, color: 'from-primary to-amber-700', title: '1. Gana puntos', text: 'Por cada S/ 1 que inviertes en tus tratamientos, ganas 1 punto Showclinic. ¡Así de fácil!' },
    { icon: Crown, color: 'from-yellow-500 to-amber-600', title: '2. Sube de nivel', text: 'Hay 5 niveles: Bronce, Plata, Oro, Platinium y Diamante. Mientras más acumulas, más alto tu nivel y mejores tus beneficios.' },
    { icon: Gift, color: 'from-rose-500 to-pink-600', title: '3. Canjea por descuentos', text: 'Usa tus puntos como descuento directo en tus tratamientos (hasta 7%). Y lo mejor: tu nivel se mantiene aunque canjees.' },
    { icon: Calendar, color: 'from-violet-500 to-purple-600', title: '4. Bonos de regalo', text: 'Recibe puntos extra de regalo en tu cumpleaños 🎂 y por cada persona que refieras 👥.' },
    { icon: Check, color: 'from-emerald-500 to-teal-600', title: `¡Todo listo, ${first}!`, text: 'Empieza a acumular puntos en tu próxima visita. Bienvenido/a al Club. 💛' },
  ];
  const [step, setStep] = useState(0);
  const isLast = step === slides.length - 1;
  const s = slides[step];
  const Icon = s.icon;

  return (
    <div className="text-center">
      {/* Progreso */}
      <div className="flex items-center justify-center gap-1.5 mb-8">
        {slides.map((_, i) => (
          <span key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? 'w-6 bg-primary' : i < step ? 'w-1.5 bg-primary/40' : 'w-1.5 bg-gray-200'}`} />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.3 }}
        >
          <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${s.color} flex items-center justify-center mx-auto mb-6 shadow-lg`}>
            <Icon className="w-9 h-9 text-white" />
          </div>
          <h3 className="font-serif text-2xl font-semibold text-dark mb-3 px-2">{s.title}</h3>
          <p className="text-gray-500 text-[15px] leading-relaxed px-2 min-h-[72px]">{s.text}</p>
        </motion.div>
      </AnimatePresence>

      {/* Controles */}
      <div className="flex items-center gap-3 mt-8">
        {step > 0 && (
          <button onClick={() => setStep(step - 1)}
            className="inline-flex items-center justify-center gap-2 px-5 py-3.5 text-[13px] font-semibold text-gray-500 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Atrás
          </button>
        )}
        {!isLast ? (
          <button onClick={() => setStep(step + 1)}
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 text-[13px] font-semibold uppercase tracking-wider text-white bg-accent rounded-xl hover:bg-dark transition-colors">
            Siguiente <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button onClick={onFinish}
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 text-[13px] font-semibold uppercase tracking-wider text-white bg-primary rounded-xl hover:bg-primary-dark transition-colors">
            Entrar a mi cuenta <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {!isLast && (
        <button onClick={onFinish} className="mt-4 text-[13px] text-gray-400 hover:text-gray-600 transition-colors">
          Saltar recorrido
        </button>
      )}
    </div>
  );
}
