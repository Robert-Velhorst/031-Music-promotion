# NOTE — Music Promotion

This workspace contains a first, browser-run implementation of NOTE's Promotion workflow. It is grounded in the `031-Music-promotion` repository specification and the NOTE product material in the connected Google Drive.

## Run locally

No build step or package install is required. From this directory, run:

```powershell
python -m http.server 4173
```

Then open `http://localhost:4173`.

## Implemented in this build

- Artist workspace navigation and overview
- Editable Song Passports with artist-entered metadata and rights assertions
- Advisory release-readiness indicators
- Campaign planning with dates, territories, channels, activity commitment and permission boundaries
- Explicit local authorization record that does not trigger external work
- Opportunity directory with evidence, fit reasons, risk signals, status filters and a review list
- Factual pitch drafts assembled from saved artist and track facts; drafts stay editable and unsent
- Activity log and JSON/CSV export
- Browser-local persistence and resettable illustrative sample data
- Responsive layout and keyboard-visible focus styles

## Current limits

This is a frontend prototype, not a production service. It stores records in browser `localStorage`; it has no account system, backend, database, secure file storage, team permissions, server-side audit integrity, live opportunity research, real promotion adapters, email connection, or analytics imports. Sample records are illustrative. No message, submission, or paid action is sent. Adapter status is visibly shown as not connected.

The repository specification requires at least two real compliant adapters before controlled production testing. This prototype does not satisfy that gate. Promotion integrations, legal review by territory, security controls, retention/deletion controls, and a production deployment guide for Hetzner remain implementation work.

## Source of product requirements

- [031 — Music Promotion repository](https://github.com/Robert-Velhorst/031-Music-promotion)

The current product name is **NOTE**. Catalyst is an earlier working label. Promotion is the first implementation scope within NOTE's wider platform direction.
