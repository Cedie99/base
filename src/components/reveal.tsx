"use client";

import { useReveal } from "@/hooks/use-reveal";
import { cn } from "@/lib/utils";

type Variant = "fade-up" | "fade-in" | "fade-left" | "fade-right" | "scale-up";

interface RevealProps {
  children: React.ReactNode;
  variant?: Variant;
  delay?: number;
  duration?: number;
  className?: string;
  as?: React.ElementType;
}

const hiddenClasses: Record<Variant, string> = {
  "fade-up": "translate-y-8 opacity-0",
  "fade-in": "opacity-0",
  "fade-left": "-translate-x-8 opacity-0",
  "fade-right": "translate-x-8 opacity-0",
  "scale-up": "scale-95 opacity-0",
};

const visibleClasses: Record<Variant, string> = {
  "fade-up": "translate-y-0 opacity-100",
  "fade-in": "opacity-100",
  "fade-left": "translate-x-0 opacity-100",
  "fade-right": "translate-x-0 opacity-100",
  "scale-up": "scale-100 opacity-100",
};

export function Reveal({
  children,
  variant = "fade-up",
  delay = 0,
  duration = 600,
  className,
  as: Component = "div",
}: RevealProps) {
  const { ref, isVisible } = useReveal();

  return (
    <Component
      ref={ref}
      className={cn(
        "transition-all ease-out",
        isVisible ? visibleClasses[variant] : hiddenClasses[variant],
        className
      )}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </Component>
  );
}
