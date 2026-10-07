'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { FormEvent, useState } from 'react'

export default function SearchBox({ className = '' }: { className?: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()
  const urlQ = params.get('q') ?? ''
  const [value, setValue] = useState(urlQ)
  const [lastUrlQ, setLastUrlQ] = useState(urlQ)

  // keep the box in sync when the URL changes from elsewhere (back button, logo click)
  if (urlQ !== lastUrlQ) {
    setLastUrlQ(urlQ)
    setValue(urlQ)
  }

  const update = (q: string, replace: boolean) => {
    const next = new URLSearchParams(params.toString())
    if (q) next.set('q', q)
    else next.delete('q')
    const url = `/work${next.size ? `?${next}` : ''}`
    if (pathname === '/work' && replace) router.replace(url, { scroll: false })
    else if (!replace) router.push(url)
  }

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    update(value, false)
  }

  return (
    <form onSubmit={onSubmit} role="search" className={`flex h-[52px] min-w-0 items-center gap-2.5 rounded-full bg-[#f3f3f4] pl-5 pr-2 ${className}`}>
      <input
        name="q"
        value={value}
        onChange={(e) => {
          setValue(e.target.value)
          update(e.target.value, true)
        }}
        placeholder="Search projects"
        aria-label="Search projects"
        className="min-w-0 flex-1 border-0 bg-transparent text-[15px] text-[#161c34] outline-none"
      />
      <button type="submit" aria-label="Search" className="flex h-[38px] w-[38px] flex-none items-center justify-center rounded-full border-0 bg-[#ff0303]">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
      </button>
    </form>
  )
}
