import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { safeFetch, urlFor } from '@/lib/sanity'
import { projectQuery, projectsQuery, siblingsQuery, slugsQuery, type ProjectDetail } from '@/lib/queries'

export const revalidate = 60

const COLUMN = 1024
const MAX_IMG_HEIGHT = 720

// Fit an image in the column: full width, unless that would exceed MAX_IMG_HEIGHT,
// in which case shrink the width (keeping proportions) so the height is capped.
const fitWidth = (d?: { width: number; height: number }) =>
  d && d.height > 0 ? Math.min(COLUMN, Math.round((MAX_IMG_HEIGHT * d.width) / d.height)) : COLUMN

type Sibling = { title: string; slug: string; client?: string; cover?: ProjectDetail['cover'] }

export async function generateStaticParams() {
  const slugs = await safeFetch<{ slug: string }[]>(slugsQuery, {}, [])
  return slugs.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const p = await safeFetch<ProjectDetail | null>(projectQuery, { slug }, null)
  if (!p) return {}
  return {
    title: `${p.title} — Yuvaraj`,
    openGraph: { title: `${p.title} — Yuvaraj`, images: p.cover?.asset ? [urlFor(p.cover).width(1200).height(630).fit('crop').url()] : [] },
  }
}

const Pill = ({ pad, size }: { pad: string; size: number }) => (
  <a href="mailto:syuvaraj12@gmail.com" className="pill-btn" style={{ padding: pad, fontSize: size }}>Get in touch</a>
)

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [p, all] = await Promise.all([
    safeFetch<ProjectDetail | null>(projectQuery, { slug }, null),
    safeFetch<Sibling[]>(siblingsQuery, {}, []),
  ])
  if (!p) notFound()

  const idx = all.findIndex((s) => s.slug === slug)
  const prev = all.length > 1 ? all[(idx - 1 + all.length) % all.length] : null
  const next = all.length > 1 ? all[(idx + 1) % all.length] : null
  const more = all.filter((s) => s.slug !== slug).slice(0, 4)

  return (
    <div className="min-h-screen">
      <Header />
      <article style={{ padding: '40px clamp(16px,4vw,48px) 0' }}>
        <div className="mx-auto max-w-[1024px]">
          <h1 className="font-bold" style={{ fontSize: 'clamp(20px,2vw,24px)', margin: '0 0 20px' }}>{p.title}</h1>
          <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#fff000]">
                <Image src="/logo.png" alt="" width={28} height={28} style={{ width: 28, height: 'auto' }} />
              </span>
              <div>
                <div className="text-[15px] font-semibold">
                  Yuvaraj {p.client && (<><span className="font-normal text-[#6b6f80]">for</span> {p.client}</>)}
                </div>
                <div className="text-[13px] text-[#6b6f80]">
                  <span className="text-[#0a9a52]">Available for work</span>{p.category && <> · {p.category.title}</>}
                </div>
              </div>
            </div>
            <Pill pad="12px 20px" size={14} />
          </div>

          {p.cover?.asset && (
            <Image
              src={urlFor(p.cover).width(2048).url()}
              alt={p.title}
              width={p.cover.asset.metadata?.dimensions?.width ?? 1024}
              height={p.cover.asset.metadata?.dimensions?.height ?? 768}
              priority
              sizes="(max-width:1024px) 100vw, 1024px"
              className="mx-auto h-auto w-full rounded-lg bg-[#f3f3f4]"
              style={{ maxWidth: fitWidth(p.cover.asset.metadata?.dimensions) }}
            />
          )}

          <div className="flex flex-col pt-14">
            {p.content?.map((b) => {
              if (b._type === 'titleBlock')
                return <h2 key={b._key} className="mx-auto w-full max-w-[680px] font-bold leading-[1.25] [text-wrap:balance]" style={{ fontSize: 'clamp(24px,2.6vw,32px)', margin: '24px auto 8px' }}>{b.text}</h2>
              if (b._type === 'subtitleBlock')
                return <h3 key={b._key} className="mx-auto w-full max-w-[680px] text-[20px] font-semibold leading-[1.35]" style={{ margin: '16px auto 4px' }}>{b.text}</h3>
              if (b._type === 'paragraphBlock')
                return (
                  <div key={b._key} className="mx-auto w-full max-w-[680px]" style={{ margin: '8px auto 24px' }}>
                    {(b.text ?? '').split(/\n+/).filter(Boolean).map((line, i) => (
                      <p key={i} className="m-0 mb-4 text-[18px] leading-[1.6] [text-wrap:pretty] last:mb-0">{line}</p>
                    ))}
                  </div>
                )
              if (b._type === 'imageBlock' && b.image?.asset) {
                const d = b.image.asset.metadata?.dimensions
                return (
                  <figure key={b._key} className="m-0" style={{ margin: '24px 0' }}>
                    <Image src={urlFor(b.image).width(2048).url()} alt={b.alt ?? ''} width={d?.width ?? 1024} height={d?.height ?? 768} sizes="(max-width:1024px) 100vw, 1024px" loading="lazy" className="mx-auto h-auto w-full rounded-lg" style={{ maxWidth: fitWidth(d) }} />
                    {b.caption && <figcaption className="mt-2 text-center text-[13px] text-[#6b6f80]">{b.caption}</figcaption>}
                  </figure>
                )
              }
              return null
            })}
          </div>
        </div>

        <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-3" style={{ marginTop: 96 }}>
          <div className="relative flex w-full flex-col items-center gap-3">
            <div className="absolute left-0 right-0 top-8 h-px bg-[#e7e7e9]" />
            <span className="relative flex h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-[#fff000]">
              <Image src="/logo.png" alt="" width={34} height={34} style={{ width: 34, height: 'auto' }} />
            </span>
          </div>
          <div className="text-[18px] font-bold">Yuvaraj</div>
          <div className="text-[14px] text-[#6b6f80]">Lead UX/UI Designer</div>
          <Pill pad="10px 18px" size={14} />
        </div>

        {more.length > 0 && (
          <section className="mx-auto max-w-[1200px]" style={{ marginTop: 64 }}>
            <div className="mb-4 flex items-center justify-between">
              <span className="text-[16px] font-bold">More by Yuvaraj</span>
              <Link href="/work" className="text-[14px] font-medium no-underline">View all work</Link>
            </div>
            <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%,220px), 1fr))' }}>
              {more.map((m) => (
                <Link key={m.slug} href={`/work/${m.slug}`} className="flex flex-col gap-2 no-underline">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-[#f3f3f4]">
                    {m.cover?.asset && <Image src={urlFor(m.cover).width(600).height(450).fit('crop').url()} alt={m.title} fill sizes="(max-width:700px) 100vw, 25vw" className="object-cover" />}
                  </div>
                  <span className="text-[14px] font-semibold">{m.title}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {prev && next && (
          <nav className="flex justify-center gap-6 text-[14px] font-medium" style={{ padding: '64px 0 24px' }}>
            <Link href={`/work/${prev.slug}`} className="no-underline">← Previous project</Link>
            <Link href={`/work/${next.slug}`} className="no-underline">Next project →</Link>
          </nav>
        )}
      </article>
      <Footer />
    </div>
  )
}
