interface Props {
  compact?: boolean;
  size?: number;
}

export function ZeroHourLogo({ compact = false, size = 40 }: Props) {
  const h = size;

  if (compact) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width={h} height={h} fill="none">
        <circle cx="64" cy="64" r="50" stroke="#f1f5f9" strokeWidth="10" fill="none" />
        <line x1="64" y1="14" x2="64" y2="64" stroke="#f59e0b" strokeWidth="5" strokeLinecap="round" />
        <line x1="64" y1="64" x2="64" y2="24" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
        <circle cx="64" cy="64" r="5" fill="#ef4444" />
      </svg>
    );
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 460 80"
      width={h * (460 / 80)}
      height={h}
      fill="none"
      style={{ display: 'block' }}
    >
      {/* Clock 0 icon */}
      <circle cx="44" cy="40" r="28" stroke="#f1f5f9" strokeWidth="6" fill="none" />
      <line x1="44" y1="12" x2="44" y2="40" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
      <line x1="44" y1="40" x2="44" y2="20" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
      <circle cx="44" cy="40" r="3.5" fill="#ef4444" />

      {/* Wordmark */}
      <text x="94" y="53" fontFamily="'Arial Black', Impact, sans-serif" fontSize="38" fontWeight="900" fill="#f1f5f9" letterSpacing="8">
        ZEROHOUR
      </text>
    </svg>
  );
}
