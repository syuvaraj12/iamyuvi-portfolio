import Image from 'next/image'
import Link from 'next/link'
import { Suspense } from 'react'
import SearchBox from './SearchBox'

export default function Header() {
  return (
    <>
    <header className="sticky top-0 z-10 flex items-center bg-white" style={{ padding: '16px clamp(16px,2.6vw,36px)', gap: 'clamp(12px,2.4vw,32px)' }}>
      <Link href="/work" aria-label="Work" className="flex flex-none">
        <Image src="/logo.png" alt="Yuvi" width={44} height={44} style={{ width: 44, height: "auto" }} priority />
      </Link>
      <div className="hidden min-w-0 flex-1 md:flex">
        <Suspense fallback={<div className="flex-1" />}>
          <SearchBox className="max-w-[640px] flex-1" />
        </Suspense>
      </div>
      <nav className="ml-auto flex flex-none items-center gap-3 md:gap-5">
        <a href="https://iamyuvi.com/" className="text-[15px] font-semibold no-underline">Profile</a>
        <a href="mailto:syuvaraj12@gmail.com" className="pill-btn px-[18px] py-[10px] text-[14px] md:px-6 md:py-[14px] md:text-[15px]">Get in touch</a>
      </nav>
    </header>
    <div className="px-[clamp(16px,2.6vw,36px)] pb-2 pt-1 md:hidden">
      <Suspense fallback={<div className="h-[52px]" />}>
        <SearchBox className="w-full" />
      </Suspense>
    </div>
    </>
  )
}
