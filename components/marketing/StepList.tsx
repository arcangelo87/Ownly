interface Step {
  label: string;
  description: string;
}

interface StepListProps {
  steps: Step[];
}

export function StepList({ steps }: StepListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
      {steps.map((step, i) => (
        <div key={i} className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <span className="font-[family-name:var(--font-serif)] text-[32px] font-semibold text-[var(--color-border)] leading-none select-none">
              {i + 1}
            </span>
            <span className="text-[15px] font-semibold text-[var(--color-text)] tracking-[-0.01em]">
              {step.label}
            </span>
          </div>
          <p className="text-[14px] text-[var(--color-muted)] leading-[1.6]">
            {step.description}
          </p>
        </div>
      ))}
    </div>
  );
}
