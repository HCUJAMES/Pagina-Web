import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Crown, Gift, Star, ArrowLeft, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';

function getLevel(points) {
  if (points >= 30000) return { name: 'Diamante', color: 'text-blue-400', next: null, min: 30000, icon: '💎', canje: 7 };
  if (points >= 20000) return { name: 'Platinium', color: 'text-violet-500', next: 30000, min: 20000, icon: '👑', canje: 6 };
  if (points >= 10000) return { name: 'Oro', color: 'text-yellow-500', next: 20000, min: 10000, icon: '🥇', canje: 5 };
  if (points >= 5000) return { name: 'Plata', color: 'text-gray-400', next: 10000, min: 5000, icon: '🥈', canje: 4 };
  return { name: 'Bronce', color: 'text-amber-700', next: 5000, min: 0, icon: '🥉', canje: 3 };
}

export default function ClientDashboard({ session, onLogout }) {
  const [client, setClient] = useState(null);

  useEffect(() => {
    const loadClient = async () => {
      const { data } = await supabase.from('clients').select('*').eq('id', session.id).single();
      if (data) setClient({ ...data, lastName: data.last_name, pointsHistory: data.points_history || [] });
    };
    loadClient();
  }, [session]);

  useEffect(() => {
    const interval = setInterval(async () => {
      const { data } = await supabase.from('clients').select('*').eq('id', session.id).single();
      if (data) setClient({ ...data, lastName: data.last_name, pointsHistory: data.points_history || [] });
    }, 5000);
    return () => clearInterval(interval);
  }, [session]);

  if (!client) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Cargando tu cuenta...</p>
        </div>
      </div>
    );
  }

  const history = client.pointsHistory || [];
  const totalEarned = history.filter(e => e.type === 'add' && !e.voided).reduce((sum, e) => sum + e.amount, 0) || client.points;
  const level = getLevel(totalEarned);
  const progress = level.next ? ((totalEarned - level.min) / (level.next - level.min)) * 100 : 100;
  const canjeValue = (client.points / 100) * level.canje;

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <div className="bg-accent">
        <div className="max-w-3xl mx-auto px-6 py-8 text-center relative">
          <button
            onClick={onLogout}
            className="absolute left-6 top-6 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
            <Crown className="w-7 h-7 text-primary-light" />
          </div>
          <p className="text-white/50 text-[12px] uppercase tracking-wider mb-1">Bienvenido/a</p>
          <h1 className="text-white font-serif text-2xl font-semibold mb-1">{client.name}</h1>
          <p className="text-white/40 text-sm">ShowClinic Club</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 -mt-4">
        {/* Points card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-8 shadow-soft-lg mb-6"
        >
          <div className="text-center mb-6">
            <p className="text-gray-400 text-[12px] uppercase tracking-wider mb-2">Puntos disponibles</p>
            <p className="font-serif text-6xl font-bold text-primary">{client.points.toLocaleString()}</p>
            <p className="text-gray-400 text-[12px] mt-2">Acumulados: {totalEarned.toLocaleString()} pts</p>
          </div>

          {/* Level */}
          <div className="bg-cream rounded-xl p-5 mb-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">{level.icon}</span>
                <span className={`font-semibold text-[14px] ${level.color}`}>Nivel {level.name}</span>
              </div>
              <span className="text-[12px] text-gray-400">
                Canje: {level.canje}%
              </span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(progress, 100)}%` }}
                transition={{ duration: 1, delay: 0.3 }}
                className="h-full bg-primary rounded-full"
              />
            </div>
            {level.next ? (
              <p className="text-[11px] text-gray-400 mt-2">
                Te faltan {(level.next - totalEarned).toLocaleString()} puntos acumulados para el nivel siguiente
              </p>
            ) : (
              <p className="text-[11px] text-gray-400 mt-2">Nivel máximo alcanzado</p>
            )}
          </div>

          {/* Canje value */}
          <div className="bg-primary/5 rounded-xl p-5 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-wider text-primary/60 font-medium mb-1">Tu descuento disponible</p>
                <p className="font-serif text-3xl font-bold text-primary">S/ {canjeValue.toFixed(2)}</p>
              </div>
              <div className="text-right">
                <p className="text-[11px] text-gray-400">Equivalencia</p>
                <p className="text-[13px] font-semibold text-dark">1,000 pts = S/ {(1000 * level.canje / 100).toFixed(0)}</p>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div>
            <h3 className="font-semibold text-dark text-[14px] mb-4">Beneficios de tu nivel</h3>
            <div className="space-y-3">
              {[
                { icon: Star, text: 'Acumulación de puntos por cada tratamiento', active: true },
                { icon: Gift, text: `Descuento del ${level.canje}% al canjear puntos`, active: true },
                { icon: Sparkles, text: 'Tu nivel se mantiene aunque canjees puntos', active: true },
              ].map((item, i) => (
                <div key={i} className={`flex items-center gap-3 p-3 rounded-xl ${item.active ? 'bg-primary/5' : 'bg-gray-50 opacity-50'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${item.active ? 'bg-primary/10' : 'bg-gray-200'}`}>
                    <item.icon className={`w-3.5 h-3.5 ${item.active ? 'text-primary' : 'text-gray-400'}`} />
                  </div>
                  <span className={`text-[13px] font-medium ${item.active ? 'text-dark' : 'text-gray-400'}`}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* History */}
        {history.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white rounded-2xl p-6 shadow-soft-lg mb-6"
          >
            <h3 className="font-semibold text-dark text-[14px] mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" /> Historial de movimientos
            </h3>
            <div className="space-y-2">
              {history.filter(e => !e.voided).slice().reverse().slice(0, 10).map((entry, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${entry.type === 'add' ? 'bg-green-50' : 'bg-red-50'}`}>
                      <span className={`text-sm font-bold ${entry.type === 'add' ? 'text-green-500' : 'text-red-400'}`}>{entry.type === 'add' ? '+' : '−'}</span>
                    </div>
                    <div>
                      <p className="text-[13px] font-medium text-dark">{entry.description}</p>
                      <p className="text-[10px] text-gray-400">{entry.date}</p>
                    </div>
                  </div>
                  <span className={`text-[14px] font-bold ${entry.type === 'add' ? 'text-green-600' : 'text-red-500'}`}>
                    {entry.type === 'add' ? '+' : '-'}{entry.amount.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
            {history.length > 10 && (
              <p className="text-center text-[11px] text-gray-400 pt-3">Mostrando los últimos 10 movimientos</p>
            )}
          </motion.div>
        )}

        {/* Info */}
        <div className="text-center pb-12">
          <p className="text-gray-400 text-[13px]">
            ¿Preguntas sobre tus puntos?{' '}
            <a
              href="https://wa.me/51974212114"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary font-medium hover:underline"
            >
              Contáctanos
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
