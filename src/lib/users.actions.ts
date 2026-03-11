"use server";

import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth.helpers";

type ActionState = {
  error?: string;
  success?: boolean;
};

export async function updateUserRole(
  userId: string,
  role: "admin" | "moderator" | "user"
): Promise<ActionState> {
  try {
    const currentUser = await requireAdmin();

    if (currentUser.id === userId) {
      return { error: "You cannot change your own role" };
    }

    await db.update(users).set({ role }).where(eq(users.id, userId));

    return { success: true };
  } catch {
    return { error: "Forbidden" };
  }
}

export async function deleteUser(userId: string): Promise<ActionState> {
  try {
    const currentUser = await requireAdmin();

    if (currentUser.id === userId) {
      return { error: "You cannot delete your own account" };
    }

    await db.delete(users).where(eq(users.id, userId));

    return { success: true };
  } catch {
    return { error: "Forbidden" };
  }
}
