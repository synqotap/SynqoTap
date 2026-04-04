'use client'
import type { Profile } from '@/types/app'
import { Input, Textarea, Button, Toggle } from '@/components/ui'

type ProfileFormProps = {
  profile: Profile
  onChange: (updates: Partial<Profile>) => void
  onSave: () => void
  onToggleActive: (active: boolean) => void
  saving: boolean
  saved: boolean
}

export function ProfileForm({ profile, onChange, onSave, onToggleActive, saving, saved }: ProfileFormProps) {
  return (
    <div className="flex flex-col gap-4">
      <Input
        label="Full name"
        value={profile.display_name || ''}
        onChange={v => onChange({ display_name: v })}
        placeholder="Your full name"
      />
      <Input
        label="Job title"
        value={profile.job_title || ''}
        onChange={v => onChange({ job_title: v })}
        placeholder="e.g. CEO, Designer, Freelancer"
      />
      <Input
        label="Company"
        value={profile.company_name || ''}
        onChange={v => onChange({ company_name: v })}
        placeholder="Your company or brand"
      />
      <Textarea
        label="Short bio"
        value={profile.bio || ''}
        onChange={v => onChange({ bio: v })}
        placeholder="Brief description about you..."
        rows={3}
      />
      <div className="flex items-center gap-3 pt-1">
        <Button onClick={onSave} loading={saving} size="md">
          Save changes
        </Button>
        {saved && <span className="text-xs text-[#5DCAA5]">✓ Saved</span>}
      </div>

      <div className="border-t border-[#1C1C2E] pt-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-[#F2F2F4]">Profile active</p>
            <p className="text-xs text-[#6B6B80] mt-0.5">
              {profile.is_active
                ? 'Visible to anyone with your link'
                : 'Paused — not visible to visitors'}
            </p>
          </div>
          <Toggle enabled={profile.is_active} onChange={onToggleActive} />
        </div>
      </div>
    </div>
  )
}
