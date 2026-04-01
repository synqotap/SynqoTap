import Spinner from './Spinner'

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

const VARIANT_STYLES: Record<ButtonVariant, string> = {
  primary: 'bg-[#00E5FF] text-[#07070C] hover:opacity-85 font-bold',
  outline: 'border border-[#22223A] text-[#F2F2F4] hover:border-[#00E5FF]/40 hover:text-[#00E5FF]',
  ghost:   'text-[#6B6B80] hover:text-[#F2F2F4] hover:bg-[#13131F]',
  danger:  'border border-[#E24B4A]/30 text-[#F09595] hover:bg-[#E24B4A]/10',
}

const SIZE_STYLES: Record<ButtonSize, string> = {
  sm: 'text-xs px-3 py-1.5 rounded-lg',
  md: 'text-sm px-5 py-2.5 rounded-full',
  lg: 'text-base px-7 py-3.5 rounded-full',
}

export default function Button({
  children, variant = 'primary', size = 'md',
  loading = false, disabled = false, fullWidth = false,
  type = 'button', onClick, className = ''
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-2
        font-[family-name:var(--font-syne)]
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${VARIANT_STYLES[variant]}
        ${SIZE_STYLES[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
    >
      {loading && <Spinner dark={variant === 'primary'} />}
      {children}
    </button>
  )
}
