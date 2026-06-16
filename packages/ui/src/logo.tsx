import { useId } from 'react';
import { cn } from './lib/cn';

export function LogoInline({ className }: { className?: string }) {
  const uid = useId().replace(/:/g, '');

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 440 96"
      fill="none"
      className={cn('h-14 w-auto', className)}
      role="img"
      aria-label="DNZMEDYA"
    >
      <defs>
        <radialGradient id={`${uid}-planet`} cx="38%" cy="32%" r="68%">
          <stop offset="0%" stopColor="#40E8EB" />
          <stop offset="45%" stopColor="#00CED1" />
          <stop offset="100%" stopColor="#0B3D5C" />
        </radialGradient>
        <linearGradient id={`${uid}-nebula`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00CED1" />
          <stop offset="45%" stopColor="#818CF8" />
          <stop offset="100%" stopColor="#D4AF37" />
        </linearGradient>
        <linearGradient id={`${uid}-beam`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#00CED1" stopOpacity="0" />
          <stop offset="50%" stopColor="#00CED1" />
          <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
        </linearGradient>
        <filter id={`${uid}-glow`} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id={`${uid}-softGlow`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Space emblem */}
      <g filter={`url(#${uid}-glow)`}>
        <circle cx="52" cy="48" r="34" stroke="#00CED1" strokeWidth="0.75" strokeOpacity="0.25" fill="#0A1424" />
        <circle cx="52" cy="48" r="34" stroke={`url(#${uid}-beam)`} strokeWidth="1" strokeOpacity="0.5" fill="none" strokeDasharray="4 6" />

        <ellipse cx="52" cy="48" rx="30" ry="11" stroke="#00CED1" strokeWidth="0.9" strokeOpacity="0.55" transform="rotate(-18 52 48)" />
        <ellipse cx="52" cy="48" rx="24" ry="8" stroke="#818CF8" strokeWidth="0.75" strokeOpacity="0.45" transform="rotate(32 52 48)" />

        <circle cx="52" cy="48" r="19" fill={`url(#${uid}-planet)`} />
        <circle cx="52" cy="48" r="19" stroke="#40E8EB" strokeWidth="0.6" strokeOpacity="0.35" fill="none" />
        <path
          d="M38 42c6-4 14-4 20 0"
          stroke="#FFFFFF"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeOpacity="0.35"
          fill="none"
        />

        <circle cx="78" cy="34" r="3.2" fill="#D4AF37" filter={`url(#${uid}-softGlow)`} />
        <path d="M76 34 L78 30 L80 34 L78 38 Z" fill="#FFFFFF" opacity="0.85" />

        <circle cx="24" cy="58" r="2" fill="#00CED1" opacity="0.9" />
        <circle cx="68" cy="66" r="1.5" fill="#FFFFFF" opacity="0.7" />
        <circle cx="30" cy="28" r="1.5" fill="#818CF8" opacity="0.8" />
      </g>

      {/* Satellite */}
      <g transform="translate(72 38) rotate(24)">
        <rect x="-4" y="-2.5" width="8" height="5" rx="1" fill="#CBD5E1" />
        <rect x="-10" y="-1" width="5" height="2" rx="0.5" fill="#00CED1" opacity="0.85" />
        <rect x="5" y="-1" width="5" height="2" rx="0.5" fill="#00CED1" opacity="0.85" />
        <circle cx="0" cy="0" r="1.2" fill="#D4AF37" />
      </g>

      {/* Constellation left */}
      <g stroke="#00CED1" strokeWidth="0.8" strokeOpacity="0.45" fill="none">
        <line x1="96" y1="30" x2="108" y2="42" />
        <line x1="108" y1="42" x2="104" y2="58" />
        <circle cx="96" cy="30" r="2" fill="#00CED1" stroke="none" opacity="0.8" />
        <circle cx="108" cy="42" r="1.5" fill="#818CF8" stroke="none" opacity="0.7" />
        <circle cx="104" cy="58" r="1.5" fill="#FFFFFF" stroke="none" opacity="0.6" />
      </g>

      {/* Wordmark */}
      <text
        x="118"
        y="44"
        fontFamily="Montserrat, system-ui, sans-serif"
        fontSize="40"
        fontWeight="800"
        fill={`url(#${uid}-nebula)`}
        letterSpacing="5"
        filter={`url(#${uid}-glow)`}
      >
        DNZ
      </text>

      <line x1="118" y1="54" x2="420" y2="54" stroke={`url(#${uid}-beam)`} strokeWidth="1.2" opacity="0.75" />
      <polygon points="268,54 272,50 276,54 272,58" fill="#D4AF37" opacity="0.9" />

      <text
        x="118"
        y="78"
        fontFamily="Montserrat, system-ui, sans-serif"
        fontSize="22"
        fontWeight="700"
        fill="#FFFFFF"
        letterSpacing="10"
        opacity="0.95"
      >
        MEDYA
      </text>

      {/* Constellation right */}
      <g stroke="#818CF8" strokeWidth="0.8" strokeOpacity="0.4" fill="none">
        <line x1="390" y1="28" x2="408" y2="36" />
        <line x1="408" y1="36" x2="402" y2="52" />
        <line x1="402" y1="52" x2="420" y2="58" />
        <circle cx="390" cy="28" r="1.8" fill="#00CED1" stroke="none" opacity="0.75" />
        <circle cx="408" cy="36" r="1.5" fill="#D4AF37" stroke="none" opacity="0.8" />
        <circle cx="420" cy="58" r="1.5" fill="#FFFFFF" stroke="none" opacity="0.65" />
      </g>

      {/* Tech scan line */}
      <rect x="118" y="84" width="72" height="1.5" rx="0.75" fill="#00CED1" opacity="0.35" />
      <rect x="196" y="84" width="24" height="1.5" rx="0.75" fill="#D4AF37" opacity="0.5" />
    </svg>
  );
}
