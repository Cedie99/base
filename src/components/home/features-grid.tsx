import { Zap, Shield, Globe, Code, History, Search } from "lucide-react";

const features = [
  {
    icon: Search,
    title: "Instant Search",
    description: "Find any company, data center, or registrar in milliseconds with live auto-complete.",
  },
  {
    icon: Globe,
    title: "Comprehensive Profiles",
    description: "Detailed pages with products, offices, milestones, funding, screenshots, and more.",
  },
  {
    icon: Shield,
    title: "Moderated Content",
    description: "All submissions are reviewed by moderators to ensure data quality and accuracy.",
  },
  {
    icon: History,
    title: "Revision History",
    description: "Full edit history for every listing. See who changed what and when.",
  },
  {
    icon: Zap,
    title: "No Account Needed",
    description: "Submit new listings or suggest edits without creating an account.",
  },
  {
    icon: Code,
    title: "SEO-Friendly URLs",
    description: "Clean, readable URLs like /company/hostgator for easy sharing and bookmarking.",
  },
];

export function FeaturesGrid() {
  return (
    <section className="space-y-10">
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
          Why BASE?
        </h2>
        <p className="mt-2 text-neutral-500">
          Everything you need to explore and contribute to the web hosting industry database.
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <div
            key={f.title}
            className="group rounded-2xl border border-neutral-200 bg-white p-6 transition-all duration-300 hover:border-neutral-300 hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900/50 dark:hover:border-neutral-700 dark:hover:shadow-[0_0_30px_4px_rgba(255,255,255,0.03)]"
          >
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-200 bg-neutral-50 transition-colors group-hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-900 dark:group-hover:border-neutral-700">
              <f.icon className="h-5 w-5 text-neutral-600 dark:text-neutral-300" />
            </div>
            <h3 className="font-semibold text-neutral-900 dark:text-white">{f.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-neutral-500">
              {f.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
