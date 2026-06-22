import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Send } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const treatments = [
  'Estética Facial',
  'Contorno Corporal',
  'Bioestimuladores',
  'Rejuvenecimiento',
  'Armonización Orofacial',
  'Tecnología Láser',
  'Otro / Consulta general',
];

export default function BookingForm() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    treatment: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Nombre requerido';
    if (!formData.phone.trim()) newErrors.phone = 'Teléfono requerido';
    if (!formData.treatment) newErrors.treatment = 'Selecciona un tratamiento';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const patient = {
      ...formData,
      id: Date.now(),
      date: new Date().toLocaleString('es-PE', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
      status: 'nuevo',
    };

    const existing = JSON.parse(localStorage.getItem('showclinic_patients') || '[]');
    existing.push(patient);
    localStorage.setItem('showclinic_patients', JSON.stringify(existing));

    setSubmitted(true);
    setFormData({ name: '', phone: '', email: '', treatment: '', message: '' });
    setErrors({});

    setTimeout(() => setSubmitted(false), 4000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  return (
    <section className="w-full overflow-hidden snap-start bg-[#F5EDE0] min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Info */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            {/* Kicker */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-px bg-[#C8A96E]"></div>
              <span className="text-[10px] tracking-[0.3em] text-[#C8A96E] font-medium">
                RESERVA TU CITA
              </span>
            </div>

            {/* Title */}
            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal leading-[1.05] text-[#2c1810] tracking-tight mb-6">
              Agenda tu{' '}
              <span className="italic text-[#C8A96E]">consulta</span>
            </h2>

            {/* Description */}
            <p className="text-sm leading-[1.8] text-[#6B5547] font-light max-w-md mb-10">
              Completa el formulario y te contactaremos para agendar tu evaluación personalizada.
            </p>

            {/* Benefits */}
            <div className="space-y-4">
              {[
                'Evaluación inicial sin costo',
                'Respuesta en menos de 24 horas',
                'Plan de tratamiento personalizado',
              ].map((benefit, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#C8A96E]/20 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-3 h-3 text-[#C8A96E]" />
                  </div>
                  <span className="text-sm text-[#6B5547] font-light">{benefit}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: Form */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <div className="bg-[#FFF8F0] p-8 border border-[#C8A96E]/10">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-16"
                >
                  <div className="w-16 h-16 rounded-full bg-[#C8A96E]/20 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-[#C8A96E]" />
                  </div>
                  <h3 className="font-serif text-2xl font-normal text-[#2c1810] mb-2">
                    ¡Registro exitoso!
                  </h3>
                  <p className="text-[#6B5547] text-sm font-light">
                    Nos pondremos en contacto contigo muy pronto.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name */}
                  <div>
                    <label className="block text-[10px] tracking-wider uppercase text-[#6B5547] mb-2">
                      Nombre completo *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Tu nombre"
                      className={`w-full px-4 py-3.5 bg-white border text-sm text-[#2c1810] placeholder:text-gray-300 focus:outline-none focus:border-[#C8A96E] transition-all duration-300 ${
                        errors.name ? 'border-red-300' : 'border-[#C8A96E]/20'
                      }`}
                    />
                    {errors.name && <p className="text-red-400 text-xs mt-1.5">{errors.name}</p>}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-[10px] tracking-wider uppercase text-[#6B5547] mb-2">
                      Teléfono / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+51 999 999 999"
                      className={`w-full px-4 py-3.5 bg-white border text-sm text-[#2c1810] placeholder:text-gray-300 focus:outline-none focus:border-[#C8A96E] transition-all duration-300 ${
                        errors.phone ? 'border-red-300' : 'border-[#C8A96E]/20'
                      }`}
                    />
                    {errors.phone && <p className="text-red-400 text-xs mt-1.5">{errors.phone}</p>}
                  </div>

                  {/* Treatment */}
                  <div>
                    <label className="block text-[10px] tracking-wider uppercase text-[#6B5547] mb-2">
                      Tratamiento de interés *
                    </label>
                    <select
                      name="treatment"
                      value={formData.treatment}
                      onChange={handleChange}
                      className={`w-full px-4 py-3.5 bg-white border text-sm focus:outline-none focus:border-[#C8A96E] transition-all duration-300 appearance-none ${
                        errors.treatment ? 'border-red-300' : 'border-[#C8A96E]/20'
                      } ${!formData.treatment ? 'text-gray-300' : 'text-[#2c1810]'}`}
                    >
                      <option value="">Selecciona un tratamiento</option>
                      {treatments.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                    {errors.treatment && <p className="text-red-400 text-xs mt-1.5">{errors.treatment}</p>}
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-[10px] tracking-wider uppercase text-[#6B5547] mb-2">
                      Mensaje (opcional)
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Cuéntanos sobre tu consulta..."
                      rows={4}
                      className="w-full px-4 py-3.5 bg-white border border-[#C8A96E]/20 text-sm text-[#2c1810] placeholder:text-gray-300 focus:outline-none focus:border-[#C8A96E] transition-all duration-300 resize-none"
                    />
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    className="w-full bg-[#C8A96E] text-[#2c1810] uppercase tracking-wider text-xs font-medium py-4 hover:bg-[#b08d52] transition-colors duration-300"
                  >
                    Enviar solicitud
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
