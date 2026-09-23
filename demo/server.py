"""Loopback-only persistence service for the NOTE Promotion demo.

This is intentionally a local development server, not a production API. It has
no user accounts, cloud database, external integrations, or outbound actions.
"""

from __future__ import annotations

import argparse
import json
import os
import sqlite3
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit


APP_DIR = Path(__file__).resolve().parent
MAX_STATE_BYTES = 1_048_576
MAX_CAMPAIGNS = 100
MAX_APPROVALS = 200
MAX_AUDIT_EVENTS = 200
ALLOWED_HOSTS = {"127.0.0.1", "localhost"}


def default_database_path() -> Path:
    data_root = Path(os.environ.get("XDG_DATA_HOME", Path.home() / ".local" / "share"))
    return data_root / "note-demo" / "note-demo.sqlite3"


def initialize_database(database_path: Path) -> None:
    database_path.parent.mkdir(parents=True, exist_ok=True)
    with sqlite3.connect(database_path) as connection:
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS demo_state (
                id INTEGER PRIMARY KEY CHECK (id = 1),
                payload TEXT NOT NULL,
                updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
            )
            """
        )


def _is_text(value, maximum: int, *, allow_empty: bool = False) -> bool:
    return (
        isinstance(value, str)
        and len(value) <= maximum
        and (allow_empty or bool(value.strip()))
    )


def _is_text_list(value, maximum_items: int, maximum_length: int) -> bool:
    return (
        isinstance(value, list)
        and len(value) <= maximum_items
        and all(_is_text(item, maximum_length, allow_empty=False) for item in value)
    )


def validate_state(state) -> bool:
    """Validate the small, local demo state before storing it as JSON."""
    if not isinstance(state, dict):
        return False

    artist = state.get("artist")
    if not isinstance(artist, dict) or not all(
        _is_text(artist.get(field), maximum)
        for field, maximum in (("name", 100), ("genre", 80), ("song", 100))
    ):
        return False

    if not isinstance(state.get("cleanVersion"), bool):
        return False
    if not _is_text_list(state.get("savedOpportunityIds"), 100, 100):
        return False

    campaigns = state.get("campaigns")
    if not isinstance(campaigns, list) or len(campaigns) > MAX_CAMPAIGNS:
        return False
    for campaign in campaigns:
        if not isinstance(campaign, dict):
            return False
        if not all(
            _is_text(campaign.get(field), maximum)
            for field, maximum in (
                ("id", 120),
                ("title", 120),
                ("release", 100),
                ("goal", 300),
                ("status", 20),
                ("updated", 40),
                ("owner", 100),
                ("releaseDate", 60),
            )
        ):
            return False
        if campaign["status"] not in {"Planning", "Active", "Completed"}:
            return False
        completion = campaign.get("completion")
        if isinstance(completion, bool) or not isinstance(completion, int) or not 0 <= completion <= 100:
            return False
        if not _is_text_list(campaign.get("channels"), 20, 80):
            return False

    approvals = state.get("approvals")
    if not isinstance(approvals, list) or len(approvals) > MAX_APPROVALS:
        return False
    valid_approval_statuses = {"Pending", "Approved in demo", "Declined"}
    for approval in approvals:
        if not isinstance(approval, dict):
            return False
        if not all(
            _is_text(approval.get(field), maximum)
            for field, maximum in (
                ("id", 120),
                ("kind", 80),
                ("icon", 40),
                ("title", 180),
                ("description", 500),
                ("detail", 800),
                ("requestedBy", 100),
                ("requested", 60),
                ("status", 24),
            )
        ):
            return False
        if approval["status"] not in valid_approval_statuses:
            return False
        opportunity_id = approval.get("opportunityId")
        if opportunity_id is not None and not _is_text(opportunity_id, 100):
            return False

    audit = state.get("audit")
    if not isinstance(audit, list) or len(audit) > MAX_AUDIT_EVENTS:
        return False
    for event in audit:
        if not isinstance(event, dict) or not all(
            _is_text(event.get(field), maximum)
            for field, maximum in (("text", 300), ("by", 100), ("time", 60))
        ):
            return False

    return True


def create_handler(database_path: Path):
    database_path = Path(database_path)

    class NoteRequestHandler(SimpleHTTPRequestHandler):
        server_version = "NOTE-Demo"
        sys_version = ""

        def __init__(self, *args, **kwargs):
            super().__init__(*args, directory=str(APP_DIR), **kwargs)

        def log_message(self, _format, *_args):
            # Keep local artist and release data out of request logs.
            return

        def end_headers(self):
            self.send_header("X-Content-Type-Options", "nosniff")
            self.send_header("X-Frame-Options", "DENY")
            self.send_header("Referrer-Policy", "no-referrer")
            self.send_header(
                "Content-Security-Policy",
                "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; "
                "connect-src 'self'; img-src 'self' data:; font-src 'self'; "
                "object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'",
            )
            super().end_headers()

        def _host_name(self) -> str:
            raw_host = self.headers.get("Host", "")
            if raw_host.startswith("["):
                return ""
            return raw_host.partition(":")[0].strip().lower()

        def _trusted_request(self) -> bool:
            host_name = self._host_name()
            if host_name not in ALLOWED_HOSTS:
                self._send_error_json(421, "Host not allowed")
                return False

            origin = self.headers.get("Origin")
            if origin:
                parsed_origin = urlsplit(origin)
                origin_host = (parsed_origin.hostname or "").lower()
                if parsed_origin.scheme != "http" or origin_host not in ALLOWED_HOSTS or origin_host != host_name:
                    self._send_error_json(403, "Origin not allowed")
                    return False
            return True

        def _send_json(self, status: int, payload: dict):
            encoded = json.dumps(payload, ensure_ascii=False, separators=(",", ":")).encode("utf-8")
            self.send_response(status)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Cache-Control", "no-store")
            self.send_header("Content-Length", str(len(encoded)))
            self.end_headers()
            self.wfile.write(encoded)

        def _send_error_json(self, status: int, message: str):
            self._send_json(status, {"error": message})

        def do_GET(self):
            if not self._trusted_request():
                return
            path = urlsplit(self.path).path
            if path == "/api/health":
                self._send_json(200, {"ok": True})
                return
            if path == "/api/state":
                with sqlite3.connect(database_path) as connection:
                    row = connection.execute(
                        "SELECT payload, updated_at FROM demo_state WHERE id = 1"
                    ).fetchone()
                if row is None:
                    self._send_json(200, {"state": None, "updated_at": None})
                    return
                self._send_json(200, {"state": json.loads(row[0]), "updated_at": row[1]})
                return
            if path.startswith("/api/"):
                self._send_error_json(404, "Not found")
                return
            super().do_GET()

        def do_PUT(self):
            if not self._trusted_request():
                return
            if urlsplit(self.path).path != "/api/state":
                self._send_error_json(404, "Not found")
                return

            content_type = self.headers.get("Content-Type", "").split(";", 1)[0].strip().lower()
            if content_type != "application/json":
                self._send_error_json(415, "Content-Type must be application/json")
                return

            raw_length = self.headers.get("Content-Length")
            try:
                content_length = int(raw_length) if raw_length is not None else -1
            except ValueError:
                content_length = -1
            if content_length < 0:
                self._send_error_json(411, "Content-Length is required")
                return
            if content_length > MAX_STATE_BYTES:
                self._send_error_json(413, "State payload is too large")
                return

            try:
                state = json.loads(self.rfile.read(content_length).decode("utf-8"))
            except (UnicodeDecodeError, json.JSONDecodeError):
                self._send_error_json(400, "Malformed JSON payload")
                return
            if not validate_state(state):
                self._send_error_json(400, "Invalid state payload")
                return

            encoded_state = json.dumps(state, ensure_ascii=False, separators=(",", ":"))
            with sqlite3.connect(database_path) as connection:
                connection.execute(
                    """
                    INSERT INTO demo_state (id, payload, updated_at)
                    VALUES (1, ?, strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
                    ON CONFLICT(id) DO UPDATE SET
                        payload = excluded.payload,
                        updated_at = excluded.updated_at
                    """,
                    (encoded_state,),
                )
            self._send_json(200, {"saved": True})

        def do_POST(self):
            if not self._trusted_request():
                return
            self._send_error_json(405, "Method not allowed")

        def do_DELETE(self):
            if not self._trusted_request():
                return
            self._send_error_json(405, "Method not allowed")

    return NoteRequestHandler


def create_server(database_path: Path, host: str = "127.0.0.1", port: int = 8000):
    if host not in ALLOWED_HOSTS:
        raise ValueError("The demo server may only bind to localhost or 127.0.0.1")
    database_path = Path(database_path).expanduser().resolve()
    initialize_database(database_path)
    return ThreadingHTTPServer((host, port), create_handler(database_path))


def main():
    parser = argparse.ArgumentParser(description="Run the NOTE Promotion demo on this device.")
    parser.add_argument("--host", default="127.0.0.1", choices=sorted(ALLOWED_HOSTS))
    parser.add_argument("--port", type=int, default=8000)
    parser.add_argument("--db", type=Path, default=default_database_path())
    args = parser.parse_args()

    server = create_server(args.db, host=args.host, port=args.port)
    print(f"NOTE demo available at http://{args.host}:{server.server_port}")
    print(f"Local demo state is stored in {Path(args.db).expanduser().resolve()}")
    print("Press Ctrl+C to stop. This server must not be exposed to the internet.")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping NOTE demo.")
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
