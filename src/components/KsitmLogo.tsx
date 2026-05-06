interface Props { size?: number; className?: string; }
export default function KsitmLogo({ size = 40, className = "" }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={className} aria-label="KSITM crest">
      <defs>
        <linearGradient id="ksitm-shield" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="hsl(273 82% 45%)" />
          <stop offset="100%" stopColor="hsl(273 82% 22%)" />
        </linearGradient>
      </defs>
      <path d="M32 2 L58 12 V32 C58 48 32 62 32 62 C32 62 6 48 6 32 V12 Z"
        fill="url(#ksitm-shield)" stroke="hsl(23 91% 54%)" strokeWidth="2" />
      <polygon points="32,16 44,24 44,38 32,46 20,38 20,24" fill="none" stroke="hsl(23 91% 54%)" strokeWidth="1.5" />
      <text x="32" y="36" textAnchor="middle" fontFamily="Clash Display, sans-serif"
        fontWeight="700" fontSize="14" fill="white">KS</text>
    </svg>
  );
}
