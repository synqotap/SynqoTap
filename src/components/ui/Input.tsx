type InputProps = {
  label?: string
  type?: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  required?: boolean
  autoComplete?: string
  autoFocus?: boolean
  disabled?: boolean
  hint?: string
  error?: string
}

export function Input({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required,
  autoComplete,
  autoFocus,
  disabled,
  hint,
  error,
}: InputProps) {
  return (
    <div>
      {label && <label className="block text-xs text-[#6B6B80] mb-1.5">{label}</label>}
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        autoFocus={autoFocus}
        disabled={disabled}
        className={`w-full bg-[#13131F] border rounded-xl px-4 py-3 text-sm text-[#F2F2F4] placeholder:text-[#3A3A50] focus:outline-none focus:border-[#00E5FF] transition-colors disabled:opacity-50 ${
          error ? 'border-[#E24B4A]' : 'border-[#22223A]'
        }`}
      />
      {error && <p className="mt-1.5 text-xs text-[#F09595]">{error}</p>}
      {hint && !error && <p className="mt-1.5 text-xs text-[#6B6B80]">{hint}</p>}
    </div>
  )
}
