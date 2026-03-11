"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";

export interface OfficeEntry {
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  isHq: boolean;
}

const emptyOffice: OfficeEntry = {
  address: "",
  city: "",
  state: "",
  country: "",
  postalCode: "",
  isHq: false,
};

export function OfficesEditor({
  offices,
  onChange,
}: {
  offices: OfficeEntry[];
  onChange: (offices: OfficeEntry[]) => void;
}) {
  function addOffice() {
    onChange([...offices, { ...emptyOffice }]);
  }

  function removeOffice(index: number) {
    onChange(offices.filter((_, i) => i !== index));
  }

  function updateOffice(index: number, field: keyof OfficeEntry, value: string | boolean) {
    const updated = offices.map((o, i) =>
      i === index ? { ...o, [field]: value } : o
    );
    onChange(updated);
  }

  return (
    <div className="rounded-lg border p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Offices</h2>
        <Button type="button" variant="outline" size="sm" onClick={addOffice}>
          <Plus className="mr-1 h-3.5 w-3.5" />
          Add Office
        </Button>
      </div>

      {offices.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No offices added yet. Click &quot;Add Office&quot; to add one.
        </p>
      )}

      {offices.map((office, index) => (
        <div key={index} className="rounded-md border p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              Office {index + 1}
              {office.isHq && " (HQ)"}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeOffice(index)}
            >
              <Trash2 className="h-3.5 w-3.5 text-destructive" />
            </Button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1 sm:col-span-2">
              <Label>Address *</Label>
              <Input
                value={office.address}
                onChange={(e) => updateOffice(index, "address", e.target.value)}
                placeholder="123 Main St"
                required
              />
            </div>
            <div className="space-y-1">
              <Label>City</Label>
              <Input
                value={office.city}
                onChange={(e) => updateOffice(index, "city", e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label>State / Province</Label>
              <Input
                value={office.state}
                onChange={(e) => updateOffice(index, "state", e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label>Country</Label>
              <Input
                value={office.country}
                onChange={(e) => updateOffice(index, "country", e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label>Postal Code</Label>
              <Input
                value={office.postalCode}
                onChange={(e) => updateOffice(index, "postalCode", e.target.value)}
              />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={office.isHq}
              onChange={(e) => updateOffice(index, "isHq", e.target.checked)}
              className="rounded border-input"
            />
            Headquarters
          </label>
        </div>
      ))}
    </div>
  );
}
