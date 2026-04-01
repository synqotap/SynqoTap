const PRODUCTS = [
  {
    icon: '💳', name: 'PVC Card',
    desc: 'Light, durable and elegant. Perfect for everyday networking.',
    price: '39', featured: false,
    features: ['Programmed NFC chip', 'Unlimited digital profile', 'Real-time updates', 'Custom URL', '3 design templates'],
    btn: 'Buy PVC →', href: '/checkout',
  },
  {
    icon: '⚡', name: 'Metal Card',
    desc: "Stainless steel finish. A first impression that won't be forgotten.",
    price: '79', featured: true,
    features: ['Everything in PVC', 'Premium stainless steel', 'Matte or mirror finish', 'Laser engraving included', 'Presentation case'],
    btn: 'Buy Metal →', href: '/checkout',
  },
  {
    icon: '🏢', name: 'Business',
    desc: 'Volume for teams. Discounts starting at 10 units.',
    price: null, featured: false,
    features: ['Orders from 10 units', 'Volume discounts', 'Corporate branding', 'Centralized management', 'Dedicated support'],
    btn: 'Contact us →', href: 'mailto:synqotap@gmail.com',
  },
]

export default function Products() {
  return (
    <section className="py-20 sm:py-24 px-5" id="products">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10">
          <div className="text-xs font-medium tracking-widest uppercase text-[#00E5FF] mb-3">Products</div>
          <h2 className="font-black text-2xl sm:text-4xl tracking-tight mb-4 font-[family-name:var(--font-syne)]">Choose your card</h2>
          <p className="text-[#6B6B80] text-base sm:text-lg font-light">Two materials, same power. Both include unlimited digital profile.</p>
        </div>
        <div className="grid sm:grid-cols-3 gap-4 sm:gap-5">
          {PRODUCTS.map((p, i) => (
            <div
              key={i}
              className={`rounded-2xl p-6 sm:p-8 relative transition-all hover:-translate-y-1 duration-300 ${p.featured ? 'border border-[#00E5FF] bg-gradient-to-b from-[#00E5FF]/[0.06] to-[#0E0E16]' : 'border border-[#22223A] bg-[#0E0E16]'}`}
            >
              {p.featured && (
                <div className="absolute top-4 right-4 bg-[#00E5FF] text-[#07070C] text-xs font-bold px-3 py-1 rounded-full">Popular</div>
              )}
              <div className="text-3xl sm:text-4xl mb-4">{p.icon}</div>
              <div className="font-black text-xl sm:text-2xl tracking-tight mb-2 font-[family-name:var(--font-syne)]">{p.name}</div>
              <div className="text-[#6B6B80] text-sm mb-4 leading-relaxed">{p.desc}</div>
              <div className="font-black tracking-tight mb-5 font-[family-name:var(--font-syne)]" style={{ fontSize: p.price ? '36px' : '24px' }}>
                {p.price ? <>${p.price}<span className="text-base font-normal text-[#6B6B80]"> USD</span></> : 'Custom'}
              </div>
              <ul className="mb-6 space-y-1">
                {p.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-2 text-sm text-white/80 py-1.5 border-b border-[#1C1C2E] last:border-0">
                    <span className="text-[#00E5FF] text-xs flex-shrink-0">✓</span>{f}
                  </li>
                ))}
              </ul>
              <a
                href={p.href}
                className={`block w-full text-center py-3 sm:py-3.5 rounded-full font-bold text-sm transition-all font-[family-name:var(--font-syne)] ${p.featured ? 'bg-[#00E5FF] text-[#07070C]' : 'border border-[#22223A] text-white hover:border-[#00E5FF]/40 hover:text-[#00E5FF]'}`}
              >
                {p.btn}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
