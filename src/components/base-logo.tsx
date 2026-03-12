interface BaseLogoProps {
  size?: number;
  className?: string;
}

export function BaseLogo({ size = 32, className }: BaseLogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      width={size}
      height={size}
      className={className}
    >
      <rect
        width="512"
        height="512"
        rx="96"
        className="fill-neutral-900 dark:fill-neutral-100"
      />
      <path
        fillRule="evenodd"
        className="fill-white dark:fill-neutral-900"
        d="M136 96h124a80 80 0 0 1 0 160h8a80 80 0 0 1 0 160H136zM204 136h56a42 42 0 0 1 0 84h-56zM204 292h64a42 42 0 0 1 0 84h-64z"
      />
    </svg>
  );
}
