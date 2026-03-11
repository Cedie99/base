import { auth } from "@/lib/auth";
import { UserNav } from "./user-nav";

export async function Header() {
  const session = await auth();

  return (
    <header className="flex h-14 items-center justify-between border-b px-6">
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
