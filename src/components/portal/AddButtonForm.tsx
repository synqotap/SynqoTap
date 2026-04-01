'use client'
import { useState } from 'react'
import { ProfileButton, BUTTON_TYPE_CONFIG, ButtonType } from '@/types/app'
import { Button, Input, Select } from '@/components/ui'

type AddButtonFormProps = {
  onAdd: (btn: Pick<ProfileButton, 'type' | 'value' | 'label'>) => void
  existingCount: number
}

const BUTTON_OPTIONS = Object.entries(BUTTON_TYPE_CONFIG).map(([type, config]) => ({
  value: type,
  label: config.label,
}))

export default function AddButtonForm({ onAdd, existingCount: _existingCount }: AddButtonFormProps) {
  const [type, setType] = useState<ButtonType>('phone')
  const [value, setValue] = useState('')
  const [label, setLabel] = useState('')

  function handleAdd() {
    if (!value.trim()) return
    onAdd({ type, value: value.trim(), label: label.trim() || null })
    setValue('')
    setLabel('')
    setType('phone')
  }

  const placeholder = BUTTON_TYPE_CONFIG[type]?.placeholder || ''

  return (
    <div className="bg-[#13131F] border border-[#22223A] rounded-2xl p-4 flex flex-col gap-3">
      <Select
        label="Button type"
        value={type}
        onChange={v => setType(v as ButtonType)}
        options={BUTTON_OPTIONS}
      />
      <Input
        label="Value"
        value={value}
        onChange={setValue}
        placeholder={placeholder}
      />
      <Input
        label="Custom label (optional)"
        value={label}
        onChange={setLabel}
        placeholder="e.g. Call me, My Instagram..."
      />
      <Button onClick={handleAdd} disabled={!value.trim()} fullWidth>
        Add button
      </Button>
    </div>
  )
}
