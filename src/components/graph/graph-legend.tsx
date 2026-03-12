const CATEGORIES = [
  { label: "Company", color: "#3b82f6" },
  { label: "Data Center", color: "#10b981" },
  { label: "Registrar", color: "#f59e0b" },
  { label: "Person", color: "#8b5cf6" },
];

const EDGE_TYPES = [
  { label: "Person link", style: "solid" },
  { label: "Datacenter link", style: "dashed" },
  { label: "Partner link", style: "dotted" },
];

export function GraphLegend() {
  return (
    <div className="absolute bottom-4 right-4 z-10 rounded-xl border border-neutral-200 bg-white/95 p-3 shadow-lg backdrop-blur-sm dark:border-neutral-800 dark:bg-neutral-950/95">
      <h4 className="mb-2 text-xs font-semibold uppercase text-neutral-400">
        Legend
      </h4>
      <div className="space-y-1.5">
        {CATEGORIES.map((cat) => (
          <div
            key={cat.label}
            className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-300"
          >
            <span
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: cat.color }}
            />
            {cat.label}
          </div>
        ))}
      </div>
      <div className="mt-2 space-y-1.5 border-t border-neutral-200 pt-2 dark:border-neutral-800">
        {EDGE_TYPES.map((edge) => (
          <div
            key={edge.label}
            className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-300"
          >
            <div
              className="h-0 w-4 border-t border-neutral-400"
              style={{
                borderStyle: edge.style as "solid" | "dashed" | "dotted",
              }}
            />
            {edge.label}
          </div>
        ))}
      </div>
    </div>
  );
}
