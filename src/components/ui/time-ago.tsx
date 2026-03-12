"use client";

import { useEffect, useState } from "react";

function formatTimeAgo(date: Date | string | number): string {
  const d = date instanceof Date ? date : new Date(date);
  const seconds = Math.floor((Date.now() - d.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

export function TimeAgo({ date }: { date: Date | string | number }) {
  const [text, setText] = useState(() => formatTimeAgo(date));

  useEffect(() => {
    const interval = setInterval(() => {
      setText(formatTimeAgo(date));
    }, 30_000);

    // Also update immediately on mount (hydration may be stale)
    setText(formatTimeAgo(date));

    return () => clearInterval(interval);
  }, [date]);

  return <>{text}</>;
}
