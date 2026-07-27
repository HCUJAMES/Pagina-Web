import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Gift, Star, Sparkles, X, User, ChevronDown, LogOut, Trophy, Calendar, UserPlus, MessageSquare, Gem, TrendingUp, ArrowRight } from 'lucide-react';
import { cardThemes } from '../lib/tierThemes';
import { supabase } from '../lib/supabase';

const levels = [
  { name: 'Bronce', icon: 'I', min: 0, next: 5000, canje: 3, gradient: 'from-amber-700 to-amber-500', glow: 'shadow-amber-500/20', ring: 'ring-amber-400/30', text: 'text-amber-700', bg: 'bg-amber-50' },
  { name: 'Plata', icon: 'II', min: 5000, next: 10000, canje: 4, gradient: 'from-gray-500 to-gray-400', glow: 'shadow-gray-400/20', ring: 'ring-gray-400/30', text: 'text-gray-500', bg: 'bg-gray-50' },
  { name: 'Oro', icon: 'III', min: 10000, next: 20000, canje: 5, gradient: 'from-yellow-600 to-yellow-400', glow: 'shadow-yellow-500/20', ring: 'ring-yellow-400/30', text: 'text-yellow-600', bg: 'bg-yellow-50' },
  { name: 'Platinium', icon: 'IV', min: 20000, next: 30000, canje: 6, gradient: 'from-violet-600 to-violet-400', glow: 'shadow-violet-500/20', ring: 'ring-violet-400/30', text: 'text-violet-500', bg: 'bg-violet-50' },
  { name: 'Diamante', icon: 'V', min: 30000, next: null, canje: 7, gradient: 'from-blue-500 to-cyan-400', glow: 'shadow-blue-500/20', ring: 'ring-blue-400/30', text: 'text-blue-500', bg: 'bg-blue-50' },
];

function getLevel(points) {
  for (let i = levels.length - 1; i >= 0; i--) {
    if (points >= levels[i].min) return levels[i];
  }
  return levels[0];
}

// Normaliza los datos del paciente para que nunca falten campos (evita pantallas en blanco)
function normalizar(data) {
  if (!data || !data.id) return null;
  return {
    ...data,
    id: data.id,
    name: data.name || 'Cliente',
    points: Number(data.points) || 0,
    lastName: data.last_name || '',
    pointsHistory: Array.isArray(data.points_history) ? data.points_history : [],
  };
}

