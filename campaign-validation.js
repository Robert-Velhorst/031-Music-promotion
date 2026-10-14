const allowedChannels = new Set([
  "Radio",
  "Blogs & magazines",
  "Podcasts",
  "Creators",
  "Communities",
  "Official platform routes",
  "Sync opportunities",
]);

const isCalendarDate = (value) => {
  if (!value) return true;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value;
};

export function validateCampaignInput(input, trackIds = []) {
  const errors = [];
  const name = String(input.name ?? "").trim();
  const trackId = String(input.trackId ?? "");
  const channels = Array.isArray(input.channels) ? input.channels : [];
  const start = String(input.start ?? "");
  const end = String(input.end ?? "");
  const commitment = Number(input.commitment);

  if (!name) errors.push("Add a campaign name.");
  if (!trackIds.includes(trackId)) errors.push("Choose a track from your Song Passport.");
  if (!channels.length) errors.push("Choose at least one channel category.");
  if (channels.some((channel) => !allowedChannels.has(channel))) {
    errors.push("Choose only supported channel categories.");
  }
  if (!isCalendarDate(start) || !isCalendarDate(end)) {
    errors.push("Enter valid calendar dates.");
  } else if (start && end && end < start) {
    errors.push("End date must be on or after the start date.");
  }
  if (!Number.isInteger(commitment) || commitment < 1 || commitment > 500) {
    errors.push("Qualified activity commitment must be a whole number from 1 to 500.");
  }

  return { valid: errors.length === 0, errors };
}
