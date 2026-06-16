'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  type BlogPost,
  estimateReadMinutes,
  formatDate,
  getPostAccent,
} from '@/lib/blog';

interface BlogCardProps {
  post: BlogPost;
  index?: number;
  featured?: boolean;
}

export function BlogCard({ post, index = 0, featured = false }: BlogCardProps) {
  const accent = getPostAccent(post.slug);
  const readMin = estimateReadMinutes(post.content);
  const category = post.categories?.[0];

  if (featured) {
    return (
      <motion.article
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="group relative col-span-full"
      >
        <Link
          href={`/blog/${post.slug}`}
          className={`relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl transition-all duration-500 lg:flex-row ${accent.glow} hover:border-white/20`}
        >
          <div
            className={`relative min-h-[220px] flex-1 overflow-hidden bg-gradient-to-br ${accent.gradient} p-10 lg:min-h-[320px] lg:max-w-[45%]`}
          >
            <div className="pointer-events-none absolute inset-0 grid-pattern opacity-30" />
            <div className="relative">
              {category && (
                <span className={`inline-block rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider ${accent.badge}`}>
                  {category.name}
                </span>
              )}
              <div className="mt-8 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-3xl backdrop-blur-sm">
                ✦
              </div>
            </div>
          </div>

          <div className="flex flex-1 flex-col justify-center p-8 lg:p-12">
            <div className="mb-4 flex flex-wrap items-center gap-3 text-xs text-brand-gray-500">
              {post.publishedAt && <time>{formatDate(post.publishedAt)}</time>}
              <span>•</span>
              <span>{readMin} dk okuma</span>
              {post.viewCount != null && post.viewCount > 0 && (
                <>
                  <span>•</span>
                  <span>{post.viewCount} görüntülenme</span>
                </>
              )}
            </div>
            <h2 className="font-heading text-2xl font-bold leading-tight transition-colors duration-300 group-hover:text-brand-gold md:text-4xl">
              {post.title}
            </h2>
            {post.excerpt && (
              <p className="mt-4 line-clamp-3 text-brand-gray-400 md:text-lg">{post.excerpt}</p>
            )}
            <div className="mt-6 flex flex-wrap gap-2">
              {post.tags?.slice(0, 4).map((tag) => (
                <span
                  key={tag.slug}
                  className="rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1 text-xs text-brand-gray-400"
                >
                  #{tag.name}
                </span>
              ))}
            </div>
            <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-brand-cyan transition-transform duration-300 group-hover:translate-x-1">
              Yazıyı Oku
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </div>
        </Link>
      </motion.article>
    );
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      className="group h-full"
    >
      <Link
        href={`/blog/${post.slug}`}
        className={`relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.03] p-6 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 ${accent.glow} hover:border-white/20`}
      >
        <div
          className={`pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br ${accent.gradient} blur-2xl opacity-50 transition-opacity duration-500 group-hover:opacity-90`}
        />

        <div className="relative mb-5 flex items-center justify-between">
          {category ? (
            <span className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-wider ${accent.badge}`}>
              {category.name}
            </span>
          ) : (
            <span />
          )}
          <span className="text-xs text-brand-gray-500">{readMin} dk</span>
        </div>

        <h2 className="relative mb-3 font-heading text-xl font-bold leading-snug transition-colors duration-300 group-hover:text-brand-gold">
          {post.title}
        </h2>

        {post.excerpt && (
          <p className="relative mb-5 line-clamp-3 flex-1 text-sm leading-relaxed text-brand-gray-400">
            {post.excerpt}
          </p>
        )}

        <div className="relative mt-auto flex items-center justify-between border-t border-white/[0.06] pt-4">
          {post.publishedAt && (
            <time className="text-xs text-brand-gray-500">{formatDate(post.publishedAt)}</time>
          )}
          <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-brand-cyan transition-all duration-300 group-hover:border-brand-cyan/30 group-hover:bg-brand-cyan/10">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </span>
        </div>
      </Link>
    </motion.article>
  );
}
