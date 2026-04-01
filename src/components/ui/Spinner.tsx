type SpinnerProps = {
  size?: 'sm' | 'md'
  dark?: boolean
}

export default function Spinner({ size = 'sm', dark = false }: SpinnerProps) {
  const dim = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'
  const border = dark
    ? 'border-black/20 border-t-[#07070C]'
    : 'border-white/20 border-t-[#F2F2F4]'
  return (
    <div className={`${dim} rounded-full border-2 ${border} animate-spin flex-shrink-0`} />
  )
}
