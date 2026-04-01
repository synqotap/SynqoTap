'use client'
import { useState } from 'react'

const FAQS = [
  { q: 'Do I need an app to use the card?', a: "No. Your card works with the phone's native NFC. The person scanning you only needs their smartphone — no download required." },
  { q: 'Can I update my profile later?', a: 'Yes, as many times as you want at no extra cost. Change your number, email, or title — updates reflect in real time.' },
  { q: 'How long does shipping take?', a: 'We program and ship in 1-3 business days. Delivery in 5-10 business days to the US and Latin America.' },
  { q: 'What if I lose my card?', a: 'Your profile stays active. Buy a replacement card and it will be programmed with the same profile URL.' },
  { q: 'Does it work with iPhones and Android?', a: 'Yes. NFC works on iPhones from model 7 (iOS 14+) and on virtually all Android phones since 2015.' },
]

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section className="py-20 sm:py-24 px-5" id="faq">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <div className="text-xs font-medium tracking-widest uppercase text-[#00E5FF] mb-3">FAQ</div>
          <h2 className="font-black text-2xl sm:text-4xl tracking-tight font-[family-name:var(--font-syne)]">Everything you need to know</h2>
        </div>
        <div>
          {FAQS.map((item, i) => (
            <div key={i} className="border-b border-[#1C1C2E]">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex justify-between items-center py-4 sm:py-5 gap-4 text-left"
              >
                <span className="font-bold text-sm sm:text-base font-[family-name:var(--font-syne)]">{item.q}</span>
                <span
                  className="text-xl text-[#00E5FF] font-light flex-shrink-0 transition-transform duration-300"
                  style={{ transform: open === i ? 'rotate(45deg)' : 'rotate(0deg)' }}
                >+</span>
              </button>
              <div
                className="overflow-hidden transition-all duration-300"
                style={{ maxHeight: open === i ? '300px' : '0px' }}
              >
                <p className="text-[#6B6B80] text-sm leading-relaxed pb-4 sm:pb-5">{item.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
