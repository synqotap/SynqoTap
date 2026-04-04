'use client'
import { useState, useRef } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import type { ProfileButton, ButtonGroup } from '@/types/app'
import { BUTTON_CONFIG, ButtonType } from '@/types/app'
import { Toggle } from '@/components/ui'
import { AddButtonForm } from './AddButtonForm'

type ListItem =
  | { kind: 'button'; data: ProfileButton }
  | { kind: 'group'; data: ButtonGroup }

type ButtonsListProps = {
  buttons: ProfileButton[]
  groups: ButtonGroup[]
  onAdd: (button: Pick<ProfileButton, 'type' | 'value' | 'label'>) => void
  onToggle: (id: string, is_active: boolean) => void
  onDelete: (id: string) => void
  onReorderAll: (buttons: Array<{ id: string; position: number }>, groups: Array<{ id: string; position: number }>) => void
  onAddGroup: (name: string, position: number) => void
  onRenameGroup: (id: string, name: string) => void
  onDeleteGroup: (id: string) => void
}

export function ButtonsList({
  buttons,
  groups,
  onAdd,
  onToggle,
  onDelete,
  onReorderAll,
  onAddGroup,
  onRenameGroup,
  onDeleteGroup,
}: ButtonsListProps) {
  const [showAdd, setShowAdd] = useState(false)
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null)
  const [editingGroupName, setEditingGroupName] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  // Build mixed sorted list
  const items: ListItem[] = [
    ...buttons.map(b => ({ kind: 'button' as const, data: b })),
    ...groups.map(g => ({ kind: 'group' as const, data: g })),
  ].sort((a, b) => a.data.position - b.data.position)

  const totalCount = buttons.length + groups.length

  function onDragEnd(result: DropResult) {
    if (!result.destination) return
    if (result.destination.index === result.source.index) return

    const reordered = Array.from(items)
    const [moved] = reordered.splice(result.source.index, 1)
    reordered.splice(result.destination.index, 0, moved)

    const buttonUpdates: Array<{ id: string; position: number }> = []
    const groupUpdates: Array<{ id: string; position: number }> = []
    reordered.forEach((item, i) => {
      if (item.kind === 'button') buttonUpdates.push({ id: item.data.id, position: i })
      else groupUpdates.push({ id: item.data.id, position: i })
    })
    onReorderAll(buttonUpdates, groupUpdates)
  }

  function startRenameGroup(g: ButtonGroup) {
    setEditingGroupId(g.id)
    setEditingGroupName(g.name)
    setTimeout(() => inputRef.current?.focus(), 0)
  }

  function commitRename() {
    if (editingGroupId && editingGroupName.trim()) {
      onRenameGroup(editingGroupId, editingGroupName.trim())
    }
    setEditingGroupId(null)
  }

  // Move button to just after the selected group (or to end if ungrouped)
  function assignButtonToGroup(buttonId: string, groupId: string | 'none') {
    const withoutBtn = items.filter(i => !(i.kind === 'button' && i.data.id === buttonId))
    const btn = items.find(i => i.kind === 'button' && i.data.id === buttonId)
    if (!btn) return

    let insertAt: number
    if (groupId === 'none') {
      // Move to end
      insertAt = withoutBtn.length
    } else {
      const groupIndex = withoutBtn.findIndex(i => i.kind === 'group' && i.data.id === groupId)
      insertAt = groupIndex === -1 ? withoutBtn.length : groupIndex + 1
    }

    withoutBtn.splice(insertAt, 0, btn)

    const buttonUpdates: Array<{ id: string; position: number }> = []
    const groupUpdates: Array<{ id: string; position: number }> = []
    withoutBtn.forEach((item, i) => {
      if (item.kind === 'button') buttonUpdates.push({ id: item.data.id, position: i })
      else groupUpdates.push({ id: item.data.id, position: i })
    })
    onReorderAll(buttonUpdates, groupUpdates)
  }

  // Determine which group a button currently belongs to
  // (the last group header that appears before it in the sorted list)
  function getButtonGroupId(buttonId: string): string {
    let currentGroupId = 'none'
    for (const item of items) {
      if (item.kind === 'group') currentGroupId = item.data.id
      if (item.kind === 'button' && item.data.id === buttonId) return currentGroupId
    }
    return 'none'
  }

  return (
    <div className="flex flex-col gap-3">
      {items.length === 0 && !showAdd && (
        <div className="bg-[#0E0E16] border border-[#22223A] rounded-2xl p-8 text-center">
          <p className="text-sm text-[#6B6B80]">No buttons yet. Add your first button below.</p>
        </div>
      )}

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="items">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="flex flex-col gap-3">
              {items.map((item, index) => {
                const draggableId = item.kind === 'button' ? `btn-${item.data.id}` : `grp-${item.data.id}`

                // ── Section divider ──────────────────────────
                if (item.kind === 'group') {
                  const g = item.data
                  const isEditing = editingGroupId === g.id
                  return (
                    <Draggable key={draggableId} draggableId={draggableId} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`flex items-center gap-2 py-1 transition-opacity ${snapshot.isDragging ? 'opacity-80' : ''}`}
                        >
                          {/* drag handle */}
                          <div
                            {...provided.dragHandleProps}
                            className="text-[#3A3A50] hover:text-[#6B6B80] cursor-grab active:cursor-grabbing shrink-0"
                          >
                            <svg width="10" height="14" viewBox="0 0 12 18" fill="currentColor" aria-hidden="true">
                              <circle cx="3" cy="3" r="1.5" /><circle cx="9" cy="3" r="1.5" />
                              <circle cx="3" cy="9" r="1.5" /><circle cx="9" cy="9" r="1.5" />
                              <circle cx="3" cy="15" r="1.5" /><circle cx="9" cy="15" r="1.5" />
                            </svg>
                          </div>
                          {/* left line */}
                          <div className="h-px flex-1 bg-[#22223A]" />
                          {/* label */}
                          {isEditing ? (
                            <input
                              ref={inputRef}
                              value={editingGroupName}
                              onChange={e => setEditingGroupName(e.target.value)}
                              onBlur={commitRename}
                              onKeyDown={e => { if (e.key === 'Enter') commitRename() }}
                              className="bg-transparent text-xs font-semibold uppercase tracking-widest text-[#F2F2F4] focus:outline-none border-b border-[#00E5FF] text-center w-28"
                            />
                          ) : (
                            <span
                              className="text-xs font-semibold uppercase tracking-widest text-[#3A3A50] hover:text-[#6B6B80] cursor-pointer transition-colors px-1 whitespace-nowrap"
                              onClick={() => startRenameGroup(g)}
                            >
                              {g.name}
                            </span>
                          )}
                          {/* right line */}
                          <div className="h-px flex-1 bg-[#22223A]" />
                          {/* delete */}
                          <button
                            onClick={() => onDeleteGroup(g.id)}
                            className="text-[#3A3A50] hover:text-[#F09595] transition-colors text-lg leading-none shrink-0"
                          >
                            ×
                          </button>
                        </div>
                      )}
                    </Draggable>
                  )
                }

                // ── Button row ───────────────────────────────
                const btn = item.data
                const config = BUTTON_CONFIG[btn.type as ButtonType]
                if (!config) return null
                const currentGroupId = groups.length > 0 ? getButtonGroupId(btn.id) : 'none'

                return (
                  <Draggable key={draggableId} draggableId={draggableId} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`bg-[#0E0E16] border rounded-2xl px-4 py-3 flex items-center gap-3 transition-shadow ${
                          snapshot.isDragging
                            ? 'border-[#3A3A50] shadow-lg shadow-black/40'
                            : 'border-[#22223A]'
                        }`}
                      >
                        <div
                          {...provided.dragHandleProps}
                          className="text-[#3A3A50] hover:text-[#6B6B80] cursor-grab active:cursor-grabbing shrink-0 select-none"
                        >
                          <svg width="12" height="18" viewBox="0 0 12 18" fill="currentColor" aria-hidden="true">
                            <circle cx="3" cy="3" r="1.5" /><circle cx="9" cy="3" r="1.5" />
                            <circle cx="3" cy="9" r="1.5" /><circle cx="9" cy="9" r="1.5" />
                            <circle cx="3" cy="15" r="1.5" /><circle cx="9" cy="15" r="1.5" />
                          </svg>
                        </div>
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-sm font-bold"
                          style={{ background: config.bgColor, color: config.iconColor }}
                        >
                          {config.label.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[#F2F2F4] truncate">{btn.label || config.label}</p>
                          <p className="text-xs text-[#6B6B80] truncate">{btn.value}</p>
                        </div>
                        {groups.length > 0 && (
                          <select
                            value={currentGroupId}
                            onChange={e => assignButtonToGroup(btn.id, e.target.value)}
                            className="text-xs bg-[#13131F] border border-[#22223A] rounded-lg px-2 py-1 text-[#6B6B80] focus:outline-none focus:border-[#3A3A50] shrink-0"
                          >
                            <option value="none">No section</option>
                            {groups
                              .slice()
                              .sort((a, b) => a.position - b.position)
                              .map(g => (
                                <option key={g.id} value={g.id}>{g.name}</option>
                              ))
                            }
                          </select>
                        )}
                        <Toggle enabled={btn.is_active} onChange={val => onToggle(btn.id, val)} />
                        <button
                          onClick={() => onDelete(btn.id)}
                          className="text-[#6B6B80] hover:text-[#F09595] transition-colors text-xl leading-none ml-1 shrink-0"
                        >
                          ×
                        </button>
                      </div>
                    )}
                  </Draggable>
                )
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {showAdd && (
        <AddButtonForm
          onAdd={btn => { onAdd(btn); setShowAdd(false) }}
          existingCount={buttons.length}
          onCancel={() => setShowAdd(false)}
        />
      )}

      {!showAdd && (
        <div className="flex gap-2">
          {buttons.length < 8 && (
            <button
              onClick={() => setShowAdd(true)}
              className="flex-1 border border-dashed border-[#22223A] rounded-2xl py-3.5 text-sm text-[#6B6B80] hover:border-[#00E5FF]/40 hover:text-[#00E5FF] transition-colors"
            >
              + Add button
            </button>
          )}
          <button
            onClick={() => onAddGroup('New section', totalCount)}
            className="flex-1 border border-dashed border-[#22223A] rounded-2xl py-3.5 text-sm text-[#6B6B80] hover:border-[#7B61FF]/40 hover:text-[#7B61FF] transition-colors"
          >
            + Add section
          </button>
        </div>
      )}

      {buttons.length >= 8 && !showAdd && (
        <p className="text-xs text-center text-[#3A3A50]">Maximum 8 buttons reached.</p>
      )}
    </div>
  )
}
