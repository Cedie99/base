"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import type { Category } from "@/types/listings";
import { CATEGORY_URL_PREFIX } from "@/types/listings";

interface Match {
  id: string;
  name: string;
  slug: string;
  category: string;
}

export function DuplicateCheck({
  name,
  category,
}: {
  name: string;
  category: Category;
}) {
  const [matches, setMatches] = useState<Match[]>([]);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (name.length < 2) {
      setMatches([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(name)}`);
        const data = await res.json();
        const catMatches = data[category] || [];
        setMatches(catMatches.slice(0, 5));
      } catch {
        setMatches([]);
      }
    }, 400);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [name, category]);

  if (matches.length === 0) return null;

  return (
    <div className="rounded-md border border-yellow-300 bg-yellow-50 p-3 text-sm dark:border-yellow-800 dark:bg-yellow-950/30">
      <p className="font-medium text-yellow-800 dark:text-yellow-400">
        Similar listings already exist:
      </p>
      <ul className="mt-1 space-y-1">
        {matches.map((m) => (
          <li key={m.id}>
            <Link
              href={`/${CATEGORY_URL_PREFIX[m.category as Category]}/${m.slug}`}
              className="text-primary hover:underline"
              target="_blank"
            >
              {m.name}
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-1 text-xs text-yellow-700 dark:text-yellow-500">
        Please verify this is not a duplicate before submitting.
      </p>
    </div>
  );
}
