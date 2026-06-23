import type { LucideIcon } from 'lucide-react';

interface IconCircleProps {
  icon: LucideIcon;
  size?: number;
  variant?: 'surface' | 'bg';
}

export function IconCircle({ icon: Icon, size = 56, variant = 'surface' }: IconCircleProps) {
  const bgVar = variant === 'surface' ? 'var(--color-surface)' : 'var(--color-bg)';
  return (
    <div
      className="flex items-center justify-center rounded-full text-[var(--color-accent)]"
      style={{ width: size, height: size, background: bgVar }}
    >
      <Icon size={Math.round(size * 0.4)} strokeWidth={1.75} />
    </div>
  );
}
