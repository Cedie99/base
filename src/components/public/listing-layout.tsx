import type { ListingWithWidgets } from "@/types/listings";
import { ListingHeader } from "./listing-header";
import { OverviewWidget } from "./widgets/overview";
import { GeneralInfoWidget } from "./widgets/general-info";
import { PersonInfoWidget } from "./widgets/person-info";
import { OfficesWidget } from "./widgets/offices";
import { PeopleWidget } from "./widgets/people-list";
import { ProductsWidget } from "./widgets/products";
import { MilestonesWidget } from "./widgets/milestones";
import { VideosWidget } from "./widgets/videos";
import { TagsWidget } from "./widgets/tags";
import { FundingWidget } from "./widgets/funding";
import { AcquisitionsWidget } from "./widgets/acquisitions";
import { ExitsWidget } from "./widgets/exits";
import { PartnersWidget } from "./widgets/partners";
import { ScreenshotsWidget } from "./widgets/screenshots";
import { DatacenterLinksWidget } from "./widgets/datacenter-links";
import { NewsWidget } from "./widgets/news";
import { CouponsWidget } from "./widgets/coupons";
import { ExternalLinksWidget } from "./widgets/external-links";
import { SourcesWidget } from "./widgets/sources";
import { DegreesWidget } from "./widgets/degrees";
import { HostingInfoWidget } from "./widgets/hosting-info";
import { IpRangesWidget } from "./widgets/ip-ranges";
import { ControlPanelsWidget } from "./widgets/control-panels";
import { getCouponVotes } from "@/lib/widgets.actions";
import { getListingThreads } from "@/lib/discussions.queries";
import { ListingDiscussions } from "./listing-discussions";

export async function ListingLayout({ listing }: { listing: ListingWithWidgets }) {
  const isPerson = listing.category === "person";
  const showCoupons =
    listing.category === "company" || listing.category === "registrar";
  const showDatacenters = listing.category === "company";

  const [userVotesResult, listingThreads] = await Promise.all([
    showCoupons && listing.coupons.length > 0
      ? getCouponVotes(listing.coupons.map((c) => c.id))
      : Promise.resolve({} as Record<string, "yes" | "no">),
    getListingThreads(listing.id),
  ]);
  const userVotes = userVotesResult;

  return (
    <div className="space-y-8">
      <ListingHeader listing={listing} />

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <OverviewWidget overview={listing.overview} />
          {!isPerson && <GeneralInfoWidget listing={listing} />}
          {!isPerson && <HostingInfoWidget listing={listing} />}
          {isPerson && <PersonInfoWidget listing={listing} />}
          <MilestonesWidget milestones={listing.milestones} />
          {!isPerson && <ProductsWidget products={listing.products} />}
          {!isPerson && <ControlPanelsWidget controlPanels={listing.controlPanels} />}
          {(listing.category === "company" || listing.category === "datacenter") && <IpRangesWidget ipRanges={listing.ipRanges} />}
          {!isPerson && <OfficesWidget offices={listing.offices} />}
          {!isPerson && <PeopleWidget people={listing.people} />}
          <VideosWidget videos={listing.videos} />
          {!isPerson && <FundingWidget funding={listing.funding} />}
          {!isPerson && <AcquisitionsWidget acquisitions={listing.acquisitions} />}
          {!isPerson && <ExitsWidget exits={listing.exits} />}
          {!isPerson && <PartnersWidget partners={listing.partners} />}
          {!isPerson && <ScreenshotsWidget screenshots={listing.screenshots} />}
          {showDatacenters && (
            <DatacenterLinksWidget links={listing.datacenterLinks} />
          )}
          <NewsWidget news={listing.news} />
          {isPerson && <DegreesWidget degrees={listing.personDegrees} />}
          <ListingDiscussions
            listingId={listing.id}
            threads={listingThreads}
          />
        </div>

        <div className="space-y-6 lg:sticky lg:top-20 lg:self-start">
          <TagsWidget tags={listing.tags} />
          {showCoupons && (
            <CouponsWidget coupons={listing.coupons} userVotes={userVotes} />
          )}
          <ExternalLinksWidget links={listing.externalLinks} />
          <SourcesWidget sources={listing.sources} />
        </div>
      </div>
    </div>
  );
}
