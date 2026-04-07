'use client'
import { useState } from 'react'

type Customer = {
  id: string
  email: string
  full_name: string | null
  plan: string
  is_active: boolean
  created_at: string
  profiles?: {
    slug: string
    display_name: string | null
    is_published: boolean
    is_active: boolean
  } | null
}

type CustomersTabProps = {
  customers: Customer[]
  onSuspend: (id: string) => Promise<void>
  onActivate: (id: string) => Promise<void>
  onEdit: (id: string, updates: { full_name?: string; plan?: string; force_password_change?: boolean }) => Promise<void>
}

const PLAN_OPTIONS = ['free', 'pvc', 'metal', 'business']

export default function CustomersTab({ customers, onSuspend, onActivate, onEdit }: CustomersTabProps) {
  const [search, setSearch] = useState('')
  const [editTarget, setEditTarget] = useState<Customer | null>(null)
  const [editName, setEditName] = useState('')
  const [editPlan, setEditPlan] = useState('')
  const [saving, setSaving] = useState(false)
  const [actionId, setActionId] = useState<string | null>(null)

  const filtered = customers.filter(c => {
    const q = search.toLowerCase()
    return !search || c.email.toLowerCase().includes(q) || (c.full_name || '').toLowerCase().includes(q)
  })

  function openEdit(c: Customer) {
    setEditTarget(c)
    setEditName(c.full_name || '')
    setEditPlan(c.plan)
  }

  async function handleSave() {
    if (!editTarget) return
    setSaving(true)
    await onEdit(editTarget.id, { full_name: editName, plan: editPlan })
    setSaving(false)
    setEditTarget(null)
  }

  async function handleForceReset() {
    if (!editTarget) return
    setSaving(true)
    await onEdit(editTarget.id, { force_password_change: true })
    setSaving(false)
    setEditTarget(null)
  }

  async function toggleStatus(c: Customer) {
    setActionId(c.id)
    if (c.is_active) {
      await onSuspend(c.id)
    } else {
      await onActivate(c.id)
    }
    setActionId(null)
  }

  const inputClass = "w-full bg-[#07070C] border border-[#22223A] rounded-xl px-3.5 py-2.5 text-sm text-[#F2F2F4] placeholder:text-[#3A3A50] focus:outline-none focus:border-[#00E5FF] transition-colors"

  return (
    <div>
      <div className="mb-4">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          className="w-full max-w-sm bg-[#0E0E16] border border-[#22223A] rounded-xl px-4 py-2.5 text-sm text-[#F2F2F4] placeholder:text-[#3A3A50] focus:outline-none focus:border-[#00E5FF] transition-colors"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-sm text-[#6B6B80]">No customers found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {['Name', 'Email', 'Plan', 'Status', 'Profile', 'Actions'].map(h => (
                  <th key={h} className="text-left text-xs font-medium text-[#6B6B80] uppercase tracking-wide px-3 py-2.5 border-b border-[#1C1C2E]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id} className="hover:bg-[#0E0E16] transition-colors">
                  <td className="px-3 py-3 border-b border-[#1C1C2E]">
                    <div className="text-sm font-medium text-[#F2F2F4]">{c.full_name || '—'}</div>
                  </td>
                  <td className="px-3 py-3 border-b border-[#1C1C2E]">
                    <div className="text-sm text-[#6B6B80]">{c.email}</div>
                  </td>
                  <td className="px-3 py-3 border-b border-[#1C1C2E]">
                    <span className="text-xs font-medium uppercase text-[#6B6B80]">{c.plan}</span>
                  </td>
                  <td className="px-3 py-3 border-b border-[#1C1C2E]">
                    {c.is_active ? (
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[#1D9E75]/15 text-[#1D9E75]">Active</span>
                    ) : (
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[#E24B4A]/15 text-[#E24B4A]">Suspended</span>
                    )}
                  </td>
                  <td className="px-3 py-3 border-b border-[#1C1C2E]">
                    {c.profiles?.slug ? (
                      <a
                        href={`/c/${c.profiles.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[#00E5FF] hover:opacity-70 transition-opacity font-mono"
                      >
                        /c/{c.profiles.slug}
                      </a>
                    ) : (
                      <span className="text-xs text-[#3A3A50]">—</span>
                    )}
                  </td>
                  <td className="px-3 py-3 border-b border-[#1C1C2E]">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEdit(c)}
                        className="text-xs px-2.5 py-1 rounded-lg border border-[#22223A] text-[#6B6B80] hover:text-[#F2F2F4] hover:border-[#3A3A50] transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => toggleStatus(c)}
                        disabled={actionId === c.id}
                        className={`text-xs px-2.5 py-1 rounded-lg border transition-colors disabled:opacity-50 ${
                          c.is_active
                            ? 'border-[#E24B4A]/40 text-[#E24B4A] hover:bg-[#E24B4A]/10'
                            : 'border-[#1D9E75]/40 text-[#1D9E75] hover:bg-[#1D9E75]/10'
                        }`}
                      >
                        {c.is_active ? 'Suspend' : 'Activate'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit modal */}
      {editTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={() => setEditTarget(null)}>
          <div className="bg-[#0E0E16] border border-[#22223A] rounded-2xl p-6 w-full max-w-sm" onClick={e => e.stopPropagation()}>
            <h2 className="font-syne font-black text-lg mb-5">Edit customer</h2>
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs text-[#6B6B80] mb-1.5 block">Full name</label>
                <input
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-xs text-[#6B6B80] mb-1.5 block">Email (read-only)</label>
                <input
                  value={editTarget.email}
                  readOnly
                  className={`${inputClass} opacity-50 cursor-not-allowed`}
                />
              </div>
              <div>
                <label className="text-xs text-[#6B6B80] mb-1.5 block">Plan</label>
                <select
                  value={editPlan}
                  onChange={e => setEditPlan(e.target.value)}
                  className="w-full bg-[#07070C] border border-[#22223A] rounded-xl px-3.5 py-2.5 text-sm text-[#F2F2F4] focus:outline-none focus:border-[#00E5FF] transition-colors"
                >
                  {PLAN_OPTIONS.map(p => (
                    <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleForceReset}
                disabled={saving}
                className="text-sm text-[#EF9F27] hover:text-[#EF9F27]/70 transition-colors text-left disabled:opacity-50"
              >
                Force password reset on next login
              </button>
              <div className="flex gap-3 pt-1">
                <button
                  onClick={() => setEditTarget(null)}
                  className="flex-1 py-2.5 rounded-full border border-[#22223A] text-sm text-[#6B6B80] hover:text-[#F2F2F4] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 py-2.5 rounded-full bg-[#00E5FF] text-[#07070C] font-syne font-bold text-sm hover:opacity-85 transition-opacity disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
