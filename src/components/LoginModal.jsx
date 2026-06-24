import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, LogIn, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function LoginModal({ isOpen, onClose, onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const user = username.trim();

    // 1) Administrador por canal seguro (Supabase Auth) — entra con su EMAIL
    if (user.includes('@')) {
      const { data: authData } = await supabase.auth.signInWithPassword({ email: user, password });
      if (authData?.user) {
        const name = authData.user.user_metadata?.name || authData.user.email;
        const session = { role: 'admin', name, user: authData.user.email, adminId: authData.user.id };
        localStorage.setItem('showclinic_session', JSON.stringify(session));
        onLogin(session);
        resetAndClose();
        return;
      }
    }

    // 2) Respaldo temporal de administrador (tabla) — se desactiva al activar RLS
    const { data: admins } = await supabase.from('admins').select('*').ilike('username', user).eq('password', password);
    const admin = admins?.[0];

    if (admin) {
      const session = { role: 'admin', name: admin.name, user: admin.username, adminId: admin.id };
      localStorage.setItem('showclinic_session', JSON.stringify(session));
      onLogin(session);
      resetAndClose();
      return;
    }

    // 3) Login de paciente por canal seguro (función con contraseña cifrada, no expone la tabla)
    const { data: client } = await supabase.rpc('client_login', { p_username: username.trim(), p_password: password });

    if (client && client.id) {
      const session = { role: 'client', name: client.name, user: client.username, id: client.id, client };
      localStorage.setItem('showclinic_session', JSON.stringify(session));
      onLogin(session);
      resetAndClose();
    } else {
      setError('Usuario o contraseña incorrectos');
      setLoading(false);
    }
  };

  const resetAndClose = () => {
    setUsername('');
    setPassword('');
    setError('');
    setLoading(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center px-4"
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-dark/60 backdrop-blur-sm" onClick={resetAndClose} />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className="relative bg-white rounded-2xl p-8 md:p-10 w-full max-w-md shadow-soft-lg z-10"
          >
            <button
              onClick={resetAndClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:text-dark hover:bg-gray-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center mb-8">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <LogIn className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-serif text-2xl font-semibold text-dark mb-1">Iniciar sesión</h3>
              <p className="text-gray-400 text-sm">Accede a tu cuenta ShowClinic</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-[12px] font-semibold uppercase tracking-wider text-gray-400 mb-2">
                  Usuario
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => { setUsername(e.target.value); setError(''); }}
                  placeholder="Tu usuario"
                  className="w-full px-5 py-3.5 bg-cream border border-gray-200 rounded-xl text-[15px] text-dark placeholder:text-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold uppercase tracking-wider text-gray-400 mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(''); }}
                    placeholder="Tu contraseña"
                    className="w-full px-5 py-3.5 bg-cream border border-gray-200 rounded-xl text-[15px] text-dark placeholder:text-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm text-center bg-red-50 rounded-lg py-2"
                >
                  {error}
                </motion.p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-accent text-white uppercase tracking-wider text-[13px] font-semibold py-4 rounded-xl hover:bg-dark transition-colors duration-300 disabled:opacity-50"
              >
                {loading ? 'Ingresando...' : 'Ingresar'}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
