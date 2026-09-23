# NOTE — Promotion prototype

This is the first usable slice of NOTE: an artist-first workspace for planning music promotion. The consolidated product plan describes ten possible pillars over time: Store, Library, Production, Community, Publish, Licensing, Promotion, Finance, Education, and Wellness. This project implements the Promotion workflow only; the other pillars are future direction, not features in this prototype.

## Run locally

Requires Python 3.10 or later. The server uses only the Python standard library.

```sh
python3 server.py
```

Open <http://127.0.0.1:8000>. To choose another local port:

```sh
python3 server.py --port 8010
```

An optional `--db` path must be outside the `demo/` folder, which the service exposes as static files.

Run the service checks with:

```sh
python3 -m unittest -v test_server.py
```

## Implemented workflows

- **Artist profile and boundaries:** reusable artist facts, languages, territories, official links, rights organizations, prohibited contexts, and contact preferences.
- **Song Passport:** release details, identifiers, contributors, artist-reported rights and permissions, samples/clearance notes, and a public release link.
- **Advisory release readiness:** completeness guidance with explicit missing items; it does not assess legal clearance or predict outcomes.
- **Campaign planning:** objective, dates, channels, permitted territories and languages, exclusions, action target, budget cap, and a local planning/active/paused/stopped lifecycle. Activation checks the current release and declared boundaries.
- **Opportunity review:** fit explanations, save-for-later, and local suppression. The bundled opportunities are fictional and cannot qualify for real outreach.
- **Approvals and audit trail:** local review decisions and a record of user changes.
- **Outcome ledger and export:** separately records responses, acceptance, publication, usage, placements, revenue, and expenses with source and verification labels. Exports the workspace as JSON.
- **Persistence:** browser storage fallback and a loopback-only SQLite save service.

## Product and prototype boundaries

This implements NOTE Promotion, not NOTE’s other future pillars. It has no user accounts, encryption, audio or artwork upload, real opportunity directory, analytics connections, compliant promotion adapters, streaming integrations, or background jobs. Consequently it cannot contact anyone, publish content, spend money, or carry out licensing or rights actions. Campaign status is a local planning label only. Manually entered outcomes remain unverified unless independently checked; revenue reports include only imported, verified lines.

All seeded artists, campaigns, opportunities, and approvals are fictional examples. Do not enter private contact details, legal or financial records, or unreleased work. The local service binds only to `127.0.0.1` by default and is not intended for internet exposure.

SQLite data is stored outside the served app files, by default under `~/.local/share/note-demo/` (or `$XDG_DATA_HOME/note-demo/`).
