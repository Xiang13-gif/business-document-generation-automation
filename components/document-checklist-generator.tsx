"use client";

import { AlertTriangle, CheckCircle2, Download, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge, Button, Card, ProgressBar, StatCard } from "@/components/ui";
import { recordAuditEvent } from "@/lib/audit-log";
import { defaultChecklistInput, generateChecklist } from "@/lib/checklist-rules";
import type {
  ApplicationType,
  ChecklistInput,
  CollateralType,
  CustomerType,
  DocumentStatus,
  DocumentCategory,
  FacilityType,
  FinancialStatementStatus,
  RequirementLevel,
  RiskLevel
} from "@/lib/types";
import { downloadCsv, toCsv } from "@/lib/utils";

const applicationTypes: ApplicationType[] = ["New", "Renewal", "Enhancement"];
const facilityTypes: FacilityType[] = ["Term Loan", "Overdraft", "Trade Line", "Bank Guarantee"];
const collateralTypes: CollateralType[] = [
  "Property",
  "Cash Deposit",
  "Fixed Deposit",
  "Corporate Guarantee",
  "Personal Guarantee",
  "Debenture",
  "Unsecured"
];
const customerTypes: CustomerType[] = ["Individual", "Sole Proprietor", "Partnership", "SME Company", "Corporate"];
const riskLevels: RiskLevel[] = ["Low", "Medium", "High"];
const financialStatuses: FinancialStatementStatus[] = ["Available", "Not Available", "Waiver Requested"];
const documentStatuses: DocumentStatus[] = ["Not Uploaded", "Uploaded", "Verified", "Waived", "Not Applicable"];
const categories: Array<DocumentCategory | "All"> = [
  "All",
  "General",
  "Financial",
  "Facility",
  "Collateral",
  "Compliance / Control"
];

type DocumentReviewState = {
  status: DocumentStatus;
  waiverReason: string;
};

const defaultDocumentReviewState: DocumentReviewState = {
  status: "Not Uploaded",
  waiverReason: ""
};

