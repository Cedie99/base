"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Bell,
  MessageSquare,
  Reply,
  CheckCircle,
  XCircle,
  Pencil,
} from "lucide-react";
import Link from "next/link";
import { markAsRead, markAllAsRead } from "@/lib/notifications.actions";
import type { NotificationWithDetails } from "@/types/discussions";

interface NotificationsResponse {
  unreadCount: number;
  notifications: NotificationWithDetails[];
}

function getNotificationMeta(item: NotificationWithDetails) {
  const triggerName = item.triggeredBy.name ?? "Someone";
  const listingSlug = item.listing?.slug;
  const listingCategory = item.listing?.category;
  const categoryPath = listingCategory
    ? `/${listingCategory}/${listingSlug}`
    : null;

  switch (item.type) {
    case "listing_approved":
      return {
        icon: <CheckCircle className="h-4 w-4 text-green-500" />,
        message: "Your listing was approved",
        subtitle: item.listing?.name ?? "",
        href: categoryPath ?? "/dashboard",
      };
    case "listing_rejected":
      return {
        icon: <XCircle className="h-4 w-4 text-red-500" />,
        message: "Your listing was rejected",
        subtitle: item.listing?.name ?? "",
        href: "/dashboard",
      };
    case "revision_approved":
      return {
        icon: <CheckCircle className="h-4 w-4 text-green-500" />,
        message: "Your edit was approved",
        subtitle: item.listing?.name ?? "",
        href: categoryPath ? `${categoryPath}/revisions` : "/dashboard",
      };
    case "revision_rejected":
      return {
        icon: <XCircle className="h-4 w-4 text-red-500" />,
        message: "Your edit was rejected",
        subtitle: item.listing?.name ?? "",
        href: categoryPath ? `${categoryPath}/revisions` : "/dashboard",
      };
    case "listing_edited":
      return {
        icon: <Pencil className="h-4 w-4 text-blue-500" />,
        message: `${triggerName} submitted an edit to your listing`,
        subtitle: item.listing?.name ?? "",
        href: categoryPath ? `${categoryPath}/revisions` : "/dashboard",
      };
    case "listing_discussion":
      return {
        icon: <MessageSquare className="h-4 w-4 text-blue-500" />,
        message: `${triggerName} started a discussion on your listing`,
        subtitle: item.thread?.title ?? item.listing?.name ?? "",
        href: item.threadId
          ? `/discussions/${item.threadId}`
          : "/discussions",
      };
    case "thread_reply":
      return {
        icon: <MessageSquare className="h-4 w-4 text-muted-foreground" />,
        message: `${triggerName} replied to your thread`,
        subtitle: item.thread?.title ?? "",
        href: `/discussions/${item.threadId}`,
      };
    case "comment_reply":
      return {
        icon: <Reply className="h-4 w-4 text-muted-foreground" />,
        message: `${triggerName} replied to your comment`,
        subtitle: item.thread?.title ?? "",
        href: `/discussions/${item.threadId}`,
      };
    default:
      return {
        icon: <Bell className="h-4 w-4 text-muted-foreground" />,
        message: "New notification",
        subtitle: "",
        href: "/dashboard",
      };
  }
}

export function NotificationBell() {
  const queryClient = useQueryClient();

  const { data } = useQuery<NotificationsResponse>({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await fetch("/api/notifications");
      if (!res.ok) throw new Error("Failed to fetch notifications");
      return res.json();
    },
    refetchInterval: 30000,
  });

  const unreadCount = data?.unreadCount ?? 0;
  const items = data?.notifications ?? [];

  const handleMarkAsRead = async (id: string) => {
    await markAsRead(id);
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="relative inline-flex h-8 w-8 items-center justify-center rounded-lg outline-none hover:bg-muted">
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-medium text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex items-center justify-between">
            <span>Notifications</span>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-xs font-normal text-muted-foreground hover:text-foreground"
              >
                Mark all as read
              </button>
            )}
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {items.length === 0 ? (
            <div className="px-2 py-4 text-center text-sm text-muted-foreground">
              No notifications
            </div>
          ) : (
            items.map((item) => {
              const meta = getNotificationMeta(item);
              return (
                <DropdownMenuItem
                  key={item.id}
                  render={<Link href={meta.href} />}
                  className="flex items-start gap-3 p-3"
                  onClick={() => {
                    if (!item.isRead) handleMarkAsRead(item.id);
                  }}
                >
                  <div className="mt-0.5 shrink-0">{meta.icon}</div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm">{meta.message}</p>
                    {meta.subtitle && (
                      <p className="truncate text-xs text-muted-foreground">
                        {meta.subtitle}
                      </p>
                    )}
                  </div>
                  {!item.isRead && (
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                  )}
                </DropdownMenuItem>
              );
            })
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
