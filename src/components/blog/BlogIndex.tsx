'use client';

import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import type { BlogPost } from '@/data/types';
import { BlogCard } from '@/components/cards/BlogCard';
import { cn } from '@/lib/utils';

export function BlogIndex({ posts, categories }: { posts: BlogPost[]; categories: string[] }) {
  const [category, setCategory] = useState('All');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter(
      (p) =>
        (category === 'All' || p.category === category) &&
        (!q || `${p.title} ${p.excerpt} ${p.author} ${p.category}`.toLowerCase().includes(q)),
    );
  }, [posts, category, query]);

  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-1.5">
          {['All', ...categories].map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              aria-pressed={category === c}
              className={cn(
                'rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors',
                category === c
                  ? 'border-ink bg-ink text-paper'
                  : 'border-line bg-white text-ink/60 hover:border-ink/30 hover:text-ink',
              )}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="relative lg:w-72">
          <label htmlFor="blog-search" className="sr-only">Search articles</label>
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/35" />
          <input
            id="blog-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles…"
            className="field pl-10 py-2.5 text-xs"
          />
        </div>
      </div>

      <p className="mt-4 text-2xs uppercase tracking-[0.12em] text-muted">
        {filtered.length} article{filtered.length === 1 ? '' : 's'}
        {category !== 'All' ? ` in ${category}` : ''}
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="mt-8 card p-12 text-center">
          <p className="text-sm font-medium text-ink">No articles match that search.</p>
          <p className="mt-1 text-xs text-muted">Try a broader term, or browse all categories.</p>
          <button
            type="button"
            onClick={() => { setQuery(''); setCategory('All'); }}
            className="btn-outline btn-sm mt-4"
          >
            Reset filters
          </button>
        </div>
      )}
    </div>
  );
}
