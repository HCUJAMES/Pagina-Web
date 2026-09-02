import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Crown, Star, Sparkles, ArrowRight, Calendar, UserPlus, Clock, Flame, Zap, ChevronLeft, ChevronRight } from 'lucide-react';
import { cardThemes, tierOrder } from '../lib/tierThemes';

// Promociones de la semana — válidas hasta el 6 de septiembre
const VIGENCIA = 'Hasta el 6 de septiembre';

// Estas promos regalan un tratamiento adicional (no son descuento en %)
const offers = [
  {
    title: 'Bótox Week',
    regalo: 'HIFU',
    description: 'Suaviza tus líneas de expresión y llévate una sesión de HIFU de regalo para tensar la piel.',
    tag: 'Más solicitada',
    icon: Star,
    accentBg: 'bg-amber-500',
    image: '/Imagenes/promo-sep-botox.jpg',
  },
  {
    title: 'Armonización Week',
    regalo: 'Peeling Hollywood',
    description: 'Equilibra las proporciones de tu rostro y suma un Peeling Hollywood sin costo para una piel luminosa.',
    tag: 'Combo estrella',
    icon: Sparkles,
    accentBg: 'bg-primary',
    image: '/Imagenes/promo-sep-armonizacion.jpg',
  },
  {
    title: 'Labios Week',
    regalo: 'HIFU + Dermo Exfoliación',
    description: 'Define tus labios y recibe dos regalos: una sesión de HIFU y una dermo exfoliación facial.',
    tag: 'Doble regalo',
    icon: Gift,
    accentBg: 'bg-rose-600',
    image: '/Imagenes/promo-sep-labios.jpg',
  },
];

const clubFeatures = [
  { icon: Star, text: '1 punto Showclinic por cada S/ 1 en tratamientos' },
  { icon: Gift, text: 'Canjea puntos por descuento directo' },
  { icon: Calendar, text: '+3,000 pts de regalo en tu cumpleaños' },
  { icon: UserPlus, text: '+3,000 pts por referir un paciente' },
  { icon: Sparkles, text: '5 niveles: Bronce → Diamante' },
];

// Filete dorado decorativo
function GoldRibbon({ className = '' }) {
  return (
    <div className={`h-1 w-full bg-gradient-to-r from-primary via-primary-light to-primary ${className}`} aria-hidden="true" />
  );
}

// Videos de resultados que acompañan a las promociones
const videos = [
  { title: 'Armonización facial', src: '/videos/showclinic-video-1.mp4', poster: '/videos/poster-1.jpg' },
  { title: 'Diseño de labios', src: '/videos/showclinic-video-2.mp4', poster: '/videos/poster-2.jpg' },
];

// Se reproduce solo (sin sonido, en bucle) cuando entra en pantalla,
// y se pausa al salir para no gastar datos ni batería del paciente.
function VideoPromo({ src, poster, title }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') return;

    const io = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          el.play().catch(() => { /* si el navegador lo bloquea, queda la portada */ });
        } else {
          el.pause();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <figure className="group relative">
      <div className="relative rounded-2xl overflow-hidden ring-1 ring-primary/30 shadow-[0_18px_45px_-12px_rgba(0,0,0,0.55)] aspect-[9/16] bg-dark">
        <video
          ref={ref}
          src={src}
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-label={`Resultado en video: ${title}`}
          className="w-full h-full object-cover"
        />
        {/* Velo inferior para que el rótulo se lea siempre */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/75 to-transparent pointer-events-none" />
        <figcaption className="absolute bottom-3.5 inset-x-4 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-primary-light flex-shrink-0" />
          <span className="text-white text-[12.5px] font-semibold tracking-wide drop-shadow">
            {title}
          </span>
        </figcaption>
      </div>
    </figure>
  );
}

