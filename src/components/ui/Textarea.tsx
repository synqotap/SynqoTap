type TextareaProps = {
  label?: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  rows?: number
  required?: boolean
}

export function Textarea({ label, value, onChange, placeholder, rows = 3, required }: TextareaProps) {
  return (
    <div>
      {label && <label className="block text-xs text-[#6B6B80] mb-1.5">{label}</label>}
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        required={required}
        className="w-full bg-[#13131F] border border-[#22223A] rounded-xl px-4 py-3 text-sm text-[#F2F2F4] placeholder:text-[#3A3A50] focus:outline-none focus:border-[#00E5FF] transition-colors resize-none"
      />
    </div>
  )
}
