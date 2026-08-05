import { BadgeInfo } from 'lucide-react';

/**
 * Condición de canje de los puntos Showclinic.
 * Un solo lugar para el texto, así se mantiene idéntico en todas las pantallas.
 *
 * variante: 'clara'  → sobre fondos claros (modal de acceso, panel del paciente)
 *           'oscura' → sobre fondos oscuros (barra de cuenta, secciones en negro)
 */
export default function CanjeNota({ variante = 'clara', className = '' }) {
  const oscura = variante === 'oscura';

  return (
    <div
      className={`flex items-start gap-2.5 rounded-xl px-3.5 py-3 ${
        oscura
          ? 'bg-white/[0.07] ring-1 ring-white/12'
          : 'bg-cream/70 ring-1 ring-primary/12'
      } ${className}`}
    >
      <BadgeInfo
        className={`w-3.5 h-3.5 mt-[1px] flex-shrink-0 ${oscura ? 'text-primary-light' : 'text-primary'}`}
        strokeWidth={2}
      />
      <p className={`text-[11.5px] leading-[1.55] ${oscura ? 'text-white/60' : 'text-gray-500'}`}>
        Tus puntos Showclinic son canjeables como descuento en{' '}
        <span className={`font-semibold ${oscura ? 'text-white/85' : 'text-dark'}`}>
          tratamientos estéticos mayores a S/&nbsp;2,500
        </span>
        .
      </p>
    </div>
  );
}
