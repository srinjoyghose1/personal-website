// Rings distribute evenly over 100% of the spine height — no fixed px needed
export default function RingBinding({ count = 6 }) {
  const rings = Array.from({ length: count });

  return (
    <div style={{
      position: 'absolute', inset: 0,
      display: 'flex', flexDirection: 'column',
      justifyContent: 'space-evenly',
      alignItems: 'center',
      pointerEvents: 'none',
    }}>
      {rings.map((_, i) => (
        <svg key={i} width="44" height="20" viewBox="0 0 44 20" overflow="visible">
          <defs>
            <radialGradient id={`rg-${i}`} cx="38%" cy="32%" r="65%">
              <stop offset="0%"   stopColor="var(--color-ring-highlight)" />
              <stop offset="45%"  stopColor="var(--color-ring)" />
              <stop offset="100%" stopColor="var(--color-ring-shadow)" />
            </radialGradient>
            <radialGradient id={`ri-${i}`} cx="50%" cy="40%" r="60%">
              <stop offset="0%"   stopColor="#2A2A2A" />
              <stop offset="100%" stopColor="#0F0F0F" />
            </radialGradient>
          </defs>
          {/* Drop shadow */}
          <ellipse cx="22" cy="12" rx="18" ry="7.5" fill="rgba(0,0,0,0.45)" />
          {/* Ring body */}
          <ellipse cx="22" cy="10" rx="18" ry="7.5"
            fill={`url(#rg-${i})`}
            stroke="rgba(0,0,0,0.22)" strokeWidth="0.5" />
          {/* Inner hole */}
          <ellipse cx="22" cy="10" rx="12" ry="4.8" fill={`url(#ri-${i})`} />
          {/* Specular arc */}
          <path
            d={`M 10 6.5 A 12 4 0 0 1 34 6.5`}
            fill="none"
            stroke="rgba(255,255,255,0.30)"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
        </svg>
      ))}
    </div>
  );
}