export default function ClientAccountBar({ session, onLogout }) {
  const [client, setClient] = useState(null);
  const [showPanel, setShowPanel] = useState(false);
  const [ganados, setGanados] = useState(0);

  useEffect(() => {
    const base = normalizar(session.client);
    if (base) setClient(base);

    // Consulta los puntos reales al abrir, para que el paciente vea
    // de inmediato lo que la clínica le cargó. Si la función aún no
    // existe en la base, se mantiene lo guardado en la sesión.
    let cancelado = false;
    const refrescar = async () => {
      if (!session.token || !session.id) return;
      try {
        const { data, error } = await supabase.rpc('refresh_client', {
          p_id: session.id,
          p_token: session.token,
        });
        if (cancelado || error || !data) return;
        const fresco = normalizar(data);
        if (!fresco) return;
        setClient(fresco);

        // Aviso de puntos nuevos desde la última vez que miró
        const clave = `showclinic_pts_${fresco.id}`;
        const previo = Number(localStorage.getItem(clave));
        if (Number.isFinite(previo) && fresco.points > previo) {
          setGanados(fresco.points - previo);
        }
        localStorage.setItem(clave, String(fresco.points));
      } catch { /* se mantiene lo de la sesión */ }
    };
    refrescar();
    // Vuelve a consultar cuando el paciente regresa a la pestaña
    const alVolver = () => { if (document.visibilityState === 'visible') refrescar(); };
    document.addEventListener('visibilitychange', alVolver);
    return () => { cancelado = true; document.removeEventListener('visibilitychange', alVolver); };
  }, [session]);

  if (!client) return null;

  // Solo entradas válidas (evita crasheos si el historial tiene datos incompletos)
  const history = (client.pointsHistory || []).filter(e => e && typeof e === 'object');
  const totalEarned = history.filter(e => e.type === 'add' && !e.voided).reduce((sum, e) => sum + (Number(e.amount) || 0), 0) || client.points;
  const level = getLevel(totalEarned);
  const progress = level.next ? ((totalEarned - level.min) / (level.next - level.min)) * 100 : 100;
  const canjeValue = (client.points / 100) * level.canje;
  const levelIndex = levels.indexOf(level);
  const theme = cardThemes[level.name] || cardThemes.Bronce;
  const socioNumber = String(50000000 + client.id);
  const fullName = `${client.name} ${client.lastName || ''}`.trim().toUpperCase();

  return (
    <>
      {/* Barra de cuenta — visible y con el color de su nivel */}
      <motion.div
        initial={{ y: -60 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', damping: 22, stiffness: 260 }}
        className="fixed top-0 left-0 right-0 z-[60] text-white overflow-hidden"
      >
        {/* Fondo: base oscura + tinte metálico del nivel */}
        <div className="absolute inset-0 bg-accent" />
        <div className={`absolute inset-0 bg-gradient-to-r ${level.gradient} opacity-[0.28]`} />
        <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: 'repeating-linear-gradient(115deg, rgba(255,255,255,0.9) 0px, rgba(255,255,255,0.9) 1px, transparent 1px, transparent 7px)' }} />
        <div className="absolute -top-10 right-1/4 w-72 h-24 bg-white/10 blur-3xl rounded-full pointer-events-none" />
        {/* Filo inferior dorado */}
        <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-primary-light to-transparent" />

        <div className="container-fluid relative">
          <div className="flex items-center justify-between gap-3 h-16 md:h-20">

            {/* Identidad del socio */}
            <button
              onClick={() => setShowPanel(true)}
              className="flex items-center gap-3 md:gap-4 min-w-0 text-left group"
              title="Ver mi cuenta"
            >
              <div className="relative flex-shrink-0">
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-gradient-to-br ${level.gradient} flex items-center justify-center ring-2 ring-white/25 shadow-lg ${level.glow} group-hover:ring-white/50 transition-all`}>
                  <span className="font-serif text-[15px] md:text-[17px] font-bold text-white drop-shadow">
                    {client.name.charAt(0)}{(client.lastName || '').charAt(0)}
                  </span>
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 md:w-4.5 md:h-4.5 rounded-full bg-green-500 ring-2 ring-accent flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                </span>
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <Crown className="w-3 h-3 text-primary-light flex-shrink-0" />
                  <span className="text-[9px] md:text-[10px] uppercase tracking-[0.18em] text-white/60 font-semibold truncate">
                    Showclinic Club
                  </span>
                </div>
                <p className="font-serif text-[15px] md:text-[19px] font-semibold leading-tight truncate">
                  Hola, {client.name.split(' ')[0]}
                </p>
              </div>

              <span className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/12 ring-1 ring-white/20 text-[10px] md:text-[11px] font-bold uppercase tracking-wider flex-shrink-0 ${level.text === 'text-gray-500' ? 'text-white' : 'text-white'}`}>
                <Gem className="w-3 h-3 text-primary-light" />
                Socio {level.name}
              </span>
            </button>

            {/* Puntos y canje */}
            <div className="flex items-center gap-3 md:gap-5 flex-shrink-0">
              <div className="text-right">
                <p className="text-[9px] md:text-[10px] uppercase tracking-[0.16em] text-white/55 font-semibold leading-none mb-1">
                  Tus puntos
                </p>
                <div className="flex items-baseline gap-1.5 justify-end">
                  <span className="font-serif text-[19px] md:text-[26px] font-bold leading-none text-primary-light">
                    {client.points.toLocaleString()}
                  </span>
                  <span className="text-[10px] md:text-[11px] text-white/50 font-semibold">pts</span>
                </div>
              </div>

              <div className="hidden lg:block text-right pl-5 border-l border-white/15">
                <p className="text-[10px] uppercase tracking-[0.16em] text-white/55 font-semibold leading-none mb-1">
                  Vale
                </p>
                <span className="text-[17px] font-bold leading-none">S/ {canjeValue.toFixed(0)}</span>
              </div>

              {ganados > 0 && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={() => { setShowPanel(true); setGanados(0); }}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-green-500/25 text-green-200 ring-1 ring-green-400/40 text-[11px] font-bold hover:bg-green-500/40 transition-colors"
                  title="Ver tus movimientos"
                >
                  <Sparkles className="w-3 h-3" />
                  +{ganados.toLocaleString()}
                </motion.button>
              )}

              <button
                onClick={() => setShowPanel(true)}
                className="inline-flex items-center gap-2 px-3.5 md:px-5 py-2 md:py-2.5 rounded-full bg-white text-accent text-[11px] md:text-[12px] font-bold uppercase tracking-[0.1em] hover:bg-cream transition-colors shadow-lg"
              >
                <User className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Mi cuenta</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-50" />
              </button>

              <button
                onClick={onLogout}
                className="p-2 md:p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors flex-shrink-0"
                title="Cerrar sesión"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Profile slide-out panel */}
      <AnimatePresence>
        {showPanel && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[70] bg-dark/50 backdrop-blur-sm" onClick={() => setShowPanel(false)} />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 z-[80] w-full max-w-md bg-cream shadow-2xl overflow-y-auto"
            >
              {/* Hero header with gradient */}
              <div className="relative overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${level.gradient} opacity-90`} />
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2" />

                <div className="relative px-6 pt-6 pb-10">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-2">
                      <Crown className="w-4 h-4 text-white/80" />
                      <span className="text-white/70 text-[11px] uppercase tracking-[0.2em] font-semibold">Showclinic Club</span>
                    </div>
                    <button onClick={() => setShowPanel(false)} className="w-8 h-8 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/25 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0 ring-2 ring-white/30">
                      <span className="font-serif text-2xl font-bold text-white">{client.name.charAt(0)}{(client.lastName || '').charAt(0)}</span>
                    </div>
                    <div>
                      <h2 className="text-white font-serif text-xl font-semibold leading-tight">{client.name} {client.lastName || ''}</h2>
                      <p className="text-white/60 text-[12px] mt-1">Miembro desde tu primera visita</p>
                    </div>
                  </div>

                  {/* Premium metallic membership card */}
                  <div className="relative rounded-[1.3rem] overflow-hidden ring-1 ring-white/15 shadow-2xl shadow-black/40" style={{ background: theme.base }}>
                    {/* Diagonal striations */}
                    <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(115deg, rgba(255,255,255,0.07) 0px, rgba(255,255,255,0.07) 1px, transparent 1px, transparent 6px)' }} />
                    {/* Soft secondary stria for brushed-metal depth */}
                    <div className="absolute inset-0 pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'repeating-linear-gradient(115deg, rgba(0,0,0,0.18) 0px, rgba(0,0,0,0.18) 2px, transparent 2px, transparent 9px)' }} />
                    {/* Sheen reflection bloom */}
                    <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(130% 90% at 78% 12%, ${theme.glow} 0%, transparent 48%)` }} />
                    {/* Bright diagonal light bar (metallic glint) */}
                    <div className="absolute -top-1/4 -left-10 w-24 h-[150%] rotate-[20deg] blur-xl pointer-events-none" style={{ background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.45), transparent)' }} />
                    <div className="absolute -top-1/4 left-24 w-10 h-[150%] rotate-[20deg] blur-md pointer-events-none" style={{ background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.25), transparent)' }} />
                    {/* Faint logo watermark */}
                    <img src="/Imagenes/logo-blanco.png" alt="" className="absolute -bottom-8 -right-7 w-40 h-40 opacity-[0.06] pointer-events-none select-none" loading="lazy" decoding="async" />

                    <div className="relative p-5">
                      {/* Top row: brand + tier */}
                      <div className="flex items-start justify-between mb-5">
                        <div className="flex items-center gap-2">
                          <Crown className="w-3.5 h-3.5 text-white/70" />
                          <span className="text-white/85 text-[11px] uppercase tracking-[0.22em] font-bold">Showclinic Club</span>
                        </div>
                        <span className="font-serif text-lg font-semibold text-white leading-none drop-shadow">{theme.label}</span>
                      </div>

                      {/* Points */}
                      <div className="flex items-end justify-between mb-1">
                        <div>
                          <p className="text-white/55 text-[9px] uppercase tracking-[0.2em] font-medium mb-1">Puntos disponibles</p>
                          <p className="font-serif text-[3.1rem] font-bold text-white leading-none drop-shadow-sm">{client.points.toLocaleString()}</p>
                        </div>
                        <div className="text-right pb-1.5">
                          <p className="text-white/45 text-[9px] uppercase tracking-[0.15em] font-medium">Acumulados</p>
                          <p className="text-white/90 text-[15px] font-bold leading-none mt-0.5">{totalEarned.toLocaleString()}</p>
                        </div>
                      </div>

                      {/* Progress */}
                      <div className="mt-4 flex items-center gap-3">
                        <div className="flex-1">
                          <div className="w-full h-2 bg-black/25 rounded-full overflow-hidden ring-1 ring-white/10">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.min(progress, 100)}%` }}
                              transition={{ duration: 1.2, delay: 0.3, ease: 'easeOut' }}
                              className="h-full bg-gradient-to-r from-white/70 to-white rounded-full"
                            />
                          </div>
                        </div>
                        <span className="text-white/70 text-[10px] font-semibold flex-shrink-0">{Math.round(progress)}%</span>
                      </div>
                      {level.next ? (
                        <p className="text-white/50 text-[10px] mt-1.5">
                          <span className="text-white font-semibold">{(level.next - totalEarned).toLocaleString()}</span> pts para nivel {levels[levelIndex + 1]?.name}
                        </p>
                      ) : (
                        <p className="text-white/70 text-[10px] mt-1.5 flex items-center gap-1.5">
                          <Trophy className="w-3 h-3" /> Nivel máximo alcanzado
                        </p>
                      )}

                      {/* Cardholder row */}
                      <div className="flex items-center gap-3 mt-5 pt-4 border-t border-white/10">
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${theme.chip} flex items-center justify-center shadow-lg ring-1 ring-white/40 flex-shrink-0`}>
                          <img src="/Imagenes/logo-negro.png" alt="Showclinic" className="w-7 h-7" loading="lazy" decoding="async" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-white text-[13px] font-semibold tracking-wide truncate">{fullName}</p>
                          <p className="text-white/50 text-[10px] tracking-wide">Nro. Socio {socioNumber}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-6 -mt-3">
                {/* Canje card */}
                <div className="bg-white rounded-2xl p-5 shadow-lg shadow-primary/5 border border-gray-100 mb-5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Gift className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold text-dark">Valor de canje disponible</p>
                      <p className="text-[11px] text-gray-400">Descuento {level.canje}% en nivel {level.name}</p>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl px-5 py-4 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.15em] text-primary/60 font-medium">Descuento acumulado</p>
                      <p className="font-serif text-3xl font-bold text-primary">S/ {canjeValue.toFixed(2)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] uppercase tracking-[0.15em] text-gray-400 font-medium">Equivalencia</p>
                      <p className="text-[13px] font-semibold text-dark">1,000 pts = S/ {(1000 * level.canje / 100).toFixed(0)}</p>
                    </div>
                  </div>
                </div>

                {/* How to earn */}
                <div className="mb-5">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-3.5 h-3.5 text-primary" />
                    <h3 className="text-[12px] uppercase tracking-[0.15em] text-gray-400 font-semibold">Cómo ganar puntos</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    {[
                      { icon: Star, text: 'S/1 = 1 punto', sub: 'En tratamientos' },
                      { icon: Gift, text: '+1,000 pts', sub: 'Bono bienvenida' },
                      { icon: Calendar, text: '+3,000 pts', sub: 'Tu cumpleaños' },
                      { icon: UserPlus, text: '+3,000 pts', sub: 'Referir paciente' },
                    ].map((item, i) => (
                      <div key={i} className="bg-white rounded-xl p-3.5 border border-gray-100 hover:border-primary/20 hover:shadow-sm transition-all">
                        <div className="w-8 h-8 rounded-lg bg-primary/8 flex items-center justify-center mb-2">
                          <item.icon className="w-3.5 h-3.5 text-primary" />
                        </div>
                        <p className="text-[13px] font-bold text-dark">{item.text}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">{item.sub}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Level progress */}
                <div className="mb-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Crown className="w-3.5 h-3.5 text-primary" />
                    <h3 className="text-[12px] uppercase tracking-[0.15em] text-gray-400 font-semibold">Tu camino de niveles</h3>
                  </div>
                  <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                    {levels.map((lvl, i) => {
                      const isCurrent = lvl.name === level.name;
                      const isPast = lvl.min < level.min;
                      return (
                        <div key={i} className={`flex items-center justify-between px-4 py-3.5 ${i > 0 ? 'border-t border-gray-50' : ''} ${isCurrent ? 'bg-primary/5' : ''}`}>
                          <div className="flex items-center gap-3">
                            <div className={`relative w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0 ${isCurrent ? `bg-gradient-to-br ${lvl.gradient} text-white shadow-lg ${lvl.glow}` : isPast ? 'bg-primary/15 text-primary' : 'bg-gray-100 text-gray-400'}`}>
                              {lvl.icon}
                              {isCurrent && (
                                <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-white rounded-full flex items-center justify-center shadow">
                                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                                </div>
                              )}
                            </div>
                            <div>
                              <p className={`text-[13px] font-semibold ${isCurrent ? 'text-dark' : isPast ? 'text-dark' : 'text-gray-400'}`}>{lvl.name}</p>
                              <p className="text-[10px] text-gray-400">{lvl.next ? `${lvl.min.toLocaleString()} – ${(lvl.next - 1).toLocaleString()} pts` : `${lvl.min.toLocaleString()}+ pts`}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className={`text-[14px] font-bold ${isCurrent ? 'text-primary' : isPast ? 'text-primary/50' : 'text-gray-300'}`}>{lvl.canje}%</span>
                            {isCurrent && <p className="text-[9px] text-primary font-medium uppercase tracking-wider">Actual</p>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Points history */}
                {history.length > 0 && (
                  <div className="mb-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="w-3.5 h-3.5 text-primary" />
                      <h3 className="text-[12px] uppercase tracking-[0.15em] text-gray-400 font-semibold">Historial</h3>
                    </div>
                    <div className="space-y-2">
                      {history.filter(e => !e.voided).slice().reverse().slice(0, 10).map((entry, i) => (
                        <div key={i} className="bg-white rounded-xl px-4 py-3 border border-gray-100 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${entry.type === 'add' ? 'bg-green-50' : 'bg-red-50'}`}>
                              <span className={`text-sm font-bold ${entry.type === 'add' ? 'text-green-500' : 'text-red-400'}`}>{entry.type === 'add' ? '+' : '−'}</span>
                            </div>
                            <div>
                              <p className="text-[13px] font-medium text-dark leading-tight">{entry.description}</p>
                              <p className="text-[10px] text-gray-400 mt-0.5">{entry.date}</p>
                            </div>
                          </div>
                          <span className={`text-[14px] font-bold flex-shrink-0 ml-3 ${entry.type === 'add' ? 'text-green-600' : 'text-red-500'}`}>
                            {entry.type === 'add' ? '+' : '-'}{(Number(entry.amount) || 0).toLocaleString()}
                          </span>
                        </div>
                      ))}
                      {history.length > 10 && (
                        <p className="text-center text-[11px] text-gray-400 py-2">Mostrando los últimos 10 movimientos</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Contact CTA */}
                <div className="pb-8 pt-2">
                  <a
                    href="https://wa.me/51974212114?text=Hola%2C%20vengo%20de%20la%20p%C3%A1gina%20web%20y%20tengo%20una%20consulta%20sobre%20mis%20puntos%20Showclinic"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between w-full px-5 py-4 bg-accent rounded-2xl hover:bg-dark transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <MessageSquare className="w-4 h-4 text-primary-light" />
                      <div>
                        <p className="text-white text-[13px] font-semibold">¿Dudas sobre tus puntos?</p>
                        <p className="text-white/40 text-[11px]">Escríbenos por WhatsApp</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
