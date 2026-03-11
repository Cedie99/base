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
  const listing = await getPublicListingBySlug("company", slug);
  if (!listing) return { title: "Not Found" };
  return {
    title: `${listing.name} — BASE`,
    description: listing.overview?.slice(0, 160) ?? `${listing.name} company profile on BASE.`,
  };
}

export default async function CompanyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const listing = await getPublicListingBySlug("company", slug);
  if (!listing) notFound();
  return <ListingLayout listing={listing} />;
}
