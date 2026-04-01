'use client'
import { useState } from 'react'
import { ProfileButton, BUTTON_TYPE_CONFIG, ButtonType } from '@/types/app'
import { Toggle, Button } from '@/components/ui'
import AddButtonForm from './AddButtonForm'

type ButtonsListProps = {
  buttons: ProfileButton[]
  onAdd: (btn: Pick<ProfileButton, 'type' | 'value' | 'label'>) => void
  onToggle: (id: string, active: boolean) => void
  onDelete: (id: string) => void
}

const BUTTON_ICONS: Record<string, string> = {
  phone: '📞', whatsapp: '💬', email: '✉️', instagram: '📷',
  linkedin: '💼', facebook: '👥', tiktok: '🎵', website: '🌐', calendly: '📅',
}

export default function ButtonsList({ buttons, onAdd, onToggle, onDelete }: ButtonsListProps) {
  const [showForm, setShowForm] = useState(false)

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-[#0E0E16] border border-[#22223A] rounded-2xl divide-y divide-[#1C1C2E]">
        {buttons.length === 0 && (
          <div className="text-center py-8 text-sm text-[#6B6B80]">
            No buttons yet. Add your first one below.
          </div>
        )}
        {buttons.map(btn => {
          const config = BUTTON_TYPE_CONFIG[btn.type as ButtonType]
          return (
            <div key={btn.id} className="flex items-center gap-3 px-4 py-3">
              <div className="w-9 h-9 rounded-xl bg-[#13131F] flex items-center justify-center text-sm flex-shrink-0">
                {BUTTON_ICONS[btn.type] || '🔗'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-[#F2F2F4]">{config?.label || btn.type}</div>
                <div className="text-xs text-[#6B6B80] truncate">{btn.value}</div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Toggle enabled={btn.is_active} onChange={v => onToggle(btn.id, v)} />
                <Button variant="danger" size="sm" onClick={() => onDelete(btn.id)}>Delete</Button>
              </div>
            </div>
          )
        })}
      </div>

      {buttons.length < 8 && (
        <>
          <Button variant="outline" onClick={() => setShowForm(!showForm)}>
            {showForm ? '✕ Cancel' : '+ Add button'}
          </Button>
          {showForm && (
            <AddButtonForm
              onAdd={(btn) => { onAdd(btn); setShowForm(false) }}
              existingCount={buttons.length}
            />
          )}
        </>
      )}
    </div>
  )
}
