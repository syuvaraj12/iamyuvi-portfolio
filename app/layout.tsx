import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-poppins' })

export const metadata: Metadata = {
  title: 'Work — Yuvaraj',
  description: 'Portfolio of Yuvaraj, Lead UX/UI Designer.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={poppins.variable}>
      <body>{children}</body>
    </html>
  )
}
