import { getPublicListingBySlug } from "@/lib/listings.queries";
import { ListingLayout } from "@/components/public/listing-layout";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const listing = await getPublicListingBySlug("person", slug);
  if (!listing) return { title: "Not Found" };
  return {
    title: `${listing.name} — MESH`,
    description: listing.overview?.slice(0, 160) ?? `${listing.name} profile on MESH.`,
  };
}

export default async function PersonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const listing = await getPublicListingBySlug("person", slug);
  if (!listing) notFound();
  return <ListingLayout listing={listing} />;
}
