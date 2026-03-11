import { auth } from "@/lib/auth";

export async function getCurrentUser() {
  const session = await auth();
  return session?.user ?? null;
}

export async function isAdmin() {
  const user = await getCurrentUser();
  return user?.role === "admin";
}

export async function isModerator() {
  const user = await getCurrentUser();
  return user?.role === "moderator" || user?.role === "admin";
}

export async function canApprove() {
  return isModerator();
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  return user;
}

export async function requireAdmin() {
  const user = await requireAuth();
  if (user.role !== "admin") throw new Error("Forbidden");
  return user;
}

export async function requireModerator() {
  const user = await requireAuth();
  if (user.role !== "admin" && user.role !== "moderator")
    throw new Error("Forbidden");
  return user;
}
