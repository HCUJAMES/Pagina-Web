import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Plus, Minus, Search, Trash2, Edit3, Save, X, Crown, ArrowLeft, Gift, ChevronDown, ChevronUp, Clock, Package, RefreshCw, Eye, DollarSign, Shield, EyeOff, Mail, MailOpen, MessageSquare } from 'lucide-react';
import { supabase } from '../lib/supabase';

const inputClass = 'w-full px-4 py-3 bg-cream border border-gray-200 rounded-xl text-[14px] text-dark placeholder:text-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all';

function getLevel(points) {
  if (points >= 30000) return { name: 'Diamante', icon: 'V', color: 'text-blue-400', canje: 7 };
  if (points >= 20000) return { name: 'Platinium', icon: 'IV', color: 'text-violet-500', canje: 6 };
  if (points >= 10000) return { name: 'Oro', icon: 'III', color: 'text-yellow-600', canje: 5 };
  if (points >= 5000) return { name: 'Plata', icon: 'II', color: 'text-gray-500', canje: 4 };
  return { name: 'Bronce', icon: 'I', color: 'text-amber-700', canje: 3 };
}

function getTotalEarned(history) {
  return (history || []).filter(e => e.type === 'add').reduce((sum, e) => sum + e.amount, 0);
}

export default function AdminDashboard({ onBack }) {
  const [activeTab, setActiveTab] = useState('patients');
  const [clients, setClients] = useState([]);
  const [treatments, setTreatments] = useState([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: '', lastName: '', phone: '', username: '', password: '', points: 0 });
  const [pointsAction, setPointsAction] = useState({ id: null, soles: '', treatment: '', description: '', mode: 'treatment' });
  const [bonusAction, setBonusAction] = useState({ id: null, type: '', customPoints: '', description: '' });
  const [canjeAction, setCanjeAction] = useState({ id: null, points: '', description: '' });
  const [expandedId, setExpandedId] = useState(null);
  const [treatmentForm, setTreatmentForm] = useState({ name: '', price: '', category: 'Armonización' });
  const [editingTreatment, setEditingTreatment] = useState(null);
  const [treatmentSearch, setTreatmentSearch] = useState('');
  const [admins, setAdmins] = useState([]);
  const [adminForm, setAdminForm] = useState({ name: '', username: '', password: '' });
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [showAdminPass, setShowAdminPass] = useState({});
  const [contacts, setContacts] = useState([]);
  const [contactSearch, setContactSearch] = useState('');

  useEffect(() => {
    const loadData = async () => {
      const { data: c } = await supabase.from('clients').select('*').order('id');
      if (c) setClients(c.map(r => ({ ...r, lastName: r.last_name, createdAt: new Date(r.created_at).toLocaleString('es-PE', { dateStyle: 'medium', timeStyle: 'short' }), pointsHistory: r.points_history || [] })));
      const { data: t } = await supabase.from('treatments').select('*').order('id');
      if (t) setTreatments(t);
      const { data: a } = await supabase.from('admins').select('*').order('id');
      if (a) setAdmins(a);
      const { data: ct } = await supabase.from('contacts').select('*').order('created_at', { ascending: false });
      if (ct) setContacts(ct);
    };
    loadData();
  }, []);

  const [formError, setFormError] = useState('');

  const handleAddClient = async (e) => {
    e.preventDefault();
    setFormError('');
    const trimmedUsername = form.username.trim().toLowerCase();
    const duplicate = clients.find(c => c.username.toLowerCase() === trimmedUsername && c.id !== editingId);
    if (duplicate) {
      setFormError(`El usuario "${form.username}" ya existe (${duplicate.name})`);
      return;
    }
    if (!form.phone.trim() || form.phone.trim().length < 9) {
      setFormError('El número de celular es obligatorio (mínimo 9 dígitos)');
      return;
    }
    if (form.password.length < 4) {
      setFormError('La contraseña debe tener al menos 4 caracteres');
      return;
    }
    if (editingId) {
      await supabase.from('clients').update({ name: form.name, last_name: form.lastName, phone: form.phone, username: form.username, password: form.password }).eq('id', editingId);
      setClients(clients.map(c => c.id === editingId ? { ...c, name: form.name, lastName: form.lastName, phone: form.phone, username: form.username, password: form.password } : c));
      setEditingId(null);
    } else {
      const { data, error } = await supabase.from('clients').insert({ name: form.name, last_name: form.lastName, phone: form.phone, username: form.username, password: form.password, points: 0, points_history: [] }).select().single();
      if (error) {
        setFormError('Error al crear paciente: ' + error.message);
        return;
      }
      if (data) {
        setClients([...clients, { ...data, lastName: data.last_name, createdAt: new Date(data.created_at).toLocaleString('es-PE', { dateStyle: 'medium', timeStyle: 'short' }), pointsHistory: data.points_history || [] }]);
      }
    }
    setForm({ name: '', lastName: '', phone: '', username: '', password: '', points: 0 });
    setShowForm(false);
  };

  const handleEdit = (client) => {
    setForm({ name: client.name, lastName: client.lastName || '', phone: client.phone, username: client.username, password: client.password, points: client.points });
    setEditingId(client.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (confirm('¿Eliminar este paciente?')) {
      await supabase.from('clients').delete().eq('id', id);
      setClients(clients.filter((c) => c.id !== id));
      if (expandedId === id) setExpandedId(null);
    }
  };

  const handlePointsApply = async (id) => {
    const soles = Math.floor(Number(pointsAction.soles));
    if (!soles || soles <= 0) return;
    const pts = soles;
    const desc = pointsAction.description.trim() || pointsAction.treatment || `Pago S/ ${soles.toFixed(2)}`;
    const client = clients.find(c => c.id === id);
    if (!client) return;
    const entry = { type: 'add', amount: pts, soles, description: desc, date: new Date().toLocaleString('es-PE', { dateStyle: 'medium', timeStyle: 'short' }) };
    const newPoints = client.points + pts;
    const newHistory = [...(client.pointsHistory || []), entry];
    const { error } = await supabase.from('clients').update({ points: newPoints, points_history: newHistory }).eq('id', id);
    if (error) { alert('Error al guardar puntos: ' + error.message); return; }
    setClients(clients.map(c => c.id === id ? { ...c, points: newPoints, pointsHistory: newHistory } : c));
    setPointsAction({ id: null, soles: '', treatment: '', description: '', mode: 'treatment' });
  };

  const bonusOptions = [
    { label: 'Cumpleaños', points: 3000, icon: '🎂' },
    { label: 'Primer registro', points: 1000, icon: '🎉' },
    { label: 'Referido', points: 3000, icon: '👥' },
    { label: 'Otro (personalizado)', points: 0, icon: '⭐' },
  ];

  const handleBonusApply = async (id) => {
    const option = bonusOptions.find(o => o.label === bonusAction.type);
    if (!option) return;
    const pts = option.points > 0 ? option.points : Math.floor(Number(bonusAction.customPoints));
    if (!pts || pts <= 0) return;
    const client = clients.find(c => c.id === id);
    if (!client) return;
    const desc = bonusAction.description.trim() || `Bonus: ${bonusAction.type}`;
    const entry = { type: 'add', amount: pts, description: desc, date: new Date().toLocaleString('es-PE', { dateStyle: 'medium', timeStyle: 'short' }) };
    const newPoints = client.points + pts;
    const newHistory = [...(client.pointsHistory || []), entry];
    const { error } = await supabase.from('clients').update({ points: newPoints, points_history: newHistory }).eq('id', id);
    if (error) { alert('Error al agregar bonus: ' + error.message); return; }
    setClients(clients.map(c => c.id === id ? { ...c, points: newPoints, pointsHistory: newHistory } : c));
    setBonusAction({ id: null, type: '', customPoints: '', description: '' });
  };

  const handleCanjeApply = async (id) => {
    const pts = Math.floor(Number(canjeAction.points));
    if (!pts || pts <= 0) return;
    const client = clients.find(c => c.id === id);
    if (!client || pts > client.points) return;
    const level = getLevel(getTotalEarned(client.pointsHistory));
    const solesValue = (pts / 100) * level.canje;
    if (!confirm(`¿Confirmar canje de ${pts.toLocaleString()} puntos de ${client.name}?\nDescuento aplicado: S/ ${solesValue.toFixed(2)}\nSaldo restante: ${(client.points - pts).toLocaleString()} pts`)) return;
    const desc = canjeAction.description.trim() || `Canje de ${pts.toLocaleString()} pts (S/ ${solesValue.toFixed(2)})`;
    const entry = { type: 'subtract', amount: pts, solesValue, description: desc, date: new Date().toLocaleString('es-PE', { dateStyle: 'medium', timeStyle: 'short' }) };
    const newPoints = client.points - pts;
    const newHistory = [...(client.pointsHistory || []), entry];
    const { error } = await supabase.from('clients').update({ points: newPoints, points_history: newHistory }).eq('id', id);
    if (error) { alert('Error al canjear puntos: ' + error.message); return; }
    setClients(clients.map(c => c.id === id ? { ...c, points: newPoints, pointsHistory: newHistory } : c));
    setCanjeAction({ id: null, points: '', description: '' });
  };

  const handleSelectTreatment = (t) => {
    setPointsAction({ ...pointsAction, soles: String(t.price), treatment: t.name, description: t.name, mode: 'treatment' });
  };

  const handleAddTreatment = async (e) => {
    e.preventDefault();
    if (editingTreatment) {
      await supabase.from('treatments').update({ name: treatmentForm.name, price: Number(treatmentForm.price), category: treatmentForm.category }).eq('id', editingTreatment);
      setTreatments(treatments.map(t => t.id === editingTreatment ? { ...t, name: treatmentForm.name, price: Number(treatmentForm.price), category: treatmentForm.category } : t));
      setEditingTreatment(null);
    } else {
      const { data } = await supabase.from('treatments').insert({ name: treatmentForm.name, price: Number(treatmentForm.price), category: treatmentForm.category }).select().single();
      if (data) setTreatments([...treatments, data]);
    }
    setTreatmentForm({ name: '', price: '', category: 'Armonización' });
  };

  const filtered = clients.filter(
    (c) => c.name.toLowerCase().includes(search.toLowerCase()) || (c.lastName || '').toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search) || c.username.toLowerCase().includes(search.toLowerCase())
  );

  const totalPoints = clients.reduce((sum, c) => sum + c.points, 0);
  const totalCanjes = clients.reduce((sum, c) => sum + (c.pointsHistory || []).filter(e => e.type === 'subtract').length, 0);
  const categories = [...new Set(treatments.map(t => t.category))];
  const filteredTreatments = treatments.filter(t => t.name.toLowerCase().includes(treatmentSearch.toLowerCase()) || t.category.toLowerCase().includes(treatmentSearch.toLowerCase()));

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-dark via-accent to-dark">
        <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '22px 22px' }} />
        <div className="absolute -top-16 -right-10 w-64 h-64 bg-primary/20 rounded-full blur-[80px]" />
        <div className="relative max-w-6xl mx-auto px-6 py-7 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onBack} title="Ver sitio web" className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors ring-1 ring-white/10">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary to-amber-700 flex items-center justify-center shadow-lg shadow-primary/30 ring-1 ring-white/20">
                <Crown className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-white font-serif text-xl font-semibold leading-tight">Panel de Administración</h1>
                <p className="text-white/50 text-[12px]">ShowClinic Club · Gestión de fidelización</p>
              </div>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm ring-1 ring-white/10">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-white/80 text-[12px] font-semibold tracking-wide">Master</span>
          </div>
        </div>
        {/* Tabs */}
        <div className="relative max-w-6xl mx-auto px-6">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab('patients')}
              className={`px-5 py-3 text-[12px] font-semibold uppercase tracking-wider rounded-t-xl transition-colors ${activeTab === 'patients' ? 'bg-cream text-dark' : 'text-white/50 hover:text-white/80'}`}
            >
              <span className="flex items-center gap-2"><Users className="w-3.5 h-3.5" /> Pacientes</span>
            </button>
            <button
              onClick={() => setActiveTab('treatments')}
              className={`px-5 py-3 text-[12px] font-semibold uppercase tracking-wider rounded-t-xl transition-colors ${activeTab === 'treatments' ? 'bg-cream text-dark' : 'text-white/50 hover:text-white/80'}`}
            >
              <span className="flex items-center gap-2"><Package className="w-3.5 h-3.5" /> Tratamientos</span>
            </button>
            <button
              onClick={() => setActiveTab('messages')}
              className={`px-5 py-3 text-[12px] font-semibold uppercase tracking-wider rounded-t-xl transition-colors ${activeTab === 'messages' ? 'bg-cream text-dark' : 'text-white/50 hover:text-white/80'}`}
            >
              <span className="flex items-center gap-2">
                <MessageSquare className="w-3.5 h-3.5" /> Mensajes
                {contacts.filter(c => !c.read).length > 0 && (
                  <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">{contacts.filter(c => !c.read).length}</span>
                )}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('admins')}
              className={`px-5 py-3 text-[12px] font-semibold uppercase tracking-wider rounded-t-xl transition-colors ${activeTab === 'admins' ? 'bg-cream text-dark' : 'text-white/50 hover:text-white/80'}`}
            >
              <span className="flex items-center gap-2"><Shield className="w-3.5 h-3.5" /> Administradores</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {activeTab === 'patients' && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { icon: Users, label: 'Pacientes', value: clients.length.toLocaleString(), grad: 'from-blue-500 to-indigo-600', soft: 'bg-blue-50' },
                { icon: Crown, label: 'Puntos totales', value: totalPoints.toLocaleString(), grad: 'from-primary to-amber-700', soft: 'bg-amber-50' },
                { icon: Gift, label: 'Promedio por paciente', value: clients.length ? Math.round(totalPoints / clients.length).toLocaleString() : 0, grad: 'from-emerald-500 to-teal-600', soft: 'bg-emerald-50' },
                { icon: RefreshCw, label: 'Canjes realizados', value: totalCanjes.toLocaleString(), grad: 'from-rose-500 to-pink-600', soft: 'bg-rose-50' },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="relative bg-white rounded-2xl p-5 shadow-soft overflow-hidden group hover:shadow-soft-lg transition-shadow"
                >
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.grad}`} />
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.grad} flex items-center justify-center mb-3 shadow-md`}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold mb-1">{stat.label}</p>
                  <p className="font-serif text-3xl font-bold text-dark leading-none">{stat.value}</p>
                </motion.div>
              ))}
            </div>

            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar paciente..." className={`${inputClass} pl-11`} />
              </div>
              <button onClick={() => { setShowForm(true); setEditingId(null); setForm({ name: '', lastName: '', phone: '', username: '', password: '', points: 0 }); }}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 text-[13px] font-semibold uppercase tracking-wider text-white bg-accent rounded-xl hover:bg-dark transition-colors">
                <Plus className="w-4 h-4" /> Nuevo paciente
              </button>
            </div>

            {/* Add/Edit Form */}
            <AnimatePresence>
              {showForm && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-6">
                  <form onSubmit={handleAddClient} className="bg-white rounded-2xl p-6 shadow-soft">
                    <div className="flex items-center justify-between mb-5">
                      <h3 className="font-serif text-lg font-semibold text-dark">{editingId ? 'Editar paciente' : 'Nuevo paciente'}</h3>
                      <button type="button" onClick={() => { setShowForm(false); setEditingId(null); }} className="text-gray-400 hover:text-dark"><X className="w-5 h-5" /></button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
                      <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nombre" className={inputClass} required />
                      <input type="text" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} placeholder="Apellidos" className={inputClass} required />
                      <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/[^0-9+]/g, '') })} placeholder="Celular (obligatorio)" className={inputClass} required minLength={9} />
                      <input type="text" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} placeholder="Usuario (para login)" className={inputClass} required />
                      <input type="text" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Contraseña" className={inputClass} required />
                    </div>
                    {formError && (
                      <p className="text-red-500 text-[13px] bg-red-50 rounded-lg px-4 py-2 mb-2">{formError}</p>
                    )}
                    <button type="submit" className="inline-flex items-center gap-2 px-6 py-3 text-[13px] font-semibold uppercase tracking-wider text-white bg-primary rounded-xl hover:bg-primary-dark transition-colors">
                      <Save className="w-4 h-4" /> {editingId ? 'Guardar cambios' : 'Crear paciente'}
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Clients list */}
            <div className="space-y-3">
              {filtered.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-soft text-center py-16">
                  <Users className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm">{search ? 'No se encontraron pacientes' : 'No hay pacientes registrados'}</p>
                </div>
              ) : (
                filtered.map((client) => {
                  const level = getLevel(getTotalEarned(client.pointsHistory));
                  const isExpanded = expandedId === client.id;
                  const history = client.pointsHistory || [];
                  const isAddingPoints = pointsAction.id === client.id;
                  const isCanjeing = canjeAction.id === client.id;
                  const solesAmount = Number(pointsAction.soles) || 0;
                  const previewPoints = solesAmount;
                  const canjePoints = Number(canjeAction.points) || 0;
                  const canjeValue = (canjePoints / 100) * level.canje;

                  return (
                    <div key={client.id} className="bg-white rounded-2xl shadow-soft overflow-hidden">
                      {/* Main row */}
                      <div className="flex items-center gap-4 px-6 py-5 cursor-pointer hover:bg-cream/30 transition-colors" onClick={() => setExpandedId(isExpanded ? null : client.id)}>
                        <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-primary font-serif font-bold text-[16px]">{client.name.charAt(0)}{(client.lastName || '').charAt(0)}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-dark text-[15px] truncate">{client.name} {client.lastName || ''}</p>
                          <p className="text-gray-400 text-[12px] truncate">{client.phone} · @{client.username}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="font-serif text-xl font-bold text-primary">{client.points.toLocaleString()}</p>
                          <p className={`text-[11px] font-medium ${level.color}`}>{level.icon} {level.name}</p>
                        </div>
                        <div className="flex-shrink-0 text-gray-300">
                          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </div>
                      </div>

                      {/* Expanded */}
                      <AnimatePresence initial={false}>
                        {isExpanded && (
                          <motion.div
                            key={client.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className="px-6 pb-6 border-t border-gray-100">
                              {/* Info grid */}
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-5">
                                <div>
                                  <p className="text-[11px] uppercase tracking-wider text-gray-400 font-medium mb-1">Puntos disponibles</p>
                                  <p className="text-[14px] text-primary font-bold">{client.points.toLocaleString()}</p>
                                </div>
                                <div>
                                  <p className="text-[11px] uppercase tracking-wider text-gray-400 font-medium mb-1">Total acumulado</p>
                                  <p className="text-[14px] text-dark font-medium">{getTotalEarned(client.pointsHistory).toLocaleString()}</p>
                                </div>
                                <div>
                                  <p className="text-[11px] uppercase tracking-wider text-gray-400 font-medium mb-1">Valor canje ({level.canje}%)</p>
                                  <p className="text-[14px] text-dark font-medium">S/ {((client.points / 100) * level.canje).toFixed(2)}</p>
                                </div>
                                <div>
                                  <p className="text-[11px] uppercase tracking-wider text-gray-400 font-medium mb-1">Registro</p>
                                  <p className="text-[14px] text-dark font-medium">{client.createdAt}</p>
                                </div>
                              </div>

                              {/* Registrar tratamiento / puntos */}
                              <div className="bg-cream rounded-xl p-4 mb-4">
                                <p className="text-[12px] uppercase tracking-wider text-gray-400 font-semibold mb-3 flex items-center gap-2">
                                  <Crown className="w-3.5 h-3.5" /> Registrar tratamiento
                                </p>
                                {isAddingPoints ? (
                                  <div className="space-y-3">
                                    {/* Treatment selector */}
                                    <div>
                                      <label className="text-[11px] uppercase tracking-wider text-gray-400 font-medium mb-1.5 block">Seleccionar tratamiento</label>
                                      <select
                                        value={pointsAction.treatment}
                                        onChange={(e) => {
                                          const t = treatments.find(t => t.name === e.target.value);
                                          if (t) handleSelectTreatment(t);
                                          else setPointsAction({ ...pointsAction, treatment: '', soles: '', description: '' });
                                        }}
                                        className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-[13px] bg-white font-medium"
                                      >
                                        <option value="">— Seleccionar o ingresar monto manual —</option>
                                        {categories.map(cat => (
                                          <optgroup key={cat} label={cat}>
                                            {treatments.filter(t => t.category === cat).map(t => (
                                              <option key={t.id} value={t.name}>{t.name} — S/ {t.price.toLocaleString()}</option>
                                            ))}
                                          </optgroup>
                                        ))}
                                      </select>
                                    </div>

                                    {/* Amount in soles */}
                                    <div>
                                      <label className="text-[11px] uppercase tracking-wider text-gray-400 font-medium mb-1.5 block">Monto pagado (S/)</label>
                                      <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-[13px] font-medium">S/</span>
                                        <input
                                          type="number"
                                          value={pointsAction.soles}
                                          onChange={(e) => setPointsAction({ ...pointsAction, soles: e.target.value })}
                                          placeholder="0.00"
                                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-[14px] text-center bg-white font-medium"
                                          min="1"
                                          step="0.01"
                                        />
                                      </div>
                                    </div>

                                    {/* Description */}
                                    <input
                                      type="text"
                                      value={pointsAction.description}
                                      onChange={(e) => setPointsAction({ ...pointsAction, description: e.target.value })}
                                      placeholder="Descripción adicional (opcional)"
                                      className={inputClass}
                                    />

                                    {/* Preview */}
                                    {solesAmount > 0 && (
                                      <div className="bg-white rounded-xl p-4 border border-primary/20">
                                        <div className="flex items-center gap-2 mb-3">
                                          <Eye className="w-3.5 h-3.5 text-primary" />
                                          <span className="text-[12px] uppercase tracking-wider text-primary font-semibold">Previsualización</span>
                                        </div>
                                        <div className="grid grid-cols-3 gap-4 text-center">
                                          <div>
                                            <p className="text-[11px] text-gray-400 mb-1">Monto</p>
                                            <p className="text-[16px] font-bold text-dark">S/ {solesAmount.toFixed(2)}</p>
                                          </div>
                                          <div>
                                            <p className="text-[11px] text-gray-400 mb-1">Puntos generados</p>
                                            <p className="text-[16px] font-bold text-green-600">+{previewPoints.toLocaleString()}</p>
                                          </div>
                                          <div>
                                            <p className="text-[11px] text-gray-400 mb-1">Nuevo saldo</p>
                                            <p className="text-[16px] font-bold text-primary">{(client.points + previewPoints).toLocaleString()}</p>
                                          </div>
                                        </div>
                                        <p className="text-[11px] text-gray-400 text-center mt-2">S/ 1 = 1 punto ShowClinic</p>
                                      </div>
                                    )}

                                    <div className="flex items-center gap-2">
                                      <button onClick={() => handlePointsApply(client.id)} disabled={solesAmount <= 0}
                                        className="inline-flex items-center gap-2 px-4 py-2 text-[12px] font-semibold uppercase tracking-wider text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                                        <Save className="w-3.5 h-3.5" /> Registrar
                                      </button>
                                      <button onClick={() => setPointsAction({ id: null, soles: '', treatment: '', description: '', mode: 'treatment' })}
                                        className="px-4 py-2 text-[12px] font-semibold uppercase tracking-wider text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                        Cancelar
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <button onClick={(e) => { e.stopPropagation(); setPointsAction({ id: client.id, soles: '', treatment: '', description: '', mode: 'treatment' }); setCanjeAction({ id: null, points: '', description: '' }); setBonusAction({ id: null, type: '', customPoints: '', description: '' }); }}
                                    className="inline-flex items-center gap-2 px-4 py-2.5 text-[12px] font-semibold text-primary bg-white border border-primary/20 rounded-xl hover:bg-primary/5 transition-colors">
                                    <Plus className="w-3.5 h-3.5" /> Registrar tratamiento / agregar puntos
                                  </button>
                                )}
                              </div>

                              {/* Bonus de puntos */}
                              <div className="bg-cream rounded-xl p-4 mb-4">
                                <p className="text-[12px] uppercase tracking-wider text-gray-400 font-semibold mb-3 flex items-center gap-2">
                                  <Gift className="w-3.5 h-3.5" /> Agregar puntos bonus
                                </p>
                                {bonusAction.id === client.id ? (
                                  <div className="space-y-3">
                                    <div className="grid grid-cols-2 gap-2">
                                      {bonusOptions.map((opt) => (
                                        <button
                                          key={opt.label}
                                          onClick={() => setBonusAction({ ...bonusAction, type: opt.label, customPoints: '' })}
                                          className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-[12px] font-medium transition-all border ${
                                            bonusAction.type === opt.label
                                              ? 'bg-primary text-white border-primary shadow-md'
                                              : 'bg-white text-dark border-gray-200 hover:border-primary/30'
                                          }`}
                                        >
                                          <span className="text-[16px]">{opt.icon}</span>
                                          <div className="text-left">
                                            <p className="font-semibold">{opt.label}</p>
                                            {opt.points > 0 && <p className={`text-[10px] ${bonusAction.type === opt.label ? 'text-white/70' : 'text-gray-400'}`}>+{opt.points.toLocaleString()} pts</p>}
                                          </div>
                                        </button>
                                      ))}
                                    </div>

                                    {bonusAction.type === 'Otro (personalizado)' && (
                                      <div>
                                        <label className="text-[11px] uppercase tracking-wider text-gray-400 font-medium mb-1.5 block">Cantidad de puntos</label>
                                        <input
                                          type="number"
                                          value={bonusAction.customPoints}
                                          onChange={(e) => setBonusAction({ ...bonusAction, customPoints: e.target.value })}
                                          placeholder="Ej: 500"
                                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-[14px] bg-white font-medium"
                                          min="1"
                                        />
                                      </div>
                                    )}

                                    {bonusAction.type && (
                                      <input
                                        type="text"
                                        value={bonusAction.description}
                                        onChange={(e) => setBonusAction({ ...bonusAction, description: e.target.value })}
                                        placeholder={`Descripción (ej: Cumpleaños de ${client.name})`}
                                        className={inputClass}
                                      />
                                    )}

                                    {bonusAction.type && (
                                      <div className="bg-white rounded-xl p-3 border border-green-200 flex items-center justify-between">
                                        <span className="text-[13px] text-gray-600">Se agregarán</span>
                                        <span className="text-[16px] font-bold text-green-600">
                                          +{(bonusOptions.find(o => o.label === bonusAction.type)?.points || Math.floor(Number(bonusAction.customPoints)) || 0).toLocaleString()} pts
                                        </span>
                                      </div>
                                    )}

                                    <div className="flex items-center gap-2">
                                      <button
                                        onClick={() => handleBonusApply(client.id)}
                                        disabled={!bonusAction.type || (bonusAction.type === 'Otro (personalizado)' && (!bonusAction.customPoints || Number(bonusAction.customPoints) <= 0))}
                                        className="inline-flex items-center gap-2 px-4 py-2 text-[12px] font-semibold uppercase tracking-wider text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                      >
                                        <Gift className="w-3.5 h-3.5" /> Agregar bonus
                                      </button>
                                      <button onClick={() => setBonusAction({ id: null, type: '', customPoints: '', description: '' })}
                                        className="px-4 py-2 text-[12px] font-semibold uppercase tracking-wider text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                        Cancelar
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <button onClick={(e) => { e.stopPropagation(); setBonusAction({ id: client.id, type: '', customPoints: '', description: '' }); setPointsAction({ id: null, soles: '', treatment: '', description: '', mode: 'treatment' }); setCanjeAction({ id: null, points: '', description: '' }); }}
                                    className="inline-flex items-center gap-2 px-4 py-2.5 text-[12px] font-semibold text-green-600 bg-white border border-green-200 rounded-xl hover:bg-green-50 transition-colors">
                                    <Gift className="w-3.5 h-3.5" /> Cumpleaños / Referido / Otro bonus
                                  </button>
                                )}
                              </div>

                              {/* Canjear puntos */}
                              <div className="bg-cream rounded-xl p-4 mb-4">
                                <p className="text-[12px] uppercase tracking-wider text-gray-400 font-semibold mb-3 flex items-center gap-2">
                                  <RefreshCw className="w-3.5 h-3.5" /> Canjear puntos
                                </p>
                                {isCanjeing ? (
                                  <div className="space-y-3">
                                    <div>
                                      <label className="text-[11px] uppercase tracking-wider text-gray-400 font-medium mb-1.5 block">Puntos a canjear (disponibles: {client.points.toLocaleString()})</label>
                                      <input
                                        type="number"
                                        value={canjeAction.points}
                                        onChange={(e) => setCanjeAction({ ...canjeAction, points: e.target.value })}
                                        placeholder="Cantidad de puntos"
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-[14px] bg-white font-medium"
                                        min="1"
                                        max={client.points}
                                      />
                                    </div>
                                    <input
                                      type="text"
                                      value={canjeAction.description}
                                      onChange={(e) => setCanjeAction({ ...canjeAction, description: e.target.value })}
                                      placeholder="Motivo del canje (ej: Descuento en Botox)"
                                      className={inputClass}
                                    />

                                    {/* Canje preview */}
                                    {canjePoints > 0 && (
                                      <div className="bg-white rounded-xl p-4 border border-red-200">
                                        <div className="flex items-center gap-2 mb-3">
                                          <Eye className="w-3.5 h-3.5 text-red-500" />
                                          <span className="text-[12px] uppercase tracking-wider text-red-500 font-semibold">Previsualización de canje</span>
                                        </div>
                                        <div className="grid grid-cols-3 gap-4 text-center">
                                          <div>
                                            <p className="text-[11px] text-gray-400 mb-1">Puntos canjeados</p>
                                            <p className="text-[16px] font-bold text-red-500">-{canjePoints.toLocaleString()}</p>
                                          </div>
                                          <div>
                                            <p className="text-[11px] text-gray-400 mb-1">Descuento ({level.canje}%)</p>
                                            <p className="text-[16px] font-bold text-dark">S/ {canjeValue.toFixed(2)}</p>
                                          </div>
                                          <div>
                                            <p className="text-[11px] text-gray-400 mb-1">Saldo restante</p>
                                            <p className="text-[16px] font-bold text-primary">{Math.max(0, client.points - canjePoints).toLocaleString()}</p>
                                          </div>
                                        </div>
                                        {canjePoints > client.points && (
                                          <p className="text-[11px] text-red-500 text-center mt-2 font-medium">No tiene suficientes puntos</p>
                                        )}
                                      </div>
                                    )}

                                    <div className="flex items-center gap-2">
                                      <button onClick={() => handleCanjeApply(client.id)} disabled={canjePoints <= 0 || canjePoints > client.points}
                                        className="inline-flex items-center gap-2 px-4 py-2 text-[12px] font-semibold uppercase tracking-wider text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                                        <RefreshCw className="w-3.5 h-3.5" /> Aplicar canje
                                      </button>
                                      <button onClick={() => setCanjeAction({ id: null, points: '', description: '' })}
                                        className="px-4 py-2 text-[12px] font-semibold uppercase tracking-wider text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                        Cancelar
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <button onClick={(e) => { e.stopPropagation(); setCanjeAction({ id: client.id, points: '', description: '' }); setPointsAction({ id: null, soles: '', treatment: '', description: '', mode: 'treatment' }); setBonusAction({ id: null, type: '', customPoints: '', description: '' }); }}
                                    className="inline-flex items-center gap-2 px-4 py-2.5 text-[12px] font-semibold text-red-500 bg-white border border-red-200 rounded-xl hover:bg-red-50 transition-colors">
                                    <RefreshCw className="w-3.5 h-3.5" /> Canjear puntos del paciente
                                  </button>
                                )}
                              </div>

                              {/* History */}
                              {history.length > 0 && (
                                <div className="mb-4">
                                  <p className="text-[12px] uppercase tracking-wider text-gray-400 font-semibold mb-3 flex items-center gap-2">
                                    <Clock className="w-3.5 h-3.5" /> Historial de puntos
                                  </p>
                                  <div className="space-y-2 max-h-60 overflow-y-auto">
                                    {history.slice().reverse().map((entry, i) => (
                                      <div key={i} className="flex items-start justify-between px-4 py-3 bg-cream rounded-xl">
                                        <div className="flex items-start gap-3">
                                          <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${entry.type === 'add' ? 'bg-green-100' : 'bg-red-100'}`}>
                                            {entry.type === 'add' ? <Plus className="w-3 h-3 text-green-600" /> : <Minus className="w-3 h-3 text-red-500" />}
                                          </div>
                                          <div>
                                            <p className="text-[13px] font-medium text-dark">{entry.description}</p>
                                            <div className="flex items-center gap-2 mt-0.5">
                                              <p className="text-[11px] text-gray-400">{entry.date}</p>
                                              {entry.soles && <span className="text-[11px] text-gray-400">· S/ {entry.soles}</span>}
                                            </div>
                                          </div>
                                        </div>
                                        <span className={`text-[14px] font-bold flex-shrink-0 ml-3 ${entry.type === 'add' ? 'text-green-600' : 'text-red-500'}`}>
                                          {entry.type === 'add' ? '+' : '-'}{entry.amount.toLocaleString()}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Actions */}
                              <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                                <button onClick={() => handleEdit(client)} className="inline-flex items-center gap-2 px-4 py-2 text-[12px] font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                                  <Edit3 className="w-3.5 h-3.5" /> Editar datos
                                </button>
                                <button onClick={() => handleDelete(client.id)} className="inline-flex items-center gap-2 px-4 py-2 text-[12px] font-medium text-red-500 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                                  <Trash2 className="w-3.5 h-3.5" /> Eliminar
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })
              )}
            </div>
          </>
        )}

        {/* Treatments Tab */}
        {activeTab === 'treatments' && (
          <>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="font-serif text-2xl font-semibold text-dark mb-1">Base de datos de tratamientos</h2>
                <p className="text-gray-400 text-[13px]">{treatments.length} tratamientos registrados · Se usan al registrar puntos de pacientes</p>
              </div>
            </div>

            {/* Add treatment form */}
            <form onSubmit={handleAddTreatment} className="bg-white rounded-2xl p-6 shadow-soft mb-6">
              <h3 className="font-serif text-lg font-semibold text-dark mb-4">{editingTreatment ? 'Editar tratamiento' : 'Agregar tratamiento'}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <input type="text" value={treatmentForm.name} onChange={(e) => setTreatmentForm({ ...treatmentForm, name: e.target.value })} placeholder="Nombre del tratamiento" className={inputClass} required />
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-[13px]">S/</span>
                  <input type="number" value={treatmentForm.price} onChange={(e) => setTreatmentForm({ ...treatmentForm, price: e.target.value })} placeholder="Precio" className={`${inputClass} pl-10`} min="1" required />
                </div>
                <select value={treatmentForm.category} onChange={(e) => setTreatmentForm({ ...treatmentForm, category: e.target.value })} className={inputClass}>
                  <option value="Armonización">Armonización</option>
                  <option value="Cosmiatría Facial">Cosmiatría Facial</option>
                  <option value="Cosmiatría Corporal">Cosmiatría Corporal</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button type="submit" className="inline-flex items-center gap-2 px-5 py-2.5 text-[12px] font-semibold uppercase tracking-wider text-white bg-primary rounded-xl hover:bg-primary-dark transition-colors">
                  <Save className="w-3.5 h-3.5" /> {editingTreatment ? 'Guardar' : 'Agregar'}
                </button>
                {editingTreatment && (
                  <button type="button" onClick={() => { setEditingTreatment(null); setTreatmentForm({ name: '', price: '', category: 'Armonización' }); }}
                    className="px-5 py-2.5 text-[12px] font-semibold uppercase tracking-wider text-gray-500 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">Cancelar</button>
                )}
              </div>
            </form>

            {/* Search */}
            <div className="relative max-w-md mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" value={treatmentSearch} onChange={(e) => setTreatmentSearch(e.target.value)} placeholder="Buscar tratamiento..." className={`${inputClass} pl-11`} />
            </div>

            {/* Treatments by category */}
            {categories.map(cat => {
              const catTreatments = filteredTreatments.filter(t => t.category === cat);
              if (catTreatments.length === 0) return null;
              return (
                <div key={cat} className="mb-6">
                  <h3 className="text-[12px] uppercase tracking-wider text-gray-400 font-semibold mb-3">{cat}</h3>
                  <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
                    <div className="divide-y divide-gray-50">
                      {catTreatments.map(t => (
                        <div key={t.id} className="flex items-center justify-between px-6 py-4 hover:bg-cream/30 transition-colors">
                          <div className="flex-1">
                            <p className="text-[14px] font-medium text-dark">{t.name}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="text-[14px] font-bold text-dark">S/ {t.price.toLocaleString()}</p>
                              <p className="text-[11px] text-gray-400">{t.price.toLocaleString()} pts</p>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <button onClick={() => { setEditingTreatment(t.id); setTreatmentForm({ name: t.name, price: String(t.price), category: t.category }); }}
                                className="w-8 h-8 rounded-full bg-cream flex items-center justify-center text-gray-500 hover:text-primary hover:bg-primary/10 transition-colors">
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button onClick={async () => { if (confirm('¿Eliminar este tratamiento?')) { await supabase.from('treatments').delete().eq('id', t.id); setTreatments(treatments.filter(x => x.id !== t.id)); } }}
                                className="w-8 h-8 rounded-full bg-cream flex items-center justify-center text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors">
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </>
        )}

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="font-serif text-2xl font-semibold text-dark mb-1">Mensajes de contacto</h2>
                <p className="text-gray-400 text-[13px]">{contacts.length} mensaje{contacts.length !== 1 ? 's' : ''} · {contacts.filter(c => !c.read).length} sin leer</p>
              </div>
            </div>

            <div className="relative max-w-md mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" value={contactSearch} onChange={(e) => setContactSearch(e.target.value)} placeholder="Buscar por nombre o email..." className={`${inputClass} pl-11`} />
            </div>

            <div className="space-y-3">
              {contacts.filter(c => c.name.toLowerCase().includes(contactSearch.toLowerCase()) || c.email.toLowerCase().includes(contactSearch.toLowerCase())).length === 0 ? (
                <div className="bg-white rounded-2xl shadow-soft text-center py-16">
                  <MessageSquare className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm">{contactSearch ? 'No se encontraron mensajes' : 'No hay mensajes'}</p>
                </div>
              ) : (
                contacts.filter(c => c.name.toLowerCase().includes(contactSearch.toLowerCase()) || c.email.toLowerCase().includes(contactSearch.toLowerCase())).map(contact => (
                  <div key={contact.id} className={`bg-white rounded-2xl shadow-soft overflow-hidden ${!contact.read ? 'ring-1 ring-primary/30' : ''}`}>
                    <div className="px-6 py-5">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${!contact.read ? 'bg-primary/10' : 'bg-gray-100'}`}>
                            {!contact.read ? <Mail className="w-4 h-4 text-primary" /> : <MailOpen className="w-4 h-4 text-gray-400" />}
                          </div>
                          <div>
                            <p className={`text-[15px] text-dark ${!contact.read ? 'font-bold' : 'font-medium'}`}>{contact.name}</p>
                            <p className="text-[12px] text-gray-400">{contact.email}{contact.phone ? ` · ${contact.phone}` : ''}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-[11px] text-gray-400">{contact.date}</span>
                          {!contact.read && (
                            <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                          )}
                        </div>
                      </div>
                      <p className="text-[14px] text-gray-600 leading-relaxed bg-cream rounded-xl p-4">{contact.message}</p>
                      <div className="flex items-center gap-2 mt-3">
                        {!contact.read && (
                          <button onClick={async () => { await supabase.from('contacts').update({ read: true }).eq('id', contact.id); setContacts(contacts.map(c => c.id === contact.id ? { ...c, read: true } : c)); }}
                            className="inline-flex items-center gap-2 px-4 py-2 text-[12px] font-medium text-primary bg-primary/5 border border-primary/20 rounded-lg hover:bg-primary/10 transition-colors">
                            <MailOpen className="w-3.5 h-3.5" /> Marcar como leído
                          </button>
                        )}
                        <button onClick={async () => { if (confirm('¿Eliminar este mensaje?')) { await supabase.from('contacts').delete().eq('id', contact.id); setContacts(contacts.filter(c => c.id !== contact.id)); } }}
                          className="inline-flex items-center gap-2 px-4 py-2 text-[12px] font-medium text-red-500 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                          <Trash2 className="w-3.5 h-3.5" /> Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {/* Admins Tab */}
        {activeTab === 'admins' && (
          <>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="font-serif text-2xl font-semibold text-dark mb-1">Administradores</h2>
                <p className="text-gray-400 text-[13px]">{admins.length} administrador{admins.length !== 1 ? 'es' : ''} registrado{admins.length !== 1 ? 's' : ''} · Pueden acceder al panel de gestión</p>
              </div>
            </div>

            {/* Add/Edit admin form */}
            <form onSubmit={async (e) => {
              e.preventDefault();
              if (editingAdmin) {
                const updateData = { name: adminForm.name, username: adminForm.username };
                if (adminForm.password) updateData.password = adminForm.password;
                await supabase.from('admins').update(updateData).eq('id', editingAdmin);
                setAdmins(admins.map(a => a.id === editingAdmin ? { ...a, ...updateData } : a));
                setEditingAdmin(null);
              } else {
                if (!adminForm.password) return;
                const { data } = await supabase.from('admins').insert({ name: adminForm.name, username: adminForm.username, password: adminForm.password }).select().single();
                if (data) setAdmins([...admins, data]);
              }
              setAdminForm({ name: '', username: '', password: '' });
            }} className="bg-white rounded-2xl p-6 shadow-soft mb-6">
              <h3 className="font-serif text-lg font-semibold text-dark mb-4">{editingAdmin ? 'Editar administrador' : 'Nuevo administrador'}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <input type="text" value={adminForm.name} onChange={(e) => setAdminForm({ ...adminForm, name: e.target.value })} placeholder="Nombre completo" className={inputClass} required />
                <input type="text" value={adminForm.username} onChange={(e) => setAdminForm({ ...adminForm, username: e.target.value })} placeholder="Usuario" className={inputClass} required />
                <input type="text" value={adminForm.password} onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })} placeholder={editingAdmin ? 'Nueva contraseña (dejar vacío para mantener)' : 'Contraseña'} className={inputClass} required={!editingAdmin} />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="inline-flex items-center gap-2 px-5 py-2.5 text-[12px] font-semibold uppercase tracking-wider text-white bg-primary rounded-xl hover:bg-primary-dark transition-colors">
                  <Save className="w-3.5 h-3.5" /> {editingAdmin ? 'Guardar' : 'Crear administrador'}
                </button>
                {editingAdmin && (
                  <button type="button" onClick={() => { setEditingAdmin(null); setAdminForm({ name: '', username: '', password: '' }); }}
                    className="px-5 py-2.5 text-[12px] font-semibold uppercase tracking-wider text-gray-500 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">Cancelar</button>
                )}
              </div>
            </form>

            {/* Admins list */}
            <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
              <div className="divide-y divide-gray-50">
                {admins.map(admin => (
                  <div key={admin.id} className="flex items-center justify-between px-6 py-5 hover:bg-cream/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                        <Shield className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <p className="text-[15px] font-semibold text-dark">{admin.name}</p>
                        <p className="text-[12px] text-gray-400">@{admin.username} · {new Date(admin.created_at).toLocaleDateString('es-PE', { dateStyle: 'medium' })}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5 bg-cream rounded-lg px-3 py-2">
                        <span className="text-[13px] font-medium text-dark font-mono">
                          {showAdminPass[admin.id] ? admin.password : '••••••••'}
                        </span>
                        <button onClick={() => setShowAdminPass(prev => ({ ...prev, [admin.id]: !prev[admin.id] }))}
                          className="text-gray-400 hover:text-primary transition-colors ml-1">
                          {showAdminPass[admin.id] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                      <button onClick={() => { setEditingAdmin(admin.id); setAdminForm({ name: admin.name, username: admin.username, password: '' }); }}
                        className="w-9 h-9 rounded-full bg-cream flex items-center justify-center text-gray-500 hover:text-primary hover:bg-primary/10 transition-colors">
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      {admins.length > 1 && (
                        <button onClick={async () => { if (confirm(`¿Eliminar al administrador ${admin.name}?`)) { await supabase.from('admins').delete().eq('id', admin.id); setAdmins(admins.filter(a => a.id !== admin.id)); } }}
                          className="w-9 h-9 rounded-full bg-cream flex items-center justify-center text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
