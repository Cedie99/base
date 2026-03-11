import { SubmissionForm } from "@/components/submission/submission-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add Company — BASE",
};

export default function NewCompanyPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Add a Company</h1>
        <p className="text-muted-foreground">
          Submit a new web hosting company to the BASE database.
        </p>
      </div>
      <SubmissionForm category="company" />
    </div>
  );
}
