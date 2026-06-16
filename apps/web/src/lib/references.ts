export interface ReferenceItem {
  id: string;
  title: string;
  client: string;
  description?: string;
  url?: string;
  category?: string;
  logoUrl?: string | null;
  logoSlug?: string | null;
  image?: { url: string } | null;
}

const LOGO_FALLBACK: Record<string, { slug: string; color: string }> = {
  Google: { slug: 'google', color: '4285F4' },
  Microsoft: { slug: 'microsoft', color: '00A4EF' },
  Apple: { slug: 'apple', color: 'FFFFFF' },
  'Amazon Web Services': { slug: 'amazon', color: 'FF9900' },
  Meta: { slug: 'meta', color: '0866FF' },
  Netflix: { slug: 'netflix', color: 'E50914' },
  Spotify: { slug: 'spotify', color: '1DB954' },
  Shopify: { slug: 'shopify', color: '7AB55C' },
  Stripe: { slug: 'stripe', color: '635BFF' },
  Vercel: { slug: 'vercel', color: 'FFFFFF' },
  OpenAI: { slug: 'openai', color: 'FFFFFF' },
  NVIDIA: { slug: 'nvidia', color: '76B900' },
  Adobe: { slug: 'adobe', color: 'FF0000' },
  Salesforce: { slug: 'salesforce', color: '00A1E0' },
  Oracle: { slug: 'oracle', color: 'F80000' },
  IBM: { slug: 'ibm', color: 'FFFFFF' },
  Intel: { slug: 'intel', color: '0071C5' },
  Samsung: { slug: 'samsung', color: '1428A0' },
  Tesla: { slug: 'tesla', color: 'CC0000' },
  GitHub: { slug: 'github', color: 'FFFFFF' },
};

export function getReferenceLogoUrl(ref: ReferenceItem): string | null {
  if (ref.logoUrl) return ref.logoUrl;
  if (ref.image?.url) return ref.image.url;

  if (ref.logoSlug) {
    const fallback = LOGO_FALLBACK[ref.title];
    const color = fallback?.slug === ref.logoSlug ? fallback.color : 'FFFFFF';
    return `https://cdn.simpleicons.org/${ref.logoSlug}/${color}`;
  }

  const logo = LOGO_FALLBACK[ref.title];
  if (!logo) return null;

  return `https://cdn.simpleicons.org/${logo.slug}/${logo.color}`;
}

export function getReferenceInitials(title: string): string {
  return title
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}
