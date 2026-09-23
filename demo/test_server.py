import json
import tempfile
import threading
import unittest
from pathlib import Path
from urllib.error import HTTPError
from urllib.request import Request, urlopen

from server import APP_DIR, MAX_STATE_BYTES, create_server


SAMPLE_STATE = {
    "artist": {"name": "Demo Artist", "genre": "Indie pop", "song": "Demo Track"},
    "cleanVersion": False,
    "savedOpportunityIds": ["source-1"],
    "campaigns": [
        {
            "id": "campaign-1",
            "title": "Demo Track release plan",
            "release": "Demo Track",
            "goal": "Plan discovery",
            "status": "Planning",
            "completion": 0,
            "updated": "Just now",
            "channels": ["Editorial"],
            "owner": "Demo Artist",
            "releaseDate": "Date to be confirmed",
        }
    ],
    "approvals": [],
    "audit": [],
}


class StateApiTests(unittest.TestCase):
    def setUp(self):
        self.temp_dir = tempfile.TemporaryDirectory()
        self.database_path = Path(self.temp_dir.name) / "test.sqlite3"
        self.server = create_server(self.database_path, port=0)
        self.start_server()

    def start_server(self):
        self.thread = threading.Thread(target=self.server.serve_forever, daemon=True)
        self.thread.start()
        host, port = self.server.server_address
        self.base_url = f"http://{host}:{port}"

    def tearDown(self):
        self.server.shutdown()
        self.server.server_close()
        self.thread.join(timeout=2)
        self.temp_dir.cleanup()

    def request(self, method, path, payload=None, headers=None):
        body = None if payload is None else json.dumps(payload).encode("utf-8")
        request = Request(
            f"{self.base_url}{path}",
            data=body,
            method=method,
            headers={"Content-Type": "application/json", **(headers or {})},
        )
        try:
            response = urlopen(request, timeout=3)
        except HTTPError as error:
            return error.code, error.headers, json.loads(error.read().decode("utf-8"))
        with response:
            content = response.read()
            return response.status, response.headers, json.loads(content) if content else None

    def test_health_endpoint_and_security_headers(self):
        status, headers, body = self.request("GET", "/api/health")
        self.assertEqual(status, 200)
        self.assertEqual(body, {"ok": True})
        self.assertEqual(headers.get("X-Content-Type-Options"), "nosniff")
        self.assertEqual(headers.get("X-Frame-Options"), "DENY")

    def test_server_delivers_the_app_and_its_local_script(self):
        with urlopen(f"{self.base_url}/", timeout=3) as response:
            self.assertEqual(response.status, 200)
            page = response.read().decode("utf-8")
        self.assertIn("NOTE — Artist workspace", page)

        with urlopen(f"{self.base_url}/app.js", timeout=3) as response:
            self.assertEqual(response.status, 200)
            script = response.read().decode("utf-8")
        self.assertIn("loadServerState();", script)

    def test_state_is_empty_until_first_save(self):
        status, _, body = self.request("GET", "/api/state")
        self.assertEqual(status, 200)
        self.assertIsNone(body["state"])

    def test_state_round_trips_through_sqlite(self):
        status, _, saved = self.request("PUT", "/api/state", SAMPLE_STATE)
        self.assertEqual(status, 200)
        self.assertTrue(saved["saved"])

        status, _, loaded = self.request("GET", "/api/state")
        self.assertEqual(status, 200)
        self.assertEqual(loaded["state"], SAMPLE_STATE)

    def test_state_survives_server_restart(self):
        self.request("PUT", "/api/state", SAMPLE_STATE)
        self.server.shutdown()
        self.server.server_close()
        self.thread.join(timeout=2)

        self.server = create_server(self.database_path, port=0)
        self.start_server()
        status, _, loaded = self.request("GET", "/api/state")

        self.assertEqual(status, 200)
        self.assertEqual(loaded["state"], SAMPLE_STATE)

    def test_malformed_state_is_rejected_without_overwriting_saved_data(self):
        self.request("PUT", "/api/state", SAMPLE_STATE)
        status, _, body = self.request("PUT", "/api/state", {"artist": "not-an-object"})
        self.assertEqual(status, 400)
        self.assertEqual(body["error"], "Invalid state payload")

        _, _, loaded = self.request("GET", "/api/state")
        self.assertEqual(loaded["state"], SAMPLE_STATE)

    def test_oversized_request_is_rejected_before_reading_body(self):
        request = Request(
            f"{self.base_url}/api/state",
            data=None,
            method="PUT",
            headers={"Content-Type": "application/json", "Content-Length": str(MAX_STATE_BYTES + 1)},
        )
        with self.assertRaises(HTTPError) as error:
            urlopen(request, timeout=3)
        self.assertEqual(error.exception.code, 413)

    def test_cross_origin_write_is_rejected(self):
        status, _, body = self.request(
            "PUT", "/api/state", SAMPLE_STATE, {"Origin": "http://untrusted.invalid"}
        )
        self.assertEqual(status, 403)
        self.assertEqual(body["error"], "Origin not allowed")

    def test_non_json_state_is_rejected(self):
        status, _, body = self.request(
            "PUT", "/api/state", SAMPLE_STATE, {"Content-Type": "text/plain"}
        )
        self.assertEqual(status, 415)
        self.assertEqual(body["error"], "Content-Type must be application/json")

    def test_untrusted_host_header_is_rejected(self):
        status, _, body = self.request(
            "GET", "/api/health", headers={"Host": "attacker.invalid"}
        )
        self.assertEqual(status, 421)
        self.assertEqual(body["error"], "Host not allowed")

    def test_server_refuses_to_bind_to_a_public_interface(self):
        with self.assertRaisesRegex(ValueError, "only bind to localhost"):
            create_server(Path(self.temp_dir.name) / "public.sqlite3", host="0.0.0.0", port=0)

    def test_server_refuses_database_inside_the_served_demo_folder(self):
        with self.assertRaisesRegex(ValueError, "outside the served demo folder"):
            create_server(APP_DIR / "exposed.sqlite3", port=0)


if __name__ == "__main__":
    unittest.main()
