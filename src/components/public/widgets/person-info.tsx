import type { Listing } from "@/types/listings";

export function PersonInfoWidget({ listing }: { listing: Listing }) {
  const socialLinks = [
    { label: "Website", value: listing.homepageUrl },
    { label: "Blog", value: listing.blogUrl },
    { label: "Twitter", value: listing.twitterUsername ? `@${listing.twitterUsername}` : null },
    { label: "LinkedIn", value: listing.linkedinUrl },
    { label: "Facebook", value: listing.facebookUrl },
    { label: "Instagram", value: listing.instagramUrl },
    { label: "TikTok", value: listing.tiktokUrl },
  ].filter((l) => l.value);

  const info = [
    { label: "Birthplace", value: listing.birthplace },
    { label: "Birthdate", value: listing.birthdate },
  ].filter((i) => i.value);

  if (socialLinks.length === 0 && info.length === 0) return null;

  return (
    <section className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 p-6 space-y-3">
      <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Details</h2>
      <dl className="grid gap-x-4 gap-y-2 sm:grid-cols-2">
        {info.map((i) => (
          <div key={i.label} className="flex justify-between border-b border-neutral-200 dark:border-neutral-800 py-2 text-sm">
            <dt className="text-neutral-500">{i.label}</dt>
            <dd className="font-medium text-neutral-700 dark:text-neutral-200">{i.value}</dd>
          </div>
        ))}
        {socialLinks.map((l) => (
          <div key={l.label} className="flex justify-between border-b border-neutral-200 dark:border-neutral-800 py-2 text-sm">
            <dt className="text-neutral-500">{l.label}</dt>
            <dd>
              {l.value?.startsWith("http") ? (
                <a href={l.value} target="_blank" rel="noopener noreferrer" className="text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:underline">
                  {l.value.replace(/^https?:\/\//, "")}
                </a>
              ) : (
                <span className="font-medium text-neutral-700 dark:text-neutral-200">{l.value}</span>
              )}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
