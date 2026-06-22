export default function MarqueeBanner() {
  const text = 'CONSULTA GRATUITA HOY';
  const repeat = 12;

  return (
    <div className="relative overflow-hidden bg-primary py-4 z-10">
      <div className="animate-marquee flex whitespace-nowrap">
        {[...Array(repeat)].map((_, i) => (
          <span
            key={i}
            className="mx-8 text-sm font-semibold uppercase tracking-[0.25em] text-white/90 flex items-center gap-4"
          >
            <span className="w-2 h-2 bg-white/40 rounded-full" />
            {text}
          </span>
        ))}
        {[...Array(repeat)].map((_, i) => (
          <span
            key={`dup-${i}`}
            className="mx-8 text-sm font-semibold uppercase tracking-[0.25em] text-white/90 flex items-center gap-4"
          >
            <span className="w-2 h-2 bg-white/40 rounded-full" />
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}
