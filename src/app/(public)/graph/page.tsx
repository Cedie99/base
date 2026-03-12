import { Metadata } from "next";
import { GraphView } from "@/components/graph/graph-view";

export const metadata: Metadata = {
  title: "Industry Relationship Graph — BASE",
  description:
    "Interactive visualization of connections between hosting companies, data centers, registrars, and people.",
};

export default function GraphPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
          Industry Relationship Graph
        </h1>
        <p className="mt-1 text-neutral-500 dark:text-neutral-400">
          Explore connections between companies, data centers, registrars, and
          people. Click a node to view its profile.
        </p>
      </div>
      <div className="h-[calc(100vh-280px)] min-h-[500px]">
        <GraphView />
      </div>
    </div>
  );
}
