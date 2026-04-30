interface LogoProps {
  className?: string;
  width?: number;
}

export function Logo({ className, width = 108 }: LogoProps) {
  const height = Math.round(width * (28 / 108));

  return (
    <svg
      viewBox="0 0 108 28"
      width={width}
      height={height}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Bottega"
      role="img"
      className={className}
    >
      <text
        x="0"
        y="22"
        fontSize="24"
        fontFamily="var(--font-serif), 'Playfair Display', Georgia, serif"
        fontWeight="600"
        letterSpacing="-0.5"
        fill="currentColor"
      >
        Bottega
      </text>
    </svg>
  );
}
