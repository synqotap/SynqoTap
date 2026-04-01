type BadgeVariant = 'cyan' | 'red' | 'green' | 'yellow' | 'purple' | 'custom'

type BadgeProps = {
  label: string
  variant?: BadgeVariant
  color?: string
}

const VARIANT_STYLES: Record<BadgeVariant, string> = {
  cyan:   'bg-[#00E5FF]/15 border-[#00E5FF]/40 text-[#00E5FF]',
  red:    'bg-[#E24B4A]/15 border-[#E24B4A]/40 text-[#F09595]',
  green:  'bg-[#1D9E75]/15 border-[#1D9E75]/40 text-[#5DCAA5]',
  yellow: 'bg-[#EF9F27]/15 border-[#EF9F27]/40 text-[#EF9F27]',
  purple: 'bg-[#7B61FF]/15 border-[#7B61FF]/40 text-[#7B61FF]',
  custom: '',
}

export default function Badge({ label, variant = 'cyan', color }: BadgeProps) {
  if (variant === 'custom' && color) {
    return (
      <span
        className="text-xs font-medium px-2.5 py-1 rounded-full border whitespace-nowrap"
        style={{ color, borderColor: `${color}40`, background: `${color}15` }}
      >
        {label}
      </span>
    )
  }
  return (
    <span className={`text-xs font-medium px-2.5 py-1 rounded-full border whitespace-nowrap ${VARIANT_STYLES[variant]}`}>
      {label}
    </span>
  )
}
