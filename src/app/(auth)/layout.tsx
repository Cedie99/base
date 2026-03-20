import Link from "next/link";
import { Database } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-white dark:bg-black">
      {/* Grid background */}
      <div className="bg-grid-pattern pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute inset-0 bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black" />

      <div className="relative z-10 w-full max-w-md space-y-8 px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
            <Database className="h-5 w-5 text-neutral-600 dark:text-neutral-300" />
          </div>
          <span className="bg-gradient-to-b from-neutral-900 to-neutral-400 bg-clip-text text-xl font-bold text-transparent dark:from-white dark:to-neutral-400">
            MESH
          </span>
        </Link>

        {children}
      </div>
    </div>
  );
}
