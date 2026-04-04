'use client'
import { Spinner } from './Spinner'

type ButtonVariant = 'primary' | 'outline' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

type ButtonProps = {
  children: React.ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  disabled?: boolean
  fullWidth?: boolean
  type?: 'button' | 'submit' | 'reset'
  onClick?: () => void
  className?: string
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: 'bg-[#00E5FF] text-[#07070C] hover:opacity-85',
  outline: 'border border-[#22223A] text-[#F2F2F4] hover:border-[#00E5FF]/40 hover:text-[#00E5FF]',
  ghost:   'text-[#6B6B80] hover:text-[#F2F2F4] hover:bg-[#13131F]',
  danger:  'border border-[#E24B4A]/30 text-[#F09595] hover:bg-[#E24B4A]/10',
}

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-6 py-3.5 text-sm',
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading,
  disabled,
  fullWidth,
  type = 'button',
  onClick,
  className = '',
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-full font-syne font-bold transition-all duration-200 disabled:opacity-50 ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {loading && <Spinner size="sm" dark={variant === 'primary'} />}
      {children}
    </button>
  )
}
