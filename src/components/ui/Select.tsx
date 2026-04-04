type SelectOption = { value: string; label: string }

type SelectProps = {
  label?: string
  value: string
  onChange: (value: string) => void
  options: SelectOption[]
  className?: string
}

export function Select({ label, value, onChange, options, className = '' }: SelectProps) {
  return (
    <div className={className}>
      {label && <label className="block text-xs text-[#6B6B80] mb-1.5">{label}</label>}
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full bg-[#13131F] border border-[#22223A] rounded-xl px-4 py-3 text-sm text-[#F2F2F4] focus:outline-none focus:border-[#00E5FF] transition-colors appearance-none cursor-pointer"
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  )
}
