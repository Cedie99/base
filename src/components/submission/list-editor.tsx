"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { FieldConfig } from "./widget-configs";

interface ListEditorProps<T extends object> {
  title: string;
  singularLabel: string;
  fields: FieldConfig[];
  items: T[];
  onChange: (items: T[]) => void;
  emptyItem: T;
  icon?: LucideIcon;
  description?: string;
}

export function ListEditor<T extends object>({
  title,
  singularLabel,
  fields,
  items,
  onChange,
  emptyItem,
  icon: Icon,
  description,
}: ListEditorProps<T>) {
  function addItem() {
    onChange([...items, { ...emptyItem }]);
  }

  function removeItem(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }

  function updateItem(index: number, key: string, value: string) {
    const updated = items.map((item, i) =>
      i === index ? { ...item, [key]: value } : item
    );
    onChange(updated);
  }

  return (
    <div className="rounded-lg border bg-card p-6 space-y-4 h-full">
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {Icon && (
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                <Icon className="h-4 w-4 text-muted-foreground" />
              </div>
            )}
            <h2 className="text-lg font-semibold">{title}</h2>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={addItem}>
            <Plus className="mr-1 h-3.5 w-3.5" />
            Add {singularLabel}
          </Button>
        </div>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>

      {items.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No {title.toLowerCase()} added yet. Click &quot;Add {singularLabel}&quot; to add one.
        </p>
      )}

      {items.map((item, index) => (
        <div key={index} className="rounded-md border p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              {singularLabel} {index + 1}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeItem(index)}
            >
              <Trash2 className="h-3.5 w-3.5 text-destructive" />
            </Button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {fields.map((field) => (
              <div
                key={field.key}
                className={`space-y-1${field.colSpan === 2 ? " sm:col-span-2" : ""}`}
              >
                <Label>
                  {field.label}
                  {field.required ? " *" : ""}
                </Label>
                <Input
                  value={(item as Record<string, string>)[field.key] ?? ""}
                  onChange={(e) => updateItem(index, field.key, e.target.value)}
                  placeholder={field.placeholder}
                  type={field.type ?? "text"}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
