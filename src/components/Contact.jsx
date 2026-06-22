import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

const inputBase = 'w-full px-5 py-4 bg-cream border border-gray-200 rounded-xl text-[15px] text-dark placeholder:text-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all duration-300';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!formData.name.trim()) e.name = 'Nombre requerido';
    if (!formData.email.trim()) e.email = 'Email requerido';
    if (!formData.message.trim()) e.message = 'Mensaje requerido';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
    const date = new Date().toLocaleString('es-PE', { dateStyle: 'medium', timeStyle: 'short' });
    await supabase.from('contacts').insert({ name: formData.name.trim(), email: formData.email.trim(), phone: formData.phone.trim() || null, message: formData.message.trim(), date });
    setSubmitted(true);
    setFormData({ name: '', email: '', phone: '', message: '' });
    setErrors({});
    setTimeout(() => setSubmitted(false), 4000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  return (
    <section id="contact" className="bg-cream">
      <div className="container-fluid py-20 md:py-28 2xl:py-36">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 md:mb-18">
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="w-10 h-[2px] bg-primary" />
            <span className="text-[12px] font-semibold uppercase tracking-[0.2em] text-primary">
              Contacto
            </span>
            <div className="w-10 h-[2px] bg-primary" />
          </div>
          <h2 className="font-serif font-semibold text-dark tracking-tight leading-[1.1] mb-4">
            Agenda tu consulta hoy
          </h2>
          <p className="text-gray-500">
            Completa el formulario y nos pondremos en contacto contigo
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white p-8 md:p-10 rounded-2xl shadow-soft"
          >
            {submitted ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-serif text-2xl font-semibold text-dark mb-2">¡Mensaje enviado!</h3>
                <p className="text-gray-500 text-sm">Te contactaremos pronto.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Nombre completo" className={`${inputBase} ${errors.name ? 'border-red-400' : ''}`} />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className={`${inputBase} ${errors.email ? 'border-red-400' : ''}`} />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>
                </div>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Teléfono (opcional)" className={inputBase} />
                <div>
                  <textarea name="message" value={formData.message} onChange={handleChange} placeholder="¿En qué podemos ayudarte?" rows={5} className={`${inputBase} resize-none ${errors.message ? 'border-red-400' : ''}`} />
                  {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
                </div>
                <button type="submit" className="w-full bg-accent text-white uppercase tracking-wider text-[13px] font-semibold py-4 rounded-xl hover:bg-dark transition-colors duration-300">
                  Enviar mensaje
                </button>
                <p className="text-xs text-gray-400 text-center">
                  Al enviar aceptas nuestra <a href="#" className="text-primary hover:underline">política de privacidad</a>
                </p>
              </form>
            )}
          </motion.div>

          {/* Map */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="min-h-[400px] lg:min-h-0 rounded-2xl overflow-hidden shadow-soft"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d821.5771759223795!2d-71.54541322397263!3d-16.39055484702853!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x91424bdbcdb4fe49%3A0xd7dc19185f13d70b!2sShowclinic%20Yanahuara!5e0!3m2!1ses-419!2spe!4v1780092101550!5m2!1ses-419!2spe"
              width="100%" height="100%" style={{ border: 0, minHeight: 400 }} allowFullScreen="" loading="lazy"
              referrerPolicy="no-referrer-when-downgrade" title="Ubicación ShowClinic Yanahuara"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
