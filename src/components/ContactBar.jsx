import { Mail, Phone, MapPin, Clock } from 'lucide-react';

const items = [
  { icon: Mail, label: 'Email', value: 'showclinicyanahuara@gmail.com', href: 'mailto:showclinicyanahuara@gmail.com' },
  { icon: Phone, label: 'Teléfono', value: '+51 974 212 114', href: 'tel:+51974212114' },
  { icon: MapPin, label: 'Ubicación', value: 'Av. Ejército 616, Yanahuara', href: '#contact' },
  {
    icon: Clock,
    label: 'Horario',
    value: null,
    lines: ['Lun - Vie: 9am a 1pm / 4pm a 8pm', 'Sábado: 9am a 1pm'],
    href: null,
  },
];

export default function ContactBar() {
  return (
    <div className="bg-white border-y border-gray-100">
      <div className="container-fluid">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-gray-100">
          {items.map((item) => {
            const Wrapper = item.href ? 'a' : 'div';
            return (
              <Wrapper
                key={item.label}
                {...(item.href ? { href: item.href } : {})}
                className="flex items-center gap-4 py-5 lg:py-6 px-4 lg:px-6 group hover:bg-cream/50 transition-colors duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-cream flex items-center justify-center flex-shrink-0 group-hover:bg-primary/10 transition-colors duration-300">
                  <item.icon className="w-4 h-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-[0.15em] text-gray-400 font-medium mb-0.5">{item.label}</p>
                  {item.lines ? (
                    <div>
                      {item.lines.map((line, i) => (
                        <p key={i} className="text-[12px] lg:text-[13px] font-medium text-dark leading-snug">{line}</p>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[13px] font-medium text-dark truncate">{item.value}</p>
                  )}
                </div>
              </Wrapper>
            );
          })}
        </div>
      </div>
    </div>
  );
}
