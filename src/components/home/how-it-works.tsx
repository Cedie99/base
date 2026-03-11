"use client";

import { Search, PenLine, CheckCircle } from "lucide-react";
import { SectionLabel } from "@/components/home/section-label";
import { useReveal } from "@/hooks/use-reveal";
import { cn } from "@/lib/utils";

const steps = [
  {
    icon: Search,
    title: "Search & Discover",
    description:
      "Browse through companies, data centers, registrars, and industry professionals. Find detailed profiles with products, milestones, and more.",
  },
  {
    icon: PenLine,
    title: "Contribute Data",
    description:
      "Anyone can submit new listings or suggest edits. No account required — just share what you know about the hosting industry.",
  },
  {
    icon: CheckCircle,
    title: "Community Verified",
    description:
      "All submissions go through a review process. Moderators verify data accuracy to keep the database reliable and up to date.",
  },
];

export function HowItWorks() {
  const { ref, isVisible } = useReveal();

  return (
    <section className="space-y-10">
      <SectionLabel
        label="Process"
        title="How It Works"
        description="A simple, transparent process for building the industry's most comprehensive database."
      />
      <div ref={ref} className="relative grid gap-8 sm:grid-cols-3">
        {/* Horizontal connector line (desktop) */}
        <div className="pointer-events-none absolute left-[calc(16.67%+1.75rem)] right-[calc(16.67%+1.75rem)] top-7 hidden h-px bg-neutral-200 sm:block dark:bg-neutral-800" />

        {steps.map((step, i) => (
          <div
            key={step.title}
            className={cn(
              "relative flex flex-col items-center gap-4 text-center transition-all ease-out",
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            )}
            style={{
              transitionDuration: "600ms",
              transitionDelay: isVisible ? `${i * 120}ms` : "0ms",
            }}
          >
            {/* Step circle */}
            <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-neutral-900 text-[10px] font-bold text-white dark:bg-white dark:text-black">
                {i + 1}
              </span>
              <step.icon className="h-6 w-6 text-neutral-600 dark:text-neutral-300" />
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900 dark:text-white">
                {step.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-neutral-500">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
