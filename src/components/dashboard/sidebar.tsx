import Link from "next/link";
import { LayoutDashboard, Settings, List, Shield, Users } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { auth } from "@/lib/auth";
import { BaseLogo } from "@/components/base-logo";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  roles?: string[];
}

const navItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/listings", label: "Listings", icon: List, roles: ["admin", "moderator"] },
  { href: "/dashboard/moderation", label: "Moderation", icon: Shield, roles: ["admin", "moderator"] },
  { href: "/dashboard/users", label: "Users", icon: Users, roles: ["admin"] },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export async function Sidebar() {
  const session = await auth();
  const role = session?.user?.role ?? "user";

  const visibleItems = navItems.filter(
    (item) => !item.roles || item.roles.includes(role)
  );

  return (
    <aside className="sticky top-0 flex h-screen w-64 flex-col border-r bg-card">
      <div className="flex h-14 items-center gap-2.5 px-6 font-semibold">
        <Link href="/" className="flex items-center gap-2.5">
          <BaseLogo size={24} />
          <span>BASE</span>
        </Link>
      </div>
      <Separator />
      <nav className="flex-1 space-y-1 p-4">
        {visibleItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
