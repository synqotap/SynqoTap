type SelectOption = {
  value: string
  label: string
}

type SelectProps = {
  label?: string
  value: string
  onChange: (value: string) => void
  options: SelectOption[]
  className?: string
}

export default function Select({ label, value, onChange, options, className = '' }: SelectProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs text-[#6B6B80]">{label}</label>
      )}
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className={`
          w-full bg-[#0E0E16] border border-[#22223A] rounded-xl
          px-3.5 py-3 text-sm text-[#F2F2F4]
          focus:outline-none focus:border-[#00E5FF]
          transition-colors duration-200
          font-[family-name:var(--font-dm-sans)]
          ${className}
        `}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  )
}
