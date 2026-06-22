// Single source of truth for the ShowClinic Club membership card themes.
// Used by the client account panel and the public "ShowClinic Club" showcase.
export const cardThemes = {
  Bronce: {
    label: 'Bronce', icon: 'I', range: '0 – 4,999 pts', canje: '3%',
    base: 'radial-gradient(at 16% 18%, #7a4a23 0, transparent 55%), radial-gradient(at 86% 8%, #d9913f 0, transparent 44%), radial-gradient(at 72% 96%, #170d05 0, transparent 52%), linear-gradient(130deg, #3a240f 0%, #5c3a1c 45%, #1c1209 100%)',
    glow: 'rgba(217,145,63,0.55)', chip: 'from-amber-300 to-amber-600',
  },
  Plata: {
    label: 'Plata', icon: 'II', range: '5,000 – 9,999 pts', canje: '4%',
    base: 'radial-gradient(at 18% 16%, #5e6470 0, transparent 55%), radial-gradient(at 84% 8%, #cdd3dd 0, transparent 42%), radial-gradient(at 74% 96%, #0d0f13 0, transparent 52%), linear-gradient(130deg, #2c2f37 0%, #474b54 45%, #14161a 100%)',
    glow: 'rgba(214,219,227,0.50)', chip: 'from-gray-200 to-gray-400',
  },
  Oro: {
    label: 'Gold', icon: 'III', range: '10,000 – 19,999 pts', canje: '5%',
    base: 'radial-gradient(at 16% 18%, #84691f 0, transparent 55%), radial-gradient(at 86% 6%, #f0cd72 0, transparent 45%), radial-gradient(at 72% 96%, #181102 0, transparent 52%), linear-gradient(130deg, #3c2f14 0%, #6b551f 45%, #181206 100%)',
    glow: 'rgba(240,205,114,0.62)', chip: 'from-yellow-300 to-amber-500',
  },
  Platinium: {
    label: 'Platinium', icon: 'IV', range: '20,000 – 29,999 pts', canje: '6%',
    base: 'radial-gradient(at 18% 16%, #503e75 0, transparent 55%), radial-gradient(at 84% 8%, #cbb2f0 0, transparent 42%), radial-gradient(at 74% 96%, #110c1a 0, transparent 52%), linear-gradient(130deg, #2e2542 0%, #4a3563 45%, #130f1b 100%)',
    glow: 'rgba(203,178,240,0.52)', chip: 'from-violet-200 to-violet-400',
  },
  Diamante: {
    label: 'Diamond', icon: 'V', range: '30,000+ pts', canje: '7%',
    base: 'radial-gradient(at 16% 18%, #215168 0, transparent 55%), radial-gradient(at 86% 6%, #a7ebf7 0, transparent 44%), radial-gradient(at 72% 96%, #05101a 0, transparent 52%), linear-gradient(130deg, #103145 0%, #1d3a52 45%, #0a1018 100%)',
    glow: 'rgba(167,235,247,0.55)', chip: 'from-cyan-200 to-sky-400',
  },
};

export const tierOrder = ['Bronce', 'Plata', 'Oro', 'Platinium', 'Diamante'];
