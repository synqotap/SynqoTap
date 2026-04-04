'use client'
import { useState } from 'react'
import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd'
import {
  SiWhatsapp, SiTelegram, SiInstagram, SiFacebook, SiTiktok,
  SiX, SiSnapchat, SiYoutube, SiCalendly, SiZelle, SiCashapp, SiVenmo, SiPaypal,
} from 'react-icons/si'
import { FaLinkedinIn } from 'react-icons/fa6'
import { LuPhone, LuMail, LuGlobe, LuMapPin, LuLink } from 'react-icons/lu'
import { ProfileButton, ButtonGroup, BUTTON_CONFIG, ButtonType, ProfileTemplate } from '@/types/app'

type IconComp = React.ComponentType<{ size?: number }>

const ICON_COMPONENTS: Record<ButtonType, IconComp> = {
  phone:     LuPhone,
  whatsapp:  SiWhatsapp,
  email:     LuMail,
  telegram:  SiTelegram,
  instagram: SiInstagram,
  linkedin:  FaLinkedinIn,
  facebook:  SiFacebook,
  tiktok:    SiTiktok,
  twitter:   SiX,
  snapchat:  SiSnapchat,
  youtube:   SiYoutube,
  website:   LuGlobe,
  calendly:  SiCalendly,
  zelle:     SiZelle,
  cashapp:   SiCashapp,
  venmo:     SiVenmo,
  paypal:    SiPaypal,
  maps:      LuMapPin,
  custom:    LuLink,
}

function buildIcons(size: number): Record<ButtonType, React.ReactNode> {
  return Object.fromEntries(
    (Object.entries(ICON_COMPONENTS) as [ButtonType, IconComp][]).map(([k, Comp]) => [k, <Comp key={k} size={size} />])
  ) as Record<ButtonType, React.ReactNode>
}

export const ICONS = buildIcons(20)
const ICONS_LG    = buildIcons(24)

const DEFAULT_CAT_ORDER = ['contact', 'social', 'web', 'payment', 'other'] as const
type AutoCategory = typeof DEFAULT_CAT_ORDER[number]

const CATEGORY_LABELS: Record<AutoCategory, string> = {
  contact: 'Contact',
  social:  'Social',
  web:     'Web',
  payment: 'Payments',
  other:   'Other',
}

const GRID_CATEGORIES = new Set<AutoCategory>(['social', 'payment'])

const EXTERNAL_TYPES = new Set([
  'website', 'instagram', 'linkedin', 'facebook', 'tiktok', 'twitter',
  'snapchat', 'youtube', 'calendly', 'telegram', 'zelle', 'cashapp',
  'venmo', 'paypal', 'maps', 'custom',
])

type ProfileButtonsProps = {
  buttons: ProfileButton[]
  groups?: ButtonGroup[]
  accent: string
  template?: ProfileTemplate
  isEditMode?: boolean
  onDelete?: (id: string) => void
  onReorder?: (buttons: ProfileButton[]) => void
  onEditButton?: (button: ProfileButton) => void
}

