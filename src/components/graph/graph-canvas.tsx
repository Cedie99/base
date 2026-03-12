"use client";

import { useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import type { GraphData } from "@/types/graph";

interface GraphCanvasProps {
  data: GraphData;
}

export function GraphCanvas({ data }: GraphCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { theme } = useTheme();
  const sigmaRef = useRef<unknown>(null);

  const initGraph = useCallback(async () => {
    if (!containerRef.current || data.nodes.length === 0) return;

    try {
      const { default: Graph } = await import("graphology");
      const { Sigma } = await import("sigma");

      // Clear previous
      if (sigmaRef.current) {
        (sigmaRef.current as { kill: () => void }).kill();
      }

      const graph = new Graph();

      // Add nodes with random initial positions
      data.nodes.forEach((node) => {
        graph.addNode(node.id, {
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: node.size,
          label: node.label,
          color: node.color,
        });
      });

      // Add edges
      data.edges.forEach((edge) => {
        if (graph.hasNode(edge.source) && graph.hasNode(edge.target)) {
          try {
            graph.addEdge(edge.source, edge.target, {
              size: 1,
              color: theme === "dark" ? "#404040" : "#d4d4d4",
              type: "line",
            });
          } catch {
            // Skip duplicate edges
          }
        }
      });

      // Apply ForceAtlas2 layout
      try {
        const { default: forceAtlas2 } = await import(
          "graphology-layout-forceatlas2"
        );
        forceAtlas2.assign(graph, {
          iterations: 150,
          settings: {
            gravity: 0.5,
            scalingRatio: 20,
            barnesHutOptimize: graph.order > 50,
            strongGravityMode: true,
          },
        });
      } catch {
        // Layout library not available, random positions are fine
      }

      const bgColor = theme === "dark" ? "#000000" : "#ffffff";
      const labelColor = theme === "dark" ? "#e5e5e5" : "#262626";

      const sigma = new Sigma(graph, containerRef.current, {
        renderEdgeLabels: false,
        labelColor: { color: labelColor },
        defaultEdgeColor: theme === "dark" ? "#404040" : "#d4d4d4",
        labelRenderedSizeThreshold: 0,
        labelFont: "DM Sans, sans-serif",
        labelSize: 14,
        stagePadding: 60,
        defaultNodeColor: "#3b82f6",
        minCameraRatio: 0.1,
        maxCameraRatio: 10,
      });

      // Style the container background
      containerRef.current.style.backgroundColor = bgColor;

      // Click to navigate
      sigma.on("clickNode", ({ node }) => {
        const nodeData = data.nodes.find((n) => n.id === node);
        if (nodeData) router.push(nodeData.url);
      });

      // Hover highlights
      let hoveredNode: string | null = null;

      sigma.on("enterNode", ({ node }) => {
        hoveredNode = node;
        sigma.setSetting("nodeReducer", (n, attrs) => {
          if (
            n === hoveredNode ||
            graph.neighbors(hoveredNode!).includes(n)
          ) {
            return { ...attrs, zIndex: 1 };
          }
          return { ...attrs, color: "#e5e5e5", zIndex: 0 };
        });
        sigma.setSetting("edgeReducer", (edge, attrs) => {
          const [source, target] = graph.extremities(edge);
          if (source === hoveredNode || target === hoveredNode) {
            return { ...attrs, color: "#737373", size: 2 };
          }
          return { ...attrs, hidden: true };
        });
        sigma.refresh();
      });

      sigma.on("leaveNode", () => {
        hoveredNode = null;
        sigma.setSetting("nodeReducer", null);
        sigma.setSetting("edgeReducer", null);
        sigma.refresh();
      });

      sigmaRef.current = sigma;
    } catch (error) {
      console.error("Failed to initialize graph:", error);
      if (containerRef.current) {
        containerRef.current.innerHTML = `
          <div style="display:flex;align-items:center;justify-content:center;height:100%;color:#737373;font-size:14px">
            <p>Graph visualization requires sigma and graphology packages.<br/>
            Run: npm install sigma graphology graphology-layout-forceatlas2</p>
          </div>
        `;
      }
    }

    return () => {
      if (sigmaRef.current) {
        (sigmaRef.current as { kill: () => void }).kill();
      }
    };
  }, [data, theme, router]);

  useEffect(() => {
    const cleanup = initGraph();
    return () => {
      cleanup?.then((fn) => fn?.());
    };
  }, [initGraph]);

  return <div ref={containerRef} className="h-full w-full" />;
}
