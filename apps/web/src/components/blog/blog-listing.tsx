import { BlogHero } from '@/components/blog/blog-hero';
import { BlogCard } from '@/components/blog/blog-card';
import type { BlogPost } from '@/lib/blog';

interface BlogListingProps {
  posts: BlogPost[];
}

export function BlogListing({ posts }: BlogListingProps) {
  if (posts.length === 0) {
    return (
      <div className="container mx-auto px-6 pb-24">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] py-20 text-center backdrop-blur-xl">
          <p className="text-brand-gray-400">Henüz blog yazısı yayınlanmamış.</p>
        </div>
      </div>
    );
  }

  const [featured, ...rest] = posts;

  return (
    <div className="relative pb-24">
      <div className="pointer-events-none absolute inset-0 dot-pattern opacity-20" />
      <div className="container relative mx-auto px-6">
        <div className="mb-10">
          <BlogCard post={featured} featured />
        </div>

        <div className="mb-12 flex items-center gap-4">
          <h2 className="font-heading text-xl font-bold text-brand-white">Tüm Yazılar</h2>
          <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
          <span className="text-sm text-brand-gray-500">{posts.length} yazı</span>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {rest.map((post, i) => (
            <BlogCard key={post.id} post={post} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
