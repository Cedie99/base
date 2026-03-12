"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

interface CompareItem {
  category: string;
  slug: string;
  name: string;
  logoUrl?: string | null;
}

interface CompareContextValue {
  items: CompareItem[];
  addItem: (item: CompareItem) => void;
  removeItem: (slug: string) => void;
  clearItems: () => void;
  isInCompare: (slug: string) => boolean;
  compareUrl: string;
}

const CompareContext = createContext<CompareContextValue | null>(null);

const STORAGE_KEY = "base-compare-items";
const MAX_ITEMS = 3;

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CompareItem[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setItems(JSON.parse(stored));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items]);

  const addItem = useCallback(
    (item: CompareItem) => {
      if (items.length >= MAX_ITEMS) {
        toast.error("You can compare up to 3 listings at a time");
        return;
      }
      if (items.length > 0 && items[0].category !== item.category) {
        toast.error("You can only compare listings in the same category");
        return;
      }
      if (items.some((i) => i.slug === item.slug)) {
        toast.info("Already added to compare");
        return;
      }
      setItems((prev) => [...prev, item]);
      toast.success(`Added ${item.name} to compare`);
    },
    [items]
  );

  const removeItem = useCallback((slug: string) => {
    setItems((prev) => prev.filter((i) => i.slug !== slug));
  }, []);

  const clearItems = useCallback(() => {
    setItems([]);
  }, []);

  const isInCompare = useCallback(
    (slug: string) => items.some((i) => i.slug === slug),
    [items]
  );

  const compareUrl = `/compare?items=${items.map((i) => `${i.category}:${i.slug}`).join(",")}`;

  return (
    <CompareContext.Provider value={{ items, addItem, removeItem, clearItems, isInCompare, compareUrl }}>
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (!context) throw new Error("useCompare must be used within CompareProvider");
  return context;
}
