type CardProps = {
  children: React.ReactNode
  className?: string
  padding?: 'sm' | 'md' | 'lg'
}

const PADDING = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
}

export default function Card({ children, className = '', padding = 'md' }: CardProps) {
  return (
    <div className={`bg-[#0E0E16] border border-[#22223A] rounded-2xl ${PADDING[padding]} ${className}`}>
      {children}
    </div>
  )
}
