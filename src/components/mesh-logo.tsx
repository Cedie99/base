interface MeshLogoProps {
  size?: number;
  className?: string;
}

export function MeshLogo({ size = 32, className }: MeshLogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      width={size}
      height={size}
      className={className}
    >
      {/* Background */}
      <rect
        width="512"
        height="512"
        rx="96"
        className="fill-neutral-900 dark:fill-neutral-100"
      />
      
      {/* Mesh nodes and connections */}
      {/* Top-left node */}
      <circle cx="120" cy="120" r="12" className="fill-white dark:fill-neutral-900" />
      {/* Top-right node */}
      <circle cx="392" cy="120" r="12" className="fill-white dark:fill-neutral-900" />
      {/* Center node */}
      <circle cx="256" cy="256" r="12" className="fill-white dark:fill-neutral-900" />
      {/* Bottom-left node */}
      <circle cx="120" cy="392" r="12" className="fill-white dark:fill-neutral-900" />
      {/* Bottom-right node */}
      <circle cx="392" cy="392" r="12" className="fill-white dark:fill-neutral-900" />
      
      {/* Connection lines */}
      {/* Top-left to top-right */}
      <line
        x1="120"
        y1="120"
        x2="392"
        y2="120"
        stroke="currentColor"
        strokeWidth="3"
        className="stroke-white dark:stroke-neutral-900"
      />
      {/* Top-left to center */}
      <line
        x1="120"
        y1="120"
        x2="256"
        y2="256"
        stroke="currentColor"
        strokeWidth="3"
        className="stroke-white dark:stroke-neutral-900"
      />
      {/* Top-right to center */}
      <line
        x1="392"
        y1="120"
        x2="256"
        y2="256"
        stroke="currentColor"
        strokeWidth="3"
        className="stroke-white dark:stroke-neutral-900"
      />
      {/* Bottom-left to center */}
      <line
        x1="120"
        y1="392"
        x2="256"
        y2="256"
        stroke="currentColor"
        strokeWidth="3"
        className="stroke-white dark:stroke-neutral-900"
      />
      {/* Bottom-right to center */}
      <line
        x1="392"
        y1="392"
        x2="256"
        y2="256"
        stroke="currentColor"
        strokeWidth="3"
        className="stroke-white dark:stroke-neutral-900"
      />
      {/* Bottom-left to bottom-right */}
      <line
        x1="120"
        y1="392"
        x2="392"
        y2="392"
        stroke="currentColor"
        strokeWidth="3"
        className="stroke-white dark:stroke-neutral-900"
      />
    </svg>
  );
}
