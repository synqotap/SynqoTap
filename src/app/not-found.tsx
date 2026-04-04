import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#07070C] flex items-center justify-center px-5">
      <div className="text-center">
        <div className="text-6xl font-black font-syne text-[#1C1C2E] mb-4">404</div>
        <h1 className="text-xl font-bold font-syne mb-2">Page not found</h1>
        <p className="text-sm text-[#6B6B80] mb-8">The page you&apos;re looking for doesn&apos;t exist.</p>
        <Link
          href="/"
          className="bg-[#00E5FF] text-[#07070C] font-bold text-sm px-6 py-3 rounded-full hover:opacity-85 transition-opacity font-syne"
        >
          Go home
        </Link>
      </div>
    </div>
  )
}
