import { SubmissionForm } from "@/components/submission/submission-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add Data Center — BASE",
};

export default function NewDatacenterPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Add a Data Center</h1>
        <p className="text-muted-foreground">
          Submit a new data center to the BASE database.
        </p>
      </div>
      <SubmissionForm category="datacenter" />
    </div>
  );
}
