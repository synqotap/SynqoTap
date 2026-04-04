'use client'
import { useState } from 'react'
import { ACCENT_COLORS, TEMPLATES, ProfileTemplate } from '@/types/app'
import { Button } from '@/components/ui'

type DesignPanelProps = {
  profile: { accent_color?: string | null; template?: string | null }
  onChange: (updates: { accent_color?: string; template?: string }) => void
  onSave: () => void
  saving: boolean
  saved: boolean
}

export function DesignPanel({ profile, onChange, onSave, saving, saved }: DesignPanelProps) {
  const [customHex, setCustomHex] = useState('')
  const currentAccent = profile.accent_color || '#00E5FF'
  const currentTemplate = (profile.template || 'minimal') as ProfileTemplate

  function selectColor(color: string) {
    onChange({ accent_color: color })
    setCustomHex('')
  }

  function handleCustomHex(val: string) {
    setCustomHex(val)
    const hex = val.startsWith('#') ? val : `#${val}`
    if (/^#[0-9A-Fa-f]{6}$/.test(hex)) {
      onChange({ accent_color: hex })
    }
  }

  function selectTemplate(t: ProfileTemplate) {
    onChange({ template: t })
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-xs text-[#6B6B80] mb-3">Accent color</p>
        <div className="flex items-center gap-3 flex-wrap mb-4">
          {ACCENT_COLORS.map(color => (
            <button
              key={color}
              onClick={() => selectColor(color)}
              className="w-8 h-8 rounded-full transition-all hover:scale-110"
              style={{
                background: color,
                outline: currentAccent === color ? `3px solid ${color}` : 'none',
                outlineOffset: '2px',
              }}
            />
          ))}
        </div>
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-full shrink-0 border border-[#22223A]"
            style={{ background: currentAccent }}
          />
          <input
            type="text"
            value={customHex || currentAccent}
            onChange={e => handleCustomHex(e.target.value)}
            placeholder="#00E5FF"
            className="flex-1 bg-[#13131F] border border-[#22223A] rounded-xl px-3 py-2 text-sm text-[#F2F2F4] placeholder:text-[#3A3A50] focus:outline-none focus:border-[#00E5FF] transition-colors font-mono"
          />
        </div>
      </div>

      <div>
        <p className="text-xs text-[#6B6B80] mb-3">Profile template</p>
        <div className="flex flex-col gap-2">
          {(Object.entries(TEMPLATES) as [ProfileTemplate, { label: string; description: string }][]).map(([key, cfg]) => {
            const isSelected = currentTemplate === key
            return (
              <button
                key={key}
                onClick={() => selectTemplate(key)}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-left transition-all"
                style={{
                  background: isSelected ? `${currentAccent}12` : '#13131F',
                  border: `1px solid ${isSelected ? currentAccent : '#22223A'}`,
                }}
              >
                <div
                  className="w-4 h-4 rounded-full shrink-0 border-2 flex items-center justify-center"
                  style={{ borderColor: isSelected ? currentAccent : '#3A3A50' }}
                >
                  {isSelected && (
                    <div className="w-2 h-2 rounded-full" style={{ background: currentAccent }} />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-[#F2F2F4]">{cfg.label}</p>
                  <p className="text-xs text-[#6B6B80]">{cfg.description}</p>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex items-center gap-3 pt-1">
        <Button onClick={onSave} loading={saving} size="md">
          Save design
        </Button>
        {saved && <span className="text-xs text-[#5DCAA5]">✓ Saved</span>}
      </div>
    </div>
  )
}
