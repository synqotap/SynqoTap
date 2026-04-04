import type { Metadata } from 'next'
import { Syne, DM_Sans } from 'next/font/google'
import './globals.css'

const syne = Syne({
  subsets: ['latin'],
  weight: ['700', '800'],
  variable: '--font-syne',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: { default: 'SynqoTap', template: '%s | SynqoTap' },
  description: 'Share your contact with a single tap. NFC smart business cards with unlimited digital profile.',
  metadataBase: new URL('https://www.synqotap.com'),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${syne.variable} ${dmSans.variable} bg-[#07070C] text-[#F2F2F4] antialiased`}>
        {children}
      </body>
    </html>
  )
}
