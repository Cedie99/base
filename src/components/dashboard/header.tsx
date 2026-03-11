import { auth } from "@/lib/auth";
import { UserNav } from "./user-nav";

export async function Header() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b bg-background px-6">
      <div />
      {session?.user && (
        <UserNav
          name={session.user.name ?? ""}
          email={session.user.email ?? ""}
          image={session.user.image ?? ""}
        />
      )}
    </header>
  );
}
