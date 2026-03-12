import { auth } from "@/lib/auth";
import { UserNav } from "./user-nav";
import { NotificationBell } from "./notification-bell";

export async function Header() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b bg-background px-6">
      <div />
      {session?.user && (
        <div className="flex items-center gap-2">
          <NotificationBell />
          <UserNav
            name={session.user.name ?? ""}
            email={session.user.email ?? ""}
            image={session.user.image ?? ""}
          />
        </div>
      )}
    </header>
  );
}
