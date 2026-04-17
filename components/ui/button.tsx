import * as React from 'react'
import { cn } from '@/lib/utils'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-md text-sm font-semibold transition-opacity focus:outline-none disabled:pointer-events-none disabled:opacity-50',
          variant === 'primary' &&
            'bg-[var(--color-accent)] text-white px-7 py-3 hover:opacity-90',
          variant === 'ghost' &&
            'text-[var(--color-muted)] px-4 py-3 hover:text-[var(--color-text)]',
          className,
        )}
        {...props}
      />
    )
  },
)
Button.displayName = 'Button'

export { Button }
