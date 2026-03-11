import { auth } from "@/lib/auth";
import { getCategoryCounts, getRecentListings } from "@/lib/listings.queries";
import { HeroSearch } from "@/components/home/hero-search";
import { CategoryCards } from "@/components/home/category-cards";
import { RecentActivity } from "@/components/home/recent-activity";
import { ProductInsights } from "@/components/home/product-insights";
import { HowItWorks } from "@/components/home/how-it-works";
import { FeaturesGrid } from "@/components/home/features-grid";
import { CTASection } from "@/components/home/cta-section";
import { StatsBar } from "@/components/home/stats-bar";
import { Reveal } from "@/components/reveal";
import { PublicHeader } from "@/components/public/public-header";
import { PublicFooter } from "@/components/public/public-footer";

export default async function Home() {
  const [session, counts, recent] = await Promise.all([
    auth(),
    getCategoryCounts(),
    getRecentListings(5),
  ]);

  const totalListings = Object.values(counts).reduce((sum, n) => sum + n, 0);

  const stats = [
    { label: "Total Listings", value: totalListings, description: "Listings in the database and growing every day." },
    { label: "Categories", value: 4, description: "Companies, data centers, registrars, and people." },
    { label: "Products Tracked", value: 30, suffix: "+", description: "Product types tracked across all categories." },
    { label: "Open & Free", value: 100, suffix: "%", description: "Completely free and open for everyone to use." },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-black">
      <PublicHeader user={session?.user} />
      <main className="flex-1">
        <HeroSearch />
        <div className="mx-auto max-w-6xl space-y-28 px-4 pb-28">
          <Reveal>
            <StatsBar stats={stats} />
          </Reveal>
          <HowItWorks />
          <FeaturesGrid />
          <div className="grid gap-16 lg:grid-cols-2">
            <Reveal>
              <RecentActivity listings={recent} />
            </Reveal>
            <Reveal delay={100}>
              <ProductInsights />
            </Reveal>
          </div>
          <CTASection />
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
