import { useState, useEffect } from 'react';
import { Phone, Mail, Trash2, ArrowLeft, Search, Users, Clock, MessageSquare } from 'lucide-react';

export default function AdminPanel({ onBack }) {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('todos');

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('showclinic_patients') || '[]');
    setPatients(stored.reverse());
  }, []);

  const deletePatient = (id) => {
    const updated = patients.filter((p) => p.id !== id);
    setPatients(updated);
    localStorage.setItem('showclinic_patients', JSON.stringify(updated));
  };

  const updateStatus = (id, newStatus) => {
    const updated = patients.map((p) =>
      p.id === id ? { ...p, status: newStatus } : p
    );
    setPatients(updated);
    localStorage.setItem('showclinic_patients', JSON.stringify(updated));
  };

  const filteredPatients = patients.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.phone.includes(search) ||
      p.treatment.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === 'todos' || p.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const statusColors = {
    nuevo: 'bg-blue-50 text-blue-600',
    contactado: 'bg-amber-50 text-amber-600',
    agendado: 'bg-green-50 text-green-600',
    completado: 'bg-gray-100 text-gray-500',
  };

  const stats = {
    total: patients.length,
    nuevos: patients.filter((p) => p.status === 'nuevo').length,
    contactados: patients.filter((p) => p.status === 'contactado').length,
    agendados: patients.filter((p) => p.status === 'agendado').length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-dark transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Volver al sitio
              </button>
              <div className="h-6 w-px bg-gray-200" />
              <h1 className="font-serif text-lg font-semibold text-dark">
                Show<span className="text-primary italic">Clinic</span>
                <span className="text-gray-400 font-sans text-sm font-normal ml-2">Admin</span>
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total registros', value: stats.total, icon: Users, color: 'text-dark' },
            { label: 'Nuevos', value: stats.nuevos, icon: Clock, color: 'text-blue-500' },
            { label: 'Contactados', value: stats.contactados, icon: Phone, color: 'text-amber-500' },
            { label: 'Agendados', value: stats.agendados, icon: MessageSquare, color: 'text-green-500' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl p-5 border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <p className="text-2xl font-semibold text-dark">{stat.value}</p>
              <p className="text-xs text-gray-400 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nombre, teléfono o tratamiento..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-gray-100 text-sm text-dark placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            {['todos', 'nuevo', 'contactado', 'agendado', 'completado'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                  filterStatus === status
                    ? 'bg-dark text-white'
                    : 'bg-white text-gray-500 border border-gray-100 hover:bg-gray-50'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        {filteredPatients.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
            <Users className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <h3 className="font-semibold text-dark mb-1">Sin registros</h3>
            <p className="text-sm text-gray-400">
              {patients.length === 0
                ? 'Aún no hay pacientes registrados. Los registros aparecerán aquí cuando alguien complete el formulario.'
                : 'No se encontraron resultados para tu búsqueda.'}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-50">
                    <th className="text-left px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-gray-400">Paciente</th>
                    <th className="text-left px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-gray-400">Contacto</th>
                    <th className="text-left px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-gray-400">Tratamiento</th>
                    <th className="text-left px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-gray-400">Fecha</th>
                    <th className="text-left px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-gray-400">Estado</th>
                    <th className="text-right px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-gray-400">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPatients.map((patient) => (
                    <tr key={patient.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-cream flex items-center justify-center text-xs font-semibold text-primary-dark">
                            {patient.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-dark">{patient.name}</p>
                            {patient.message && (
                              <p className="text-[11px] text-gray-400 truncate max-w-[200px]">{patient.message}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <a href={`tel:${patient.phone}`} className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-dark transition-colors">
                            <Phone className="w-3 h-3" />
                            {patient.phone}
                          </a>
                          {patient.email && (
                            <a href={`mailto:${patient.email}`} className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-dark transition-colors">
                              <Mail className="w-3 h-3" />
                              {patient.email}
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">{patient.treatment}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs text-gray-400">{patient.date}</span>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={patient.status}
                          onChange={(e) => updateStatus(patient.id, e.target.value)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-medium border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20 ${statusColors[patient.status] || 'bg-gray-100 text-gray-500'}`}
                        >
                          <option value="nuevo">Nuevo</option>
                          <option value="contactado">Contactado</option>
                          <option value="agendado">Agendado</option>
                          <option value="completado">Completado</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <a
                            href={`https://wa.me/${patient.phone.replace(/\D/g, '')}?text=Hola%20${encodeURIComponent(patient.name)}%2C%20gracias%20por%20registrarte%20en%20ShowClinic.`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-8 h-8 rounded-lg bg-green-50 hover:bg-green-100 flex items-center justify-center transition-colors"
                            title="Enviar WhatsApp"
                          >
                            <MessageSquare className="w-3.5 h-3.5 text-green-600" />
                          </a>
                          <button
                            onClick={() => deletePatient(patient.id)}
                            className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-red-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-gray-50">
              {filteredPatients.map((patient) => (
                <div key={patient.id} className="p-5 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-cream flex items-center justify-center text-xs font-semibold text-primary-dark">
                        {patient.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-dark">{patient.name}</p>
                        <p className="text-xs text-gray-400">{patient.date}</p>
                      </div>
                    </div>
                    <select
                      value={patient.status}
                      onChange={(e) => updateStatus(patient.id, e.target.value)}
                      className={`px-2 py-1 rounded-lg text-[11px] font-medium border-0 ${statusColors[patient.status]}`}
                    >
                      <option value="nuevo">Nuevo</option>
                      <option value="contactado">Contactado</option>
                      <option value="agendado">Agendado</option>
                      <option value="completado">Completado</option>
                    </select>
                  </div>
                  <div className="text-sm text-gray-600">{patient.treatment}</div>
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <a href={`tel:${patient.phone}`} className="flex items-center gap-1 hover:text-dark">
                      <Phone className="w-3 h-3" /> {patient.phone}
                    </a>
                    {patient.email && (
                      <a href={`mailto:${patient.email}`} className="flex items-center gap-1 hover:text-dark">
                        <Mail className="w-3 h-3" /> {patient.email}
                      </a>
                    )}
                  </div>
                  {patient.message && (
                    <p className="text-xs text-gray-400 italic">"{patient.message}"</p>
                  )}
                  <div className="flex items-center gap-2 pt-1">
                    <a
                      href={`https://wa.me/${patient.phone.replace(/\D/g, '')}?text=Hola%20${encodeURIComponent(patient.name)}%2C%20gracias%20por%20registrarte%20en%20ShowClinic.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2 rounded-lg bg-green-50 text-green-600 text-xs font-medium text-center hover:bg-green-100 transition-colors"
                    >
                      WhatsApp
                    </a>
                    <button
                      onClick={() => deletePatient(patient.id)}
                      className="py-2 px-4 rounded-lg bg-red-50 text-red-400 text-xs font-medium hover:bg-red-100 transition-colors"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
