import type { Metadata } from 'next';
import { ServicesPage } from '@/components/services/services-page';
import { mapApiServicesToDefinitions } from '@/lib/service-mapper';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Hizmetler',
  description:
    'DNZMEDYA premium dijital hizmetleri: web tasarım, UI/UX, e-ticaret, özel yazılım, marka kimliği, sosyal medya, video, SEO, yapay zeka otomasyonu ve hosting altyapısı.',
  openGraph: {
    title: 'Hizmetler | DNZMEDYA',
    description:
      'Dijital dünyada markanızı büyüten premium çözümler — web, SEO, e-ticaret, AI otomasyon ve daha fazlası.',
  },
};

async function fetchServices() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';
  try {
    const res = await fetch(`${apiUrl}/services?published=true&limit=100`, { cache: 'no-store' });
    if (!res.ok) return [];
    const json = await res.json() as { data?: unknown[] };
    return mapApiServicesToDefinitions((json.data ?? []) as Parameters<typeof mapApiServicesToDefinitions>[0]);
  } catch {
    return [];
  }
}

export default async function HizmetlerPage() {
  const services = await fetchServices();
  return <ServicesPage services={services} />;
}
