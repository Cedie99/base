import Link from "next/link";
import { Database } from "lucide-react";

export function PublicFooter() {
  return (
    <footer className="border-t border-neutral-200/80 bg-white dark:border-neutral-800/50 dark:bg-black">
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link
              href="/"
              className="flex items-center gap-2.5"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
                <Database className="h-4 w-4 text-neutral-600 dark:text-neutral-300" />
              </div>
              <span className="bg-gradient-to-b from-neutral-900 to-neutral-400 bg-clip-text text-lg font-bold text-transparent dark:from-white dark:to-neutral-400">
                MESH
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-neutral-500">
              A community-driven database for the web hosting industry.
            </p>
          </div>

          {/* Browse */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Browse</h3>
            <nav className="flex flex-col gap-2.5 text-sm text-neutral-500">
              <Link href="/companies" className="transition-colors hover:text-neutral-900 dark:hover:text-white">
                Companies
              </Link>
              <Link href="/datacenters" className="transition-colors hover:text-neutral-900 dark:hover:text-white">
                Data Centers
              </Link>
              <Link href="/registrars" className="transition-colors hover:text-neutral-900 dark:hover:text-white">
                Registrars
              </Link>
              <Link href="/people" className="transition-colors hover:text-neutral-900 dark:hover:text-white">
                People
              </Link>
            </nav>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Resources</h3>
            <nav className="flex flex-col gap-2.5 text-sm text-neutral-500">
              <Link href="/search" className="transition-colors hover:text-neutral-900 dark:hover:text-white">
                Search
              </Link>
              <Link href="/companies/new" className="transition-colors hover:text-neutral-900 dark:hover:text-white">
                Add Company
              </Link>
              <Link href="/datacenters/new" className="transition-colors hover:text-neutral-900 dark:hover:text-white">
                Add Data Center
              </Link>
              <Link href="/registrars/new" className="transition-colors hover:text-neutral-900 dark:hover:text-white">
                Add Registrar
              </Link>
            </nav>
          </div>

          {/* Account */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Account</h3>
            <nav className="flex flex-col gap-2.5 text-sm text-neutral-500">
              <Link href="/login" className="transition-colors hover:text-neutral-900 dark:hover:text-white">
                Sign In
              </Link>
              <Link href="/register" className="transition-colors hover:text-neutral-900 dark:hover:text-white">
                Create Account
              </Link>
            </nav>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-16 border-t border-neutral-200/80 pt-8 text-center text-sm text-neutral-400 dark:border-neutral-800/50 dark:text-neutral-600">
          &copy; {new Date().getFullYear()} MESH. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
