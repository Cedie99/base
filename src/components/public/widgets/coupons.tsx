"use client";

import { useState, useTransition } from "react";
import type { ListingCoupon } from "@/types/listings";
import { Ticket, ThumbsUp, ThumbsDown } from "lucide-react";
import { voteCoupon } from "@/lib/widgets.actions";

function CouponCard({
  coupon,
  initialVote,
}: {
  coupon: ListingCoupon;
  initialVote?: "yes" | "no";
}) {
  const [isPending, startTransition] = useTransition();
  const [yes, setYes] = useState(coupon.votesYes);
  const [no, setNo] = useState(coupon.votesNo);
  const [voted, setVoted] = useState<"yes" | "no" | null>(initialVote ?? null);

  function handleVote(vote: "yes" | "no") {
    if (voted) return;
    setVoted(vote);
    if (vote === "yes") setYes((v) => v + 1);
    else setNo((v) => v + 1);
    startTransition(async () => {
      const result = await voteCoupon(coupon.id, vote);
      if (result.error || result.alreadyVoted) {
        // Roll back optimistic update
        if (vote === "yes") setYes((v) => v - 1);
        else setNo((v) => v - 1);
        // If already voted server-side, keep disabled
        if (!result.alreadyVoted) {
          setVoted(null);
        }
      }
    });
  }

  return (
    <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 p-3 text-sm">
      <div className="flex items-center gap-2">
        <Ticket className="h-4 w-4 text-neutral-500" />
        <code className="rounded border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 font-mono font-bold text-neutral-900 dark:text-white">
          {coupon.code}
        </code>
      </div>
      <p className="mt-1.5 text-neutral-500 dark:text-neutral-400">
        {coupon.discount}
      </p>
      <div className="mt-2 flex items-center gap-2">
        {coupon.expiresAt && (
          <span className="text-xs text-neutral-400 dark:text-neutral-600 mr-auto">
            Expires: {coupon.expiresAt}
          </span>
        )}
        <button
          type="button"
          onClick={() => handleVote("yes")}
          disabled={isPending || voted !== null}
          className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs transition-colors ${
            voted === "yes"
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-500"
              : "border-neutral-200 dark:border-neutral-700 text-neutral-500 hover:border-emerald-500/30 hover:bg-emerald-500/10 hover:text-emerald-500"
          } disabled:cursor-default`}
        >
          <ThumbsUp className="h-3 w-3" />
          <span>{yes}</span>
        </button>
        <button
          type="button"
          onClick={() => handleVote("no")}
          disabled={isPending || voted !== null}
          className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs transition-colors ${
            voted === "no"
              ? "border-red-500/30 bg-red-500/10 text-red-500"
              : "border-neutral-200 dark:border-neutral-700 text-neutral-500 hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-500"
          } disabled:cursor-default`}
        >
          <ThumbsDown className="h-3 w-3" />
          <span>{no}</span>
        </button>
      </div>
    </div>
  );
}

export function CouponsWidget({
  coupons,
  userVotes,
}: {
  coupons: ListingCoupon[];
  userVotes?: Record<string, "yes" | "no">;
}) {
  if (coupons.length === 0) return null;
  return (
    <section className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 p-6 space-y-3">
      <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
        Coupons
      </h2>
      <div className="space-y-2">
        {coupons.map((c) => (
          <CouponCard
            key={c.id}
            coupon={c}
            initialVote={userVotes?.[c.id]}
          />
        ))}
      </div>
    </section>
  );
}
