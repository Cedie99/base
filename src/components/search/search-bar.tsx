"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { SearchResultsDropdown } from "./search-results-dropdown";
import type { GroupedSearchResults } from "@/lib/search.queries";

export function SearchBar({
  className,
  size = "default",
}: {
  className?: string;
  size?: "default" | "lg";
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GroupedSearchResults | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const router = useRouter();

  const isLg = size === "lg";

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (query.length < 2) {
      setResults(null);
      setIsOpen(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data);
        setIsOpen(true);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setIsOpen(false);
    }
  }

  return (
    <div ref={containerRef} className={`relative z-50 ${className ?? ""}`}>
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <Search
            className={`absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500 ${
              isLg ? "h-5 w-5" : "h-4 w-4"
            }`}
          />
          <input
            ref={inputRef}
            type="search"
            placeholder="Search companies, data centers, registrars, people..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => results && setIsOpen(true)}
            className={`w-full rounded-xl border border-neutral-200 bg-white text-neutral-900 placeholder:text-neutral-400 transition-all duration-200 focus:border-neutral-300 focus:outline-none focus:ring-1 focus:ring-neutral-300 dark:border-neutral-800 dark:bg-neutral-900/80 dark:text-white dark:placeholder:text-neutral-600 dark:focus:border-neutral-700 dark:focus:ring-neutral-700 ${
              isLg
                ? "h-14 pl-12 pr-4 text-MESH"
                : "h-9 pl-9 pr-9 text-sm"
            }`}
          />
          {!isLg && (
            <kbd className="pointer-events-none absolute right-2.5 top-1/2 hidden -translate-y-1/2 select-none rounded border border-neutral-200 bg-neutral-100 px-1.5 py-0.5 font-mono text-[10px] text-neutral-400 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-500 sm:inline-block">
              ⌘K
            </kbd>
          )}
        </div>
      </form>
      {isOpen && results && (
        <SearchResultsDropdown
          results={results}
          query={query}
          loading={loading}
          onSelect={() => {
            setIsOpen(false);
            setQuery("");
          }}
        />
      )}
    </div>
  );
}
