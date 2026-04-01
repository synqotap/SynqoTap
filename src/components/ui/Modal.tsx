'use client'
import { useEffect } from 'react'

type ModalProps = {
  open: boolean
  onClose: () => void
  children: React.ReactNode
  maxWidth?: string
}

export default function Modal({ open, onClose, children, maxWidth = 'max-w-lg' }: ModalProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (open) document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className={`relative z-10 w-full ${maxWidth} bg-[#0E0E16] border border-[#22223A] rounded-3xl p-6`}>
        {children}
      </div>
    </div>
  )
}
