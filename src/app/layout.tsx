import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SynqoTap — Share your contact with a single tap',
  description: 'NFC smart business card with unlimited digital profile. No apps, no friction.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}