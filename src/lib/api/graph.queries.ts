import { db } from "@/lib/db";
import {
  listings,
  listingPeople,
  listingDatacenterLinks,
  listingPartners,
} from "@/lib/db/schema";
import { eq, isNotNull } from "drizzle-orm";
import type { GraphNode, GraphEdge, GraphData } from "@/types/graph";
import type { Category } from "@/types/listings";
import { CATEGORY_URL_PREFIX } from "@/types/listings";

const CATEGORY_COLORS: Record<string, string> = {
  company: "#3b82f6",
  datacenter: "#10b981",
  registrar: "#f59e0b",
  person: "#8b5cf6",
};

export async function getGraphData(categoryFilter?: Category): Promise<GraphData> {
  // Fetch all approved listings (basic fields only)
  const allListings = await db.query.listings.findMany({
    where: eq(listings.approvalStatus, "approved"),
    columns: {
      id: true,
      name: true,
      slug: true,
      category: true,
      logoUrl: true,
      photoUrl: true,
    },
  });

  const listingMap = new Map(allListings.map((l) => [l.id, l]));

  // Fetch person-company edges (where personListingId links to another listing)
  const personLinks = await db
    .select({
      listingId: listingPeople.listingId,
      personListingId: listingPeople.personListingId,
      name: listingPeople.name,
    })
    .from(listingPeople)
    .where(isNotNull(listingPeople.personListingId));

  // Fetch datacenter edges
  const dcLinks = await db
    .select({
      listingId: listingDatacenterLinks.listingId,
      datacenterListingId: listingDatacenterLinks.datacenterListingId,
    })
    .from(listingDatacenterLinks)
    .where(isNotNull(listingDatacenterLinks.datacenterListingId));

  // Fetch partner edges
  const partnerLinks = await db
    .select({
      listingId: listingPartners.listingId,
      partnerListingId: listingPartners.partnerListingId,
    })
    .from(listingPartners)
    .where(isNotNull(listingPartners.partnerListingId));

  // Build edges
  const edges: GraphEdge[] = [];
  const connectedIds = new Set<string>();

  for (const link of personLinks) {
    if (!link.personListingId) continue;
    const source = listingMap.get(link.listingId);
    const target = listingMap.get(link.personListingId);
    if (!source || !target) continue;

    edges.push({
      id: `person-${link.listingId}-${link.personListingId}`,
      source: link.listingId,
      target: link.personListingId,
      type: "person",
      label: link.name,
    });
    connectedIds.add(link.listingId);
    connectedIds.add(link.personListingId);
  }

  for (const link of dcLinks) {
    if (!link.datacenterListingId) continue;
    const source = listingMap.get(link.listingId);
    const target = listingMap.get(link.datacenterListingId);
    if (!source || !target) continue;

    edges.push({
      id: `dc-${link.listingId}-${link.datacenterListingId}`,
      source: link.listingId,
      target: link.datacenterListingId,
      type: "datacenter",
    });
    connectedIds.add(link.listingId);
    connectedIds.add(link.datacenterListingId);
  }

  for (const link of partnerLinks) {
    if (!link.partnerListingId) continue;
    const source = listingMap.get(link.listingId);
    const target = listingMap.get(link.partnerListingId);
    if (!source || !target) continue;

    edges.push({
      id: `partner-${link.listingId}-${link.partnerListingId}`,
      source: link.listingId,
      target: link.partnerListingId,
      type: "partner",
    });
    connectedIds.add(link.listingId);
    connectedIds.add(link.partnerListingId);
  }

  // Build nodes (only include connected listings)
  const degreeMap = new Map<string, number>();
  for (const edge of edges) {
    degreeMap.set(edge.source, (degreeMap.get(edge.source) || 0) + 1);
    degreeMap.set(edge.target, (degreeMap.get(edge.target) || 0) + 1);
  }

  // If no edges exist, show all listings as nodes so the graph isn't empty
  const showAll = connectedIds.size === 0;

  let nodes: GraphNode[] = allListings
    .filter((l) => showAll || connectedIds.has(l.id))
    .map((l) => ({
      id: l.id,
      label: l.name,
      category: l.category,
      slug: l.slug,
      url: `/${CATEGORY_URL_PREFIX[l.category as Category]}/${l.slug}`,
      logoUrl: l.logoUrl,
      photoUrl: l.photoUrl,
      size: Math.max(10, Math.min(30, (degreeMap.get(l.id) || 1) * 5 + 8)),
      color: CATEGORY_COLORS[l.category] || "#737373",
    }));

  // Apply category filter (but keep connected nodes from other categories)
  if (categoryFilter) {
    const filteredIds = new Set(
      nodes.filter((n) => n.category === categoryFilter).map((n) => n.id)
    );
    const connectedToFiltered = new Set<string>();
    for (const edge of edges) {
      if (filteredIds.has(edge.source)) connectedToFiltered.add(edge.target);
      if (filteredIds.has(edge.target)) connectedToFiltered.add(edge.source);
    }
    const keepIds = new Set([...filteredIds, ...connectedToFiltered]);
    nodes = nodes.filter((n) => keepIds.has(n.id));
  }

  const nodeIds = new Set(nodes.map((n) => n.id));
  const filteredEdges = edges.filter(
    (e) => nodeIds.has(e.source) && nodeIds.has(e.target)
  );

  return { nodes, edges: filteredEdges };
}
