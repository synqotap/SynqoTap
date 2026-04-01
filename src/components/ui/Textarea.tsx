type TextareaProps = {
  label?: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  rows?: number
  required?: boolean
  autoFocus?: boolean
}

export default function Textarea({
  label, value, onChange, placeholder,
  rows = 3, required, autoFocus
}: TextareaProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs text-[#6B6B80]">{label}</label>
      )}
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        required={required}
        autoFocus={autoFocus}
        className="
          w-full bg-[#13131F] border border-[#22223A] rounded-xl
          px-3.5 py-3 text-sm text-[#F2F2F4]
          placeholder:text-[#3A3A50]
          focus:outline-none focus:border-[#00E5FF]
          resize-none transition-colors duration-200
          font-[family-name:var(--font-dm-sans)]
        "
      />
    </div>
  )
}
