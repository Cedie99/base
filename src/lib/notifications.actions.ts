"use server";

import { db } from "@/lib/db";
import { notifications } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth.helpers";

export async function markAsRead(notificationId: string) {
  const user = await getCurrentUser();
  if (!user) return { error: "Unauthorized" };

  await db
    .update(notifications)
    .set({ isRead: true })
    .where(
      and(
        eq(notifications.id, notificationId),
        eq(notifications.userId, user.id)
      )
    );

  revalidatePath("/dashboard");
  return { success: true };
}

export async function markAllAsRead() {
  const user = await getCurrentUser();
  if (!user) return { error: "Unauthorized" };

  await db
    .update(notifications)
    .set({ isRead: true })
    .where(
      and(eq(notifications.userId, user.id), eq(notifications.isRead, false))
    );

  revalidatePath("/dashboard");
  return { success: true };
}