function SelectField<T extends string>({
  label,
  value,
  options,
  onChange
}: {
  label: string;
  value: T;
  options: T[];
  onChange: (value: T) => void;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium">
      {label}
      <select className="control" value={value} onChange={(event) => onChange(event.target.value as T)}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function requirementTone(level: RequirementLevel) {
  if (level === "Required") {
    return "danger";
  }
  if (level === "Conditional") {
    return "warning";
  }
  return "default";
}

function statusTone(status: DocumentStatus) {
  if (status === "Verified" || status === "Not Applicable") {
    return "success";
  }
  if (status === "Uploaded" || status === "Waived") {
    return "warning";
  }
  return "danger";
}

function isSubmissionReadyStatus(status: DocumentStatus) {
  return status === "Uploaded" || status === "Verified" || status === "Waived" || status === "Not Applicable";
}

export function DocumentChecklistGenerator() {
  const [input, setInput] = useState<ChecklistInput>(defaultChecklistInput);
  const [category, setCategory] = useState<DocumentCategory | "All">("All");
  const [documentReview, setDocumentReview] = useState<Record<string, DocumentReviewState>>({});

  const result = useMemo(() => generateChecklist(input), [input]);
  const filteredDocuments = result.documents.filter((document) => category === "All" || document.category === category);
  const requiredCount = result.documents.filter((document) => document.requirementLevel === "Required").length;
  const conditionalCount = result.documents.filter((document) => document.requirementLevel === "Conditional").length;
  const optionalCount = result.documents.filter((document) => document.requirementLevel === "Optional").length;
  const requiredDocuments = result.documents.filter((document) => document.requirementLevel === "Required");

  const getReviewState = (documentId: string) => documentReview[documentId] ?? defaultDocumentReviewState;
  const readyRequiredDocuments = requiredDocuments.filter((document) => {
    const reviewState = getReviewState(document.id);
    return isSubmissionReadyStatus(reviewState.status) && (reviewState.status !== "Waived" || reviewState.waiverReason.trim().length > 0);
  });
  const missingRequiredDocuments = requiredDocuments.filter((document) => getReviewState(document.id).status === "Not Uploaded");
  const incompleteWaiverDocuments = result.documents.filter((document) => {
    const reviewState = getReviewState(document.id);
    return reviewState.status === "Waived" && reviewState.waiverReason.trim().length === 0;
  });
  const submissionBlockers = [
    ...missingRequiredDocuments.map((document) => `${document.name} is still Not Uploaded.`),
    ...incompleteWaiverDocuments.map((document) => `${document.name} is Waived but missing waiver reason.`)
  ];
  const readinessPercentage = requiredCount === 0 ? 100 : Math.round((readyRequiredDocuments.length / requiredCount) * 100);
  const waiverCount = result.documents.filter((document) => getReviewState(document.id).status === "Waived").length;
  const verifiedCount = result.documents.filter((document) => getReviewState(document.id).status === "Verified").length;
  const uploadedCount = result.documents.filter((document) => getReviewState(document.id).status === "Uploaded").length;
  const canSubmit = submissionBlockers.length === 0;

  const updateInput = <K extends keyof ChecklistInput>(key: K, value: ChecklistInput[K]) => {
    setInput((current) => ({ ...current, [key]: value }));
  };

  const updateDocumentReview = (documentId: string, patch: Partial<DocumentReviewState>) => {
    setDocumentReview((current) => {
      const nextState = { ...(current[documentId] ?? defaultDocumentReviewState), ...patch };
      return { ...current, [documentId]: nextState };
    });
  };

  const markRequiredUploaded = () => {
    setDocumentReview((current) => {
      const next = { ...current };
      requiredDocuments.forEach((document) => {
        const currentState = next[document.id] ?? defaultDocumentReviewState;
        next[document.id] = {
          ...currentState,
          status: currentState.status === "Not Uploaded" ? "Uploaded" : currentState.status
        };
      });
      return next;
    });
    recordAuditEvent({
      actor: "RM / BA Reviewer",
      action: "Required documents marked uploaded",
      module: "Document Checklist",
      referenceId: `${input.applicationType} ${input.facilityType}`,
      details: `Marked missing required checklist items as Uploaded for ${input.applicationType}, ${input.facilityType}, ${input.collateralType}.`,
      controlImpact: "Medium"
    });
  };

  const clearDocumentStatuses = () => {
    setDocumentReview({});
    recordAuditEvent({
      actor: "RM / BA Reviewer",
      action: "Checklist statuses cleared",
      module: "Document Checklist",
      referenceId: `${input.applicationType} ${input.facilityType}`,
      details: "Cleared document status review state and returned the submission gate to default blockers.",
      controlImpact: "Low"
    });
  };

  const exportChecklist = () => {
    downloadCsv(
      "document-checklist-readiness.csv",
      toCsv(
        result.documents.map((document) => {
          const reviewState = getReviewState(document.id);
          return {
            id: document.id,
            name: document.name,
            category: document.category,
            requirementLevel: document.requirementLevel,
            status: reviewState.status,
            waiverReason: reviewState.waiverReason,
            submissionBlocking:
              document.requirementLevel === "Required" && !isSubmissionReadyStatus(reviewState.status)
                ? "Yes"
                : "No",
            businessRuleId: document.businessRuleId,
            reason: document.reason
          };
        })
      )
    );
    recordAuditEvent({
      actor: "RM / BA Reviewer",
      action: "Checklist exported",
      module: "Document Checklist",
      referenceId: `${input.applicationType} ${input.facilityType}`,
      details: `Exported ${result.documents.length} documents for ${input.applicationType}, ${input.facilityType}, ${input.collateralType}, ${input.riskLevel} risk.`,
      controlImpact: result.warnings.length > 0 ? "High" : "Medium"
    });
  };

  const resetChecklist = () => {
    setInput(defaultChecklistInput);
    setCategory("All");
    setDocumentReview({});
    recordAuditEvent({
      actor: "RM / BA Reviewer",
      action: "Checklist inputs reset",
      module: "Document Checklist",
      referenceId: "DEFAULT",
      details: "Checklist inputs were reset to the default New Term Loan with Property collateral scenario.",
      controlImpact: "Low"
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        <StatCard label="Total Documents" value={result.documents.length} helper="Generated by rule engine" />
        <StatCard label="Required" value={requiredCount} tone="danger" helper="Submission control items" />
        <StatCard label="Conditional" value={conditionalCount} tone="warning" helper="Depends on case context" />
        <StatCard label="Optional" value={optionalCount} helper="Supporting evidence" />
        <StatCard label="Readiness" value={`${readinessPercentage}%`} tone={canSubmit ? "success" : "warning"} helper={`${readyRequiredDocuments.length}/${requiredCount} required ready`} />
        <StatCard label="Blockers" value={submissionBlockers.length} tone={canSubmit ? "success" : "danger"} helper="Submission gate" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        <div className="space-y-6">
          <Card>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold">Application Inputs</h2>
                <p className="mt-1 text-sm text-muted-foreground">The output changes when business context changes.</p>
              </div>
              <Button onClick={resetChecklist} variant="ghost">
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
            </div>

            <div className="mt-5 grid gap-4">
              <SelectField label="Application Type" value={input.applicationType} options={applicationTypes} onChange={(value) => updateInput("applicationType", value)} />
              <SelectField label="Facility Type" value={input.facilityType} options={facilityTypes} onChange={(value) => updateInput("facilityType", value)} />
              <SelectField label="Collateral Type" value={input.collateralType} options={collateralTypes} onChange={(value) => updateInput("collateralType", value)} />
              <SelectField label="Customer Type" value={input.customerType} options={customerTypes} onChange={(value) => updateInput("customerType", value)} />
              <SelectField label="Risk Level" value={input.riskLevel} options={riskLevels} onChange={(value) => updateInput("riskLevel", value)} />
              <SelectField label="Financial Statement" value={input.financialStatementStatus} options={financialStatuses} onChange={(value) => updateInput("financialStatementStatus", value)} />
            </div>
          </Card>

          <Card>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold">Submission Gate</h2>
                <p className="mt-1 text-sm text-muted-foreground">Required documents must be uploaded, verified, waived, or not applicable.</p>
              </div>
              <Badge tone={canSubmit ? "success" : "danger"}>{canSubmit ? "Ready" : "Blocked"}</Badge>
            </div>

            <div className="mt-5">
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="font-medium">Required readiness</span>
                <span className="text-muted-foreground">{readinessPercentage}%</span>
              </div>
              <div className="mt-2">
                <ProgressBar value={readinessPercentage} />
              </div>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3 text-sm">
              <div className="rounded-lg border p-3">
                <p className="text-muted-foreground">Uploaded</p>
                <p className="mt-1 text-lg font-semibold">{uploadedCount}</p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-muted-foreground">Verified</p>
                <p className="mt-1 text-lg font-semibold">{verifiedCount}</p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-muted-foreground">Waived</p>
                <p className="mt-1 text-lg font-semibold">{waiverCount}</p>
              </div>
            </div>

            {submissionBlockers.length > 0 ? (
              <div className="mt-5 rounded-lg border border-danger/20 bg-danger/10 p-4">
                <p className="text-sm font-semibold text-danger">Open blockers</p>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  {submissionBlockers.slice(0, 4).map((blocker) => (
                    <li key={blocker}>{blocker}</li>
                  ))}
                  {submissionBlockers.length > 4 ? <li>{submissionBlockers.length - 4} more blockers.</li> : null}
                </ul>
              </div>
            ) : (
              <div className="mt-5 rounded-lg border border-success/20 bg-success/10 p-4 text-sm text-success">
                Required document gate is clear for submission.
              </div>
            )}

            <div className="mt-5 flex flex-wrap gap-2">
              <Button onClick={markRequiredUploaded} variant="secondary">
                <CheckCircle2 className="h-4 w-4" />
                Mark Required Uploaded
              </Button>
              <Button onClick={clearDocumentStatuses} variant="ghost">
                Clear Statuses
              </Button>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          {result.warnings.length > 0 ? (
            <Card className="border-warning/40 bg-warning/10">
              <div className="flex gap-3">
                <AlertTriangle className="mt-1 h-5 w-5 text-warning-foreground dark:text-warning" />
                <div>
                  <h2 className="font-semibold">Risk Warning</h2>
                  <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                    {result.warnings.map((warning) => (
                      <li key={warning}>{warning}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          ) : null}

          <Card>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-lg font-semibold">Generated Checklist</h2>
                <p className="mt-1 text-sm text-muted-foreground">Documents are grouped by category with status, waiver evidence, and rule rationale.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <select className="control" value={category} onChange={(event) => setCategory(event.target.value as DocumentCategory | "All")}>
                  {categories.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                <Button onClick={exportChecklist} variant="secondary">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>

            <div className="mt-5 overflow-x-auto rounded-lg border">
              <table className="w-full min-w-[1240px] border-collapse text-sm">
                <thead className="table-head">
                  <tr>
                    <th className="px-4 py-3 text-left">Document</th>
                    <th className="px-4 py-3 text-left">Category</th>
                    <th className="px-4 py-3 text-left">Level</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-left">Waiver Reason</th>
                    <th className="px-4 py-3 text-left">Rule</th>
                    <th className="px-4 py-3 text-left">Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDocuments.map((document) => {
                    const reviewState = getReviewState(document.id);
                    return (
                      <tr className="border-t align-top" key={document.id}>
                        <td className="px-4 py-3 font-medium">{document.name}</td>
                        <td className="px-4 py-3 text-muted-foreground">{document.category}</td>
                        <td className="px-4 py-3">
                          <Badge tone={requirementTone(document.requirementLevel)}>{document.requirementLevel}</Badge>
                        </td>
                        <td className="px-4 py-3">
                          <div className="grid gap-2">
                            <select
                              className="control min-w-[160px]"
                              value={reviewState.status}
                              onChange={(event) => updateDocumentReview(document.id, { status: event.target.value as DocumentStatus })}
                            >
                              {documentStatuses.map((status) => (
                                <option key={status} value={status}>
                                  {status}
                                </option>
                              ))}
                            </select>
                            <Badge tone={statusTone(reviewState.status)}>{reviewState.status}</Badge>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          {reviewState.status === "Waived" ? (
                            <input
                              className="control min-w-[220px]"
                              onChange={(event) => updateDocumentReview(document.id, { waiverReason: event.target.value })}
                              placeholder="Required for waived item"
                              value={reviewState.waiverReason}
                            />
                          ) : (
                            <span className="text-muted-foreground">Not required</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{document.businessRuleId}</td>
                        <td className="px-4 py-3 text-muted-foreground">{document.reason}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>

          <Card>
            <h2 className="text-lg font-semibold">Triggered Business Rules</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {result.triggeredRules.map((item) => (
                <div className="rounded-lg border p-4" key={item.id}>
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-semibold">{item.id}</h3>
                    <Badge tone="info">{item.controlPoint}</Badge>
                  </div>
                  <p className="mt-2 text-sm font-medium">{item.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
