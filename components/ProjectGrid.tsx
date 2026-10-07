'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useMemo, useState } from 'react'
import { urlFor } from '@/lib/sanity'
import type { Category, ProjectCard } from '@/lib/queries'

export default function ProjectGrid({ projects, categories }: { projects: ProjectCard[]; categories: Category[] }) {
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()
  const [sort, setSort] = useState<'recent' | 'az'>('recent')
  const category = params.get('category') ?? ''
  const q = (params.get('q') ?? '').trim().toLowerCase()

  const setCategory = (title: string) => {
    const next = new URLSearchParams(params.toString())
    if (title) next.set('category', title)
    else next.delete('category')
    router.replace(`${pathname}${next.size ? `?${next}` : ''}`, { scroll: false })
  }

  const filtered = useMemo(() => {
    let list = projects.filter(
      (p) =>
        (!category || p.category?.title === category) &&
        (!q || p.title.toLowerCase().includes(q) || (p.client ?? '').toLowerCase().includes(q)),
    )
    if (sort === 'az') list = [...list].sort((a, b) => a.title.localeCompare(b.title))
    return list
  }, [projects, category, q, sort])

  const pills = [{ title: '' , label: 'All' }, ...categories.map((c) => ({ title: c.title, label: c.title }))]

  return (
    <div style={{ padding: '0 clamp(16px,4.6vw,72px)' }}>
      <div className="flex flex-wrap items-center justify-between gap-4" style={{ padding: '40px 0 32px' }}>
        <label className="relative flex flex-none items-center">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as 'recent' | 'az')}
            aria-label="Sort projects"
            className="cursor-pointer appearance-none rounded-lg border border-[#e3e3e6] bg-white text-[15px] font-medium text-[#161c34]"
            style={{ padding: '12px 44px 12px 16px' }}
          >
            <option value="recent">Recent</option>
            <option value="az">A–Z</option>
          </select>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#161c34" strokeWidth="2.5" className="pointer-events-none absolute right-4"><path d="m6 9 6 6 6-6" /></svg>
        </label>
        <div className="flex flex-wrap justify-center gap-1">
          {pills.map((c) => (
            <button
              key={c.label}
              onClick={() => setCategory(c.title)}
              className={`cursor-pointer rounded-full border-0 text-[15px] font-semibold text-[#161c34] hover:text-[#ff0303] ${category === c.title ? 'bg-[#f3f3f4]' : 'bg-transparent'}`}
              style={{ padding: '10px 18px' }}
            >
              {c.label}
            </button>
          ))}
        </div>
        <span className="min-w-[100px] flex-none text-right text-[14px] text-[#6b6f80]">
          {filtered.length} {filtered.length === 1 ? 'project' : 'projects'}
        </span>
      </div>
      <main className="grid pb-20" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%,280px), 1fr))', gap: '40px 36px' }}>
        {filtered.map((p) => (
          <article key={p._id} className="group relative flex flex-col gap-2.5">
            <Link href={`/work/${p.slug}`} className="absolute inset-0 z-[1]" aria-label={p.title} />
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-[#f3f3f4]">
              {p.cover?.asset && (
                <Image src={urlFor(p.cover).width(800).height(600).fit('crop').url()} alt={p.title} fill sizes="(max-width:700px) 100vw, 25vw" className="object-cover" />
              )}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end opacity-0 transition-opacity duration-200 group-hover:opacity-100" style={{ padding: '20px 16px 16px', background: 'linear-gradient(transparent, rgba(0,0,0,.55))' }}>
                <span className="text-[15px] font-semibold text-white">{p.title}</span>
              </div>
            </div>
            <div className="flex min-w-0 items-center gap-2">
              <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-[#161c34] text-[10px] font-bold text-[#fff000]">{(p.client ?? p.title).charAt(0).toUpperCase()}</span>
              <span className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-[14px] font-semibold">{p.title}</span>
              {p.category?.badge && (
                <span className="ml-auto flex-none rounded bg-[#f3f3f4] text-[10px] font-bold tracking-[.04em] text-[#6b6f80]" style={{ padding: '3px 6px' }}>{p.category.badge}</span>
              )}
            </div>
            {p.client && <span className="-mt-1.5 pl-8 text-[12px] text-[#6b6f80]">{p.client}</span>}
          </article>
        ))}
      </main>
    </div>
  )
}
