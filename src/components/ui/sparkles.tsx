"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface SparklesProps {
  children: React.ReactNode;
  className?: string;
  sparklesClassName?: string;
  particleColor?: string;
  particleDensity?: number;
  minSize?: number;
  maxSize?: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  driftX: number;
}

export function Sparkles({
  children,
  className,
  sparklesClassName,
  particleColor = "#ffffff",
  particleDensity = 80,
  minSize = 0.4,
  maxSize = 1.4,
}: SparklesProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: particleDensity }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: minSize + Math.random() * (maxSize - minSize),
        duration: 1.5 + Math.random() * 3,
        delay: Math.random() * 3,
        driftX: (Math.random() - 0.5) * 20,
      }))
    );
  }, [particleDensity, minSize, maxSize]);

  return (
    <div className={cn("relative", className)}>
      {children}
      {/* Sparkle band below text */}
      <div
        className={cn(
          "pointer-events-none relative mx-auto h-8 w-full sm:h-10",
          sparklesClassName
        )}
      >
        {/* Glowing gradient underline */}
        <div className="absolute inset-x-0 top-0 h-px">
          <div className="h-full w-full bg-gradient-to-r from-transparent via-cyan-400/80 to-transparent" />
        </div>
        {/* Glow bloom behind the line */}
        <div className="absolute inset-x-[10%] -top-1 h-2 bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent blur-sm" />

        {/* Particles container — clipped to stay below the line */}
        <div className="absolute inset-0 overflow-hidden">
          {particles.map((p) => (
            <span
              key={p.id}
              className="absolute animate-sparkle-fall rounded-full"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: `${p.size}px`,
                height: `${p.size}px`,
                backgroundColor: particleColor,
                animationDuration: `${p.duration}s`,
                animationDelay: `${p.delay}s`,
                "--drift-x": `${p.driftX}px`,
              } as React.CSSProperties}
            />
          ))}
        </div>

      </div>
    </div>
  );
}
