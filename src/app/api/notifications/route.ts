import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  getUnreadCount,
  getNotifications,
} from "@/lib/notifications.queries";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [unreadCount, notifications] = await Promise.all([
    getUnreadCount(session.user.id),
    getNotifications(session.user.id, 10),
  ]);

  return NextResponse.json({ unreadCount, notifications });
}
