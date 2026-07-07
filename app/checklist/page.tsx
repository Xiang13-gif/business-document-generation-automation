import { DocumentChecklistGenerator } from "@/components/document-checklist-generator";
import { PageHeader } from "@/components/ui";

export default function ChecklistPage() {
  return (
    <>
      <PageHeader
        description="Generate document requirements, mark document status, capture waiver reasons, and evaluate whether required items are ready for submission."
        eyebrow="Module 1"
        title="Document Checklist Generator"
      />
      <div className="p-5 md:p-8">
        <DocumentChecklistGenerator />
      </div>
    </>
  );
}
