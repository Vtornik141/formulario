type CeibaMarkProps = {
  size?: number;
  className?: string;
  color?: string;
};

export function CeibaMark({ size = 100, className, color }: CeibaMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      style={color ? { color } : undefined}
      aria-hidden="true"
    >
      <path
        d="M50 96 V42 M50 42 L28 20 M50 42 L72 20 M50 58 L32 40 M50 58 L68 40 M50 72 L38 60 M50 72 L62 60 M28 20 L18 8 M28 20 L38 10 M72 20 L82 8 M72 20 L62 10"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="square"
        fill="none"
      />
    </svg>
  );
}
