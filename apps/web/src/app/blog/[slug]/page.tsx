import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BlogContentRenderer } from '@/components/blog/blog-content-renderer';
import { BlogCard } from '@/components/blog/blog-card';
import {
  type BlogPost,
  estimateReadMinutes,
  formatDate,
  getPostAccent,
  parseContentBlocks,
} from '@/lib/blog';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getPost(slug: string): Promise<BlogPost | null> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:4000';
  try {
    const res = await fetch(`${apiUrl}/api/v1/posts/slug/${slug}`, {
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) return null;
    return (await res.json()) as BlogPost;
  } catch {
    return null;
  }
}

async function getRelatedPosts(currentSlug: string): Promise<BlogPost[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:4000';
  try {
    const res = await fetch(`${apiUrl}/api/v1/posts/published?limit=4`, {
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) return [];
    const json = (await res.json()) as { data?: BlogPost[] };
    return (json.data ?? []).filter((p) => p.slug !== currentSlug).slice(0, 3);
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: 'Yazı Bulunamadı' };

  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt ?? undefined,
      type: 'article',
      publishedTime: post.publishedAt ?? undefined,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const related = await getRelatedPosts(slug);
  const blocks = parseContentBlocks(post.content);
  const accent = getPostAccent(post.slug);
  const readMin = estimateReadMinutes(post.content);
  const category = post.categories?.[0];
  const authorName = post.author
    ? `${post.author.firstName} ${post.author.lastName}`.trim()
    : 'DNZMEDYA';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    author: { '@type': 'Organization', name: 'DNZMEDYA' },
  };

  return (
    <article className="min-h-screen bg-brand-black pt-28 pb-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="pointer-events-none absolute inset-x-0 top-0 h-[480px] bg-[radial-gradient(ellipse_at_top,rgba(0,206,209,0.1)_0%,transparent_60%)]" />

      <div className="container relative mx-auto max-w-4xl px-6">
        <Link
          href="/blog"
          className="mb-10 inline-flex items-center gap-2 text-sm text-brand-gray-400 transition-colors hover:text-brand-cyan"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
          </svg>
          Blog&apos;a Dön
        </Link>

        <header className="mb-12">
          <div className="mb-6 flex flex-wrap items-center gap-3">
            {category && (
              <span className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider ${accent.badge}`}>
                {category.name}
              </span>
            )}
            {post.publishedAt && (
              <time className="text-sm text-brand-gray-500">{formatDate(post.publishedAt)}</time>
            )}
            <span className="text-sm text-brand-gray-500">• {readMin} dk okuma</span>
          </div>

          <h1 className="font-heading text-3xl font-bold leading-tight md:text-5xl lg:text-[3.25rem]">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="mt-6 text-xl leading-relaxed text-brand-gray-400">{post.excerpt}</p>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-4 border-y border-white/[0.08] py-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-cyan/30 to-brand-gold/30 text-sm font-bold">
              D
            </div>
            <div>
              <p className="text-sm font-medium text-brand-white">{authorName}</p>
              <p className="text-xs text-brand-gray-500">DNZMEDYA Dijital Ajans</p>
            </div>
            {post.tags && post.tags.length > 0 && (
              <div className="ml-auto flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag.slug}
                    className="rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1 text-xs text-brand-gray-400"
                  >
                    #{tag.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </header>

        <div
          className={`mb-16 rounded-3xl border border-white/[0.08] bg-white/[0.02] p-8 backdrop-blur-xl md:p-12`}
        >
          <BlogContentRenderer blocks={blocks} />
        </div>

        <div className="rounded-3xl border border-brand-gold/20 bg-gradient-to-br from-brand-gold/10 to-transparent p-8 text-center md:p-10">
          <h2 className="font-heading text-2xl font-bold">Projeniz için uzman desteği</h2>
          <p className="mx-auto mt-3 max-w-lg text-brand-gray-400">
            Bu yazıdaki teknolojilerle projenizi hayata geçirmek ister misiniz? Ücretsiz teklif alın.
          </p>
          <Link
            href="/teklif-al"
            className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-brand-gold to-brand-gold-light px-8 py-3.5 font-semibold text-brand-black transition-transform hover:scale-[1.03]"
          >
            Teklif Al
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        {related.length > 0 && (
          <section className="mt-20">
            <h2 className="mb-8 font-heading text-2xl font-bold">İlgili Yazılar</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {related.map((p, i) => (
                <BlogCard key={p.id} post={p} index={i} />
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}
