"use client";

import { useEffect, useState } from "react";
import { useReveal } from "@/hooks/use-reveal";

interface Stat {
  label: string;
  value: number;
  suffix?: string;
  description: string;
}

function AnimatedNumber({ value, suffix, started }: { value: number; suffix?: string; started: boolean }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!started) return;
    const duration = 1200;
    const start = performance.now();

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }, [started, value]);

  return (
    <span className="tabular-nums">
      {display.toLocaleString()}{suffix ?? ""}
    </span>
  );
}

export function StatsBar({ stats }: { stats: Stat[] }) {
  const { ref, isVisible } = useReveal({ threshold: 0.3 });

  return (
    <div
      ref={ref}
      className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-black"
    >
      {/* Grid background */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 hidden dark:block"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Radial fade mask */}
      <div className="pointer-events-none absolute inset-0 bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_30%,black)] dark:bg-black" />

      {/* Subtle glow orb */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[300px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-neutral-200/50 blur-3xl dark:bg-neutral-800/30" />

      {/* Stats content */}
      <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => {
          const isLastCol2 = i % 2 === 1;
          const isTopRow = i < 2;
          return (
          <div
            key={stat.label}
            className={`group/stat relative flex flex-col gap-1 p-8 sm:p-10 transition-all duration-300 border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100/50 dark:hover:bg-neutral-800/50 ${
              !isLastCol2 ? "border-r" : "lg:border-r"
            } ${
              isTopRow ? "border-b lg:border-b-0" : ""
            } ${
              i === stats.length - 1 ? "!border-r-0" : ""
            }`}
          >
            {/* Hover gradient line at top */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neutral-300 to-transparent opacity-0 transition-opacity duration-300 group-hover/stat:opacity-100 dark:via-neutral-600" />

            <div className="text-4xl font-bold tracking-tight sm:text-5xl">
              <span className="bg-gradient-to-b from-neutral-900 to-neutral-400 bg-clip-text text-transparent transition-all duration-300 group-hover/stat:from-neutral-900 group-hover/stat:to-neutral-600 dark:from-white dark:to-neutral-400 dark:group-hover/stat:from-white dark:group-hover/stat:to-neutral-300">
                <AnimatedNumber value={stat.value} suffix={stat.suffix} started={isVisible} />
              </span>
            </div>
            <div className="mt-2 text-sm leading-relaxed text-neutral-500 transition-colors duration-300 group-hover/stat:text-neutral-700 dark:text-neutral-400 dark:group-hover/stat:text-neutral-300">
              {stat.description}
            </div>
          </div>
          );
        })}
      </div>
    </div>
  );
}