export default function ProfileButtons({
  buttons,
  groups = [],
  accent,
  template = 'minimal',
  isEditMode,
  onDelete,
  onReorder,
  onEditButton,
}: ProfileButtonsProps) {
  const [catOrder, setCatOrder] = useState<AutoCategory[]>([...DEFAULT_CAT_ORDER])
  // Tracks user-assigned section overrides (cross-section drags). Session-only.
  const [sectionOverrides, setSectionOverrides] = useState<Map<string, AutoCategory>>(new Map())

  const active = buttons
    .filter(b => isEditMode ? b.is_active : (b.is_active && !!b.value))
    .sort((a, b) => a.position - b.position)

  if (active.length === 0 && !isEditMode) return null

  const isCard = template === 'card'
  const isBold = template === 'bold'
  const isSoft = template === 'soft'
  const isRound = isSoft || isCard

  // Manual group labels
  const buttonToGroupName = new Map<string, string>()
  if (groups.length > 0) {
    const allItems = [
      ...active.map(b => ({ kind: 'button' as const, id: b.id, name: '', position: b.position })),
      ...groups.map(g => ({ kind: 'group' as const, id: g.id, name: g.name, position: g.position })),
    ].sort((a, b) => a.position - b.position)
    let currentGroupName = ''
    for (const item of allItems) {
      if (item.kind === 'group') currentGroupName = item.name
      else if (currentGroupName) buttonToGroupName.set(item.id, currentGroupName)
    }
  }

  const byCategory = new Map<AutoCategory, ProfileButton[]>()
  for (const btn of active) {
    const config = BUTTON_CONFIG[btn.type as ButtonType]
    if (!config) continue
    // Use user override if they dragged this button to a different section
    const cat = sectionOverrides.get(btn.id) ?? (config.group as AutoCategory)
    if (!byCategory.has(cat)) byCategory.set(cat, [])
    byCategory.get(cat)!.push(btn)
  }

  const buttonAnimIdx = new Map<string, number>()
  let idx = 0
  for (const cat of catOrder) {
    for (const btn of (byCategory.get(cat) || [])) {
      buttonAnimIdx.set(btn.id, idx++)
    }
  }

  // Only render categories that actually have buttons (keeps DnD indices consistent)
  const visibleCats = catOrder.filter(cat => (byCategory.get(cat)?.length ?? 0) > 0)

  function getLabel(cat: AutoCategory, catBtns: ProfileButton[]): string {
    if (groups.length === 0) return CATEGORY_LABELS[cat]
    const names = [...new Set(catBtns.map(b => buttonToGroupName.get(b.id)).filter((n): n is string => !!n))]
    return names.length === 1 ? names[0] : CATEGORY_LABELS[cat]
  }

  function onDragEnd(result: DropResult) {
    const { source, destination, type } = result
    if (!destination) return

    // ── Section drag ────────────────────────────────────────────
    if (type === 'SECTION') {
      if (source.index === destination.index) return
      const newOrder = [...catOrder]
      const [moved] = newOrder.splice(source.index, 1)
      newOrder.splice(destination.index, 0, moved)
      setCatOrder(newOrder)
      return
    }

    // ── Button drag ─────────────────────────────────────────────
    if (!onReorder) return
    if (source.droppableId === destination.droppableId && source.index === destination.index) return

    const srcCat = source.droppableId as AutoCategory
    const dstCat = destination.droppableId as AutoCategory

    // Build mutable per-category lists
    const catMap = new Map<AutoCategory, ProfileButton[]>()
    for (const cat of catOrder) {
      catMap.set(cat, [...(byCategory.get(cat) || [])])
    }

    const srcList = catMap.get(srcCat)!
    const [moved] = srcList.splice(source.index, 1)

    if (srcCat === dstCat) {
      srcList.splice(destination.index, 0, moved)
    } else {
      catMap.get(dstCat)!.splice(destination.index, 0, moved)
      // Remember this button now belongs to the destination section
      setSectionOverrides(prev => new Map(prev).set(moved.id, dstCat))
    }

    // Flatten in catOrder order and assign new positions
    const reordered: ProfileButton[] = []
    for (const cat of catOrder) {
      reordered.push(...(catMap.get(cat) || []))
    }

    // CRITICAL: update position fields so the position-based sort doesn't undo the drag
    onReorder(reordered.map((b, i) => ({ ...b, position: i })))
  }

  // ── Full-width button ────────────────────────────────────────
  function renderFullWidth(btn: ProfileButton, isDragging?: boolean) {
    const config = BUTTON_CONFIG[btn.type as ButtonType]
    if (!config) return null
    const icon = ICONS[btn.type as ButtonType]
    const isExternal = EXTERNAL_TYPES.has(btn.type)
    const delay = `${0.05 + (buttonAnimIdx.get(btn.id) ?? 0) * 0.04}s`
    const isEmpty = !btn.value

    if (isEmpty && isEditMode) {
      return (
        <button
          onClick={() => onEditButton?.(btn)}
          className="flex items-center gap-3.5 rounded-2xl px-4 py-3.5 w-full border-2 border-dashed border-[#22223A] text-left"
          style={{ background: 'transparent' }}
        >
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 opacity-40" style={{ background: config.bgColor, color: config.iconColor }}>{icon}</div>
          <span className="flex-1 text-sm text-[#6B6B80]">Tap to add {config.label}</span>
          <span className="text-sm text-[#3A3A50]">+</span>
        </button>
      )
    }

    const inner = isBold ? (
      <a
        href={config.href(btn.value)}
        target={isExternal ? '_blank' : undefined}
        rel="noopener noreferrer"
        className="animate-fadeUp flex items-center gap-3.5 rounded-xl px-4 py-4 transition-all duration-200 active:scale-[0.98] w-full"
        style={{ background: '#13131F', borderTop: '1px solid #1C1C2E', borderRight: '1px solid #1C1C2E', borderBottom: '1px solid #1C1C2E', borderLeft: `4px solid ${accent}`, animationDelay: delay }}
      >
        <div className="w-9 h-9 flex items-center justify-center shrink-0" style={{ color: accent }}>{icon}</div>
        <span className="text-xs font-bold uppercase tracking-widest text-[#F2F2F4] flex-1">{btn.label || config.label}</span>
      </a>
    ) : isSoft ? (
      <a
        href={config.href(btn.value)}
        target={isExternal ? '_blank' : undefined}
        rel="noopener noreferrer"
        className="animate-fadeUp flex items-center justify-center gap-3 rounded-full px-5 py-3.5 transition-all duration-200 active:scale-[0.98] w-full"
        style={{ background: `${accent}1F`, border: `1px solid ${accent}4D`, animationDelay: delay }}
      >
        <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: config.bgColor, color: config.iconColor }}>{icon}</div>
        <span className="text-sm font-medium text-[#F2F2F4]">{btn.label || config.label}</span>
      </a>
    ) : (
      <a
        href={config.href(btn.value)}
        target={isExternal ? '_blank' : undefined}
        rel="noopener noreferrer"
        className="animate-fadeUp flex items-center gap-3.5 rounded-2xl px-4 py-3.5 transition-all duration-200 hover:translate-x-1 active:scale-[0.98] group w-full"
        style={{ background: isDragging ? '#13131F' : '#0E0E16', border: '1px solid #1C1C2E', animationDelay: delay }}
      >
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: config.bgColor, color: config.iconColor }}>{icon}</div>
        <span className="flex-1 text-sm font-medium text-[#F2F2F4]">{btn.label || config.label}</span>
        <span className="text-lg transition-all duration-200 group-hover:translate-x-1 text-[#6B6B80]">›</span>
      </a>
    )

    return inner
  }

  // ── Icon card styles per template ───────────────────────────
  function iconCardStyle(config: typeof BUTTON_CONFIG[ButtonType], delay: string): React.CSSProperties {
    if (isBold) return {
      width: 56, height: 56, borderRadius: 8,
      background: '#13131F',
      borderTop: '1px solid #1C1C2E',
      borderRight: '1px solid #1C1C2E',
      borderBottom: '1px solid #1C1C2E',
      borderLeft: `3px solid ${accent}`,
      color: accent,
      animationDelay: delay,
    }
    if (isSoft) return {
      width: 56, height: 56, borderRadius: '50%',
      background: `${accent}1F`,
      border: `1px solid ${accent}4D`,
      color: config.iconColor,
      animationDelay: delay,
    }
    // minimal / card
    return {
      width: 56, height: 56,
      borderRadius: isCard ? '50%' : 12,
      background: config.bgColor,
      color: config.iconColor,
      animationDelay: delay,
    }
  }

  // ── Icon-only card (social/payment display mode) ─────────────
  function renderIconCard(btn: ProfileButton) {
    const config = BUTTON_CONFIG[btn.type as ButtonType]
    if (!config) return null
    const icon = ICONS_LG[btn.type as ButtonType]
    const isExternal = EXTERNAL_TYPES.has(btn.type)
    const delay = `${0.05 + (buttonAnimIdx.get(btn.id) ?? 0) * 0.04}s`
    return (
      <a
        href={config.href(btn.value)}
        target={isExternal ? '_blank' : undefined}
        rel="noopener noreferrer"
        className="animate-fadeUp flex items-center justify-center transition-all duration-200 active:scale-[0.93]"
        style={iconCardStyle(config, delay)}
      >
        {icon}
      </a>
    )
  }

  // ── Edit icon card (social/payment edit mode) ────────────────
  function renderEditIconCard(btn: ProfileButton) {
    const config = BUTTON_CONFIG[btn.type as ButtonType]
    if (!config) return null
    const icon = ICONS_LG[btn.type as ButtonType]
    const isEmpty = !btn.value
    const baseStyle = iconCardStyle(config, '')
    return (
      <button
        onClick={() => onEditButton?.(btn)}
        className={`flex items-center justify-center ${isEmpty ? 'border-2 border-dashed border-[#22223A]' : 'animate-wiggle'}`}
        style={{
          ...baseStyle,
          background: isEmpty ? 'transparent' : baseStyle.background,
          opacity: isEmpty ? 0.5 : 1,
        }}
      >
        {icon}
      </button>
    )
  }

  // ── Section header ───────────────────────────────────────────
  // dragHandleProps MUST always be spread on some DOM element (even invisible)
  // otherwise @hello-pangea/dnd throws "Unable to find drag handle"
  function renderSectionHeader(cat: AutoCategory, catBtns: ProfileButton[], dragHandleProps: object) {
    const label = getLabel(cat, catBtns)
    if (isCard) {
      // Card has no visible header — render a hidden 0×0 element to satisfy the library
      return <div {...dragHandleProps} style={{ width: 0, height: 0, overflow: 'hidden', position: 'absolute' }} aria-hidden />
    }
    return (
      <div className="flex items-center gap-1.5 mb-2.5">
        {/* Always in DOM; visible + interactive only in edit mode */}
        <div
          {...dragHandleProps}
          className={isEditMode
            ? 'cursor-grab p-1 -ml-1 rounded text-[#3A3A50] hover:text-[#6B6B80] hover:bg-[#13131F] transition-colors'
            : 'w-0 h-0 overflow-hidden pointer-events-none'
          }
          aria-hidden={!isEditMode}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="18" x2="20" y2="18" />
          </svg>
        </div>
        <p className="text-xs font-semibold uppercase tracking-widest text-[#3A3A50]">{label}</p>
      </div>
    )
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="sections" type="SECTION" direction="vertical">
        {sectProv => (
          <div ref={sectProv.innerRef} {...sectProv.droppableProps} className="flex flex-col gap-5">
            {visibleCats.map((cat, catIdx) => {
              const catBtns = byCategory.get(cat)!
              const useIconGrid = GRID_CATEGORIES.has(cat)

              return (
                <Draggable
                  key={cat}
                  draggableId={`section-${cat}`}
                  index={catIdx}
                  isDragDisabled={!isEditMode}
                >
                  {(sectDrag, sectSnap) => (
                    <div
                      ref={sectDrag.innerRef}
                      {...sectDrag.draggableProps}
                      style={{
                        ...sectDrag.draggableProps.style,
                        opacity: sectSnap.isDragging ? 0.85 : 1,
                      }}
                    >
                      {renderSectionHeader(cat, catBtns, sectDrag.dragHandleProps ?? {})}

                      {/* ── Icon grid display ───────────── */}
                      {useIconGrid && !isEditMode && (
                        <div className="flex flex-wrap gap-3 justify-center">
                          {catBtns.map(btn => <div key={btn.id}>{renderIconCard(btn)}</div>)}
                        </div>
                      )}

                      {/* ── Icon grid edit (horizontal DnD) */}
                      {useIconGrid && isEditMode && (
                        <Droppable droppableId={cat} type="BUTTON" direction="horizontal">
                          {btnProv => (
                            <div
                              ref={btnProv.innerRef}
                              {...btnProv.droppableProps}
                              className="flex flex-wrap gap-3 justify-center min-h-16"
                            >
                              {catBtns.map((btn, i) => (
                                <Draggable key={btn.id} draggableId={btn.id} index={i}>
                                  {(drag, snap) => (
                                    <div
                                      ref={drag.innerRef}
                                      {...drag.draggableProps}
                                      {...drag.dragHandleProps}
                                      className="relative"
                                      style={{ ...drag.draggableProps.style, opacity: snap.isDragging ? 0.7 : 1 }}
                                    >
                                      {renderEditIconCard(btn)}
                                      <button
                                        onClick={e => { e.preventDefault(); e.stopPropagation(); onDelete?.(btn.id) }}
                                        onPointerDown={e => e.stopPropagation()}
                                        className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#E24B4A] rounded-full flex items-center justify-center z-20 text-white font-black select-none leading-none"
                                        style={{ fontSize: 14 }}
                                      >×</button>
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                              {btnProv.placeholder}
                            </div>
                          )}
                        </Droppable>
                      )}

                      {/* ── Full-width display ──────────── */}
                      {!useIconGrid && !isEditMode && (
                        <div className="flex flex-col gap-2.5">
                          {catBtns.map(btn => <div key={btn.id}>{renderFullWidth(btn)}</div>)}
                        </div>
                      )}

                      {/* ── Full-width edit (vertical DnD) */}
                      {!useIconGrid && isEditMode && (
                        <Droppable droppableId={cat} type="BUTTON" direction="vertical">
                          {btnProv => (
                            <div
                              ref={btnProv.innerRef}
                              {...btnProv.droppableProps}
                              className="flex flex-col gap-2.5 min-h-14"
                            >
                              {catBtns.map((btn, i) => (
                                <Draggable key={btn.id} draggableId={btn.id} index={i}>
                                  {(drag, snap) => (
                                    <div
                                      ref={drag.innerRef}
                                      {...drag.draggableProps}
                                      className="relative"
                                      style={{ ...drag.draggableProps.style, opacity: snap.isDragging ? 0.7 : 1 }}
                                    >
                                      {/* drag handle */}
                                      <div
                                        {...drag.dragHandleProps}
                                        className="absolute left-0 top-0 bottom-0 w-10 z-10 flex items-center justify-center cursor-grab active:cursor-grabbing"
                                        onClick={e => { e.preventDefault(); e.stopPropagation() }}
                                      >
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-[#3A3A50]">
                                          <line x1="8" y1="6" x2="16" y2="6" />
                                          <line x1="8" y1="12" x2="16" y2="12" />
                                          <line x1="8" y1="18" x2="16" y2="18" />
                                        </svg>
                                      </div>
                                      {/* tap to edit */}
                                      <button className="w-full text-left" onClick={() => onEditButton?.(btn)}>
                                        {renderFullWidth(btn, snap.isDragging)}
                                      </button>
                                      {/* × delete */}
                                      <button
                                        onClick={e => { e.preventDefault(); e.stopPropagation(); onDelete?.(btn.id) }}
                                        onPointerDown={e => e.stopPropagation()}
                                        className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#E24B4A] rounded-full flex items-center justify-center z-20 text-white font-black select-none leading-none"
                                        style={{ fontSize: 14 }}
                                      >×</button>
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                              {btnProv.placeholder}
                            </div>
                          )}
                        </Droppable>
                      )}
                    </div>
                  )}
                </Draggable>
              )
            })}
            {sectProv.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}