function OfferCard({ offer }) {
  const Icon = offer.icon;
  return (
    <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-0 items-stretch">
      {/* Image side — promoción completa, sin recortar */}
      <div className="relative flex items-center justify-center p-5 sm:p-6 md:p-7 md:rounded-l-3xl bg-gradient-to-br from-white via-cream to-[#F2EBE2]">
        {/* Marco premium con brillo */}
        <div className="relative group w-full max-w-[540px]">
          <div className="absolute -inset-2 rounded-[1.6rem] bg-gradient-to-br from-primary/25 via-transparent to-primary-light/20 blur-xl opacity-70" />
          <div className="relative overflow-hidden rounded-[1.25rem] ring-1 ring-black/[0.06] shadow-[0_18px_45px_-12px_rgba(0,0,0,0.35)]">
            <img
              src={offer.image}
              alt={`Promoción ${offer.title} — ${offer.regalo} gratis`}
              className="w-full h-auto block transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              loading="lazy"
              width="1000"
              height="1000"
            />
            {/* Brillo diagonal al pasar el cursor */}
            <div className="absolute -top-1/3 -left-1/4 w-1/3 h-[180%] rotate-[18deg] bg-gradient-to-r from-transparent via-white/35 to-transparent blur-md opacity-0 group-hover:opacity-100 group-hover:translate-x-[380%] transition-all duration-[1100ms] ease-out pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Content side */}
      <div className="relative p-8 md:p-11 lg:p-14 flex flex-col justify-center">
        <div className="flex items-center gap-3 mb-5 flex-wrap">
          <span className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[11px] font-bold uppercase tracking-[0.12em] text-white shadow-lg ${offer.accentBg}`}>
            <Icon className="w-3 h-3" />
            {offer.tag}
          </span>
          <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/10 ring-1 ring-white/15 text-[11px] font-semibold uppercase tracking-wider text-white/75">
            <Clock className="w-3 h-3" />
            {VIGENCIA}
          </span>
        </div>

        <h3 className="font-serif text-4xl md:text-5xl font-bold text-white leading-[1.05] mb-5">
          {offer.title}
        </h3>

        {/* El regalo es el protagonista */}
        <div className="relative inline-flex flex-col self-start rounded-2xl bg-white/[0.07] ring-1 ring-primary/40 px-6 py-5 mb-7 overflow-hidden">
          <GoldRibbon className="absolute top-0 inset-x-0" />
          <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.22em] text-primary-light font-bold mb-2">
            <Gift className="w-3 h-3" />
            Te regalamos
          </span>
          <span className="font-serif text-[2rem] md:text-[2.6rem] font-bold leading-[1.05] bg-gradient-to-br from-white via-primary-light to-primary bg-clip-text text-transparent">
            {offer.regalo}
          </span>
          <span className="text-[13px] md:text-[14px] uppercase tracking-[0.3em] text-white font-black mt-1.5">
            Gratis
          </span>
        </div>

        <p className="text-white/75 text-[16px] md:text-[17px] leading-relaxed mb-9 max-w-lg">
          {offer.description}
        </p>

        <a
          href={`https://wa.me/51974212114?text=${encodeURIComponent(`Hola, vengo de la página web y me interesa la promoción ${offer.title} (con ${offer.regalo} gratis)`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-9 py-4.5 text-[14px] font-bold uppercase tracking-[0.12em] text-accent bg-white rounded-full hover:bg-cream transition-colors duration-300 self-start"
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
      <img src="/Imagenes/logo-blanco.png" alt="" className="absolute -bottom-7 -right-6 w-32 h-32 opacity-[0.06] pointer-events-none select-none" loading="lazy" decoding="async" />

      <div className="relative h-full flex flex-col justify-between p-5">
        {/* Top */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-1.5">
            <Crown className="w-3.5 h-3.5 text-white/70" />
            <span className="text-white/85 text-[10px] uppercase tracking-[0.2em] font-bold">Showclinic Club</span>
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
            <img src="/Imagenes/logo-negro.png" alt="Showclinic" className="w-6 h-6" loading="lazy" decoding="async" />
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
    <section id="promociones" className="scroll-mt-24">
      {/* ===== BANDA DE PROMOCIONES DE LA SEMANA ===== */}
      <div className="relative overflow-hidden bg-[#2A2320]">
        {/* Profundidad y textura cálida */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#3D342E] via-[#2A2320] to-[#1a1512]" />
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'repeating-linear-gradient(115deg, #fff 0px, #fff 1px, transparent 1px, transparent 9px)' }} />
        <div className="absolute -top-40 left-1/4 w-[38rem] h-[38rem] bg-primary/20 rounded-full blur-[110px] pointer-events-none" />
        <div className="absolute -bottom-52 right-0 w-[34rem] h-[34rem] bg-primary-light/10 rounded-full blur-[120px] pointer-events-none" />
        {/* Filetes dorados arriba y abajo */}
        <GoldRibbon className="absolute top-0 inset-x-0 z-10" />
        <GoldRibbon className="absolute bottom-0 inset-x-0 z-10 opacity-60" />

        <div className="container-fluid pt-20 md:pt-28 2xl:pt-32 pb-28 md:pb-40 relative">
        <div className="">
          <div className="text-center max-w-3xl mx-auto mb-10 md:mb-14">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/12 ring-1 ring-white/25 backdrop-blur-sm mb-7"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-300 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-300" />
              </span>
              <span className="text-[12px] md:text-[13px] font-bold uppercase tracking-[0.18em] text-white">
                Ofertas activas
              </span>
            </motion.div>

            <h2 className="font-serif font-semibold text-white tracking-tight leading-[1.12] mb-6 drop-shadow-sm">
              Promociones de la{' '}
              <span className="italic text-[#F4C77B]">semana</span>
            </h2>

            {/* Cinta carmesí bajo el título */}
            <div className="flex items-center justify-center gap-2 mb-5">
              <span className="h-px w-14 bg-gradient-to-r from-transparent to-white/40" />
              <span className="px-4 py-1 rounded-full bg-white/10 ring-1 ring-white/20 text-[10px] uppercase tracking-[0.25em] text-white/80 font-bold">Solo esta semana</span>
              <span className="h-px w-14 bg-gradient-to-l from-transparent to-white/40" />
            </div>

            <p className="text-white/75 text-[15px] md:text-[17px]">
              Reserva tu tratamiento y llévate <span className="font-bold text-[#F4C77B]">otro de regalo</span> · {VIGENCIA}
            </p>
          </div>

          {/* Featured offer — large card */}
          <div
            className="relative max-w-[1240px] mx-auto mb-12 grid"
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
                className="relative overflow-hidden rounded-3xl bg-accent ring-1 ring-white/10 shadow-[0_30px_70px_-25px_rgba(0,0,0,0.55)]"
              >
                {/* Cinta carmesí superior */}
                <GoldRibbon className="absolute top-0 left-0 right-0 z-20 opacity-90" />
                <div className={`absolute inset-0 bg-gradient-to-br ${currentOffer.accent} opacity-20`} />
                <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />
                <OfferCard offer={currentOffer} />
              </motion.div>
            </AnimatePresence>

            {/* Navigation arrows */}
            <button
              onClick={() => setActive((p) => (p - 1 + offers.length) % offers.length)}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/95 shadow-xl flex items-center justify-center text-dark hover:bg-white hover:scale-105 transition-all z-20"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => setActive((p) => (p + 1) % offers.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/95 shadow-xl flex items-center justify-center text-dark hover:bg-white hover:scale-105 transition-all z-20"
            >
              <ChevronRight className="w-6 h-6" />
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
                  className={`group inline-flex items-center gap-2.5 pl-5 pr-2.5 py-3 rounded-full text-[13.5px] font-semibold transition-all duration-300 ${
                    active === i
                      ? 'bg-white text-accent shadow-2xl ring-2 ring-primary/50 scale-[1.06]'
                      : 'bg-white/12 text-white/85 ring-1 ring-white/20 hover:bg-white/22 hover:text-white backdrop-blur-sm'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 transition-colors ${active === i ? 'text-primary' : 'text-white/70'}`} />
                  {offer.title}
                  <span className={`text-[11px] font-bold px-2 py-1 rounded-full transition-colors ${
                    active === i ? 'bg-primary text-white' : 'bg-white/20 text-white group-hover:bg-white/30'
                  }`}>
                    + {offer.regalo}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Resultados en video de estas promociones */}
          <div className="max-w-4xl mx-auto mt-16 md:mt-20">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-3">
                <span className="h-px w-12 bg-gradient-to-r from-transparent to-primary/50" />
                <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary-light">
                  Resultados reales
                </span>
                <span className="h-px w-12 bg-gradient-to-l from-transparent to-primary/50" />
              </div>
              <p className="text-white/65 text-[15px]">
                Mira el antes y después de nuestras pacientes
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-7 sm:gap-8 max-w-[360px] sm:max-w-3xl mx-auto">
              {videos.map((v, i) => (
                <motion.div
                  key={v.src}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.12 }}
                >
                  <VideoPromo src={v.src} poster={v.poster} title={v.title} />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
        </div>
      </div>

      {/* ===== SHOWCLINIC CLUB (fondo claro) ===== */}
      <div className="bg-white">
        <div className="container-fluid py-20 md:py-28 2xl:py-36">
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
              Showclinic <span className="italic text-primary">Club</span>
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
                Por cada S/ 1 que inviertes en tu belleza, ganas 1 punto Showclinic.
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
                    href="https://wa.me/51974212114?text=Hola%2C%20vengo%20de%20la%20p%C3%A1gina%20web%20y%20quiero%20saber%20m%C3%A1s%20sobre%20Showclinic%20Club"
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
      </div>
    </section>
  );
}
