type SpinnerProps = {
  size?: 'sm' | 'md'
  dark?: boolean
}

export function Spinner({ size = 'md', dark }: SpinnerProps) {
  const dim = size === 'sm' ? 'w-4 h-4' : 'w-6 h-6'
  const color = dark
    ? 'border-[#07070C]/20 border-t-[#07070C]'
    : 'border-[#00E5FF]/20 border-t-[#00E5FF]'
  return <div className={`${dim} rounded-full border-2 ${color} animate-spin`} />
}
