'use client'
import { useState } from 'react'

type Discount = {
  id: string
  code: string
  type: string
  value: number
  max_uses: number | null
  uses_count: number
  expires_at: string | null
  is_active: boolean
  show_on_home?: boolean
  description?: string | null
  created_at: string
}

type DiscountsTabProps = {
  discounts: Discount[]
  onCreateDiscount: (data: any) => Promise<void>
  onUpdateDiscount: (id: string, updates: any) => Promise<void>
  onDeleteDiscount: (id: string) => Promise<void>
}

function generateCode() {
  return 'SYNQO' + Math.random().toString(36).substring(2, 7).toUpperCase()
}

const emptyForm = {
  code: '',
  type: 'percentage',
  value: '',
  max_uses: '',
  expires_at: '',
  description: '',
  show_on_home: false,
  is_active: true,
}

export default function DiscountsTab({ discounts, onCreateDiscount, onUpdateDiscount, onDeleteDiscount }: DiscountsTabProps) {
  console.log('[DiscountsTab] discounts:', discounts)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [editTarget, setEditTarget] = useState<Discount | null>(null)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  function openCreate() {
    setEditTarget(null)
    setForm(emptyForm)
    setShowForm(true)
  }

  function openEdit(d: Discount) {
    setEditTarget(d)
    setForm({
      code: d.code,
      type: d.type,
      value: String(d.value),
      max_uses: d.max_uses != null ? String(d.max_uses) : '',
      expires_at: d.expires_at ? d.expires_at.split('T')[0] : '',
      description: d.description || '',
      show_on_home: d.show_on_home ?? false,
      is_active: d.is_active,
    })
    setShowForm(true)
  }

  async function handleSubmit() {
    setSaving(true)
    const payload = {
      code: form.code.toUpperCase(),
      type: form.type,
      value: Number(form.value),
      max_uses: form.max_uses ? Number(form.max_uses) : null,
      expires_at: form.expires_at ? new Date(form.expires_at).toISOString() : null,
      description: form.description || null,
      show_on_home: form.show_on_home,
      is_active: form.is_active,
    }
    if (editTarget) {
      await onUpdateDiscount(editTarget.id, payload)
    } else {
      await onCreateDiscount(payload)
    }
    setSaving(false)
    setShowForm(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this discount?')) return
    setDeletingId(id)
    await onDeleteDiscount(id)
    setDeletingId(null)
  }

  async function toggleActive(d: Discount) {
    await onUpdateDiscount(d.id, { is_active: !d.is_active })
  }

  const inputClass = "w-full bg-[#07070C] border border-[#22223A] rounded-xl px-3.5 py-2.5 text-sm text-[#F2F2F4] placeholder:text-[#3A3A50] focus:outline-none focus:border-[#00E5FF] transition-colors"

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-syne font-black text-lg">Discounts</h2>
        <button
          onClick={openCreate}
          className="text-sm px-4 py-2 rounded-full bg-[#00E5FF] text-[#07070C] font-syne font-bold hover:opacity-85 transition-opacity"
        >
          + Create discount
        </button>
      </div>

      {discounts.length === 0 ? (
        <div className="text-center py-12 text-sm text-[#6B6B80]">No discounts yet.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {['Code', 'Type', 'Value', 'Uses', 'Expires', 'Active', 'Home', 'Actions'].map(h => (
                  <th key={h} className="text-left text-xs font-medium text-[#6B6B80] uppercase tracking-wide px-3 py-2.5 border-b border-[#1C1C2E]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {discounts.map(d => (
                <tr key={d.id} className="hover:bg-[#0E0E16] transition-colors">
                  <td className="px-3 py-3 border-b border-[#1C1C2E]">
                    <span className="font-mono text-sm text-[#F2F2F4]">{d.code}</span>
                  </td>
                  <td className="px-3 py-3 border-b border-[#1C1C2E]">
                    <span className="text-xs text-[#6B6B80] capitalize">{d.type}</span>
                  </td>
                  <td className="px-3 py-3 border-b border-[#1C1C2E]">
                    <span className="text-sm text-[#F2F2F4]">
                      {d.type === 'percentage' ? `${d.value}%` : `$${d.value}`}
                    </span>
                  </td>
                  <td className="px-3 py-3 border-b border-[#1C1C2E]">
                    <span className="text-sm text-[#6B6B80]">
                      {d.uses_count}{d.max_uses ? `/${d.max_uses}` : ''}
                    </span>
                  </td>
                  <td className="px-3 py-3 border-b border-[#1C1C2E]">
                    <span className="text-xs text-[#6B6B80]">
                      {d.expires_at ? new Date(d.expires_at).toLocaleDateString() : '—'}
                    </span>
                  </td>
                  <td className="px-3 py-3 border-b border-[#1C1C2E]">
                    <button
                      onClick={() => toggleActive(d)}
                      className={`relative w-9 h-5 rounded-full transition-colors ${d.is_active ? 'bg-[#00E5FF]' : 'bg-[#22223A]'}`}
                    >
                      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${d.is_active ? 'left-4' : 'left-0.5'}`} />
                    </button>
                  </td>
                  <td className="px-3 py-3 border-b border-[#1C1C2E]">
                    <span className={`text-xs ${(d.show_on_home ?? false) ? 'text-[#1D9E75]' : 'text-[#3A3A50]'}`}>
                      {(d.show_on_home ?? false) ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="px-3 py-3 border-b border-[#1C1C2E]">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEdit(d)}
                        className="text-xs px-2.5 py-1 rounded-lg border border-[#22223A] text-[#6B6B80] hover:text-[#F2F2F4] transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(d.id)}
                        disabled={deletingId === d.id}
                        className="text-xs px-2.5 py-1 rounded-lg border border-[#E24B4A]/30 text-[#E24B4A] hover:bg-[#E24B4A]/10 transition-colors disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 overflow-y-auto" onClick={() => setShowForm(false)}>
          <div className="bg-[#0E0E16] border border-[#22223A] rounded-2xl p-6 w-full max-w-md my-auto" onClick={e => e.stopPropagation()}>
            <h2 className="font-syne font-black text-lg mb-5">
              {editTarget ? 'Edit discount' : 'Create discount'}
            </h2>
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs text-[#6B6B80] mb-1.5 block">Code</label>
                <div className="flex gap-2">
                  <input
                    value={form.code}
                    onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))}
                    placeholder="SUMMER20"
                    className={inputClass}
                  />
                  <button
                    onClick={() => setForm(f => ({ ...f, code: generateCode() }))}
                    className="px-3 rounded-xl border border-[#22223A] text-xs text-[#6B6B80] hover:text-[#F2F2F4] whitespace-nowrap transition-colors"
                  >
                    Auto
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-[#6B6B80] mb-1.5 block">Type</label>
                  <select
                    value={form.type}
                    onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                    className="w-full bg-[#07070C] border border-[#22223A] rounded-xl px-3.5 py-2.5 text-sm text-[#F2F2F4] focus:outline-none focus:border-[#00E5FF] transition-colors"
                  >
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-[#6B6B80] mb-1.5 block">Value</label>
                  <input
                    type="number"
                    value={form.value}
                    onChange={e => setForm(f => ({ ...f, value: e.target.value }))}
                    placeholder={form.type === 'percentage' ? '20' : '10'}
                    className={inputClass}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-[#6B6B80] mb-1.5 block">Max uses (optional)</label>
                  <input
                    type="number"
                    value={form.max_uses}
                    onChange={e => setForm(f => ({ ...f, max_uses: e.target.value }))}
                    placeholder="100"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="text-xs text-[#6B6B80] mb-1.5 block">Expires (optional)</label>
                  <input
                    type="date"
                    value={form.expires_at}
                    onChange={e => setForm(f => ({ ...f, expires_at: e.target.value }))}
                    className={inputClass}
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-[#6B6B80] mb-1.5 block">Description (shown on homepage)</label>
                <input
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Launch special — 20% off"
                  className={inputClass}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#F2F2F4]">Show on homepage</span>
                <button
                  onClick={() => setForm(f => ({ ...f, show_on_home: !f.show_on_home }))}
                  className={`relative w-9 h-5 rounded-full transition-colors ${form.show_on_home ? 'bg-[#00E5FF]' : 'bg-[#22223A]'}`}
                >
                  <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${form.show_on_home ? 'left-4' : 'left-0.5'}`} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#F2F2F4]">Active</span>
                <button
                  onClick={() => setForm(f => ({ ...f, is_active: !f.is_active }))}
                  className={`relative w-9 h-5 rounded-full transition-colors ${form.is_active ? 'bg-[#00E5FF]' : 'bg-[#22223A]'}`}
                >
                  <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${form.is_active ? 'left-4' : 'left-0.5'}`} />
                </button>
              </div>
              <div className="flex gap-3 pt-1">
                <button
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-2.5 rounded-full border border-[#22223A] text-sm text-[#6B6B80] hover:text-[#F2F2F4] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={saving || !form.code || !form.value}
                  className="flex-1 py-2.5 rounded-full bg-[#00E5FF] text-[#07070C] font-syne font-bold text-sm hover:opacity-85 transition-opacity disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editTarget ? 'Save' : 'Create'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
