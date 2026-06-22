import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Crown, Star, Sparkles, ArrowRight, Calendar, UserPlus, Clock, Flame, Zap, ChevronLeft, ChevronRight } from 'lucide-react';
import { cardThemes, tierOrder } from '../lib/tierThemes';

const offers = [
  {
    title: 'Mirada Descansada',
    subtitle: 'Jalupro + HIFU',
    description: 'Mejora la calidad de la ojera, hidrata profundamente y aporta un aspecto más fresco y rejuvenecido.',
    discount: '-20%',
    tag: 'Más popular',
    icon: Flame,
    accent: 'from-amber-500 to-orange-600',
    accentBg: 'bg-amber-500',
    image: '/Imagenes/PROMOS JUNIO-14.jpg',
  },
  {
    title: 'Botox + HIFU + Limpieza Facial',
    description: 'Suaviza líneas de expresión, redefine y revitaliza tu piel. Combo completo de rejuvenecimiento.',
    discount: '-20%',
    tag: 'Top ventas',
    icon: Sparkles,
    accent: 'from-rose-500 to-pink-600',
    accentBg: 'bg-rose-500',
    image: '/Imagenes/PROMOS JUNIO-19.jpg',
  },
  {
    title: 'Contorno Perfecto',
    subtitle: 'Enzimas + HIFU + Limpieza Facial',
    description: 'Trabaja grasa localizada, reafirma y mejora la apariencia general del rostro.',
    discount: '-20%',
    tag: 'Oferta del mes',
    icon: Zap,
    accent: 'from-primary to-amber-700',
    accentBg: 'bg-primary',
    image: '/Imagenes/PROMOS JUNIO-20.jpg',
  },
];

const clubFeatures = [
  { icon: Star, text: '1 punto ShowClinic por cada S/ 1 en tratamientos' },
  { icon: Gift, text: 'Canjea puntos por descuento directo' },
  { icon: Calendar, text: '+3,000 pts de regalo en tu cumpleaños' },
  { icon: UserPlus, text: '+3,000 pts por referir un paciente' },
  { icon: Sparkles, text: '5 niveles: Bronce → Diamante' },
];

function OfferCard({ offer }) {
  const Icon = offer.icon;
  return (
    <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-0 items-stretch min-h-[400px]">
      {/* Image side */}
      <div className="relative overflow-hidden md:rounded-l-3xl">
        {offer.image ? (
          <>
            <img src={offer.image} alt={offer.title} className="w-full h-full object-cover min-h-[250px] md:min-h-full" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-accent/80 hidden md:block" />
            <div className="absolute inset-0 bg-gradient-to-t from-accent/80 via-transparent to-transparent md:hidden" />
          </>
        ) : (
          <div className={`w-full h-full min-h-[250px] bg-gradient-to-br ${offer.accent} opacity-30`} />
        )}
        {/* Discount badge on image */}
        <motion.div
          initial={{ rotate: -10, scale: 0.8 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ type: 'spring', damping: 12 }}
          className={`absolute top-5 right-5 w-24 h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-br ${offer.accent} flex flex-col items-center justify-center shadow-2xl ring-4 ring-white/20`}
        >
          <span className="text-white/70 text-[9px] font-semibold uppercase tracking-wider">Hasta</span>
          <span className="text-white text-3xl md:text-4xl font-black leading-none">{offer.discount.replace('-', '')}</span>
          <span className="text-white/70 text-[9px] font-semibold uppercase">Dcto.</span>
        </motion.div>
      </div>

      {/* Content side */}
      <div className="p-8 md:p-10 lg:p-12 flex flex-col justify-center">
        <div className="flex items-center gap-3 mb-5 flex-wrap">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.12em] text-white ${offer.accentBg}`}>
            <Icon className="w-3 h-3" />
            {offer.tag}
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 text-[10px] font-semibold uppercase tracking-wider text-white/60">
            <Clock className="w-3 h-3" />
            Hasta el 17 de junio
          </span>
        </div>

        <h3 className="font-serif text-3xl md:text-4xl font-bold text-white leading-[1.1] mb-2">
          {offer.title}
        </h3>
        {offer.subtitle && (
          <p className="text-white/70 text-[16px] font-semibold mb-4">{offer.subtitle}</p>
        )}

        <p className="text-white/50 text-[15px] leading-relaxed mb-8 max-w-lg">
          {offer.description}
        </p>

        <a
          href={`https://wa.me/51974212114?text=Hola%2C%20me%20interesa%20la%20oferta%3A%20${encodeURIComponent(offer.title)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-8 py-4 text-[13px] font-semibold uppercase tracking-[0.12em] text-accent bg-white rounded-full hover:bg-cream transition-colors duration-300 self-start"
        >
          Quiero esta oferta
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}

