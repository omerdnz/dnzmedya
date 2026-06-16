export type BlogContentBlock =
  | { type: 'heading'; level: 2 | 3; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'quote'; text: string };

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt?: string | null;
  content: unknown;
  publishedAt?: string | null;
  viewCount?: number;
  categories?: { slug: string; name: string }[];
  tags?: { slug: string; name: string }[];
  author?: { firstName: string; lastName: string };
}

export const BLOG_ACCENTS: Record<string, { gradient: string; badge: string; glow: string }> = {
  cyan: {
    gradient: 'from-cyan-500/20 via-brand-cyan/10 to-transparent',
    badge: 'bg-brand-cyan/10 text-brand-cyan border-brand-cyan/20',
    glow: 'group-hover:shadow-[0_0_40px_rgba(0,206,209,0.2)]',
  },
  gold: {
    gradient: 'from-brand-gold/20 via-amber-500/10 to-transparent',
    badge: 'bg-brand-gold/10 text-brand-gold border-brand-gold/20',
    glow: 'group-hover:shadow-[0_0_40px_rgba(212,175,55,0.2)]',
  },
  violet: {
    gradient: 'from-violet-500/20 via-purple-500/10 to-transparent',
    badge: 'bg-violet-500/10 text-violet-300 border-violet-500/20',
    glow: 'group-hover:shadow-[0_0_40px_rgba(139,92,246,0.2)]',
  },
  emerald: {
    gradient: 'from-emerald-500/20 via-green-500/10 to-transparent',
    badge: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
    glow: 'group-hover:shadow-[0_0_40px_rgba(16,185,129,0.2)]',
  },
  amber: {
    gradient: 'from-amber-500/20 via-orange-500/10 to-transparent',
    badge: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
    glow: 'group-hover:shadow-[0_0_40px_rgba(245,158,11,0.2)]',
  },
  rose: {
    gradient: 'from-rose-500/20 via-pink-500/10 to-transparent',
    badge: 'bg-rose-500/10 text-rose-300 border-rose-500/20',
    glow: 'group-hover:shadow-[0_0_40px_rgba(244,63,94,0.2)]',
  },
  sky: {
    gradient: 'from-sky-500/20 via-blue-500/10 to-transparent',
    badge: 'bg-sky-500/10 text-sky-300 border-sky-500/20',
    glow: 'group-hover:shadow-[0_0_40px_rgba(14,165,233,0.2)]',
  },
  indigo: {
    gradient: 'from-indigo-500/20 via-indigo-600/10 to-transparent',
    badge: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20',
    glow: 'group-hover:shadow-[0_0_40px_rgba(99,102,241,0.2)]',
  },
};

const SLUG_ACCENT: Record<string, keyof typeof BLOG_ACCENTS> = {
  'nextjs-vercel-modern-web-gelistirme': 'cyan',
  'shopify-woocommerce-e-ticaret-karsilastirma': 'amber',
  'figma-ui-ux-tasarim-standardi': 'violet',
  'aws-google-cloud-bulut-altyapi': 'indigo',
  'openai-groq-yapay-zeka-otomasyon': 'sky',
  'google-ads-meta-ads-dijital-pazarlama': 'emerald',
  'nestjs-nodejs-ozel-yazilim-mimarisi': 'cyan',
  'stripe-odeme-altyapilari-e-ticaret': 'gold',
  'instagram-tiktok-sosyal-medya-icerik': 'rose',
  'seo-teknik-optimizasyon-rehberi': 'emerald',
};

export function getPostAccent(slug: string) {
  return BLOG_ACCENTS[SLUG_ACCENT[slug] ?? 'cyan'];
}

export function estimateReadMinutes(content: unknown): number {
  const blocks = parseContentBlocks(content);
  const words = blocks.reduce((acc, b) => {
    if (b.type === 'paragraph' || b.type === 'quote') return acc + b.text.split(/\s+/).length;
    if (b.type === 'heading') return acc + b.text.split(/\s+/).length;
    if (b.type === 'list') return acc + b.items.join(' ').split(/\s+/).length;
    return acc;
  }, 0);
  return Math.max(3, Math.ceil(words / 180));
}

export function parseContentBlocks(content: unknown): BlogContentBlock[] {
  if (!content || typeof content !== 'object') return [];

  const obj = content as { blocks?: BlogContentBlock[]; content?: unknown[] };

  if (Array.isArray(obj.blocks)) return obj.blocks;

  if (Array.isArray(obj.content)) {
    return obj.content.flatMap((node) => {
      if (!node || typeof node !== 'object') return [];
      const n = node as { type?: string; content?: { type?: string; text?: string }[] };
      if (n.type === 'paragraph' && Array.isArray(n.content)) {
        const text = n.content.map((c) => c.text ?? '').join('');
        return text ? [{ type: 'paragraph' as const, text }] : [];
      }
      return [];
    });
  }

  return [];
}

export function formatDate(date?: string | null) {
  if (!date) return '';
  return new Date(date).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
