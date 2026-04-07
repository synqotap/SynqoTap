'use client'
import { useState, useEffect } from 'react'

type ManualOrderModalProps = {
  customers: { id: string; email: string; full_name: string | null }[]
  prices: { card_type: string; price: number }[]
  onSubmit: (data: {
    customerEmail: string
    customerName: string
    cardType: string
    quantity: number
    unitPrice: number
    notes?: string
    shipping_address?: {
      name: string
      line1: string
      line2: string | null
      city: string
      state: string
      postal_code: string
      country: string
    }
  }) => Promise<void>
  onClose: () => void
}

export default function ManualOrderModal({ customers, prices, onSubmit, onClose }: ManualOrderModalProps) {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [cardType, setCardType] = useState('pvc')
  const [quantity, setQuantity] = useState(1)
  const [unitPrice, setUnitPrice] = useState('')
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [suggestions, setSuggestions] = useState<typeof customers>([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  // Shipping address fields
  const [recipientName, setRecipientName] = useState('')
  const [addressLine1, setAddressLine1] = useState('')
  const [addressLine2, setAddressLine2] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [country, setCountry] = useState('US')

  useEffect(() => {
    const price = prices.find(p => p.card_type === cardType)
    if (price) setUnitPrice(String(price.price))
  }, [cardType, prices])

  function handleEmailChange(val: string) {
    setEmail(val)
    if (val.length >= 2) {
      const q = val.toLowerCase()
      const matches = customers.filter(c => c.email.toLowerCase().includes(q) || (c.full_name || '').toLowerCase().includes(q)).slice(0, 5)
      setSuggestions(matches)
      setShowSuggestions(matches.length > 0)
    } else {
      setShowSuggestions(false)
    }
  }

  function selectCustomer(c: typeof customers[0]) {
    setEmail(c.email)
    setName(c.full_name || '')
    setShowSuggestions(false)
  }

  async function handleSubmit() {
    if (!email || !name || !unitPrice) return
    setSubmitting(true)
    await onSubmit({
      customerEmail: email,
      customerName: name,
      cardType,
      quantity,
      unitPrice: Number(unitPrice),
      notes: notes || undefined,
      shipping_address: addressLine1 ? {
        name: recipientName,
        line1: addressLine1,
        line2: addressLine2 || null,
        city,
        state,
        postal_code: postalCode,
        country,
      } : undefined,
    })
    setSubmitting(false)
  }

  const inputClass = "w-full bg-[#07070C] border border-[#22223A] rounded-xl px-3.5 py-2.5 text-sm text-[#F2F2F4] placeholder:text-[#3A3A50] focus:outline-none focus:border-[#00E5FF] transition-colors"

  return (
    <div className="p-1">
      <h2 className="font-syne font-black text-lg mb-5">Create manual order</h2>
      <div className="flex flex-col gap-4">
        <div className="relative">
          <label className="text-xs text-[#6B6B80] mb-1.5 block">Customer email</label>
          <input
            value={email}
            onChange={e => handleEmailChange(e.target.value)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            placeholder="customer@example.com"
            className={inputClass}
          />
          {showSuggestions && (
            <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-[#13131F] border border-[#22223A] rounded-xl overflow-hidden shadow-xl">
              {suggestions.map(c => (
                <button
                  key={c.id}
                  onClick={() => selectCustomer(c)}
                  className="w-full px-3.5 py-2.5 text-left hover:bg-[#1C1C2E] transition-colors"
                >
                  <div className="text-sm text-[#F2F2F4]">{c.full_name || c.email}</div>
                  <div className="text-xs text-[#6B6B80]">{c.email}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="text-xs text-[#6B6B80] mb-1.5 block">Customer name</label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Full name"
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-[#6B6B80] mb-1.5 block">Card type</label>
            <select
              value={cardType}
              onChange={e => setCardType(e.target.value)}
              className="w-full bg-[#07070C] border border-[#22223A] rounded-xl px-3.5 py-2.5 text-sm text-[#F2F2F4] focus:outline-none focus:border-[#00E5FF] transition-colors"
            >
              <option value="pvc">PVC</option>
              <option value="metal">Metal</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-[#6B6B80] mb-1.5 block">Quantity</label>
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={e => setQuantity(Number(e.target.value))}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className="text-xs text-[#6B6B80] mb-1.5 block">Unit price ($)</label>
          <input
            type="number"
            value={unitPrice}
            onChange={e => setUnitPrice(e.target.value)}
            className={inputClass}
          />
          {unitPrice && quantity > 1 && (
            <div className="text-xs text-[#6B6B80] mt-1">
              Total: ${(Number(unitPrice) * quantity).toFixed(2)}
            </div>
          )}
        </div>

        <div>
          <label className="text-xs text-[#6B6B80] mb-1.5 block">Notes (internal)</label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Internal notes..."
            rows={3}
            className={`${inputClass} resize-none`}
          />
        </div>

        {/* Shipping address */}
        <div className="mt-4">
          <div className="text-xs uppercase text-[#6B6B80] tracking-wide mb-3">Shipping address</div>
          <div className="flex flex-col gap-3">
            <div>
              <label className="text-xs text-[#6B6B80] mb-1.5 block">Recipient name</label>
              <input
                value={recipientName}
                onChange={e => setRecipientName(e.target.value)}
                placeholder="Full name"
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-xs text-[#6B6B80] mb-1.5 block">Address line 1</label>
              <input
                value={addressLine1}
                onChange={e => setAddressLine1(e.target.value)}
                placeholder="123 Main St"
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-xs text-[#6B6B80] mb-1.5 block">Address line 2</label>
              <input
                value={addressLine2}
                onChange={e => setAddressLine2(e.target.value)}
                placeholder="Apt, suite, etc. (optional)"
                className={inputClass}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-[#6B6B80] mb-1.5 block">City</label>
                <input
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  placeholder="New York"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-xs text-[#6B6B80] mb-1.5 block">State</label>
                <input
                  value={state}
                  onChange={e => setState(e.target.value)}
                  placeholder="NY"
                  className={inputClass}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-[#6B6B80] mb-1.5 block">ZIP / Postal code</label>
                <input
                  value={postalCode}
                  onChange={e => setPostalCode(e.target.value)}
                  placeholder="10001"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-xs text-[#6B6B80] mb-1.5 block">Country</label>
                <input
                  value={country}
                  onChange={e => setCountry(e.target.value)}
                  placeholder="US"
                  className={inputClass}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-1">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-full border border-[#22223A] text-sm text-[#6B6B80] hover:text-[#F2F2F4] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting || !email || !name || !unitPrice}
            className="flex-1 py-2.5 rounded-full bg-[#00E5FF] text-[#07070C] font-syne font-bold text-sm hover:opacity-85 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-[#07070C]/20 border-t-[#07070C] animate-spin" />
                Creating...
              </>
            ) : 'Create order'}
          </button>
        </div>
      </div>
    </div>
  )
}
