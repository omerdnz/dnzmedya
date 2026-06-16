import type { ServiceDefinition } from '@/lib/services-data';

interface ServiceIconProps {
  serviceId: string;
  className?: string;
}

export function ServiceIcon({ serviceId, className = 'h-7 w-7' }: ServiceIconProps) {
  const props = {
    className,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.5,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  switch (serviceId) {
    case 'web':
      return (
        <svg {...props}>
          <rect x="3" y="4" width="18" height="14" rx="2" />
          <path d="M3 9h18M8 4V2M16 4V2" />
          <circle cx="12" cy="14" r="2" fill="currentColor" stroke="none" opacity="0.6" />
        </svg>
      );
    case 'uiux':
      return (
        <svg {...props}>
          <rect x="5" y="3" width="14" height="18" rx="2" />
          <path d="M9 8h6M9 12h4" />
          <circle cx="17" cy="7" r="1.5" fill="currentColor" stroke="none" />
        </svg>
      );
    case 'ecommerce':
      return (
        <svg {...props}>
          <path d="M6 6h15l-1.5 9H7.5L6 6z" />
          <circle cx="9" cy="19" r="1.5" fill="currentColor" stroke="none" />
          <circle cx="17" cy="19" r="1.5" fill="currentColor" stroke="none" />
          <path d="M6 6L5 3H2" />
        </svg>
      );
    case 'software':
      return (
        <svg {...props}>
          <path d="M8 6l-4 6 4 6M16 6l4 6-4 6M14 4l-4 16" />
        </svg>
      );
    case 'branding':
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="8" />
          <path d="M12 8v8M8 12h8" opacity="0.5" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      );
    case 'social':
      return (
        <svg {...props}>
          <path d="M18 8a6 6 0 00-9.33-5M6 16a6 6 0 009.33 5" />
          <circle cx="8" cy="8" r="3" />
          <circle cx="16" cy="16" r="3" />
        </svg>
      );
    case 'video':
      return (
        <svg {...props}>
          <rect x="3" y="6" width="14" height="12" rx="2" />
          <path d="M17 10l4-2v8l-4-2" />
          <path d="M7 10l3 2-3 2V10z" fill="currentColor" stroke="none" opacity="0.5" />
        </svg>
      );
    case 'seo':
      return (
        <svg {...props}>
          <path d="M3 17l6-6 4 4 8-8" />
          <path d="M17 7h4v4" />
          <circle cx="11" cy="11" r="2" fill="currentColor" stroke="none" opacity="0.4" />
        </svg>
      );
    case 'ai':
      return (
        <svg {...props}>
          <path d="M12 3v3M12 18v3M3 12h3M18 12h3" />
          <circle cx="12" cy="12" r="5" />
          <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
          <path d="M7 7l2 2M15 15l2 2M15 7l2-2M7 17l2-2" opacity="0.6" />
        </svg>
      );
    case 'hosting':
      return (
        <svg {...props}>
          <rect x="4" y="4" width="16" height="6" rx="1.5" />
          <rect x="4" y="14" width="16" height="6" rx="1.5" />
          <circle cx="8" cy="7" r="1" fill="currentColor" stroke="none" />
          <circle cx="8" cy="17" r="1" fill="currentColor" stroke="none" />
          <path d="M12 7h5M12 17h5" opacity="0.5" />
        </svg>
      );
    default:
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="8" />
        </svg>
      );
  }
}

export function ServiceIcon3D({
  service,
  styles,
}: {
  service: ServiceDefinition;
  styles: { icon: string };
}) {
  return (
    <div className="relative">
      <div
        className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${styles.icon} blur-xl opacity-60 transition-opacity duration-500 group-hover:opacity-100`}
      />
      <div
        className={`relative flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br ${styles.icon} text-brand-white shadow-soft backdrop-blur-sm transition-all duration-500 group-hover:scale-110 group-hover:border-white/20`}
        style={{ transform: 'translateZ(20px)' }}
      >
        <ServiceIcon serviceId={service.id} className="h-7 w-7" />
      </div>
    </div>
  );
}
