"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Menu, X, Sun, Moon, User } from "lucide-react";
import { SearchBar } from "@/components/search/search-bar";
import { BaseLogo } from "@/components/base-logo";

const primaryLinks = [
  { href: "/companies", label: "Companies" },
  { href: "/datacenters", label: "Data Centers" },
  { href: "/registrars", label: "Registrars" },
  { href: "/people", label: "People" },
];

const secondaryLinks = [
  { href: "/posts", label: "Posts" },
  { href: "/discussions", label: "Discussions" },
  { href: "/api-docs", label: "API" },
  { href: "/graph", label: "Graph" },
];

const allLinks = [...primaryLinks, ...secondaryLinks];

interface PublicHeaderProps {
  user?: {
    name?: string | null;
  } | null;
}

export function PublicHeader({ user }: PublicHeaderProps = {}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200/80 bg-white/70 backdrop-blur-xl dark:border-neutral-800/50 dark:bg-black/70">
      <div className="mx-auto flex h-16 max-w-[90rem] items-center gap-6 px-4 lg:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <BaseLogo size={30} />
          <span className="bg-gradient-to-b from-neutral-900 to-neutral-500 bg-clip-text text-lg font-bold text-transparent dark:from-white dark:to-neutral-400">
            BASE
          </span>
        </Link>

        <nav className="hidden items-center lg:flex">
          {primaryLinks.map((link) => {
            const isActive =
              pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-2.5 py-1.5 text-[13px] transition-colors xl:px-3 xl:text-sm ${
                  isActive
                    ? "bg-neutral-100 font-medium text-neutral-900 dark:bg-neutral-800 dark:text-white"
                    : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          <div className="mx-1.5 h-4 w-px bg-neutral-200 dark:bg-neutral-700" />

          {secondaryLinks.map((link) => {
            const isActive =
              pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-2.5 py-1.5 text-[13px] transition-colors xl:px-3 xl:text-sm ${
                  isActive
                    ? "bg-neutral-100 font-medium text-neutral-900 dark:bg-neutral-800 dark:text-white"
                    : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <SearchBar className="hidden w-56 sm:block lg:w-64 xl:w-80" />

          <button
            type="button"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 text-neutral-500 transition-colors hover:text-neutral-900 dark:border-neutral-800 dark:text-neutral-400 dark:hover:text-white"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </button>

          {user ? (
            <Link
              href="/dashboard"
              className="hidden items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-900 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-neutral-800 dark:border-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 sm:inline-flex"
            >
              <User className="h-3.5 w-3.5" />
              {user.name ?? "Dashboard"}
            </Link>
          ) : (
            <Link
              href="/login"
              className="hidden rounded-lg border border-neutral-200 bg-neutral-900 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-neutral-800 dark:border-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 sm:inline-flex"
            >
              Sign In
            </Link>
          )}

          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="inline-flex items-center justify-center rounded-lg p-2 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white lg:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="animate-fade-in border-t border-neutral-200/80 bg-white/95 px-4 pb-4 pt-2 backdrop-blur-xl dark:border-neutral-800/50 dark:bg-black/95 lg:hidden">
          <nav className="flex flex-col gap-1">
            {allLinks.map((link) => {
              const isActive =
                pathname === link.href || pathname.startsWith(link.href + "/");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`rounded-lg px-3 py-2.5 text-sm transition-colors ${
                    isActive
                      ? "bg-neutral-100 font-medium text-neutral-900 dark:bg-neutral-800 dark:text-white"
                      : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-3 space-y-3">
            <SearchBar className="w-full sm:hidden" />
            {user ? (
              <Link
                href="/dashboard"
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-neutral-900 px-4 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-neutral-800 dark:border-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 sm:hidden"
              >
                <User className="h-3.5 w-3.5" />
                {user.name ?? "Dashboard"}
              </Link>
            ) : (
              <Link
                href="/login"
                className="block w-full rounded-lg border border-neutral-200 bg-neutral-900 px-4 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-neutral-800 dark:border-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 sm:hidden"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
