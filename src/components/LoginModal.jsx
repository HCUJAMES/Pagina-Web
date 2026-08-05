import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, LogIn, UserPlus, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../lib/supabase';
import CanjeNota from './CanjeNota';
import WelcomeTour from './WelcomeTour';

const inputCls = 'w-full px-5 py-3.5 bg-cream border border-gray-200 rounded-xl text-[15px] text-dark placeholder:text-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all';

export default function LoginModal({ isOpen, onClose, onLogin, initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [reg, setReg] = useState({ name: '', lastName: '', phone: '', username: '', password: '' });
  const [pendingSession, setPendingSession] = useState(null);

  useEffect(() => {
    if (isOpen) { setMode(initialMode); setError(''); }
  }, [isOpen, initialMode]);

  const resetAndClose = () => {
    setUsername(''); setPassword(''); setError(''); setLoading(false);
    setReg({ name: '', lastName: '', phone: '', username: '', password: '' });
    setPendingSession(null);
    onClose();
  };

  // Reclamar el bono de bienvenida (1000 pts) de forma segura — devuelve datos actualizados del cliente
  const claimWelcome = async () => {
    if (!pendingSession?.id) return null;
    try {
      const { data, error } = await supabase.rpc('claim_welcome_bonus', { p_id: pendingSession.id });
      if (!error && data && data.id) return data;
    } catch { /* si falla, se entra sin bono */ }
    return null;
  };

  // Al terminar (o saltar) el recorrido, inicia sesión y cierra.
  // Solo usa datos actualizados si son un cliente válido; si no, usa la sesión del registro.
  const finishTour = (updatedClient) => {
    const base = pendingSession;
    if (base) {
      const client = (updatedClient && updatedClient.id) ? updatedClient : base.client;
      const session = { ...base, client };
      localStorage.setItem('showclinic_session', JSON.stringify(session));
      onLogin(session);
    }
    resetAndClose();
  };

  // ---- LOGIN ----
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    const user = username.trim();

    // Administradores: solo por Supabase Auth (correo + contraseña).
    // Si falla, se continúa: algunos pacientes usan su correo como usuario.
    if (user.includes('@')) {
      const { data: authData } = await supabase.auth.signInWithPassword({ email: user, password });
      if (authData?.user) {
        const name = authData.user.user_metadata?.name || authData.user.email;
        const session = { role: 'admin', name, user: authData.user.email, adminId: authData.user.id };
        localStorage.setItem('showclinic_session', JSON.stringify(session));
        onLogin(session); resetAndClose(); return;
      }
    }

    const { data: client } = await supabase.rpc('client_login', { p_username: user, p_password: password });
    if (client && client.id) {
      // Llave privada para que el paciente pueda refrescar SUS puntos.
      // Si aún no existe la función en la base, se continúa sin ella.
      let token = null;
      try {
        const { data: t } = await supabase.rpc('issue_client_token', { p_username: user, p_password: password });
        token = t || null;
      } catch { /* la sesión funciona igual, solo sin refresco automático */ }
      const session = { role: 'client', name: client.name, user: client.username, id: client.id, token, client };
      localStorage.setItem('showclinic_session', JSON.stringify(session));
      onLogin(session); resetAndClose();
    } else {
      setError('Usuario o contraseña incorrectos'); setLoading(false);
    }
  };

  // ---- REGISTRO ----
  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    if (!reg.name.trim() || !reg.lastName.trim()) { setError('Ingresa tu nombre y apellidos.'); return; }
    if (!reg.phone.trim() || reg.phone.trim().length < 9) { setError('Ingresa un celular válido (mínimo 9 dígitos).'); return; }
    if (reg.username.trim().length < 3) { setError('El usuario debe tener al menos 3 caracteres.'); return; }
    if (reg.password.length < 4) { setError('La contraseña debe tener al menos 4 caracteres.'); return; }
    setLoading(true);

    const { data, error: rpcErr } = await supabase.rpc('register_client', {
      p_name: reg.name.trim(),
      p_last_name: reg.lastName.trim(),
      p_phone: reg.phone.trim(),
      p_username: reg.username.trim(),
      p_password: reg.password,
    });

    if (rpcErr) { setError('No se pudo registrar. Intenta de nuevo.'); setLoading(false); return; }
    if (data?.error === 'usuario_existe') { setError('Ese usuario ya está en uso. Elige otro.'); setLoading(false); return; }
    if (data?.error) { setError('Revisa tus datos e intenta de nuevo.'); setLoading(false); return; }

    if (data?.id) {
      // registro exitoso → guardar sesión y mostrar recorrido de bienvenida
      const session = { role: 'client', name: data.name, user: data.username, id: data.id, client: data };
      setPendingSession(session);
      setMode('tour');
      setLoading(false);
    } else {
      setError('No se pudo completar el registro. Intenta de nuevo.'); setLoading(false);
    }
  };

  const isRegister = mode === 'register';
  const isTour = mode === 'tour';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-8 overflow-y-auto"
        >
          <div className="absolute inset-0 bg-dark/60 backdrop-blur-sm" onClick={isTour ? finishTour : resetAndClose} />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className="relative bg-white rounded-2xl p-8 md:p-10 w-full max-w-md shadow-soft-lg z-10 my-auto"
          >
            <button onClick={isTour ? finishTour : resetAndClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:text-dark hover:bg-gray-200 transition-colors">
              <X className="w-4 h-4" />
            </button>

            {!isTour && (
              <div className="text-center mb-8">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  {isRegister ? <UserPlus className="w-6 h-6 text-primary" /> : <LogIn className="w-6 h-6 text-primary" />}
                </div>
                <h3 className="font-serif text-2xl font-semibold text-dark mb-1">
                  {isRegister ? 'Crea tu cuenta' : 'Iniciar sesión'}
                </h3>
                <p className="text-gray-400 text-sm">
                  {isRegister ? 'Únete al Showclinic Club y acumula puntos' : 'Accede a tu cuenta Showclinic'}
                </p>
              </div>
            )}

            {isTour ? (
              <WelcomeTour name={pendingSession?.name} onFinish={finishTour} onClaim={claimWelcome} />
            ) : isRegister ? (
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <input type="text" value={reg.name} onChange={(e) => { setReg({ ...reg, name: e.target.value }); setError(''); }} placeholder="Nombre" className={inputCls} required />
                  <input type="text" value={reg.lastName} onChange={(e) => { setReg({ ...reg, lastName: e.target.value }); setError(''); }} placeholder="Apellidos" className={inputCls} required />
                </div>
                <input type="tel" value={reg.phone} onChange={(e) => { setReg({ ...reg, phone: e.target.value.replace(/[^0-9+]/g, '') }); setError(''); }} placeholder="Celular" className={inputCls} required />
                <input type="text" value={reg.username} onChange={(e) => { setReg({ ...reg, username: e.target.value }); setError(''); }} placeholder="Crea un usuario" className={inputCls} required />
                <div className="relative">
                  <input type={showPass ? 'text' : 'password'} value={reg.password} onChange={(e) => { setReg({ ...reg, password: e.target.value }); setError(''); }} placeholder="Crea una contraseña" className={`${inputCls} pr-12`} required />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {error && <p className="text-red-500 text-sm text-center bg-red-50 rounded-lg py-2">{error}</p>}

                <button type="submit" disabled={loading}
                  className="w-full bg-accent text-white uppercase tracking-wider text-[13px] font-semibold py-4 rounded-xl hover:bg-dark transition-colors duration-300 disabled:opacity-50">
                  {loading ? 'Creando cuenta...' : 'Registrarme'}
                </button>

                <p className="text-center text-[13px] text-gray-400 pt-1">
                  ¿Ya tienes cuenta?{' '}
                  <button type="button" onClick={() => { setMode('login'); setError(''); }} className="text-primary font-semibold hover:underline">Inicia sesión</button>
                </p>

                <CanjeNota className="mt-1" />
              </form>
            ) : (
              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="block text-[12px] font-semibold uppercase tracking-wider text-gray-400 mb-2">Usuario</label>
                  <input type="text" value={username} onChange={(e) => { setUsername(e.target.value); setError(''); }} placeholder="Tu usuario" className={inputCls} required />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold uppercase tracking-wider text-gray-400 mb-2">Contraseña</label>
                  <div className="relative">
                    <input type={showPass ? 'text' : 'password'} value={password} onChange={(e) => { setPassword(e.target.value); setError(''); }} placeholder="Tu contraseña" className={`${inputCls} pr-12`} required />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-sm text-center bg-red-50 rounded-lg py-2">
                    {error}
                  </motion.p>
                )}

                <button type="submit" disabled={loading}
                  className="w-full bg-accent text-white uppercase tracking-wider text-[13px] font-semibold py-4 rounded-xl hover:bg-dark transition-colors duration-300 disabled:opacity-50">
                  {loading ? 'Ingresando...' : 'Ingresar'}
                </button>

                <p className="text-center text-[13px] text-gray-400 pt-1">
                  ¿No tienes cuenta?{' '}
                  <button type="button" onClick={() => { setMode('register'); setError(''); }} className="text-primary font-semibold hover:underline">Regístrate aquí</button>
                </p>

                <CanjeNota className="mt-1" />
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
