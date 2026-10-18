import test from "node:test";
import assert from "node:assert/strict";
import { validateCampaignInput } from "./campaign-validation.js";

const validCampaign = {
  name: "Release campaign",
  trackId: "track-1",
  channels: ["Radio", "Podcasts"],
  start: "2026-10-20",
  end: "2026-11-20",
  commitment: "12",
};

test("accepts a bounded campaign with a known track and supported channels", () => {
  assert.deepEqual(validateCampaignInput(validCampaign, ["track-1"]), {
    valid: true,
    errors: [],
  });
});

test("rejects missing name, unknown track, and empty channels", () => {
  const result = validateCampaignInput({ ...validCampaign, name: " ", trackId: "missing", channels: [] }, ["track-1"]);
  assert.equal(result.valid, false);
  assert.deepEqual(result.errors, [
    "Add a campaign name.",
    "Choose a track from your Song Passport.",
    "Choose at least one channel category.",
  ]);
});

test("rejects unsupported channel categories and invalid calendar dates", () => {
  const result = validateCampaignInput({
    ...validCampaign,
    channels: ["Direct messages everywhere"],
    start: "2026-02-30",
  }, ["track-1"]);
  assert.match(result.errors.join(" "), /supported channel categories/);
  assert.match(result.errors.join(" "), /valid calendar dates/);
});

test("rejects reversed dates and non-integer or out-of-range commitments", () => {
  for (const commitment of [0, 501, 2.5, "not a number"]) {
    const result = validateCampaignInput({
      ...validCampaign,
      start: "2026-11-20",
      end: "2026-10-20",
      commitment,
    }, ["track-1"]);
    assert.match(result.errors.join(" "), /on or after/);
    assert.match(result.errors.join(" "), /whole number from 1 to 500/);
  }
});
