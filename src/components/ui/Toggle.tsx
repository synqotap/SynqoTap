type ToggleProps = {
  enabled: boolean
  onChange: (value: boolean) => void
}

export default function Toggle({ enabled, onChange }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      onClick={() => onChange(!enabled)}
      className={`
        relative w-9 h-5 rounded-full flex-shrink-0
        transition-colors duration-200
        ${enabled ? 'bg-[#00E5FF]' : 'bg-[#22223A]'}
      `}
    >
      <span
        className={`
          absolute top-0.5 w-4 h-4 rounded-full bg-white
          transition-all duration-200
          ${enabled ? 'left-[18px]' : 'left-0.5'}
        `}
      />
    </button>
  )
}
