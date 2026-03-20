"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import type { GraphData } from "@/types/graph";
import { GraphControls } from "./graph-controls";
import { GraphLegend } from "./graph-legend";
import { Loader2 } from "lucide-react";

const GraphCanvas = dynamic(
  () =>
    import("./graph-canvas").then((mod) => ({ default: mod.GraphCanvas })),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-neutral-400" />
      </div>
    ),
  }
);

export function GraphView() {
  const [activeCategories, setActiveCategories] = useState<string[]>([
    "company",
    "datacenter",
    "registrar",
    "person",
  ]);
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading, error } = useQuery<{ data: GraphData }>({
    queryKey: ["graph"],
    queryFn: () => fetch("/api/v1/graph", { cache: "no-store" }).then((r) => r.json()),
    staleTime: 0,
    refetchOnWindowFocus: true,
    refetchInterval: 30_000,
  });

  const filteredData = useMemo(() => {
    if (!data?.data) return { nodes: [], edges: [] };

    let nodes = data.data.nodes.filter((n) =>
      activeCategories.includes(n.category)
    );

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      nodes = nodes.filter((n) => n.label.toLowerCase().includes(q));
    }

    const nodeIds = new Set(nodes.map((n) => n.id));
    const edges = data.data.edges.filter(
      (e) => nodeIds.has(e.source) && nodeIds.has(e.target)
    );

    return { nodes, edges };
  }, [data, activeCategories, searchQuery]);

  function toggleCategory(category: string) {
    setActiveCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center text-neutral-500">
        Failed to load graph data.
      </div>
    );
  }

  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800">
      {isLoading ? (
        <div className="flex h-full items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-neutral-400" />
        </div>
      ) : (
        <>
          <GraphControls
            activeCategories={activeCategories}
            onToggleCategory={toggleCategory}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
          {filteredData.nodes.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center px-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-100 dark:bg-neutral-900 mb-4">
                <Loader2 className="h-8 w-8 text-neutral-300 dark:text-neutral-700" />
              </div>
              <p className="text-sm font-medium text-neutral-900 dark:text-white">No connections found</p>
              <p className="mt-1 max-w-sm text-sm text-neutral-500 dark:text-neutral-400">
                The graph shows relationships between listings. Add person links, datacenter links, or partner links between listings to see them visualized here.
              </p>
            </div>
          ) : (
            <GraphCanvas data={filteredData} />
          )}
          <GraphLegend />
        </>
      )}
    </div>
  );
}
