import Link from 'next/link';
import { ArrowUpRight, Clock } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import type { BlogPost } from '@/data/types';

const TONES: Record<string, string> = {
  teal: 'from-teal-deep via-[#0d4a44] to-[#08251f]',
  ink: 'from-[#12323c] via-[#0a2028] to-[#06191f]',
  gold: 'from-[#7a5f26] via-[#4b3a17] to-[#241c0c]',
  clay: 'from-[#7a3a24] via-[#47231a] to-[#1f110c]',
  mauve: 'from-[#4c3f5c] via-[#312a3c] to-[#17131d]',
};

export function BlogCard({ post, featured = false }: { post: BlogPost; featured?: boolean }) {
  return (
    <Link
      href={`/blogs/${post.slug}`}
      className={`group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lift ${
        featured ? 'md:flex-row' : ''
      }`}
    >
      <div
        className={`relative overflow-hidden bg-gradient-to-br ${TONES[post.heroTone] ?? TONES.ink} ${
          featured ? 'h-56 md:h-auto md:w-2/5' : 'h-40'
        }`}
      >
        <div className="absolute inset-0 opacity-[0.18]" style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, #fff 1px, transparent 1px)', backgroundSize: '22px 22px' }} />
        <div className="absolute inset-0 grid place-items-center">
          <div className="h-24 w-24 rounded-full border border-paper/15" />
          <div className="absolute h-16 w-16 rounded-full border border-gold/30" />
          <span className="absolute font-display text-4xl text-paper/80">{post.category.slice(0, 1)}</span>
        </div>
        <span className="absolute left-4 top-4 rounded-full bg-paper/90 px-2.5 py-1 text-[0.5625rem] font-semibold uppercase tracking-[0.1em] text-ink">
          {post.category}
        </span>
        <ArrowUpRight className="absolute right-4 top-4 h-4 w-4 text-paper/50 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-paper" />
      </div>

      <div className={`flex flex-1 flex-col p-5 ${featured ? 'md:p-7' : ''}`}>
        <h3 className={`font-medium leading-snug text-ink transition-colors group-hover:text-teal-deep ${featured ? 'text-xl md:text-2xl md:leading-snug' : 'text-[0.9375rem]'}`}>
          {post.title}
        </h3>
        <p className={`mt-2 flex-1 text-xs leading-relaxed text-muted ${featured ? 'md:text-sm' : 'line-clamp-3'}`}>
          {post.excerpt}
        </p>
        <div className="mt-4 flex items-center justify-between border-t border-line pt-3.5 text-[0.625rem] text-ink/45">
          <span>{post.author}</span>
          <span className="flex items-center gap-2">
            <span>{formatDate(post.date, { day: 'numeric', month: 'short' })}</span>
            <span className="h-0.5 w-0.5 rounded-full bg-ink/25" />
            <span className="flex items-center gap-1"><Clock className="h-2.5 w-2.5" /> {post.readTime} min</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
