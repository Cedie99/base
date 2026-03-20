import { SubmissionForm } from "@/components/submission/submission-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add Domain Registrar — MESH",
};

export default function NewRegistrarPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Add a Domain Registrar</h1>
        <p className="text-muted-foreground">
          Submit a new domain registrar to the MESH database.
        </p>
      </div>
      <SubmissionForm category="registrar" />
    </div>
  );
}
