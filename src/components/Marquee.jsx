const items = [
  'ESTÉTICA FACIAL',
  'ARMONIZACIÓN OROFACIAL',
  'DISEÑO DE LABIOS',
  'BABY BOTOX',
  'HIFU FACIAL',
  'CARBOXITERAPIA',
  'EM SLIM',
  'MEDICINA ESTÉTICA',
  'PROYECCIÓN DE MENTÓN',
  'EXPERTOS EN BELLEZA',
];

export default function Marquee() {
  const text = items.map((item) => `${item}  ✦  `).join('');

  return (
    <div className="bg-accent py-5 overflow-hidden select-none">
      <div className="flex whitespace-nowrap animate-marquee">
        {[...Array(4)].map((_, i) => (
          <span key={i} className="font-serif text-lg md:text-xl text-white/30 tracking-[0.1em] font-medium">
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}
