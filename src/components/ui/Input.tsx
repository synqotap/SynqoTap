type InputProps = {
  label?: string
  type?: 'text' | 'email' | 'password' | 'tel'
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

export default function Input({
  label, type = 'text', value, onChange, placeholder,
  required, autoComplete, autoFocus, disabled,
  hint, error
}: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs text-[#6B6B80]">{label}</label>
      )}
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        autoFocus={autoFocus}
        disabled={disabled}
        className="
          w-full bg-[#13131F] border border-[#22223A] rounded-xl
          px-3.5 py-3 text-sm text-[#F2F2F4]
          placeholder:text-[#3A3A50]
          focus:outline-none focus:border-[#00E5FF]
          disabled:opacity-50
          transition-colors duration-200
          font-[family-name:var(--font-dm-sans)]
        "
      />
      {hint && !error && <p className="text-xs text-[#6B6B80]">{hint}</p>}
      {error && <p className="text-xs text-[#F09595]">{error}</p>}
    </div>
  )
}
