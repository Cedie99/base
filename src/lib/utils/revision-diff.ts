export const FIELD_LABELS: Record<string, string> = {
  name: "Name",
  legalName: "Legal Name",
  slug: "Slug",
  url: "Website",
  logoUrl: "Logo URL",
  photoUrl: "Photo URL",
  category: "Category",
  description: "Description",
  overview: "Overview",
  foundingDate: "Founded",
  companyStatus: "Status",
  stockTicker: "Stock Ticker",
  stockExchange: "Stock Exchange",
  employeeCount: "Employees",
  revenueRange: "Revenue Range",
  headquarters: "Headquarters",
  email: "Email",
  phone: "Phone",
  twitter: "Twitter",
  linkedin: "LinkedIn",
  facebook: "Facebook",
  github: "GitHub",
  title: "Title",
  bio: "Bio",
  nationality: "Nationality",
  birthDate: "Birth Date",
};

export const WIDGET_LABELS: Record<string, string> = {
  offices: "Offices",
  products: "Products",
  people: "People",
  milestones: "Milestones",
  videos: "Videos",
  tags: "Tags",
  funding: "Funding",
  acquisitions: "Acquisitions",
  exits: "Exits",
  partners: "Partners",
  screenshots: "Screenshots",
  datacenterLinks: "Data Center Links",
  news: "News",
  externalLinks: "External Links",
  sources: "Sources",
  coupons: "Coupons",
  personDegrees: "Degrees",
};

export interface FieldChange {
  field: string;
  label: string;
  type: "added" | "removed" | "changed";
  oldValue?: string;
  newValue?: string;
}

export interface WidgetChange {
  widget: string;
  label: string;
  type: "added" | "removed" | "changed";
  oldCount: number;
  newCount: number;
}

export interface RevisionDiff {
  fieldChanges: FieldChange[];
  widgetChanges: WidgetChange[];
}

export function formatValue(value: unknown): string {
  if (value === null || value === undefined) return "(empty)";
  if (typeof value === "string") {
    if (value === "") return "(empty)";
    if (value.length > 120) return value.slice(0, 120) + "…";
    return value;
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  const json = JSON.stringify(value);
  if (json.length > 120) return json.slice(0, 120) + "…";
  return json;
}

export function computeRevisionDiff(
  before: Record<string, unknown> | null,
  after: Record<string, unknown> | null
): RevisionDiff {
  const fieldChanges: FieldChange[] = [];
  const widgetChanges: WidgetChange[] = [];

  const b = before ?? {};
  const a = after ?? {};

  const allKeys = new Set([...Object.keys(b), ...Object.keys(a)]);

  for (const key of allKeys) {
    if (key === "widgets") continue;
    if (key === "id" || key === "createdAt" || key === "updatedAt") continue;

    const oldVal = b[key];
    const newVal = a[key];
    const label = FIELD_LABELS[key] ?? key;

    const oldEmpty =
      oldVal === null || oldVal === undefined || oldVal === "";
    const newEmpty =
      newVal === null || newVal === undefined || newVal === "";

    if (oldEmpty && newEmpty) continue;

    if (oldEmpty && !newEmpty) {
      fieldChanges.push({
        field: key,
        label,
        type: "added",
        newValue: formatValue(newVal),
      });
    } else if (!oldEmpty && newEmpty) {
      fieldChanges.push({
        field: key,
        label,
        type: "removed",
        oldValue: formatValue(oldVal),
      });
    } else if (JSON.stringify(oldVal) !== JSON.stringify(newVal)) {
      fieldChanges.push({
        field: key,
        label,
        type: "changed",
        oldValue: formatValue(oldVal),
        newValue: formatValue(newVal),
      });
    }
  }

  // Compare widgets
  const bWidgets = (b.widgets ?? {}) as Record<string, unknown[]>;
  const aWidgets = (a.widgets ?? {}) as Record<string, unknown[]>;
  const widgetKeys = new Set([
    ...Object.keys(bWidgets),
    ...Object.keys(aWidgets),
  ]);

  for (const key of widgetKeys) {
    const oldArr = bWidgets[key] ?? [];
    const newArr = aWidgets[key] ?? [];
    const label = WIDGET_LABELS[key] ?? key;

    const oldCount = Array.isArray(oldArr) ? oldArr.length : 0;
    const newCount = Array.isArray(newArr) ? newArr.length : 0;

    if (oldCount === 0 && newCount === 0) continue;

    if (oldCount === 0 && newCount > 0) {
      widgetChanges.push({ widget: key, label, type: "added", oldCount: 0, newCount });
    } else if (oldCount > 0 && newCount === 0) {
      widgetChanges.push({ widget: key, label, type: "removed", oldCount, newCount: 0 });
    } else if (JSON.stringify(oldArr) !== JSON.stringify(newArr)) {
      widgetChanges.push({ widget: key, label, type: "changed", oldCount, newCount });
    }
  }

  return { fieldChanges, widgetChanges };
}