function ClubFeature({ icon: Icon, text }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
        <Icon className="w-3.5 h-3.5 text-primary-light" />
      </div>
      <span className="text-[14px] text-white/70 font-medium">{text}</span>
    </div>
  );
}

// Showcase membership card per tier — metallic design with diagonal striations
function TierCard({ name }) {
  const t = cardThemes[name];
  return (
    <div className="relative rounded-[1.2rem] overflow-hidden ring-1 ring-white/15 shadow-xl shadow-black/40 aspect-[1.6/1]" style={{ background: t.base }}>
      {/* Diagonal striations */}
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(115deg, rgba(255,255,255,0.07) 0px, rgba(255,255,255,0.07) 1px, transparent 1px, transparent 6px)' }} />
      <div className="absolute inset-0 pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'repeating-linear-gradient(115deg, rgba(0,0,0,0.18) 0px, rgba(0,0,0,0.18) 2px, transparent 2px, transparent 9px)' }} />
      {/* Sheen bloom */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(130% 90% at 78% 12%, ${t.glow} 0%, transparent 48%)` }} />
      {/* Diagonal glint */}
      <div className="absolute -top-1/4 -left-8 w-20 h-[150%] rotate-[20deg] blur-xl pointer-events-none" style={{ background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.4), transparent)' }} />
      {/* Logo watermark */}
      <img src="/Imagenes/logo-blanco.png" alt="" className="absolute -bottom-7 -right-6 w-32 h-32 opacity-[0.06] pointer-events-none select-none" />

      <div className="relative h-full flex flex-col justify-between p-5">
        {/* Top */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-1.5">
            <Crown className="w-3.5 h-3.5 text-white/70" />
            <span className="text-white/85 text-[10px] uppercase tracking-[0.2em] font-bold">ShowClinic Club</span>
          </div>
          <span className="font-serif text-base font-semibold text-white leading-none drop-shadow">{t.label}</span>
        </div>

        {/* Middle: discount */}
        <div>
          <p className="font-serif text-[2.6rem] font-bold text-white leading-none drop-shadow-sm">{t.canje}</p>
          <p className="text-white/60 text-[11px] uppercase tracking-[0.15em] font-medium mt-1">de descuento al canjear</p>
        </div>

        {/* Bottom: emblem + tier */}
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${t.chip} flex items-center justify-center shadow-lg ring-1 ring-white/40 flex-shrink-0`}>
            <img src="/Imagenes/logo-negro.png" alt="ShowClinic" className="w-6 h-6" />
          </div>
          <div>
            <p className="text-white text-[13px] font-semibold tracking-wide leading-tight">Nivel {name}</p>
            <p className="text-white/50 text-[10px] tracking-wide">{t.range}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OffersClub() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => setActive((p) => (p + 1) % offers.length), 6000);
    return () => clearInterval(timer);
  }, [paused]);

  const currentOffer = offers[active];

  return (
    <section className="bg-white">
      <div className="container-fluid py-20 md:py-28 2xl:py-36">
        {/* Offers — Hero Banner */}
        <div className="mb-20 md:mb-28">
          <div className="text-center max-w-2xl mx-auto mb-10 md:mb-14">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 border border-red-100 mb-6"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
              </span>
              <span className="text-[12px] font-bold uppercase tracking-[0.15em] text-red-600">
                Ofertas activas
              </span>
            </motion.div>
            <h2 className="font-serif font-semibold text-dark tracking-tight leading-[1.1] mb-4">
              Promociones del <span className="italic text-primary">mes</span>
            </h2>
            <p className="text-gray-500">
              Ofertas exclusivas por tiempo limitado en nuestros tratamientos más solicitados
            </p>
          </div>

          {/* Featured offer — large card */}
          <div
            className="relative max-w-5xl mx-auto mb-8 grid"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <AnimatePresence>
              <motion.div
                key={active}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
                style={{ gridArea: '1 / 1' }}
                className="relative overflow-hidden rounded-3xl bg-accent"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${currentOffer.accent} opacity-20`} />
                <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />
                <OfferCard offer={currentOffer} />
              </motion.div>
            </AnimatePresence>

            {/* Navigation arrows */}
            <button
              onClick={() => setActive((p) => (p - 1 + offers.length) % offers.length)}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center text-dark hover:bg-white transition-colors z-20"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setActive((p) => (p + 1) % offers.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center text-dark hover:bg-white transition-colors z-20"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Offer selector pills */}
          <div className="flex items-center justify-center gap-3 flex-wrap">
            {offers.map((offer, i) => {
              const Icon = offer.icon;
              return (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[13px] font-medium transition-all duration-300 ${
                    active === i
                      ? 'bg-accent text-white shadow-lg'
                      : 'bg-cream text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {offer.title}
                  <span className={`text-[11px] font-bold ml-1 ${active === i ? 'text-primary-light' : 'text-primary'}`}>
                    {offer.discount}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ShowClinic Club — Premium Banner */}
        <div className="relative">
          {/* Top accent strip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10 md:mb-14"
          >
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent/5 border border-primary/15 mb-6">
              <Crown className="w-4 h-4 text-primary" />
              <span className="text-[12px] font-bold uppercase tracking-[0.15em] text-primary">
                Programa exclusivo
              </span>
            </div>
            <h2 className="font-serif font-semibold text-dark tracking-tight leading-[1.1] mb-3">
              ShowClinic <span className="italic text-primary">Club</span>
            </h2>
            <p className="text-gray-500 max-w-lg mx-auto">
              Tu fidelidad tiene recompensa. Gana puntos en cada visita y canjéalos por descuentos exclusivos.
            </p>
          </motion.div>

          {/* Main banner */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-3xl bg-accent"
          >
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/15 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />

            {/* Hero section */}
            <div className="relative z-10 px-8 pt-12 pb-6 md:px-14 md:pt-16 md:pb-8 text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', damping: 15, delay: 0.2 }}
                className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary to-amber-700 shadow-2xl mb-6"
              >
                <Crown className="w-9 h-9 text-white" />
              </motion.div>

              <h3 className="font-serif text-3xl md:text-5xl font-bold text-white leading-[1.1] mb-4">
                Cada tratamiento te <br className="hidden md:block" />
                <span className="text-primary-light italic">acerca a más beneficios</span>
              </h3>

              <p className="text-white/45 text-[15px] md:text-base max-w-2xl mx-auto mb-4">
                Por cada S/ 1 que inviertes en tu belleza, ganas 1 punto ShowClinic.
                Sube de nivel y tus puntos valen más — hasta un 7% de descuento directo.
              </p>

              {/* Big stat */}
              <div className="flex items-center justify-center gap-8 md:gap-16 my-10">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="text-center"
                >
                  <p className="font-serif text-5xl md:text-6xl font-black text-white">S/1</p>
                  <p className="text-white/40 text-[11px] uppercase tracking-wider mt-1">= 1 punto</p>
                </motion.div>
                <div className="w-px h-16 bg-white/10" />
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="text-center"
                >
                  <p className="font-serif text-5xl md:text-6xl font-black text-primary-light">7%</p>
                  <p className="text-white/40 text-[11px] uppercase tracking-wider mt-1">Máximo descuento</p>
                </motion.div>
                <div className="w-px h-16 bg-white/10" />
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                  className="text-center"
                >
                  <p className="font-serif text-5xl md:text-6xl font-black text-white">5</p>
                  <p className="text-white/40 text-[11px] uppercase tracking-wider mt-1">Niveles</p>
                </motion.div>
              </div>
            </div>

            {/* Tier membership cards showcase */}
            <div className="relative z-10 px-6 md:px-14 pb-6">
              <p className="text-center text-white/40 text-[11px] uppercase tracking-[0.18em] font-semibold mb-5">Tu tarjeta evoluciona con cada nivel</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {tierOrder.map((name, i) => (
                  <motion.div
                    key={name}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.15 + i * 0.08 }}
                    whileHover={{ y: -5 }}
                  >
                    <TierCard name={name} />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Benefits row + CTA */}
            <div className="relative z-10 px-6 md:px-14 pb-10 md:pb-14 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                {/* Benefits */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {clubFeatures.map((item, i) => (
                    <ClubFeature key={i} icon={item.icon} text={item.text} />
                  ))}
                </div>

                {/* CTA */}
                <div className="flex flex-col items-center md:items-end gap-4">
                  <a
                    href="https://wa.me/51974212114?text=Hola%2C%20quiero%20saber%20más%20sobre%20ShowClinic%20Club"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-10 py-4.5 text-[13px] font-bold uppercase tracking-[0.12em] text-accent bg-white rounded-full hover:bg-cream shadow-xl hover:shadow-2xl transition-all duration-300"
                  >
                    Quiero unirme al Club
                    <ArrowRight className="w-4 h-4" />
                  </a>
                  <p className="text-white/25 text-[11px]">Inscripción gratuita · Empieza a ganar desde tu primera visita</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
