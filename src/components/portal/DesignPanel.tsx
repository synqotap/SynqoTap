'use client'
import { Profile, ACCENT_COLORS } from '@/types/app'
import { Button, Input } from '@/components/ui'

type DesignPanelProps = {
  profile: Profile
  onChange: (updates: Partial<Profile>) => void
  onSave: () => void
  saving: boolean
  saved: boolean
}

export default function DesignPanel({ profile, onChange, onSave, saving, saved }: DesignPanelProps) {
  const accent = profile.accent_color || '#00E5FF'

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-xs text-[#6B6B80] mb-3">Accent color</p>
        <div className="flex gap-2.5 flex-wrap mb-4">
          {ACCENT_COLORS.map(color => (
            <button
              key={color}
              onClick={() => onChange({ accent_color: color })}
              className={`w-8 h-8 rounded-full transition-transform hover:scale-110 ${accent === color ? 'scale-110 ring-2 ring-white ring-offset-2 ring-offset-[#07070C]' : ''}`}
              style={{ background: color }}
            />
          ))}
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-[#22223A] flex-shrink-0" style={{ background: accent }} />
          <Input
            value={accent}
            onChange={v => onChange({ accent_color: v })}
            placeholder="#00E5FF"
          />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Button onClick={onSave} loading={saving} disabled={saving}>
          Save design
        </Button>
        {saved && (
          <span className="text-xs text-[#5DCAA5] bg-[#1D9E75]/15 border border-[#1D9E75]/30 px-3 py-1.5 rounded-full">
            ✓ Saved
          </span>
        )}
      </div>
    </div>
  )
}
