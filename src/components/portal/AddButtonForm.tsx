'use client'
import { useState } from 'react'
import type { ProfileButton } from '@/types/app'
import { BUTTON_CONFIG, ButtonType } from '@/types/app'
import { Select, Input, Button } from '@/components/ui'

type AddButtonFormProps = {
  onAdd: (button: Pick<ProfileButton, 'type' | 'value' | 'label'>) => void
  existingCount: number
  onCancel: () => void
}

const TYPE_OPTIONS = Object.entries(BUTTON_CONFIG).map(([value, config]) => ({
  value,
  label: config.label,
}))

export function AddButtonForm({ onAdd, existingCount, onCancel }: AddButtonFormProps) {
  const [type, setType] = useState<ButtonType>('phone')
  const [value, setValue] = useState('')
  const [label, setLabel] = useState('')

  const config = BUTTON_CONFIG[type]

  function handleAdd() {
    if (!value.trim()) return
    onAdd({ type, value: value.trim(), label: label.trim() || null })
    setValue('')
    setLabel('')
  }

  return (
    <div className="bg-[#0E0E16] border border-[#22223A] rounded-2xl p-5 flex flex-col gap-4">
      <p className="text-sm font-medium text-[#F2F2F4]">Add button</p>
      <Select
        label="Type"
        value={type}
        onChange={v => { setType(v as ButtonType); setValue('') }}
        options={TYPE_OPTIONS}
      />
      <Input
        label="Value"
        value={value}
        onChange={setValue}
        placeholder={config.placeholder}
      />
      <Input
        label="Custom label (optional)"
        value={label}
        onChange={setLabel}
        placeholder={config.label}
      />
      <div className="flex gap-2">
        <Button onClick={handleAdd} size="md" disabled={!value.trim()}>
          Add
        </Button>
        <Button onClick={onCancel} variant="ghost" size="md">
          Cancel
        </Button>
      </div>
    </div>
  )
}
