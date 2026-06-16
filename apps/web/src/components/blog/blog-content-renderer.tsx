import type { BlogContentBlock } from '@/lib/blog';

export function BlogContentRenderer({ blocks }: { blocks: BlogContentBlock[] }) {
  return (
    <div className="prose-blog space-y-6">
      {blocks.map((block, i) => {
        switch (block.type) {
          case 'heading':
            if (block.level === 2) {
              return (
                <h2
                  key={i}
                  className="font-heading text-2xl font-bold text-brand-white md:text-3xl"
                >
                  {block.text}
                </h2>
              );
            }
            return (
              <h3 key={i} className="font-heading text-xl font-semibold text-brand-gray-300">
                {block.text}
              </h3>
            );
          case 'paragraph':
            return (
              <p key={i} className="text-lg leading-relaxed text-brand-gray-400">
                {block.text}
              </p>
            );
          case 'list':
            return (
              <ul key={i} className="space-y-3">
                {block.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-brand-gray-400"
                  >
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-cyan" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            );
          case 'quote':
            return (
              <blockquote
                key={i}
                className="relative rounded-2xl border border-brand-gold/20 bg-brand-gold/5 px-6 py-5"
              >
                <div className="absolute left-0 top-0 h-full w-1 rounded-l-2xl bg-gradient-to-b from-brand-gold to-brand-cyan" />
                <p className="pl-3 text-lg italic leading-relaxed text-brand-gray-300">
                  &ldquo;{block.text}&rdquo;
                </p>
              </blockquote>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
