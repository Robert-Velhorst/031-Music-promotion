# NOTE Promotion prototype — implementation notes

## Product interpretation

NOTE is the broader music creator platform. This app implements the first slice of project 031: artist-facing Promotion planning. It keeps the catalog, rights and revenue records connected to campaigns without presenting all ten platform pillars as already built. It does not add recipient accounts, a curator portal, distribution, a social network, or music generation.

The interface is a usable local prototype. Sample entities are synthetic, clearly marked, and replaceable. Local authorization records demonstrate the approval boundary only; they do not authorize an external action.

## Screen inventory

| Screen | Main question answered | Working actions |
|---|---|---|
| Overview | What is planned, what needs review, and what happened? | Create campaign, open sections, authorize a local plan |
| Song Passports | What facts and permissions are recorded for each track? | Create and edit a track; inspect advisory readiness |
| Campaigns | What is the promotion scope and what may happen autonomously? | Create and locally authorize a plan |
| Opportunities | Which sources may fit, and what evidence or risk exists? | Search, filter, inspect, shortlist, prepare a pitch draft |
| Activity log | What was recorded, and was it actually sent? | Filter and export events or workspace data |
| Settings | What artist defaults and boundaries apply? | Edit profile, export data, reset sample workspace |

## Visual system

- Dark graphite navigation rail against a quiet, pale workspace canvas
- Lime accent for the primary action and selected navigation state
- Open lists and tables for operational information; cards are reserved for summary and focused release context
- Short labels, muted metadata and explicit state text; status is never shown through color alone
- Responsive collapse to a slide-in navigation rail and one-column content on narrow screens
- System font fallbacks keep the page usable without a font download

## Important product safeguards represented

- Activity commitments count qualified work, not message volume.
- A fit score is a reason to review, not a prediction of acceptance.
- Sample research is never represented as a live lookup.
- A high-risk source advertising guaranteed streams is excluded in the illustrative data.
- Pitch drafts use only stored artist and track facts and remain unsent.
- Spending, paid placements, agreements, licences, exclusivity, rights transfers and revenue sharing require separate approval.
- No route claims to be connected until credentials, permitted methods, current policies and health checks exist.
- Outcomes remain separate: delivery, response, acceptance, publication, verified placement, usage and revenue.

## Verification record

- JavaScript syntax: checked with `node --check app.js`.
- Local static server: started on port 4173; browser-hosted CUA initialization failed because its Windows platform directory was unavailable (`HRESULT 0x80070003`).
- Browserbase could start, but it could not reach this machine's localhost address; its page showed a site-unreachable error. No rendered browser screenshot or click-through result is claimed.
- Remaining verification: inspect the live page at desktop and mobile sizes, exercise create/edit/authorize/export flows in a local browser, and then run accessibility and security review before production use.

## Production gaps

1. Implement authenticated accounts, artist/team roles, server-side validation and consent records.
2. Add PostgreSQL records, encrypted object storage, upload scanning, retention and deletion controls.
3. Select and review two real, compliant promotion adapters. Declare capability, authorization, terms version, territories, rate limits, idempotency and kill switch for each.
4. Build opportunity provenance, contact verification, suppression, duplicate prevention and auditable background execution.
5. Implement an immutable or tamper-evident audit log and robust campaign pause/cancel behavior.
6. Add verified reply, placement, usage and revenue imports with clear evidence and confidence labels.
7. Complete WCAG 2.2 AA, privacy, threat-model, legal and operational review; document Hetzner deployment, backups and rollback.

