'use client'
import { useState, useEffect } from 'react'

type Price = {
  id: string
  card_type: string
  price: number
  updated_at: string
}

type PricesTabProps = {
  prices: Price[]
  onUpdatePrice: (cardType: string, updates: { price: number }) => Promise<void>
}

function PriceCard({ price, onSave }: { price: Price; onSave: (updates: { price: number }) => Promise<void> }) {
  const [currentPrice, setCurrentPrice] = useState(String(price.price))
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setCurrentPrice(String(price.price))
  }, [price])

  async function handleSave() {
    setSaving(true)
    await onSave({ price: Number(currentPrice) })
    setSaving(false)
  }

  const inputClass = "w-full bg-[#07070C] border border-[#22223A] rounded-xl px-3.5 py-2.5 text-sm text-[#F2F2F4] placeholder:text-[#3A3A50] focus:outline-none focus:border-[#00E5FF] transition-colors"
  const label = price.card_type === 'pvc' ? 'PVC Card' : 'Metal Card'

  return (
    <div className="bg-[#0E0E16] border border-[#22223A] rounded-2xl p-5 flex flex-col gap-4">
      <div>
        <div className="text-xs text-[#6B6B80] uppercase tracking-wide mb-1">{label}</div>
        <div className="font-syne font-black text-3xl text-[#F2F2F4]">${currentPrice}</div>
        <div className="text-xs text-[#3A3A50] mt-1">
          Updated {new Date(price.updated_at).toLocaleString()}
        </div>
      </div>

      <div>
        <label className="text-xs text-[#6B6B80] mb-1.5 block">Base price ($)</label>
        <input
          type="number"
          value={currentPrice}
          onChange={e => setCurrentPrice(e.target.value)}
          className={inputClass}
        />
      </div>

      <p className="text-xs text-[#3A3A50] leading-relaxed">
        To show a promotional price or strikethrough on the homepage, create an active discount with <span className="text-[#6B6B80]">Show on homepage</span> enabled in the Discounts tab.
      </p>

      <button
        onClick={handleSave}
        disabled={saving || !currentPrice}
        className="w-full py-2.5 rounded-full bg-[#00E5FF] text-[#07070C] font-syne font-bold text-sm hover:opacity-85 transition-opacity disabled:opacity-50"
      >
        {saving ? 'Saving...' : 'Save'}
      </button>
    </div>
  )
}

export default function PricesTab({ prices, onUpdatePrice }: PricesTabProps) {
  if (prices.length === 0) {
    return (
      <div className="text-center py-12 text-sm text-[#6B6B80]">
        No prices configured yet.
      </div>
    )
  }

  return (
    <div>
      <h2 className="font-syne font-black text-lg mb-1">Prices</h2>
      <p className="text-sm text-[#6B6B80] mb-5">
        Set the base price for each card. Promotional discounts are managed in the <span className="text-[#F2F2F4]">Discounts</span> tab.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
        {prices.map(p => (
          <PriceCard
            key={p.id}
            price={p}
            onSave={updates => onUpdatePrice(p.card_type, updates)}
          />
        ))}
      </div>
    </div>
  )
}
