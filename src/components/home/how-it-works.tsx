import { Search, PenLine, CheckCircle } from "lucide-react";

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
  return (
    <section className="space-y-10">
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
          How It Works
        </h2>
        <p className="mt-2 text-neutral-500">
          A simple, transparent process for building the industry&apos;s most comprehensive database.
        </p>
      </div>
      <div className="grid gap-8 sm:grid-cols-3">
        {steps.map((step, i) => (
          <div key={step.title} className="relative flex flex-col items-center gap-4 text-center">
            {/* Step number */}
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
              <step.icon className="h-6 w-6 text-neutral-600 dark:text-neutral-300" />
            </div>
            {/* Connector line */}
            {i < steps.length - 1 && (
              <div className="absolute left-[calc(50%+2rem)] top-7 hidden h-px w-[calc(100%-4rem)] bg-neutral-200 sm:block dark:bg-neutral-800" />
            )}
            <div>
              <h3 className="font-semibold text-neutral-900 dark:text-white">{step.title}</h3>
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
