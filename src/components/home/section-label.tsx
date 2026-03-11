import { cn } from "@/lib/utils";

interface SectionLabelProps {
  label: string;
  title: string;
  description?: string;
  align?: "center" | "left";
}

export function SectionLabel({
  label,
  title,
  description,
  align = "center",
}: SectionLabelProps) {
  return (
    <div className={cn("space-y-3", align === "center" && "text-center")}>
      <span className="inline-block rounded-full border border-neutral-200 bg-neutral-100 px-3 py-1 text-xs font-medium uppercase tracking-wider text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
        {label}
      </span>
      <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
        {title}
      </h2>
      {description && (
        <p className="mx-auto max-w-2xl text-neutral-500">{description}</p>
      )}
    </div>
  );
}
