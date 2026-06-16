import type { Metadata } from 'next';
import { BlogHero } from '@/components/blog/blog-hero';
import { BlogListing } from '@/components/blog/blog-listing';
import type { BlogPost } from '@/lib/blog';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'DNZMEDYA blog — Next.js, AWS, Shopify, OpenAI, SEO ve dijital pazarlama üzerine teknoloji yazıları ve uzman rehberleri.',
  openGraph: {
    title: 'Blog | DNZMEDYA',
    description: 'Teknoloji altyapıları, dijital trendler ve ajans içgörüleri.',
  },
};

async function getPosts(): Promise<BlogPost[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:4000';
  try {
    const res = await fetch(`${apiUrl}/api/v1/posts/published?limit=20`, {
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) return [];
    const json = (await res.json()) as { data?: BlogPost[] };
    return json.data ?? [];
  } catch {
    return [];
  }
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div className="min-h-screen bg-brand-black">
      <BlogHero />
      <BlogListing posts={posts} />
    </div>
  );
}
