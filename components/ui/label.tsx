import * as React from 'react'
import { cn } from '@/lib/utils'

export type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(
        'text-[13px] font-semibold tracking-[-0.01em] leading-none text-[var(--color-text)]',
        className,
      )}
      {...props}
    />
  ),
)
Label.displayName = 'Label'

export { Label }
