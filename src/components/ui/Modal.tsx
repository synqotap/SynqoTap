'use client'
import { useEffect } from 'react'

type ModalProps = {
  open: boolean
  onClose: () => void
  children: React.ReactNode
  maxWidth?: string
}

export function Modal({ open, onClose, children, maxWidth = 'max-w-lg' }: ModalProps) {
  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div
        className={`relative w-full ${maxWidth} bg-[#0E0E16] border border-[#22223A] rounded-2xl shadow-2xl z-10 max-h-[90vh] overflow-y-auto`}
      >
        {children}
      </div>
    </div>
  )
}
