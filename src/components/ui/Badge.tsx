type BadgeVariant = 'cyan' | 'red' | 'green' | 'yellow' | 'purple' | 'custom'

type BadgeProps = {
  label: string
  variant?: BadgeVariant
  color?: string
}

const VARIANT_STYLES: Record<Exclude<BadgeVariant, 'custom'>, string> = {
  cyan:   'bg-[#00E5FF]/10 border-[#00E5FF]/30 text-[#00E5FF]',
  red:    'bg-[#E24B4A]/10 border-[#E24B4A]/30 text-[#F09595]',
  green:  'bg-[#1D9E75]/10 border-[#1D9E75]/30 text-[#5DCAA5]',
  yellow: 'bg-[#EF9F27]/10 border-[#EF9F27]/30 text-[#EF9F27]',
  purple: 'bg-[#7B61FF]/10 border-[#7B61FF]/30 text-[#7B61FF]',
}

export function Badge({ label, variant = 'cyan', color }: BadgeProps) {
  if (variant === 'custom' && color) {
    return (
      <span
        className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border"
        style={{ background: `${color}1A`, borderColor: `${color}4D`, color }}
      >
        {label}
      </span>
    )
  }

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
        VARIANT_STYLES[variant as Exclude<BadgeVariant, 'custom'>]
      }`}
    >
      {label}
    </span>
  )
}
