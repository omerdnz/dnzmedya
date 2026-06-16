import { HeroSection } from '@/components/sections/hero';
import { AboutSection } from '@/components/sections/about';
import { ServicesSection } from '@/components/sections/services';
import { ReferencesSection } from '@/components/sections/references';
import { FaqSection } from '@/components/sections/faq';
import { ContactSection } from '@/components/sections/contact';
import { apiFetch } from '@/lib/api';
import type { HeroData, ServiceItem } from '@dnzmedya/types';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getHero(): Promise<HeroData | null> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  try {
    const res = await fetch(`${apiUrl}/api/v1/hero/active`, {
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) return null;
    return res.json() as Promise<HeroData>;
  } catch {
    return null;
  }
}

async function getServices(): Promise<ServiceItem[]> {
  try {
    const res = await apiFetch<{ data: ServiceItem[] }>('/services?published=true&limit=100');
    const featured = res.data.filter((s) => s.isFeatured);
    return (featured.length > 0 ? featured : res.data).slice(0, 6);
  } catch {
    return [];
  }
}

async function getReferences() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:4000';
  try {
    const res = await fetch(`${apiUrl}/api/v1/references?published=true&limit=20`, {
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) return [];
    const json = (await res.json()) as {
      data: Array<{
        id: string;
        title: string;
        client: string;
        description?: string;
        url?: string;
        category?: string;
        image?: { url: string } | null;
      }>;
    };
    return json.data ?? [];
  } catch {
    return [];
  }
}

async function getFaqs() {
  try {
    const res = await apiFetch<{ data: Array<{ id: string; question: string; answer: string }> }>('/faqs/published');
    return res.data ?? [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const [hero, services, references, faqs] = await Promise.all([
    getHero(),
    getServices(),
    getReferences(),
    getFaqs(),
  ]);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'DNZMEDYA',
    url: process.env.NEXT_PUBLIC_SITE_URL,
    description: 'Yazılım, SEO ve Dijital Reklam Ajansı',
    address: { '@type': 'PostalAddress', addressLocality: 'Antalya', addressCountry: 'TR' },
    contactPoint: { '@type': 'ContactPoint', telephone: '+905336169484', contactType: 'customer service' },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HeroSection data={hero} />
      <AboutSection />
      <ServicesSection services={services} />
      <ReferencesSection references={references} />
      <FaqSection faqs={faqs} />
      <ContactSection />
    </>
  );
}
