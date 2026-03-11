import type { Category } from "@/types/listings";
import { Building2, Server, Globe, Users } from "lucide-react";

export const categoryIcons: Record<Category, React.ElementType> = {
  company: Building2,
  datacenter: Server,
  registrar: Globe,
  person: Users,
};

interface CategoryColorSet {
  text: string;
  bg: string;
  border: string;
  hoverBg: string;
  ring: string;
  gradient: string;
  dot: string;
}

const colors: Record<Category, CategoryColorSet> = {
  company: {
    text: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-100 dark:bg-blue-500/10",
    border: "border-blue-200 dark:border-blue-500/20",
    hoverBg: "hover:bg-blue-50 dark:hover:bg-blue-500/10",
    ring: "ring-blue-200 dark:ring-blue-500/20",
    gradient: "from-blue-500 to-blue-600",
    dot: "bg-blue-500 dark:bg-blue-400",
  },
  datacenter: {
    text: "text-violet-600 dark:text-violet-400",
    bg: "bg-violet-100 dark:bg-violet-500/10",
    border: "border-violet-200 dark:border-violet-500/20",
    hoverBg: "hover:bg-violet-50 dark:hover:bg-violet-500/10",
    ring: "ring-violet-200 dark:ring-violet-500/20",
    gradient: "from-violet-500 to-violet-600",
    dot: "bg-violet-500 dark:bg-violet-400",
  },
  registrar: {
    text: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-100 dark:bg-emerald-500/10",
    border: "border-emerald-200 dark:border-emerald-500/20",
    hoverBg: "hover:bg-emerald-50 dark:hover:bg-emerald-500/10",
    ring: "ring-emerald-200 dark:ring-emerald-500/20",
    gradient: "from-emerald-500 to-emerald-600",
    dot: "bg-emerald-500 dark:bg-emerald-400",
  },
  person: {
    text: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-100 dark:bg-amber-500/10",
    border: "border-amber-200 dark:border-amber-500/20",
    hoverBg: "hover:bg-amber-50 dark:hover:bg-amber-500/10",
    ring: "ring-amber-200 dark:ring-amber-500/20",
    gradient: "from-amber-500 to-amber-600",
    dot: "bg-amber-500 dark:bg-amber-400",
  },
};

export function getCategoryColors(category: Category): CategoryColorSet {
  return colors[category];
}
