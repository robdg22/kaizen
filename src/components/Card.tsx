import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  title?: string
}

export default function Card({ children, className = '', title }: CardProps) {
  return (
    <div className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 ${className}`}>
      {title && (
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
          {title}
        </h3>
      )}
      {children}
    </div>
  )
}
