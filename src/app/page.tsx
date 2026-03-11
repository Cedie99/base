import { auth } from "@/lib/auth";
import { getCategoryCounts, getRecentListings } from "@/lib/listings.queries";
import { HeroSearch } from "@/components/home/hero-search";
import { CategoryCards } from "@/components/home/category-cards";
import { RecentActivity } from "@/components/home/recent-activity";
import { QuickAdd } from "@/components/home/quick-add";
import { ProductInsights } from "@/components/home/product-insights";
import { HowItWorks } from "@/components/home/how-it-works";
import { FeaturesGrid } from "@/components/home/features-grid";
import { CTASection } from "@/components/home/cta-section";
import { PublicHeader } from "@/components/public/public-header";
import { PublicFooter } from "@/components/public/public-footer";

export default async function Home() {
  const [session, counts, recent] = await Promise.all([
    auth(),
    getCategoryCounts(),
    getRecentListings(),
  ]);

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-black">
      <PublicHeader user={session?.user} />
      <main className="flex-1">
        <HeroSearch />
        <div className="mx-auto max-w-6xl space-y-24 px-4 pb-24">
          <CategoryCards counts={counts} />
          <div className="grid gap-16 lg:grid-cols-2">
            <RecentActivity listings={recent} />
            <div className="space-y-16">
              <ProductInsights />
            </div>
          </div>
          <HowItWorks />
          <FeaturesGrid />
          <CTASection />
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
