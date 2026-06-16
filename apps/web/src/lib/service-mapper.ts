import type { ServiceDefinition } from '@/lib/services-data';

export interface ApiService {
  id: string;
  slug: string;
  title: string;
  subtitle?: string | null;
  description?: string | null;
  features?: unknown;
  content?: unknown;
}

const ACCENTS = new Set([
  'cyan', 'gold', 'violet', 'emerald', 'rose', 'amber', 'sky', 'indigo', 'fuchsia', 'teal',
]);

export function mapApiServiceToDefinition(service: ApiService): ServiceDefinition {
  const content = service.content as { accent?: string } | null | undefined;
  const rawFeatures = service.features;
  const highlights = Array.isArray(rawFeatures)
    ? rawFeatures.filter((item): item is string => typeof item === 'string')
    : [];

  const accent = content?.accent && ACCENTS.has(content.accent)
    ? (content.accent as ServiceDefinition['accent'])
    : 'cyan';

  return {
    id: service.slug,
    title: service.title,
    tagline: service.subtitle ?? '',
    description: service.description ?? '',
    highlights,
    accent,
  };
}

export function mapApiServicesToDefinitions(services: ApiService[]): ServiceDefinition[] {
  return services.map(mapApiServiceToDefinition);
}
