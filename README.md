# Business Document Generation Automation

A Banking Business Analyst / Product Analyst portfolio project that demonstrates rule-based business document checklist generation for commercial credit applications.

Live site: [https://xiang13-gif.github.io/business-document-generation-automation/](https://xiang13-gif.github.io/business-document-generation-automation/)

This project shows how a commercial lending team can reduce missing documents, unclear waiver handling, manual approval routing, and disconnected UAT evidence by turning business rules into a controlled document automation workflow.

## Portfolio Positioning

This is not a generic dashboard demo. It is a GitHub-ready banking case study built to show how a BA can translate a business operations problem into requirements, rules, controls, test cases, traceability, and an interactive prototype.

Target review audience:

- Banking Business Analyst hiring managers
- Product Analyst and Product Owner teams
- Credit Operations and Lending Services teams
- Risk, Controls, and Transformation teams
- Recruiters screening for financial services domain capability

## Case Study Summary

| Area | Summary |
| --- | --- |
| Business problem | Commercial credit teams lose time when applications are submitted with missing documents, unclear waiver status, inconsistent approval routes, and fragmented evidence. |
| Proposed solution | A rule-driven document checklist generator supported by approval routing, policy exception governance, UAT tracking, traceability, audit evidence, and management dashboards. |
| Primary workflow | RM selects application, facility, collateral, customer, risk, and financial statement context. The system generates required, conditional, and optional documents with rule rationale. |
| BA value shown | Business problem framing, functional requirements, rule design, acceptance criteria, UAT coverage, traceability matrix, control thinking, and stakeholder-ready reporting. |
| Data boundary | Mock data only. No confidential bank, customer, policy, employee, or production system information. |

## Business Problem

Commercial credit applications often involve multiple facilities, collateral items, guarantors, financial statements, policy exceptions, approval authorities, and operational handoffs.

Common pain points modeled in this project:

- RM submissions with missing mandatory documents
- Manual interpretation of product and collateral document requirements
- Waiver decisions captured without enough structure or audit evidence
- Approval routing uncertainty caused by exposure, risk, collateral, and exception complexity
- Policy exceptions hidden in notes instead of a controlled register
- UAT defects and retests disconnected from the requirements they validate
- Management visibility dependent on offline trackers

## What This Project Demonstrates

- Rule-based document checklist generation
- Mandatory, conditional, and optional document classification
- Document status tracking and submission readiness gate
- Waiver and missing-document control thinking
- Risk-based delegated authority routing
- Policy exception capture and governance
- Case lifecycle visibility through a Credit Case 360 view
- UAT planning, defect tracking, retest status, and release readiness
- Requirement-to-rule-to-test-to-change-request traceability
- Executive dashboard storytelling for credit operations
- Frontend implementation with Next.js, TypeScript, Tailwind CSS, and Recharts

## Core Modules

| Module | Purpose |
| --- | --- |
| Document Checklist Generator | Generates document requirements, tracks document status, captures waiver reasons, and evaluates required-document readiness before submission. |
| Credit Case 360 | Links case profile, document readiness, lifecycle gates, approval route, exceptions, UAT evidence, audit controls, BA recommendation, and next actions. |
| Approval Routing Simulator | Recommends delegated authority using exposure, risk level, collateral coverage, customer segment, facility type, and exception severity. |
| Policy Exception Register | Tracks exception severity, mitigation, owner, aging, approval tier, control evidence, requirement linkage, and UAT coverage. |
| Executive Dashboard | Shows pipeline exposure, aging, bottlenecks, owner role, exception severity, document readiness, UAT health, CR priority, and traceability status. |
| UAT Test Case Tracker | Tracks UAT execution, defect linkage, retest status, pass rate, filters, and export. |
| Change Request Impact Analyzer | Assesses CR impact across requirements, UAT scope, roles, business rules, controls, operational risk, and BA recommendation. |
| Traceability Matrix | Links requirements, business rules, test cases, change requests, and delivery status. |
| Role-Based Workflow View | Shows RM, Credit Analyst, Approver, Credit Admin, and System Admin perspectives. |
| Audit Trail | Simulates activity logging for exports, UAT updates, role review, route simulation, and CR review. |

## Suggested Demo Flow

1. Open `/checklist` and generate a document checklist for a new term loan with property collateral.
2. Mark required documents as uploaded and observe the submission readiness gate.
3. Change a document to `Waived` without a reason and review the blocker created by the control rule.
4. Change financial statement status to `Not Available` or `Waiver Requested` and review the triggered warning and control documents.
5. Open `/approval-routing` and simulate how exposure, risk, collateral, and exception severity change the approval tier.
6. Open `/case-360` to see how document readiness connects to lifecycle gates, exceptions, UAT evidence, and next actions.
7. Open `/traceability` to show how BA artifacts connect from requirement to rule to test case and change request.

## Business Analyst Artifacts

| File | Purpose |
| --- | --- |
| `docs/01-business-problem.md` | Problem statement, business impact, target outcome, success measures, and non-goals. |
| `docs/02-as-is-to-be-process.md` | Current-state and future-state process flow. |
| `docs/03-stakeholders-and-raci.md` | Stakeholder map and RACI ownership. |
| `docs/04-business-requirements.md` | Functional requirements, non-functional requirements, and reporting requirements. |
| `docs/05-user-stories.md` | User stories and acceptance criteria by epic. |
| `docs/06-business-rules-and-approval-matrix.md` | Business rules, approval matrix, and document checklist logic. |
| `docs/07-data-dictionary.md` | Key entities, fields, ownership, and data quality rules. |
| `docs/08-uat-test-cases.md` | UAT scope, test cases, priorities, and expected results. |
| `docs/09-change-request-log.md` | Sample CRs, impact assessment, and BA recommendation logic. |
| `docs/10-dashboard-mockup.md` | Dashboard requirements and metric definitions. |
| `docs/11-references-and-boundaries.md` | Public references, assumptions, limitations, and confidentiality boundary. |
| `docs/12-global-credit-modernization-prd.md` | Product requirements document for the broader platform. |
| `docs/13-information-architecture.md` | Navigation model, entity relationships, and screen-to-data mapping. |
| `docs/14-github-portfolio-packaging.md` | GitHub About text, topics, screenshot plan, demo flow, LinkedIn summary, and publishing checklist. |

## Sample Portfolio Metrics

The application uses mock data only. Metrics are portfolio assumptions for demonstration:

- Pipeline exposure and case aging by owner role
- Case lifecycle readiness gates
- Document readiness percentage
- Missing, waived, and verified document handling
- Submission blocker count and required-document readiness gate
- Policy exception severity and aging
- UAT pass rate, failed cases, blocked cases, and pending retest
- High-priority change request count
- Requirement traceability coverage

## Tech Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- shadcn-style reusable UI primitives
- Lucide React icons
- Recharts
- Mock data and local browser state

## Main Routes

| Route | Purpose |
| --- | --- |
| `/` | Portfolio overview and module entry points. |
| `/checklist` | Rule-based document checklist generator. |
| `/case-360` | End-to-end credit case lifecycle and readiness gate view. |
| `/approval-routing` | Risk-based approval routing simulator. |
| `/exceptions` | Policy exception register. |
| `/dashboard` | Credit operations control room. |
| `/uat` | UAT tracker with defect and retest workflow. |
| `/change-requests` | Change request impact analyzer. |
| `/roles` | Role-based workflow and stakeholder view. |
| `/traceability` | Requirement-to-test-to-CR matrix. |
| `/audit` | Local activity log and audit trail. |
| `/about` | Project case study and BA positioning. |

## How to Run

```bash
pnpm install
pnpm run dev
```

Open:

```text
http://127.0.0.1:3000
```

## Quality Checks

```bash
pnpm run check
```

This runs:

- sensitive file and token scan
- ESLint
- TypeScript typecheck
- production build

## Deploy to GitHub Pages

This repository deploys the public portfolio site through GitHub Pages using `.github/workflows/deploy-pages.yml`.

The workflow:

- installs dependencies with pnpm
- runs `pnpm run check`
- exports the static Next.js site to `out/`
- publishes the artifact to GitHub Pages

For a repository named `business-document-generation-automation`, the static export path is configured in `next.config.ts`.

## LinkedIn Project Summary

Built a Business Document Generation Automation case study for commercial credit applications, showing how a Banking Business Analyst can convert document requirements, waiver controls, approval routing rules, UAT evidence, and traceability into an interactive portfolio prototype.

Suggested highlights:

- Designed a rule-based document checklist generator using application type, facility type, collateral type, customer type, risk level, and financial statement availability.
- Modeled missing document and waiver scenarios with control evidence, warning messages, and audit trail thinking.
- Built a Credit Case 360 view linking document readiness, lifecycle gates, approval route, policy exceptions, UAT evidence, change requests, and BA recommendations.
- Created executive dashboard views for pipeline aging, bottlenecks, document readiness, UAT health, change requests, and traceability.
- Prepared BA artifacts including requirements, business rules, UAT cases, change impact analysis, traceability, data dictionary, and public-reference boundaries.

## Future Enhancements

- User login and role-based access control
- API routes and database persistence
- PostgreSQL / Supabase database
- Prisma ORM
- Excel / PDF export
- Workflow approval state machine
- Server-side audit trail persistence
- Server-side persistence for document status workflow
- Reviewer comments and sign-off workflow

## Disclaimer

This is a portfolio project using mock data and generalized banking logic. It is not connected to any real bank system and does not contain confidential information, production data, internal policy wording, customer information, employee information, or vendor details.
