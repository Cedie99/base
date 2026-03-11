import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Category } from "@/types/listings";
import { getCategoryColors } from "@/lib/utils/category-colors";

const quickAddLinks: { href: string; label: string; category: Category }[] = [
  { href: "/companies/new", label: "Add Company", category: "company" },
  { href: "/datacenters/new", label: "Add Data Center", category: "datacenter" },
  { href: "/registrars/new", label: "Add Registrar", category: "registrar" },
  { href: "/people/new", label: "Add Person", category: "person" },
];

export function QuickAdd() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">Contribute</h2>
        <p className="mt-1 text-sm text-neutral-500">Help grow the database</p>
      </div>
      <div className="flex flex-wrap gap-3">
        {quickAddLinks.map((link) => {
          const colors = getCategoryColors(link.category);
          return (
            <Button
              key={link.href}
              variant="outline"
              nativeButton={false}
              render={<Link href={link.href} />}
              className="border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50 hover:text-neutral-900 dark:border-neutral-800 dark:bg-neutral-900/50 dark:text-neutral-300 dark:hover:border-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-white"
            >
              <Plus className={`mr-1.5 h-4 w-4 ${colors.text}`} />
              {link.label}
            </Button>
          );
        })}
      </div>
    </section>
  );
}
