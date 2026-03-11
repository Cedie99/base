import { db } from "@/lib/db";
import { users, listings } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export async function getAllUsers() {
  return db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      image: users.image,
      emailVerified: users.emailVerified,
    })
    .from(users)
    .orderBy(desc(users.id));
}

export async function getUserSubmissions(userId: string) {
  return db.query.listings.findMany({
    where: eq(listings.createdById, userId),
    orderBy: [desc(listings.updatedAt)],
  });
}
