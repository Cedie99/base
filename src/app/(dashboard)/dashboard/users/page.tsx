import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getAllUsers } from "@/lib/users.queries";
import { UserTable } from "@/components/dashboard/users/user-table";

export default async function UsersPage() {
  const session = await auth();

  if (session?.user?.role !== "admin") {
    redirect("/dashboard");
  }

  const users = await getAllUsers();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Users</h1>
        <p className="text-muted-foreground">
          Manage user accounts and roles.
        </p>
      </div>
      <UserTable users={users} currentUserId={session.user.id} />
    </div>
  );
}
