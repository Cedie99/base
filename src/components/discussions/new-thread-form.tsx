"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { createThread } from "@/lib/discussions.actions";
import { ArrowLeft, Send } from "lucide-react";
import Link from "next/link";

interface NewThreadFormProps {
  listingId?: string;
  backHref?: string;
}

export function NewThreadForm({ listingId, backHref = "/discussions" }: NewThreadFormProps) {
  const router = useRouter();
  const [state, action, isPending] = useActionState(
    async (prev: { error?: string; success?: boolean; id?: string }, formData: FormData) => {
      const result = await createThread(prev, formData);
      if (result.success && result.id) {
        router.push(`/discussions/${result.id}`);
      }
      return result;
    },
    {}
  );

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href={backHref}
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-neutral-500 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to discussions
      </Link>

      <h1 className="mb-6 text-2xl font-bold text-neutral-900 dark:text-white">
        New Discussion
      </h1>

      <form action={action} className="space-y-4">
        {listingId && <input type="hidden" name="listingId" value={listingId} />}

        <div>
          <label
            htmlFor="title"
            className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
          >
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            placeholder="What would you like to discuss?"
            className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none dark:border-neutral-800 dark:bg-neutral-950 dark:text-white dark:placeholder:text-neutral-500 dark:focus:border-neutral-600"
          />
        </div>

        <div>
          <label
            htmlFor="body"
            className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
          >
            Body
          </label>
          <textarea
            id="body"
            name="body"
            required
            rows={8}
            placeholder="Share your thoughts, questions, or insights..."
            className="w-full resize-none rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none dark:border-neutral-800 dark:bg-neutral-950 dark:text-white dark:placeholder:text-neutral-500 dark:focus:border-neutral-600"
          />
        </div>

        {state.error && (
          <p className="text-sm text-red-500">{state.error}</p>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center gap-2 rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
          >
            <Send className="h-4 w-4" />
            {isPending ? "Creating..." : "Create Thread"}
          </button>
        </div>
      </form>
    </div>
  );
}
