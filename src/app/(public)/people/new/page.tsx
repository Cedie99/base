import { SubmissionForm } from "@/components/submission/submission-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add Person — MESH",
};

export default function NewPersonPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Add a Person</h1>
        <p className="text-muted-foreground">
          Submit an industry professional to the MESH database.
        </p>
      </div>
      <SubmissionForm category="person" />
    </div>
  );
}
