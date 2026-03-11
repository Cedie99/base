"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { updateUserRole, deleteUser } from "@/lib/users.actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface User {
  id: string;
  name: string | null;
  email: string | null;
  role: "admin" | "moderator" | "user";
  image: string | null;
}

const roleBadgeVariant: Record<string, "destructive" | "default" | "secondary"> = {
  admin: "destructive",
  moderator: "default",
  user: "secondary",
};

export function UserTable({
  users,
  currentUserId,
}: {
  users: User[];
  currentUserId: string;
}) {
  const router = useRouter();

  async function handleRoleChange(userId: string, role: string) {
    const result = await updateUserRole(
      userId,
      role as "admin" | "moderator" | "user"
    );
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Role updated");
      router.refresh();
    }
  }

  async function handleDelete(userId: string, name: string | null) {
    if (!confirm(`Delete user "${name ?? "Unknown"}"? This cannot be undone.`))
      return;
    const result = await deleteUser(userId);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("User deleted");
      router.refresh();
    }
  }

  if (users.length === 0) {
    return (
      <div className="rounded-lg border p-8 text-center text-muted-foreground">
        No users found.
      </div>
    );
  }

  return (
    <div className="rounded-lg border">
      <table className="w-full">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="px-4 py-3 text-left text-sm font-medium">
              Name / Email
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium">Role</th>
            <th className="px-4 py-3 text-right text-sm font-medium">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            const isSelf = user.id === currentUserId;
            return (
              <tr key={user.id} className="border-b last:border-0">
                <td className="px-4 py-3">
                  <div className="font-medium">
                    {user.name ?? "Unnamed"}
                    {isSelf && (
                      <span className="ml-2 text-xs text-muted-foreground">
                        (you)
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {user.email}
                  </div>
                </td>
                <td className="px-4 py-3">
                  {isSelf ? (
                    <Badge variant={roleBadgeVariant[user.role]}>
                      {user.role}
                    </Badge>
                  ) : (
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <Badge
                          variant={roleBadgeVariant[user.role]}
                          className="cursor-pointer"
                        >
                          {user.role}
                        </Badge>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        <DropdownMenuRadioGroup
                          value={user.role}
                          onValueChange={(value) =>
                            handleRoleChange(user.id, value as string)
                          }
                        >
                          <DropdownMenuRadioItem value="admin">
                            Admin
                          </DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="moderator">
                            Moderator
                          </DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="user">
                            User
                          </DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    disabled={isSelf}
                    onClick={() => handleDelete(user.id, user.name)}
                  >
                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
