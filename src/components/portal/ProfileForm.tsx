'use client'
import { Profile } from '@/types/app'
import { Button, Input, Textarea } from '@/components/ui'

type ProfileFormProps = {
  profile: Profile
  onChange: (updates: Partial<Profile>) => void
  onSave: () => void
  saving: boolean
  saved: boolean
}

export default function ProfileForm({ profile, onChange, onSave, saving, saved }: ProfileFormProps) {
  return (
    <div className="flex flex-col gap-4">
      <Input
        label="Full name"
        value={profile.display_name || ''}
        onChange={v => onChange({ display_name: v })}
        placeholder="Your name"
      />
      <Input
        label="Job title"
        value={profile.job_title || ''}
        onChange={v => onChange({ job_title: v })}
        placeholder="CEO, Designer..."
      />
      <Input
        label="Company"
        value={profile.company_name || ''}
        onChange={v => onChange({ company_name: v })}
        placeholder="Company name"
      />
      <Textarea
        label="Short bio"
        value={profile.bio || ''}
        onChange={v => onChange({ bio: v })}
        placeholder="One line about what you do..."
        rows={3}
      />
      <div className="flex items-center gap-3 pt-2">
        <Button onClick={onSave} loading={saving} disabled={saving}>
          Save changes
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
