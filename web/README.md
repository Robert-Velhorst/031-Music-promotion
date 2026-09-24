# NOTE Promotion

NOTE Promotion is an artist-first workspace for planning music promotion and keeping career records together. This project covers the Promotion pillar of NOTE; it does not implement NOTE's other planned pillars.

> **Status:** This is an early hosted-pilot foundation, not a production-ready service or the complete Promotion MVP. External promotion is disabled. The repository's MVP requires real compliant promotion adapters, background execution, qualified-action accounting, opportunity discovery and reputation controls, and an immutable audit trail; these are not implemented or configured here.

## What the producer can do

- Sign in to a private, user-scoped workspace.
- Keep an artist profile with language, territory, rights context, contact preferences, and collecting-society/distributor details.
- Build a Song Passport for each recording, including contributors, identifiers, territory permissions, sample-clearance notes, allowed uses, and an artist authority confirmation.
- Plan bounded promotion campaigns with dates, channels, territories, languages, exclusions, a budget ceiling, and an optional activity target.
- Keep an opportunity shortlist with a public rules page, fit reason, submission route, and fee disclosure; permanently suppress opportunities from future NOTE workflows.
- Record research, preparation, artist-sent contact, replies, acceptance, publication, and declines as distinct manually entered activity records.
- Enter royalty lines or import a mapped CSV, retaining source, statement reference, release link, original category label, and artist-entered/imported provenance. Negative statement adjustments such as reversals and recoupments are supported.
- Export all paginated workspace records to JSON or permanently delete NOTE workspace records while keeping the sign-in account.

## Important product boundaries

This release does not connect to distributors, DSPs, PROs/CMOs, royalty payers, banks, advertisers, email, playlist platforms, or promotion outlets. It does not discover outlets automatically, send messages, upload music, buy ads, buy placements, spend money, or confirm that royalty amounts were paid. Campaign activation changes a NOTE status only. Artists must review and perform every external action themselves.

Amounts in the earnings ledger are statement lines supplied by the artist. They are not estimates of payable income, verified balances, or proof that a payer owes money. A recording identifier is not proof of rights ownership. Authority and clearance fields record the artist's own notes and confirmations; NOTE does not verify legal rights.

## Technical shape

- React and Vite front end.
- AppDeploy authentication and backend SDK.
- Authenticated backend routes; each database table is scoped to the AppDeploy user ID and each read rechecks `ownerId`.
- Bounded 100-record database pages; export and deletion walk pages from the client rather than draining unbounded tables in a backend request.
- CSV parsing runs in the browser; only mapped rows are sent to the backend. Original CSV files and audio assets are not stored. Exact duplicate checks inspect a bounded 100-record ledger page, so larger historical ledgers still need a manual duplicate review.
- Campaign status transitions enforce release-authority confirmation, scope checks, exclusions, and allowed state changes. Active campaigns prevent revoking their release authority confirmation. The transitions have no external side effects.
- `tests/tests.json` defines five end-to-end producer workflows, including authentication/data isolation, campaign guardrails, suppression, royalty import/export, and mobile deletion.

## Local development

This folder is an AppDeploy project source. The platform injects `@appdeploy/client` and `@appdeploy/sdk`; do not add those packages to `package.json`. To run this outside AppDeploy, provide compatible packages and configure the local environment first.

```sh
npm install
npm run typecheck
npm run build
```

For a hosted deploy, submit the new files under `web/` as the project root using the `react-vite` frontend and backend entry point `backend/index.ts`. Run the included hosted end-to-end suite before inviting producers.

## Before a public launch

This source is a hosted pilot foundation, not the complete NOTE business operation. Add and validate actual promotion adapters, compliant opportunity discovery, immutable audit and qualification accounting, statement-specific reconciliation controls, user-facing legal terms and privacy materials, support/incident processes, and the required provider credentials and policy reviews. No external provider adapter or money movement is represented as live here.
