# NOTE — Promotion demo

This is the first persistent product slice for NOTE’s artist-first Promotion workflow. The product specification remains in the repository root.

## Run locally

Requires Python 3.10 or later; there are no third-party dependencies.

```sh
python3 server.py
```

Open <http://127.0.0.1:8000>. To use a different local port:

```sh
python3 server.py --port 8010
```

An optional `--db` path must be outside the `demo/` folder, which the service exposes as static files.

Run the service checks with:

```sh
python3 -m unittest -v test_server.py
```

## Included

- Overview dashboard, release readiness, and sample reporting.
- Campaign planning, an editable Song Passport with recording identifiers, contributor notes, and self-reported rights confirmation, plus saved opportunities.
- Approval review and decision history.
- Browser storage fallback plus a local SQLite save service.
- Sample CSV report export.

## Local-demo boundaries

All opportunities and reporting values are fictional examples. The local service binds only to `127.0.0.1` by default; it has no accounts, authentication, encryption, or external integrations. Do not expose it to the internet or enter sensitive, legal, financial, or unreleased artist information. It never sends outreach, publishes content, spends money, or commits anyone to terms. Real-world execution remains disabled.

SQLite data is stored outside the app’s served files, by default under `~/.local/share/note-demo/` (or `$XDG_DATA_HOME/note-demo/`).
