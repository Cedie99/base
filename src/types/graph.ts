export interface GraphNode {
  id: string;
  label: string;
  category: string;
  slug: string;
  url: string;
  logoUrl?: string | null;
  photoUrl?: string | null;
  size: number;
  color: string;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  type: "person" | "datacenter" | "partner";
  label?: string;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}
