(function () {
  "use strict";

  const STORAGE_KEY = "note-promotion-demo-v1";
  const seed = {
    artist: { name: "Mara Bloom", genre: "Indie pop" },
    profile: { bio: "Independent artist making late-night indie pop.", homeTerritory: "GB", languages: ["English"], territories: ["GB"], website: "", socialProfiles: "", distributor: "", publisher: "", proCmo: "", neighbouringRights: "", prohibitedAssociations: "", contactPreferences: "Artist approval before any external contact." },
    release: { id: "glasshouse", title: "Glasshouse", version: "", kind: "Single", releaseDate: "2026-10-23", duration: "3:42", explicit: false, language: "English", territories: ["GB"], isrc: "", iswc: "", upc: "", publicLink: "", description: "A late-night song about finding your way back to yourself.", contributors: "Mara Bloom — songwriter, vocals; Ellis Park — producer", distributor: "", publisher: "", proCmo: "", masterOwnership: "Artist-reported; not verified", compositionSplits: "", sampleStatus: "Not declared", permittedUses: ["Editorial consideration", "Radio consideration"], rightsEvidenceNote: "", rightsConfirmed: true },
    readinessRun: null,
    cleanVersion: false,
    savedOpportunityIds: ["new-frequencies", "tidepool", "signal-bloom", "porchlight"],
    suppressedOpportunityIds: [],
    outcomes: [],
    campaigns: [
      { id: "glasshouse-release", title: "Glasshouse — Release campaign", release: "Glasshouse", goal: "Build thoughtful discovery around your next single", status: "Planning", completion: 67, updated: "Sep 18", channels: ["Editorial", "Radio", "Press"], owner: "Mara Bloom", releaseDate: "Oct 23, 2026", startDate: "2026-09-25", endDate: "2026-11-06", territories: ["GB"], languages: ["English"], exclusions: "No pay-to-play or guaranteed-placement services.", plannedQualifiedActions: null, budgetCap: 0, budgetCurrency: "EUR", freeActionPermission: false, autopilotAuthorized: false },
      { id: "soft-focus", title: "Soft Focus — Discovery campaign", release: "Soft Focus EP", goal: "Reconnect with listeners who found the EP", status: "Active", completion: 86, updated: "Sep 16", channels: ["Editorial", "Community"], owner: "Ellis Park", releaseDate: "Sep 04, 2026", startDate: "2026-09-04", endDate: "2026-10-04", territories: ["GB"], languages: ["English"], exclusions: "No undisclosed paid placement.", plannedQualifiedActions: null, budgetCap: 0, budgetCurrency: "EUR", freeActionPermission: false, autopilotAuthorized: false }
    ],
    approvals: [
      { id: "approval-campaign", kind: "Campaign plan", icon: "icon-spark", title: "Glasshouse · Campaign outline", description: "Ellis has prepared the release plan and is asking you to review its timing, channels, and next steps.", detail: "This approval marks the draft as ready for your team to work from. It does not publish anything or contact anyone.", requestedBy: "Ellis Park", requested: "Sep 18", status: "Pending" },
      { id: "approval-draft", kind: "Draft preparation", icon: "icon-edit", title: "New Frequencies · Draft intro", description: "Review a proposed short introduction before it is added to the campaign workspace.", detail: "Approving only lets your team prepare a draft for you to review. No email or pitch will be sent.", requestedBy: "Ellis Park", requested: "Sep 19", status: "Pending" },
      { id: "approval-spend", kind: "Paid opportunity", icon: "icon-lock", title: "Sample editorial package · $150", description: "A fictional paid placement proposal has been added for your consideration.", detail: "This is a sample item. Approving it records your demo decision only; it cannot spend money or reserve a placement.", requestedBy: "NOTE sample data", requested: "Sep 20", status: "Pending" }
    ],
    audit: []
  };

  const opportunities = [
    { id: "new-frequencies", initials: "nf", name: "New Frequencies", category: "Editorial", type: "Independent editorial", description: "A small editorial series focused on emerging, self-releasing artists with an intimate, left-of-center sound.", tags: ["Strong genre fit", "Accepts singles", "No fee listed"], why: ["Features emerging independent artists", "Accepts releases in the four weeks before launch", "Looks for intimate vocal-forward production"], source: "Fictional example source · sample data", genres: ["Indie pop", "Alternative"], territories: ["GB"], formats: ["Single", "EP"], windowStart: "2026-09-25", windowEnd: "2026-10-02", sourceVerified: false, contactVerified: false, termsReviewed: false, risk: "Unreviewed", costState: "Not verified" },
    { id: "tidepool", initials: "tp", name: "Tidepool Sessions", category: "Live", type: "Live session series", description: "An intimate filmed session format for new voices and stripped-back arrangements.", tags: ["Strong sound fit", "London-based", "Terms need review"], why: ["Acoustic arrangements are a regular part of the series", "The next recording window aligns with your release", "Travel and usage terms should be confirmed before you commit"], source: "Fictional example source · sample data", genres: ["Indie pop", "Folk"], territories: ["GB"], formats: ["Single", "EP"], windowStart: "2026-09-25", windowEnd: "2026-11-06", sourceVerified: false, contactVerified: false, termsReviewed: false, risk: "Unreviewed", costState: "Terms not verified" },
    { id: "signal-bloom", initials: "sb", name: "Signal Bloom Radio", category: "Radio", type: "Independent radio show", description: "A weekly radio hour sharing new alternative pop and artist stories with listeners across the UK.", tags: ["Genre fit", "UK audience", "No fee listed"], why: ["Regularly features alternative pop releases", "Audience geography matches your stated market", "The show requests a short artist introduction"], source: "Fictional example source · sample data", genres: ["Indie pop", "Alternative"], territories: ["GB"], formats: ["Single", "EP", "Album"], windowStart: "2026-09-25", windowEnd: "2026-11-20", sourceVerified: false, contactVerified: false, termsReviewed: false, risk: "Unreviewed", costState: "Not verified" },
    { id: "porchlight", initials: "p", name: "Porchlight Picks", category: "Editorial", type: "Independent editorial", description: "A listening column about songs made for slow mornings and late-evening walks.", tags: ["Mood fit", "Accepts singles", "No fee listed"], why: ["The music mood matches recent features", "Accepts independent artist submissions", "Editorial timeline is compatible with your planned release"], source: "Fictional example source · sample data", genres: ["Indie pop", "Folk", "Electronic"], territories: ["GB", "IE"], formats: ["Single", "EP"], windowStart: "2026-09-25", windowEnd: "2026-10-23", sourceVerified: false, contactVerified: false, termsReviewed: false, risk: "Unreviewed", costState: "Not verified" },
    { id: "field-notes", initials: "fn", name: "Field Notes Live", category: "Live", type: "Showcase opportunity", description: "A community-run listening night that pairs emerging artists with local music audiences.", tags: ["Community fit", "London", "Details to confirm"], why: ["Highlights developing local artists", "Based in a market you selected", "Lineup, ticket terms, and recording permissions need review"], source: "Fictional example source · sample data", genres: ["Indie pop", "Alternative", "Soul"], territories: ["GB"], formats: ["Single", "EP", "Album"], windowStart: "2026-10-01", windowEnd: "2026-11-30", sourceVerified: false, contactVerified: false, termsReviewed: false, risk: "Unreviewed", costState: "Terms not verified" },
    { id: "soft-static", initials: "ss", name: "Soft Static", category: "Radio", type: "Podcast & radio", description: "A monthly conversation and listening session about how new independent music gets made.", tags: ["Story fit", "Interview format", "No fee listed"], why: ["Focuses on artist-led stories", "Pairs a conversation with a short music feature", "Review interview time commitment before replying"], source: "Fictional example source · sample data", genres: ["Indie pop", "Alternative", "Electronic"], territories: ["GB", "IE"], formats: ["Single", "EP", "Album"], windowStart: "2026-10-01", windowEnd: "2026-12-15", sourceVerified: false, contactVerified: false, termsReviewed: false, risk: "Unreviewed", costState: "Not verified" }
  ];

  function mergeState(stored) {
    const source = stored && typeof stored === "object" ? stored : {};
    const artist = { ...seed.artist, ...(source.artist || {}) };
    const legacyTitle = artist.song;
    delete artist.song;
    const profile = { ...seed.profile, ...(source.profile || {}) };
    profile.languages = Array.isArray(profile.languages) ? profile.languages : [...seed.profile.languages];
    profile.territories = Array.isArray(profile.territories) ? profile.territories : [...seed.profile.territories];
    const release = { ...seed.release, ...(source.release || {}) };
    if (!source.release && legacyTitle) release.title = legacyTitle;
    release.territories = Array.isArray(release.territories) ? release.territories : [...seed.release.territories];
    return {
      ...JSON.parse(JSON.stringify(seed)),
      ...source,
      artist,
      profile,
      release,
      campaigns: Array.isArray(source.campaigns) ? source.campaigns.map((campaign) => ({
        ...JSON.parse(JSON.stringify(seed.campaigns[0])),
        ...campaign,
        territories: Array.isArray(campaign.territories) ? campaign.territories : [...release.territories],
        languages: Array.isArray(campaign.languages) ? campaign.languages : [release.language || "English"],
        channels: Array.isArray(campaign.channels) ? campaign.channels : []
      })) : JSON.parse(JSON.stringify(seed.campaigns)),
      approvals: Array.isArray(source.approvals) ? source.approvals : JSON.parse(JSON.stringify(seed.approvals)),
      audit: Array.isArray(source.audit) ? source.audit : JSON.parse(JSON.stringify(seed.audit)),
      savedOpportunityIds: Array.isArray(source.savedOpportunityIds) ? source.savedOpportunityIds : [...seed.savedOpportunityIds],
      suppressedOpportunityIds: Array.isArray(source.suppressedOpportunityIds) ? source.suppressedOpportunityIds : [],
      outcomes: Array.isArray(source.outcomes) ? source.outcomes : [],
      readinessRun: source.readinessRun && typeof source.readinessRun === "object" ? source.readinessRun : null
    };
  }

  function readState() {
    try {
      return mergeState(JSON.parse(localStorage.getItem(STORAGE_KEY) || "null"));
    } catch (_) {
      return mergeState(seed);
    }
  }

  let state = readState();
  let activeCampaignFilter = "all";
  let activeOpportunityFilter = "All";
  let opportunitySort = "fit";
  let lastFocused = null;
  let serverPersistence = false;
  let persistenceTimer = null;
  let persistenceWarningShown = false;
  let stateRevision = 0;
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const escapeHTML = (value) => String(value ?? "").replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);

  function save() {
    stateRevision += 1;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
    catch (_) { /* The demo still works for this session if browser storage is unavailable. */ }
    if (serverPersistence) {
      window.clearTimeout(persistenceTimer);
      persistenceTimer = window.setTimeout(() => {
        fetch("/api/state", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(state)
        }).then((response) => {
          if (!response.ok) throw new Error("Local save failed");
        }).catch(() => {
          serverPersistence = false;
          if (!persistenceWarningShown) {
            persistenceWarningShown = true;
            notify("The local save service disconnected. Changes remain in browser storage.", true);
          }
        });
      }, 120);
    }
  }

  async function loadServerState() {
    if (!(location.protocol === "http:" || location.protocol === "https:")) return;
    const revisionAtRequest = stateRevision;
    try {
      const response = await fetch("/api/state", { headers: { "Accept": "application/json" } });
      if (!response.ok) return;
      const result = await response.json();
      serverPersistence = true;
      if (stateRevision !== revisionAtRequest) {
        const saveResponse = await fetch("/api/state", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(state)
        });
        if (!saveResponse.ok) throw new Error("Initial local save failed");
      } else if (result.state) {
        state = mergeState(result.state);
      } else {
        const saveResponse = await fetch("/api/state", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(state)
        });
        if (!saveResponse.ok) throw new Error("Initial local save failed");
      }
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
      catch (_) { /* SQLite remains the source of persistence in server mode. */ }
      render();
    } catch (_) {
      serverPersistence = false;
    }
  }

  function addAudit(text) {
    state.audit.unshift({ text, by: state.artist.name, time: "Just now · Demo" });
    state.audit = state.audit.slice(0, 6);
  }

  function opportunityFit(item) {
    const genreMatches = item.genres.some((genre) => genre.toLowerCase() === String(state.artist.genre || "").trim().toLowerCase());
    const territoryMatches = item.territories.some((territory) => state.profile.territories.includes(territory));
    const formatMatches = item.formats.includes(state.release.kind);
    const releaseDate = state.release.releaseDate;
    const withinWindow = Boolean(releaseDate && releaseDate >= item.windowStart && releaseDate <= item.windowEnd);
    return Math.min(100, (genreMatches ? 35 : 12) + (territoryMatches ? 25 : 5) + (formatMatches ? 20 : 8) + (withinWindow ? 20 : 5));
  }

  function opportunityFitSignals(item) {
    const genreMatches = item.genres.some((genre) => genre.toLowerCase() === String(state.artist.genre || "").trim().toLowerCase());
    const territoryMatches = item.territories.some((territory) => state.profile.territories.includes(territory));
    const formatMatches = item.formats.includes(state.release.kind);
    const releaseDate = state.release.releaseDate;
    const withinWindow = Boolean(releaseDate && releaseDate >= item.windowStart && releaseDate <= item.windowEnd);
    return [
      `${genreMatches ? "Genre" : "Genre"} ${genreMatches ? "matches" : "is not an exact match"} · ${item.genres.join(", ")}`,
      `Territory ${territoryMatches ? "overlaps" : "does not overlap"} · ${item.territories.join(", ")}`,
      `Release type ${formatMatches ? "is listed" : "is not listed"} · ${item.formats.join(", ")}`,
      `Release date ${withinWindow ? "falls inside" : "falls outside"} the sample window · ${item.windowStart} to ${item.windowEnd}`
    ];
  }

  function opportunityQualification(item) {
    const blockers = [];
    if (state.suppressedOpportunityIds.includes(item.id)) blockers.push("This source is on your do-not-contact list.");
    if (!item.sourceVerified) blockers.push("The source is a fictional demo entry, not a verified organization.");
    if (!item.contactVerified) blockers.push("No contact route has been verified.");
    if (!item.termsReviewed) blockers.push("Requirements and terms have not been reviewed.");
    if (item.risk !== "Clear") blockers.push("Source reputation and policy risk have not been cleared.");
    return { qualified: blockers.length === 0, blockers };
  }

  function notify(message, isError = false) {
    const toast = document.createElement("div");
    toast.className = `toast${isError ? " error" : ""}`;
    toast.innerHTML = `<span class="icon ${isError ? "icon-info" : "icon-check"}" aria-hidden="true"></span><span>${escapeHTML(message)}</span>`;
    $("#toast-region").append(toast);
    window.setTimeout(() => { toast.classList.add("fade"); window.setTimeout(() => toast.remove(), 220); }, 3400);
  }

  const modalBackdrop = $("#modal-backdrop");
  const modalContent = $("#modal-content");
  const modalTitle = (title, lede) => `<h2 id="modal-title">${escapeHTML(title)}</h2><p class="modal-lede" id="modal-description">${escapeHTML(lede)}</p>`;

  function openModal(html, icon = "icon-spark") {
    lastFocused = document.activeElement;
    $("#modal-icon").innerHTML = `<span class="icon ${icon}" aria-hidden="true"></span>`;
    modalContent.innerHTML = html;
    modalBackdrop.hidden = false;
    document.body.style.overflow = "hidden";
    window.setTimeout(() => $("#modal-close").focus(), 0);
  }

  function closeModal() {
    modalBackdrop.hidden = true;
    document.body.style.overflow = "";
    if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
  }

  function showView(viewName) {
    const view = document.getElementById(`view-${viewName}`);
    if (!view) return;
    $$(".page-view").forEach((page) => page.classList.toggle("active", page === view));
    $$(".nav-item[data-view]").forEach((item) => item.classList.toggle("active", item.dataset.view === viewName));
    const name = viewName === "passport" ? "Song Passport" : viewName.charAt(0).toUpperCase() + viewName.slice(1);
    $("#breadcrumb-page").textContent = name;
    document.title = `NOTE — ${name}`;
    closeSidebar();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function openSidebar() {
    $("#sidebar").classList.add("open");
    $("#sidebar-scrim").classList.add("visible");
    $("#close-menu").focus();
  }
  function closeSidebar() {
    $("#sidebar").classList.remove("open");
    $("#sidebar-scrim").classList.remove("visible");
  }

  function renderCampaigns() {
    const visible = state.campaigns.filter((campaign) => activeCampaignFilter === "all" || campaign.status === activeCampaignFilter);
    $("#campaign-count").textContent = state.campaigns.filter((campaign) => campaign.status !== "Completed").length;
    $("#all-campaign-count").textContent = state.campaigns.length;
    const activeCount = state.campaigns.filter((campaign) => campaign.status === "Active").length;
    const planningCount = state.campaigns.filter((campaign) => campaign.status === "Planning").length;
    $("#active-campaigns").textContent = String(activeCount).padStart(2, "0");
    $("#active-campaigns-foot").textContent = `${planningCount} planning · ${activeCount} active`;
    $$("[data-campaign-filter]").forEach((tab) => {
      const selected = tab.dataset.campaignFilter === activeCampaignFilter;
      tab.classList.toggle("active", selected);
      tab.setAttribute("aria-selected", String(selected));
    });
    if (!visible.length) {
      $("#campaign-list").innerHTML = `<div class="empty-state"><span class="icon icon-spark" aria-hidden="true"></span><h2>No ${escapeHTML(activeCampaignFilter.toLowerCase())} campaigns yet</h2><p>When you create one, its plan and next steps will show up here.</p><button class="button button-primary" data-action="new-campaign"><span class="icon icon-plus"></span> New campaign</button></div>`;
      return;
    }
    $("#campaign-list").innerHTML = visible.map((campaign) => {
      const statusClass = ["Planning", "Paused", "Stopped"].includes(campaign.status) ? "planning" : campaign.status === "Completed" ? "complete" : "";
      const artClass = campaign.status === "Active" ? "live" : ["Completed", "Stopped"].includes(campaign.status) ? "archive" : "";
      const title = escapeHTML(campaign.title);
      const artTitle = campaign.release.split(" ").slice(0, 2).map(escapeHTML).join("<br>");
      const completion = campaignPlanCompletion(campaign);
      return `<article class="campaign-card panel"><div class="campaign-card-main"><div class="campaign-art ${artClass}" aria-hidden="true">${artTitle}</div><div class="campaign-main-copy"><div class="campaign-title-line"><h2>${title}</h2><span class="state-pill ${statusClass}"><span class="status-dot"></span>${escapeHTML(campaign.status)}</span></div><p class="campaign-subtitle">${escapeHTML(campaign.goal)}</p><div class="campaign-meta"><span><span class="icon icon-music"></span>${escapeHTML(campaign.release)}</span><span><span class="icon icon-calendar">◷</span>${escapeHTML(campaign.releaseDate || "Date to be confirmed")}</span><span><span class="icon icon-users"></span>${escapeHTML(campaign.channels.join(" · "))}</span></div></div><div class="campaign-progress"><strong>${completion}% plan details</strong><div class="campaign-progress-track"><span style="width:${completion}%"></span></div><span>Updated ${escapeHTML(campaign.updated)}</span></div></div><div class="campaign-bottom"><div class="team-stack" aria-label="Campaign owner"><span class="team-mini">${escapeHTML((campaign.owner || state.artist.name).split(/\s+/).map((part) => part[0] || "").join("").slice(0, 2).toUpperCase())}</span><span class="campaign-team-label">${escapeHTML(campaign.owner || state.artist.name)}</span></div><div class="campaign-actions"><button class="text-link" data-action="campaign-checklist" data-id="${escapeHTML(campaign.id)}">View readiness</button><button class="button button-secondary" data-action="campaign-open" data-id="${escapeHTML(campaign.id)}">Open campaign <span aria-hidden="true">→</span></button></div></div></article>`;
    }).join("");
  }

  function campaignPlanCompletion(campaign) {
    const requirements = [
      Boolean(campaign.title), Boolean(campaign.goal), Boolean(campaign.startDate),
      Boolean(campaign.endDate), Array.isArray(campaign.territories) && campaign.territories.length > 0,
      Array.isArray(campaign.languages) && campaign.languages.length > 0,
      Array.isArray(campaign.channels) && campaign.channels.length > 0,
      Boolean(campaign.exclusions.trim())
    ];
    return Math.round((requirements.filter(Boolean).length / requirements.length) * 100);
  }

  function renderOpportunities() {
    const list = opportunities
      .filter((item) => !state.suppressedOpportunityIds.includes(item.id))
      .filter((item) => activeOpportunityFilter === "All" || item.category === activeOpportunityFilter)
      .sort((a, b) => opportunitySort === "fit" ? opportunityFit(b) - opportunityFit(a) : a.name.localeCompare(b.name));
    $("#saved-opportunities").textContent = String(state.savedOpportunityIds.length).padStart(2, "0");
    $(".matched-count").textContent = `${list.length} FICTIONAL EXAMPLES · NONE VERIFIED`;
    $$("[data-opportunity-filter]").forEach((tab) => {
      const selected = tab.dataset.opportunityFilter === activeOpportunityFilter;
      tab.classList.toggle("active", selected);
      tab.setAttribute("aria-selected", String(selected));
    });
    $("#opportunity-list").innerHTML = list.map((item) => {
      const saved = state.savedOpportunityIds.includes(item.id);
      const logoClass = item.category === "Radio" ? "radio" : item.category === "Live" ? "live" : "editorial";
      const tags = item.tags.map((tag) => `<span>${escapeHTML(tag)}</span>`).join("");
      const score = opportunityFit(item);
      const status = opportunityQualification(item);
      return `<article class="opportunity-card panel"><div class="opportunity-logo ${logoClass}" aria-hidden="true">${escapeHTML(item.initials.toUpperCase())}</div><div class="opportunity-main"><div class="opportunity-title-row"><h2>${escapeHTML(item.name)}</h2><span class="verified-label">● Fictional example</span><span class="match-label">${escapeHTML(item.category)}</span></div><p class="opportunity-description">${escapeHTML(item.description)}</p><div class="opportunity-tags">${tags}</div><p class="qualification-note"><span class="icon icon-info" aria-hidden="true"></span> ${status.qualified ? "Qualified for review" : "Not qualified for outreach · sample only"}</p></div><div class="opportunity-actions"><span class="fit-score">FIT <strong>${score}%</strong></span><button class="button save-button ${saved ? "saved" : ""}" data-action="toggle-save" data-id="${escapeHTML(item.id)}"><span aria-hidden="true">${saved ? "✓" : "+"}</span> ${saved ? "Saved" : "Save for later"}</button><button class="text-link opportunity-detail-link" data-action="opportunity-details" data-id="${escapeHTML(item.id)}">Why this fit? <span aria-hidden="true">→</span></button></div></article>`;
    }).join("") || `<div class="empty-state"><span class="icon icon-compass" aria-hidden="true"></span><h2>No matches in this category yet</h2><p>Try another category to see more sample opportunities.</p></div>`;
  }

  function renderApprovals() {
    const pending = state.approvals.filter((item) => item.status === "Pending");
    $("#approval-count").textContent = pending.length;
    $("#pending-approvals").textContent = String(pending.length).padStart(2, "0");
    $("#approval-summary-count").textContent = pending.length === 1 ? "1 item needs your review" : `${pending.length} items need your review`;
    if (!pending.length) {
      $("#approval-summary-count").textContent = "You’re all caught up";
      $("#approval-list").innerHTML = `<div class="empty-state"><span class="icon icon-check" aria-hidden="true"></span><h2>No decisions waiting</h2><p>Anything that needs your approval will be listed here.</p></div>`;
    } else {
      $("#approval-list").innerHTML = pending.map((item) => `<article class="approval-card panel"><span class="approval-icon ${item.kind === "Paid opportunity" ? "money" : item.kind === "Rights" ? "rights" : ""}"><span class="icon ${escapeHTML(item.icon)}" aria-hidden="true"></span></span><div class="approval-copy"><h2>${escapeHTML(item.title)}</h2><p>${escapeHTML(item.description)}</p><div class="approval-meta"><span>${escapeHTML(item.kind)}</span><span>Requested by ${escapeHTML(item.requestedBy)}</span><span>${escapeHTML(item.requested)}</span></div></div><div class="approval-buttons"><button class="button button-quiet" data-action="later" data-id="${escapeHTML(item.id)}">Leave for later</button><button class="button button-primary" data-action="approval-details" data-id="${escapeHTML(item.id)}">Review</button></div></article>`).join("");
    }
    $("#audit-list").innerHTML = state.audit.length
      ? state.audit.slice(0, 5).map((entry) => `<div class="audit-row"><span class="icon icon-check" aria-hidden="true"></span><span><strong>${escapeHTML(entry.text)}</strong> · ${escapeHTML(entry.by)}</span><time>${escapeHTML(entry.time)}</time></div>`).join("")
      : `<p class="readiness-empty">Your local decisions and changes will appear here.</p>`;
  }

  function renderArtist() {
    const name = escapeHTML(state.artist.name);
    const release = state.release;
    const parsedDate = release.releaseDate ? new Date(`${release.releaseDate}T12:00:00Z`) : null;
    const hasDate = parsedDate && !Number.isNaN(parsedDate.getTime());
    const longDate = hasDate ? new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" }).format(parsedDate) : "Date to be confirmed";
    $("#workspace-date").textContent = new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date()).toUpperCase();
    $("#overview-song-title").textContent = release.title;
    $("#opportunity-release-label").textContent = release.title;
    $("#overview-artist-name").textContent = state.artist.name;
    $("#overview-release-kind").textContent = release.kind.toUpperCase();
    $("#overview-kind-copy").textContent = release.kind.toLowerCase();
    $("#overview-release-date").textContent = longDate;
    $("#release-countdown-days").textContent = hasDate ? String(Math.max(0, Math.ceil((parsedDate.getTime() - Date.now()) / 86400000))) : "—";
    $("#release-countdown-unit").textContent = hasDate ? "d" : "";
    $("#detail-artist").textContent = state.artist.name;
    $("#detail-genre").textContent = state.artist.genre;
    $("#detail-kind").textContent = release.kind;
    $("#detail-duration").textContent = release.duration || "Not added";
    $("#detail-isrc").textContent = release.isrc || "Not added";
    if ($("#detail-iswc")) $("#detail-iswc").textContent = release.iswc || "Not added";
    if ($("#detail-upc")) $("#detail-upc").textContent = release.upc || "Not added";
    $("#detail-explicit").textContent = release.explicit ? "Yes" : "No";
    $("#detail-contributors").textContent = release.contributors || "Not added";
    $("#settings-artist-name").textContent = state.artist.name;
    $("#settings-artist-genre").textContent = `Independent artist · ${state.artist.genre}`;
    if ($("#settings-market")) $("#settings-market").textContent = state.profile.homeTerritory || "Not set";
    if ($("#settings-languages")) $("#settings-languages").textContent = state.profile.languages.join(", ") || "Not set";
    if ($("#settings-bio")) $("#settings-bio").textContent = state.profile.bio || "No artist story added yet.";
    if ($("#settings-boundaries")) $("#settings-boundaries").textContent = state.profile.prohibitedAssociations || "No prohibited contexts added.";
    $("#passport-song-title").textContent = release.title;
    $("#passport-glance-title").textContent = `${release.title}, at a glance`;
    $("#passport-kind-label").textContent = release.kind.toUpperCase();
    $(".cover-title").innerHTML = escapeHTML(release.title.toUpperCase()).replace(/\s+/g, "<br>");
    $("#passport-artist-line").innerHTML = `${name} <span>·</span> ${escapeHTML(state.artist.genre)} <span>·</span> ${hasDate ? parsedDate.getUTCFullYear() : "Release date not set"}`;
    $("#passport-description").textContent = release.description || "No artist description added yet.";
    $("#passport-genre-tag").textContent = state.artist.genre;
    $("#passport-language-tag").textContent = release.language || "Language not set";
    $("#passport-explicit-tag").textContent = release.explicit ? "Explicit" : "Clean lyrics";
    const settingsAvatar = $(".settings-artist-avatar");
    if (settingsAvatar) settingsAvatar.textContent = state.artist.name.split(/\s+/).map((part) => part[0] || "").join("").slice(0, 2).toUpperCase();
    const releaseLink = $("#release-link-display");
    if (releaseLink) {
      if (release.publicLink && /^https:\/\//i.test(release.publicLink)) {
        releaseLink.innerHTML = `<a href="${escapeHTML(release.publicLink)}" target="_blank" rel="noopener noreferrer">${escapeHTML(release.publicLink)}</a>`;
      } else {
        releaseLink.textContent = "No artist-provided link added";
      }
    }
    if (hasDate) {
      const month = new Intl.DateTimeFormat("en-US", { month: "short", timeZone: "UTC" }).format(parsedDate).toUpperCase();
      const day = new Intl.DateTimeFormat("en-US", { day: "2-digit", timeZone: "UTC" }).format(parsedDate);
      const weekdayYear = new Intl.DateTimeFormat("en-US", { weekday: "long", year: "numeric", timeZone: "UTC" }).format(parsedDate);
      $("#passport-date").innerHTML = `<span>${month}</span> <b>${day}</b>`;
      $("#passport-weekday").textContent = weekdayYear;
    } else {
      $("#passport-date").textContent = "Not set";
      $("#passport-weekday").textContent = "Add a planned release date";
    }
    const confirmedBadge = $("#rights-confirmation-badge");
    confirmedBadge.innerHTML = release.rightsConfirmed ? `<span class="icon icon-check"></span> Artist confirmed` : `<span class="icon icon-info"></span> Confirmation needed`;
    $("#rights-summary").textContent = release.rightsConfirmed
      ? "Artist self-reports authority to promote this recording"
      : "Promotion authority has not been confirmed";
    if ($("#detail-master-ownership")) $("#detail-master-ownership").textContent = release.masterOwnership || "Not recorded";
    if ($("#detail-sample-status")) $("#detail-sample-status").textContent = release.sampleStatus || "Not declared";
  }

  function renderReadiness() {
    const release = state.release;
    const checks = [
      { label: "Track title and release type", ok: Boolean(release.title && release.kind) },
      { label: "Release date", ok: Boolean(release.releaseDate) },
      { label: "Promotion territory", ok: release.territories.length > 0 },
      { label: "Contributor information", ok: Boolean(release.contributors.trim()) },
      { label: "Artist authority confirmation", ok: release.rightsConfirmed, caution: true },
      { label: "Description and language", ok: Boolean(release.description.trim() && release.language) },
      { label: "Recording identifier (ISRC)", ok: Boolean(release.isrc), optional: true },
      { label: "Public or private release link", ok: Boolean(release.publicLink), optional: true }
    ];
    const essential = checks.filter((item) => !item.optional);
    const complete = essential.filter((item) => item.ok).length;
    const readiness = Math.round((complete / essential.length) * 100);
    if ($("#overview-readiness-label")) $("#overview-readiness-label").textContent = `${readiness}% complete`;
    if ($("#overview-readiness-bar")) $("#overview-readiness-bar").style.width = `${readiness}%`;
    const nextSteps = checks.filter((item) => !item.ok && !item.optional).slice(0, 4);
    const checklist = $("#overview-checklist");
    if (checklist) {
      const rows = nextSteps.length
        ? nextSteps.map((item) => `<div class="task-row"><span class="task-check"><span class="icon icon-info"></span></span><span class="task-text">${escapeHTML(item.label)}</span><button class="task-action" data-action="edit-passport">Add details <span aria-hidden="true">→</span></button></div>`).join("")
        : `<div class="task-row"><span class="task-check done"><span class="icon icon-check"></span></span><span class="task-text completed">Core release details are recorded</span><span class="task-meta">Advisory</span></div>`;
      checklist.innerHTML = `${rows}<div class="task-row"><span class="task-check"><span class="icon icon-info"></span></span><span class="task-text">Recording identifiers and release link</span><span class="task-meta">Optional</span></div>`;
    }
    $("#readiness-label").textContent = `${complete} of ${essential.length} essentials recorded`;
    $("#readiness-bar").style.width = `${readiness}%`;
    if ($("#overview-readiness")) $("#overview-readiness").textContent = String(readiness);
    if ($("#readiness-score-number")) $("#readiness-score-number").textContent = String(readiness);
    if ($("#readiness-score-word")) $("#readiness-score-word").textContent = readiness === 100 ? "RECORDED" : "IN PROGRESS";
    if ($("#readiness-summary")) $("#readiness-summary").textContent = readiness === 100 ? "Core release details are recorded." : "Add the missing release details that matter to your campaign.";
    if ($("#readiness-findings")) {
      $("#readiness-findings").innerHTML = state.readinessRun
        ? checks.map((item) => `<div class="readiness-finding ${item.ok ? "is-ready" : item.optional ? "is-optional" : "needs-attention"}"><span class="icon ${item.ok ? "icon-check" : "icon-info"}" aria-hidden="true"></span><span>${escapeHTML(item.label)}${item.caution && item.ok ? " · self-reported, not verified" : ""}</span><strong>${item.ok ? "Recorded" : item.optional ? "Optional" : "Missing"}</strong></div>`).join("")
        : `<p class="readiness-empty">Run the optional check to see missing details and practical next steps.</p>`;
    }
    const cleanRow = $(".missing-asset");
    if (cleanRow && state.cleanVersion) {
      cleanRow.innerHTML = `<span class="asset-file-icon"><span class="icon icon-info"></span></span><span class="asset-copy"><strong>Clean version noted</strong><small>Local note only · no file was uploaded</small></span><span class="asset-ready">Not stored</span>`;
    }
    if ($(".score-ring")) $(".score-ring").style.background = `conic-gradient(#76a383 0deg ${Math.round(readiness * 3.6)}deg,#edf0eb ${Math.round(readiness * 3.6)}deg 360deg)`;
  }

  function render() {
    renderCampaigns();
    renderOpportunities();
    renderApprovals();
    renderArtist();
    renderReadiness();
    renderOutcomes();
    renderActivity();
  }

  function renderOutcomes() {
    const outcomes = Array.isArray(state.outcomes) ? state.outcomes : [];
    const responses = outcomes.filter((item) => item.kind === "Response").length;
    const placements = outcomes.filter((item) => item.kind === "Placement").length;
    const verifiedRevenue = outcomes.filter((item) => item.kind === "Revenue" && item.source === "Imported" && item.verification === "Verified");
    $("#report-qualified").textContent = "0";
    $("#report-responses").textContent = String(responses);
    $("#report-placements").textContent = String(placements);
    const currencies = new Set(verifiedRevenue.map((item) => item.currency || "EUR"));
    const revenue = verifiedRevenue.reduce((total, item) => total + (Number(item.amount) || 0), 0);
    $("#report-revenue").textContent = currencies.size > 1 ? "Multiple" : new Intl.NumberFormat("en-GB", { style: "currency", currency: [...currencies][0] || "EUR" }).format(revenue);
    if (!outcomes.length) {
      $("#outcome-list").innerHTML = `<div class="empty-state outcome-empty"><span class="icon icon-chart" aria-hidden="true"></span><h3>No outcomes recorded</h3><p>Record a reply, placement, usage event, or statement line when you have evidence.</p></div>`;
      return;
    }
    const campaignsById = new Map(state.campaigns.map((campaign) => [campaign.id, campaign.title]));
    $("#outcome-list").innerHTML = [...outcomes].sort((a, b) => String(b.date).localeCompare(String(a.date))).map((item) => {
      const amount = item.amount ? `${escapeHTML(item.currency || "EUR")} ${escapeHTML(item.amount)}` : "—";
      return `<article class="outcome-row"><div><strong>${escapeHTML(item.kind)}</strong><span>${escapeHTML(campaignsById.get(item.campaignId) || "Campaign not found")}</span></div><time>${escapeHTML(item.date)}</time><span class="outcome-source">${escapeHTML(item.source)} · ${escapeHTML(item.verification)}</span><span class="outcome-amount">${amount}</span><span class="outcome-notes">${escapeHTML(item.evidence || item.notes || "No source note")}</span></article>`;
    }).join("");
  }

  function renderActivity() {
    const entries = Array.isArray(state.audit) ? state.audit.slice(0, 4) : [];
    $("#activity-list").innerHTML = entries.length ? entries.map((entry) => `<div class="activity-item"><span class="activity-icon activity-mint"><span class="icon icon-check"></span></span><div class="activity-copy"><strong>${escapeHTML(entry.text)}</strong><span>${escapeHTML(entry.by)} · Local workspace record</span></div><time>${escapeHTML(entry.time)}</time></div>`).join("") : `<div class="activity-empty"><strong>No workspace activity yet</strong><span>Changes you make to this local workspace will appear here.</span></div>`;
  }

  function campaignForm(existing = null) {
    const campaign = existing || {};
    const channels = ["Editorial", "Radio", "Press", "Podcast", "Community", "Live", "Sync"];
    const selected = Array.isArray(campaign.channels) ? campaign.channels : ["Editorial", "Radio"];
    return `${modalTitle(existing ? "Edit campaign plan" : "Plan a campaign", "Set the release window, territories, channels, exclusions, and spending boundaries.")}<form class="modal-form" id="campaign-form"><input type="hidden" name="id" value="${escapeHTML(campaign.id || "")}" /><div class="field"><label for="campaign-name">Campaign name</label><input id="campaign-name" name="title" required maxlength="120" value="${escapeHTML(campaign.title || `${state.release.title} — Promotion plan`)}" /></div><div class="field"><label for="campaign-release">Track or release</label><input id="campaign-release" name="release" required maxlength="100" value="${escapeHTML(campaign.release || state.release.title)}" /></div><div class="field"><label for="campaign-goal">Campaign objective</label><input id="campaign-goal" name="goal" required maxlength="300" value="${escapeHTML(campaign.goal || "Build relevant discovery around this release")}" /></div><div class="form-grid-two"><div class="field"><label for="campaign-start">Campaign starts</label><input id="campaign-start" name="startDate" type="date" required value="${escapeHTML(campaign.startDate || "")}" /></div><div class="field"><label for="campaign-end">Campaign ends</label><input id="campaign-end" name="endDate" type="date" required value="${escapeHTML(campaign.endDate || "")}" /></div></div><div class="field"><label for="campaign-territories">Promotion territories</label><input id="campaign-territories" name="territories" required maxlength="150" value="${escapeHTML((campaign.territories || state.profile.territories).join(", "))}" /><span class="field-hint">Two-letter country codes separated by commas.</span></div><div class="field"><label for="campaign-languages">Languages</label><input id="campaign-languages" name="languages" required maxlength="150" value="${escapeHTML((campaign.languages || state.profile.languages).join(", "))}" /></div><fieldset class="field channel-choice"><legend>Channel categories to explore</legend><div class="choice-grid">${channels.map((channel) => `<label><input type="checkbox" name="channels" value="${channel}" ${selected.includes(channel) ? "checked" : ""}/> ${channel}</label>`).join("")}</div></fieldset><div class="field"><label for="campaign-exclusions">Exclusions and prohibited contexts</label><textarea id="campaign-exclusions" name="exclusions" maxlength="1000" placeholder="Enter None, or list topics, uses, or associations to avoid">${escapeHTML(campaign.exclusions || state.profile.prohibitedAssociations)}</textarea></div><div class="form-grid-two"><div class="field"><label for="campaign-commitment">Draft qualified-action target</label><input id="campaign-commitment" name="plannedQualifiedActions" type="number" min="0" max="10000" step="1" value="${campaign.plannedQualifiedActions ?? ""}" placeholder="Leave unset"/><span class="field-hint">Planning only; not a service guarantee.</span></div><div class="field"><label for="campaign-budget">Budget cap</label><div class="currency-input"><input id="campaign-budget" name="budgetCap" type="number" min="0" max="1000000" step="0.01" value="${escapeHTML(campaign.budgetCap ?? "0")}"/><select name="budgetCurrency" aria-label="Budget currency"><option ${campaign.budgetCurrency === "EUR" || !campaign.budgetCurrency ? "selected" : ""}>EUR</option><option ${campaign.budgetCurrency === "GBP" ? "selected" : ""}>GBP</option><option ${campaign.budgetCurrency === "USD" ? "selected" : ""}>USD</option></select></div><span class="field-hint">Any spend requires separate approval.</span></div></div><div class="field checkbox-field"><input id="free-action-permission" name="freeActionPermission" type="checkbox" ${campaign.freeActionPermission ? "checked" : ""}/><label for="free-action-permission">Allow pre-approved free, reversible actions within this plan if a compliant adapter becomes available.</label></div><div class="modal-warning"><span class="icon icon-shield" aria-hidden="true"></span><span>This local prototype has no promotion adapters. Saving or activating a plan sends nothing, publishes nothing, and spends no money. Paid placement, contracts, licenses, exclusivity, and rights actions always require separate approval.</span></div><div class="modal-footer"><button class="button button-secondary" type="button" data-action="close-modal">Cancel</button><button class="button button-primary" type="submit">${existing ? "Save plan" : "Save draft"}</button></div></form>`;
  }

  function artistProfileForm() {
    const profile = state.profile;
    return `${modalTitle("Artist profile & boundaries", "Keep reusable facts and contact limits in one place. Add only information you want stored in this local prototype.")}<form class="modal-form" id="artist-profile-form"><div class="field"><label for="profile-artist-name">Artist name</label><input id="profile-artist-name" name="name" required maxlength="100" value="${escapeHTML(state.artist.name)}"/></div><div class="field"><label for="profile-genre">Primary genre</label><input id="profile-genre" name="genre" required maxlength="80" value="${escapeHTML(state.artist.genre)}"/></div><div class="field"><label for="profile-bio">Artist-provided story</label><textarea id="profile-bio" name="bio" maxlength="1200">${escapeHTML(profile.bio)}</textarea></div><div class="form-grid-two"><div class="field"><label for="profile-home">Home territory</label><input id="profile-home" name="homeTerritory" maxlength="2" pattern="[A-Za-z]{2}" value="${escapeHTML(profile.homeTerritory)}"/><span class="field-hint">Two-letter country code.</span></div><div class="field"><label for="profile-languages">Languages</label><input id="profile-languages" name="languages" maxlength="150" value="${escapeHTML(profile.languages.join(", "))}"/></div></div><div class="field"><label for="profile-territories">Permitted promotion territories</label><input id="profile-territories" name="territories" maxlength="300" value="${escapeHTML(profile.territories.join(", "))}"/><span class="field-hint">Two-letter country codes separated by commas.</span></div><div class="field"><label for="profile-website">Official website</label><input id="profile-website" name="website" type="url" maxlength="300" value="${escapeHTML(profile.website)}" placeholder="https://…"/></div><div class="field"><label for="profile-links">Official artist profiles</label><textarea id="profile-links" name="socialProfiles" maxlength="1000" placeholder="One artist-controlled public URL per line">${escapeHTML(profile.socialProfiles)}</textarea></div><div class="form-grid-two"><div class="field"><label for="profile-distributor">Distributor</label><input id="profile-distributor" name="distributor" maxlength="120" value="${escapeHTML(profile.distributor)}"/></div><div class="field"><label for="profile-publisher">Publisher</label><input id="profile-publisher" name="publisher" maxlength="120" value="${escapeHTML(profile.publisher)}"/></div></div><div class="form-grid-two"><div class="field"><label for="profile-pro">PRO / CMO</label><input id="profile-pro" name="proCmo" maxlength="120" value="${escapeHTML(profile.proCmo)}"/></div><div class="field"><label for="profile-neighbouring">Neighbouring-rights organisation</label><input id="profile-neighbouring" name="neighbouringRights" maxlength="120" value="${escapeHTML(profile.neighbouringRights)}"/></div></div><div class="field"><label for="profile-prohibitions">Prohibited associations or contexts</label><textarea id="profile-prohibitions" name="prohibitedAssociations" maxlength="1000" placeholder="Topics, brands, or uses to avoid">${escapeHTML(profile.prohibitedAssociations)}</textarea></div><div class="field"><label for="profile-contact">Contact preference</label><textarea id="profile-contact" name="contactPreferences" maxlength="500">${escapeHTML(profile.contactPreferences)}</textarea></div><div class="modal-warning"><span class="icon icon-info" aria-hidden="true"></span><span>This prototype has no encryption or user accounts. Do not enter private contact, legal, financial, or unreleased information.</span></div><div class="modal-footer"><button class="button button-secondary" type="button" data-action="close-modal">Cancel</button><button class="button button-primary" type="submit">Save profile</button></div></form>`;
  }

  function passportForm() {
    const release = state.release;
    return `${modalTitle("Edit Song Passport", "Record artist-provided details. Identifiers, rights assertions, and evidence remain unverified unless independently checked.")}<form class="modal-form" id="passport-form"><div class="field"><label for="artist-name">Primary artist</label><input id="artist-name" name="artist" required maxlength="100" value="${escapeHTML(state.artist.name)}" /></div><div class="field"><label for="song-name">Track or release title</label><input id="song-name" name="song" required maxlength="100" value="${escapeHTML(release.title)}" /></div><div class="field"><label for="genre-name">Primary genre</label><input id="genre-name" name="genre" required maxlength="80" value="${escapeHTML(state.artist.genre)}" /></div><div class="form-grid-two"><div class="field"><label for="release-version">Version name</label><input id="release-version" name="version" maxlength="80" value="${escapeHTML(release.version)}" placeholder="Radio edit, remix…"/></div><div class="field"><label for="release-kind">Recording / release type</label><select id="release-kind" name="kind">${["Single", "EP", "Album", "Compilation", "Other"].map((kind) => `<option ${release.kind === kind ? "selected" : ""}>${kind}</option>`).join("")}</select></div></div><div class="form-grid-two"><div class="field"><label for="release-date">Planned release date</label><input id="release-date" name="releaseDate" type="date" value="${escapeHTML(release.releaseDate)}" /></div><div class="field"><label for="track-duration">Track duration</label><input id="track-duration" name="duration" inputmode="numeric" pattern="(?:[0-5]?[0-9]):[0-5][0-9]" maxlength="5" placeholder="3:42" value="${escapeHTML(release.duration)}" /></div></div><div class="form-grid-two"><div class="field"><label for="release-language">Primary language</label><input id="release-language" name="language" maxlength="60" value="${escapeHTML(release.language)}" /></div><div class="field"><label for="release-territories">Promotion territories</label><input id="release-territories" name="territories" maxlength="150" value="${escapeHTML(release.territories.join(", "))}"/><span class="field-hint">Two-letter territory codes.</span></div></div><div class="form-grid-two"><div class="field"><label for="release-isrc">ISRC · recording</label><input id="release-isrc" name="isrc" maxlength="12" pattern="[A-Za-z]{2}[A-Za-z0-9]{3}[0-9]{7}" value="${escapeHTML(release.isrc)}"/><span class="field-hint">Identifier, not proof of ownership.</span></div><div class="field"><label for="release-iswc">ISWC · composition</label><input id="release-iswc" name="iswc" maxlength="30" value="${escapeHTML(release.iswc)}"/></div></div><div class="form-grid-two"><div class="field"><label for="release-upc">UPC / EAN · release</label><input id="release-upc" name="upc" maxlength="14" inputmode="numeric" value="${escapeHTML(release.upc)}"/></div><div class="field"><label for="release-distributor">Distributor</label><input id="release-distributor" name="distributor" maxlength="120" value="${escapeHTML(release.distributor)}"/></div></div><div class="form-grid-two"><div class="field"><label for="release-publisher">Publisher</label><input id="release-publisher" name="publisher" maxlength="120" value="${escapeHTML(release.publisher)}"/></div><div class="field"><label for="release-pro">PRO / CMO</label><input id="release-pro" name="proCmo" maxlength="120" value="${escapeHTML(release.proCmo)}"/></div></div><div class="field"><label for="master-ownership">Master ownership assertion</label><input id="master-ownership" name="masterOwnership" maxlength="300" value="${escapeHTML(release.masterOwnership)}"/></div><div class="field"><label for="composition-splits">Composition shares / split status</label><textarea id="composition-splits" name="compositionSplits" maxlength="1000">${escapeHTML(release.compositionSplits)}</textarea></div><div class="field"><label for="sample-status">Samples, covers, remixes, and clearance status</label><input id="sample-status" name="sampleStatus" maxlength="300" value="${escapeHTML(release.sampleStatus)}"/></div><div class="field"><label for="permitted-uses">Permitted promotional uses</label><input id="permitted-uses" name="permittedUses" maxlength="300" value="${escapeHTML(release.permittedUses.join(", "))}"/></div><div class="field"><label for="rights-evidence">Rights evidence note (no files)</label><textarea id="rights-evidence" name="rightsEvidenceNote" maxlength="500">${escapeHTML(release.rightsEvidenceNote)}</textarea><span class="field-hint">This is a note only; the prototype does not store or verify contracts.</span></div><div class="field"><label for="release-public-link">Artist-provided release link</label><input id="release-public-link" name="publicLink" type="url" maxlength="500" value="${escapeHTML(release.publicLink || "")}" placeholder="https://…"/></div><div class="field"><label for="track-description">Artist-provided track description</label><textarea id="track-description" name="description" maxlength="500">${escapeHTML(release.description)}</textarea></div><div class="field"><label for="track-contributors">Contributors and roles</label><textarea id="track-contributors" name="contributors" maxlength="1000">${escapeHTML(release.contributors)}</textarea></div><div class="field checkbox-field"><input id="release-explicit" name="explicit" type="checkbox" ${release.explicit ? "checked" : ""} /><label for="release-explicit">This release contains explicit content.</label></div><div class="field checkbox-field"><input id="rights-confirmed" name="rightsConfirmed" type="checkbox" ${release.rightsConfirmed ? "checked" : ""} /><label for="rights-confirmed">I confirm I have authority to promote this recording.</label></div><div class="modal-warning"><span class="icon icon-shield" aria-hidden="true"></span><span>This confirmation is self-reported, not legal clearance. Files cannot be uploaded in this prototype.</span></div><div class="modal-footer"><button class="button button-secondary" type="button" data-action="close-modal">Cancel</button><button class="button button-primary" type="submit">Save Song Passport</button></div></form>`;
  }

  function outcomeForm() {
    const campaignOptions = state.campaigns.map((campaign) => `<option value="${escapeHTML(campaign.id)}">${escapeHTML(campaign.title)}</option>`).join("");
    return `${modalTitle("Record an outcome", "Add a manually observed response, placement, usage, or revenue line with its provenance.")}<form class="modal-form" id="outcome-form"><div class="field"><label for="outcome-campaign">Campaign</label><select id="outcome-campaign" name="campaignId" required>${campaignOptions}</select></div><div class="form-grid-two"><div class="field"><label for="outcome-kind">Outcome type</label><select id="outcome-kind" name="kind"><option>Response</option><option>Accepted</option><option>Scheduled</option><option>Published</option><option>Aired</option><option>Placement</option><option>Usage</option><option>Revenue</option><option>Expense</option></select></div><div class="field"><label for="outcome-date">Observed date</label><input id="outcome-date" name="date" type="date" required value="${new Date().toISOString().slice(0, 10)}"/></div></div><div class="form-grid-two"><div class="field"><label for="outcome-source">Data source</label><select id="outcome-source" name="source"><option>Artist-entered</option><option>Imported</option><option>Estimated</option></select></div><div class="field"><label for="outcome-verification">Verification status</label><select id="outcome-verification" name="verification"><option>Unverified</option><option>Evidence noted</option></select></div></div><div class="form-grid-two"><div class="field"><label for="outcome-amount">Amount (optional)</label><input id="outcome-amount" name="amount" type="number" min="0" max="100000000" step="0.01" placeholder="0.00"/></div><div class="field"><label for="outcome-currency">Currency</label><select id="outcome-currency" name="currency"><option>EUR</option><option>GBP</option><option>USD</option></select></div></div><div class="field"><label for="outcome-evidence">Source or evidence note</label><input id="outcome-evidence" name="evidence" maxlength="500" placeholder="Statement period, public URL, or your source note"/></div><div class="field"><label for="outcome-notes">Notes</label><textarea id="outcome-notes" name="notes" maxlength="800"></textarea></div><div class="modal-warning"><span class="icon icon-info" aria-hidden="true"></span><span>Manual source and verification labels are your assertions; NOTE does not independently verify them. Only a verified revenue line is included in the verified-revenue total.</span></div><div class="modal-footer"><button class="button button-secondary" type="button" data-action="close-modal">Cancel</button><button class="button button-primary" type="submit">Save outcome</button></div></form>`;
  }

  function openOpportunityDetails(id) {
    const item = opportunities.find((opportunity) => opportunity.id === id);
    if (!item) return;
    const alreadyRequested = state.approvals.some((approval) => approval.opportunityId === item.id && approval.status !== "Declined");
    const fit = opportunityFit(item);
    const fitSignals = opportunityFitSignals(item).map((reason) => `<li><span class="icon icon-info" aria-hidden="true"></span>${escapeHTML(reason)}</li>`).join("");
    const blockers = opportunityQualification(item).blockers.map((reason) => `<li><span class="icon icon-lock" aria-hidden="true"></span>${escapeHTML(reason)}</li>`).join("");
    const suppressed = state.suppressedOpportunityIds.includes(item.id);
    openModal(`${modalTitle(item.name, `${item.type} · illustrative ${fit}% fit for ${state.release.title}`)}<div class="detail-source"><strong>How the fit score is calculated</strong><p>It is a local sorting aid based on genre, territory, release format, and date window. It is not a response prediction.</p></div><ul class="modal-list">${fitSignals}</ul><div class="detail-source"><strong>Qualification status</strong><p>This example is not eligible for external action in the prototype.</p><ul class="modal-list">${blockers}</ul></div><div class="detail-source"><strong>Source &amp; terms</strong><p>${escapeHTML(item.source)} · Source: ${escapeHTML(item.risk)} · Contact: unverified · Costs: ${escapeHTML(item.costState)}.</p></div><div class="modal-warning"><span class="icon icon-shield" aria-hidden="true"></span><span>Nothing is sent and release materials are not shared. An internal review request only records a local note. Suppression removes this source from discovery.</span></div><div class="modal-footer"><button class="button button-secondary" type="button" data-action="close-modal">Close</button><button class="button button-quiet" type="button" data-action="suppress-opportunity" data-id="${escapeHTML(item.id)}" ${suppressed ? "disabled" : ""}>${suppressed ? "Suppressed" : "Do not contact"}</button><button class="button button-primary" type="button" data-action="request-review" data-id="${escapeHTML(item.id)}" ${alreadyRequested || suppressed ? "disabled" : ""}>${alreadyRequested ? "Review requested" : "Request internal review"}</button></div>`, "icon-compass");
  }

  function openApprovalDetails(id) {
    const item = state.approvals.find((approval) => approval.id === id);
    if (!item) return;
    openModal(`${modalTitle(item.title, item.description)}<div class="detail-source"><strong>Requested by ${escapeHTML(item.requestedBy)}</strong><p>${escapeHTML(item.detail)}</p></div><div class="modal-warning"><span class="icon icon-shield" aria-hidden="true"></span><span>Demo only: approving or declining records a local sample decision. No one is contacted, no content is published, and no money is spent.</span></div><div class="modal-footer"><button class="button button-secondary" type="button" data-action="close-modal">Close</button><button class="button button-quiet" type="button" data-action="decide" data-decision="Declined" data-id="${escapeHTML(item.id)}">Decline</button><button class="button button-primary" type="button" data-action="decide" data-decision="Approved in demo" data-id="${escapeHTML(item.id)}">Approve in demo</button></div>`, item.icon);
  }

  function openCampaign(id) {
    const campaign = state.campaigns.find((item) => item.id === id);
    if (!campaign) return;
    const blockers = campaignActivationBlockers(campaign);
    const range = `${campaign.startDate || "Start not set"} to ${campaign.endDate || "End not set"}`;
    const commitment = Number.isInteger(campaign.plannedQualifiedActions) ? `${campaign.plannedQualifiedActions} planned actions (not a service guarantee)` : "No action target set";
    const cap = `${escapeHTML(campaign.budgetCurrency || "EUR")} ${Number(campaign.budgetCap || 0).toFixed(2)} · separate approval required for every expense`;
    const blockerList = blockers.length ? `<ul class="modal-list blocker-list">${blockers.map((item) => `<li><span class="icon icon-info" aria-hidden="true"></span>${escapeHTML(item)}</li>`).join("")}</ul>` : `<p>This plan has the release authority, dates, territories, and channel details needed for local activation.</p>`;
    let statusActions = "";
    if (campaign.status === "Planning") statusActions = `<button class="button button-primary" type="button" data-action="campaign-transition" data-id="${escapeHTML(campaign.id)}" data-status="Active" ${blockers.length ? "disabled" : ""}>Mark plan active</button>`;
    if (campaign.status === "Active") statusActions = `<button class="button button-secondary" type="button" data-action="campaign-transition" data-id="${escapeHTML(campaign.id)}" data-status="Paused">Pause plan</button><button class="button button-quiet" type="button" data-action="campaign-transition" data-id="${escapeHTML(campaign.id)}" data-status="Stopped">Stop plan</button>`;
    if (campaign.status === "Paused") statusActions = `<button class="button button-primary" type="button" data-action="campaign-transition" data-id="${escapeHTML(campaign.id)}" data-status="Active" ${blockers.length ? "disabled" : ""}>Resume plan</button><button class="button button-quiet" type="button" data-action="campaign-transition" data-id="${escapeHTML(campaign.id)}" data-status="Stopped">Stop plan</button>`;
    const editButton = ["Planning", "Paused"].includes(campaign.status) ? `<button class="button button-secondary" type="button" data-action="campaign-edit" data-id="${escapeHTML(campaign.id)}">Edit plan</button>` : "";
    openModal(`${modalTitle(campaign.title, campaign.goal)}<div class="detail-source"><strong>Plan details · ${escapeHTML(campaign.status)}</strong><p>${escapeHTML(campaign.release)} · ${escapeHTML(campaign.releaseDate || "Release date to be confirmed")}<br>Window: ${escapeHTML(range)}<br>Territories: ${escapeHTML(campaign.territories.join(", ") || "Not set")}<br>Languages: ${escapeHTML(campaign.languages.join(", ") || "Not set")}<br>Channels: ${escapeHTML(campaign.channels.join(", ") || "Not set")}<br>Exclusions: ${escapeHTML(campaign.exclusions || "None recorded")}<br>Activity plan: ${escapeHTML(commitment)}<br>Budget cap: ${cap}</p></div><div class="detail-source"><strong>Activation readiness</strong>${blockerList}</div><div class="modal-warning"><span class="icon icon-shield" aria-hidden="true"></span><span>Plan status only. No adapters are connected, so NOTE cannot send, publish, spend, or create queued work. Spending, paid placement, contracts, licenses, exclusivity, and rights actions always require separate approval.</span></div><div class="modal-footer">${editButton}${statusActions}<button class="button button-secondary" type="button" data-action="close-modal">Close</button></div>`, "icon-spark");
  }

  function campaignActivationBlockers(campaign) {
    const blockers = [];
    if (campaign.release !== state.release.title) blockers.push("This prototype has no Song Passport for the selected release. Complete its release record first.");
    if (!state.release.rightsConfirmed) blockers.push("Artist authority to promote this recording has not been self-confirmed.");
    if (!campaign.startDate || !campaign.endDate || campaign.endDate < campaign.startDate) blockers.push("Set a valid campaign start and end date.");
    if (!campaign.channels.length) blockers.push("Choose at least one channel category.");
    if (!campaign.exclusions.trim()) blockers.push("Record excluded contexts, or explicitly enter ‘None’.");
    if (!campaign.territories.length || campaign.territories.some((territory) => !state.profile.territories.includes(territory) || !state.release.territories.includes(territory))) blockers.push("Campaign territories must be within both the artist profile and release permissions.");
    if (!campaign.languages.length || campaign.languages.some((language) => !state.profile.languages.includes(language))) blockers.push("Campaign languages must be included in the artist’s working languages.");
    return blockers;
  }

  function openCampaignTransition(id, nextStatus) {
    const campaign = state.campaigns.find((item) => item.id === id);
    if (!campaign || !["Active", "Paused", "Stopped"].includes(nextStatus)) return;
    if (nextStatus === "Active" && campaignActivationBlockers(campaign).length) {
      notify("Complete the campaign readiness items before activation.", true);
      return;
    }
    const title = nextStatus === "Stopped" ? "Stop this campaign plan?" : nextStatus === "Paused" ? "Pause this campaign plan?" : "Activate this campaign plan?";
    openModal(`${modalTitle(title, `${campaign.title} · ${campaign.status} → ${nextStatus}`)}<div class="modal-warning"><span class="icon icon-shield" aria-hidden="true"></span><span>This changes only the local planner status. No outreach, publishing, spending, or background jobs are connected.</span></div><div class="field checkbox-field"><input id="campaign-transition-confirmation" type="checkbox"/><label for="campaign-transition-confirmation">I understand this is a local plan-state change, not an external action.</label></div><div class="modal-footer"><button class="button button-secondary" type="button" data-action="close-modal">Cancel</button><button class="button button-primary" type="button" data-action="campaign-transition-confirm" data-id="${escapeHTML(id)}" data-status="${escapeHTML(nextStatus)}">Confirm ${escapeHTML(nextStatus.toLowerCase())}</button></div>`, "icon-shield");
  }

  function parseCountryCodes(value) {
    const codes = String(value || "").split(",").map((code) => code.trim().toUpperCase()).filter(Boolean);
    return codes.length && codes.every((code) => /^[A-Z]{2}$/.test(code)) && new Set(codes).size === codes.length ? codes : null;
  }

  function parseCommaList(value) {
    return [...new Set(String(value || "").split(",").map((item) => item.trim()).filter(Boolean))];
  }

  function isHttpsUrl(value) {
    if (!value) return true;
    try { return new URL(value).protocol === "https:"; } catch (_) { return false; }
  }

  function validIsoDate(value) {
    if (!value) return true;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const parsed = new Date(`${value}T00:00:00Z`);
    return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
  }

  function formSubmit(event) {
    const form = event.target;
    if (form.id === "campaign-form") {
      event.preventDefault();
      const data = new FormData(form);
      const title = String(data.get("title") || "").trim();
      const release = String(data.get("release") || "").trim();
      const startDate = String(data.get("startDate") || "");
      const endDate = String(data.get("endDate") || "");
      const territories = parseCountryCodes(data.get("territories"));
      const languages = parseCommaList(data.get("languages"));
      const channels = [...new Set(data.getAll("channels").map(String))];
      const plannedText = String(data.get("plannedQualifiedActions") || "").trim();
      const plannedQualifiedActions = plannedText ? Number(plannedText) : null;
      const budgetCap = Number(data.get("budgetCap"));
      const budgetCurrency = String(data.get("budgetCurrency") || "EUR");
      if (!title || !release || !String(data.get("goal") || "").trim()) { notify("Add a campaign name, release, and objective.", true); return; }
      if (!validIsoDate(startDate) || !validIsoDate(endDate) || !startDate || !endDate || endDate < startDate) { notify("Set valid campaign dates, with the end date on or after the start date.", true); return; }
      if (!territories || !territories.length || territories.some((code) => !state.profile.territories.includes(code) || !state.release.territories.includes(code))) { notify("Campaign territories must be valid and allowed for both the artist and this release.", true); return; }
      if (!languages.length || languages.length > 20 || languages.some((language) => language.length > 60)) { notify("Add one or more valid campaign languages.", true); return; }
      if (languages.some((language) => !state.profile.languages.includes(language))) { notify("Campaign languages must be included in the artist profile. Update the profile first if needed.", true); return; }
      if (!channels.length) { notify("Choose at least one channel category.", true); return; }
      const exclusions = String(data.get("exclusions") || "").trim();
      if (!exclusions) { notify("Record excluded contexts, or explicitly enter ‘None’.", true); return; }
      if (plannedQualifiedActions !== null && (!Number.isInteger(plannedQualifiedActions) || plannedQualifiedActions < 0 || plannedQualifiedActions > 10000)) { notify("The optional action target must be a whole number from 0 to 10,000.", true); return; }
      if (!Number.isFinite(budgetCap) || budgetCap < 0 || budgetCap > 1000000 || !["EUR", "GBP", "USD"].includes(budgetCurrency)) { notify("Enter a valid budget cap and currency.", true); return; }
      const existingId = String(data.get("id") || "");
      const current = existingId ? state.campaigns.find((campaign) => campaign.id === existingId) : null;
      if (existingId && (!current || !["Planning", "Paused"].includes(current.status))) { notify("Only planning or paused campaigns can be edited.", true); return; }
      const campaign = {
        ...(current || {}),
        id: current ? current.id : `campaign-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        title,
        release,
        goal: String(data.get("goal") || "").trim(),
        status: current ? current.status : "Planning",
        completion: 0,
        updated: "Just now",
        channels,
        owner: state.artist.name,
        releaseDate: release === state.release.title && state.release.releaseDate ? new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(`${state.release.releaseDate}T12:00:00Z`)) : "Date to be confirmed",
        startDate,
        endDate,
        territories,
        languages,
        exclusions,
        plannedQualifiedActions,
        budgetCap,
        budgetCurrency,
        freeActionPermission: data.has("freeActionPermission"),
        autopilotAuthorized: current ? Boolean(current.autopilotAuthorized) : false
      };
      if (current) Object.assign(current, campaign);
      else state.campaigns.unshift(campaign);
      addAudit(current ? `Campaign plan updated: ${title}` : `Campaign plan created: ${title}`);
      save(); render(); closeModal(); showView("campaigns"); notify(current ? "Campaign plan saved locally." : "Campaign draft saved locally.");
    }
    if (form.id === "artist-profile-form") {
      event.preventDefault();
      const data = new FormData(form);
      const territories = parseCountryCodes(data.get("territories"));
      const homeTerritory = String(data.get("homeTerritory") || "").trim().toUpperCase();
      const languages = parseCommaList(data.get("languages"));
      const website = String(data.get("website") || "").trim();
      const socialProfiles = String(data.get("socialProfiles") || "").trim();
      const links = socialProfiles ? socialProfiles.split(/\r?\n/).map((link) => link.trim()).filter(Boolean) : [];
      if (!territories || !territories.length || !/^[A-Z]{2}$/.test(homeTerritory)) { notify("Use two-letter country codes for the home territory and permitted territories.", true); return; }
      if (!languages.length || languages.length > 20 || languages.some((language) => language.length > 60)) { notify("Add one or more valid working languages.", true); return; }
      if (state.release.territories.some((code) => !territories.includes(code)) || state.campaigns.some((campaign) => campaign.territories.some((code) => !territories.includes(code)))) { notify("Your permitted territories must continue to include every territory already assigned to this release and its campaign plans.", true); return; }
      if (state.campaigns.some((campaign) => campaign.languages.some((language) => !languages.includes(language)))) { notify("Your working languages must continue to include the languages assigned to existing campaign plans.", true); return; }
      if (!isHttpsUrl(website) || links.some((link) => !isHttpsUrl(link))) { notify("Artist website and profile links must use HTTPS.", true); return; }
      state.artist.name = String(data.get("name") || "").trim();
      state.artist.genre = String(data.get("genre") || "").trim();
      state.profile = {
        ...state.profile,
        bio: String(data.get("bio") || "").trim(), homeTerritory, languages, territories, website,
        socialProfiles, distributor: String(data.get("distributor") || "").trim(),
        publisher: String(data.get("publisher") || "").trim(), proCmo: String(data.get("proCmo") || "").trim(),
        neighbouringRights: String(data.get("neighbouringRights") || "").trim(),
        prohibitedAssociations: String(data.get("prohibitedAssociations") || "").trim(),
        contactPreferences: String(data.get("contactPreferences") || "").trim()
      };
      addAudit("Artist profile and promotion boundaries updated");
      save(); render(); closeModal(); notify("Artist profile saved locally.");
    }
    if (form.id === "passport-form") {
      event.preventDefault();
      const data = new FormData(form);
      const previousTitle = state.release.title;
      const releaseDate = String(data.get("releaseDate") || "");
      const duration = String(data.get("duration") || "").trim();
      const isrc = String(data.get("isrc") || "").trim().toUpperCase();
      const upc = String(data.get("upc") || "").trim();
      const publicLink = String(data.get("publicLink") || "").trim();
      const territories = parseCountryCodes(data.get("territories"));
      const permittedUses = parseCommaList(data.get("permittedUses"));
      if (!validIsoDate(releaseDate)) { notify("Enter a valid planned release date.", true); return; }
      if (duration && !/^(?:[0-5]?\d):[0-5]\d$/.test(duration)) { notify("Enter duration as minutes:seconds, such as 3:42.", true); return; }
      if (isrc && !/^[A-Z]{2}[A-Z0-9]{3}\d{7}$/.test(isrc)) { notify("An ISRC must contain 12 characters in the standard format.", true); return; }
      if (upc && !/^\d{8,14}$/.test(upc)) { notify("Enter an 8–14 digit UPC/EAN, or leave it blank.", true); return; }
      if (!territories || territories.length > 50) { notify("Use unique two-letter territory codes, separated by commas.", true); return; }
      if (!isHttpsUrl(publicLink)) { notify("Release links must use HTTPS.", true); return; }
      if (territories.some((code) => !state.profile.territories.includes(code))) { notify("The release territories must stay within your artist profile’s permitted territories.", true); return; }
      state.artist.name = String(data.get("artist") || "").trim();
      state.artist.genre = String(data.get("genre") || "").trim();
      state.release = {
        ...state.release,
        title: String(data.get("song") || "").trim(), version: String(data.get("version") || "").trim(),
        kind: String(data.get("kind") || "Single"), releaseDate, duration,
        language: String(data.get("language") || "").trim(), territories, isrc,
        iswc: String(data.get("iswc") || "").trim(), upc,
        description: String(data.get("description") || "").trim(), contributors: String(data.get("contributors") || "").trim(),
        distributor: String(data.get("distributor") || "").trim(), publisher: String(data.get("publisher") || "").trim(),
        proCmo: String(data.get("proCmo") || "").trim(), masterOwnership: String(data.get("masterOwnership") || "").trim(),
        compositionSplits: String(data.get("compositionSplits") || "").trim(), sampleStatus: String(data.get("sampleStatus") || "").trim(),
        permittedUses, rightsEvidenceNote: String(data.get("rightsEvidenceNote") || "").trim(), publicLink,
        explicit: data.has("explicit"), rightsConfirmed: data.has("rightsConfirmed")
      };
      const formattedDate = releaseDate ? new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(`${releaseDate}T12:00:00Z`)) : "Date to be confirmed";
      state.campaigns.forEach((campaign) => {
        if (campaign.release === previousTitle) {
          campaign.release = state.release.title;
          campaign.releaseDate = formattedDate;
          if (campaign.title.startsWith(`${previousTitle} —`)) campaign.title = `${state.release.title}${campaign.title.slice(previousTitle.length)}`;
        }
      });
      state.readinessRun = null;
      addAudit("Song Passport release details updated");
      save(); render(); closeModal(); notify("Song Passport updated locally.");
    }
    if (form.id === "outcome-form") {
      event.preventDefault();
      const data = new FormData(form);
      const amountText = String(data.get("amount") || "").trim();
      const amount = amountText ? Number(amountText) : null;
      const campaignId = String(data.get("campaignId") || "");
      const date = String(data.get("date") || "");
      if (!state.campaigns.some((campaign) => campaign.id === campaignId)) { notify("Select a campaign in this workspace.", true); return; }
      if (!validIsoDate(date) || !date) { notify("Enter a valid outcome date.", true); return; }
      if (amount !== null && (!Number.isFinite(amount) || amount < 0 || amount > 100000000)) { notify("Enter a valid non-negative amount.", true); return; }
      const outcome = {
        id: `outcome-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, campaignId,
        kind: String(data.get("kind") || "Response"), date, source: String(data.get("source") || "Artist-entered"),
        verification: String(data.get("verification") || "Unverified"), amount: amount === null ? "" : amount.toFixed(2),
        currency: String(data.get("currency") || "EUR"), evidence: String(data.get("evidence") || "").trim(),
        notes: String(data.get("notes") || "").trim()
      };
      state.outcomes.unshift(outcome);
      addAudit(`${outcome.kind} outcome recorded for ${state.campaigns.find((campaign) => campaign.id === campaignId).title}`);
      save(); render(); closeModal(); notify("Outcome recorded with its source and status.");
    }
  }

  function createCampaign() { openModal(campaignForm()); }
  function editCampaign(id) {
    const campaign = state.campaigns.find((item) => item.id === id);
    if (campaign && ["Planning", "Paused"].includes(campaign.status)) openModal(campaignForm(campaign), "icon-edit");
  }
  function editPassport() { openModal(passportForm(), "icon-edit"); }
  function editArtistProfile() { openModal(artistProfileForm(), "icon-users"); }

  function decide(id, decision) {
    const item = state.approvals.find((approval) => approval.id === id);
    if (!item) return;
    item.status = decision;
    addAudit(`${item.title}: ${decision.toLowerCase()}`);
    save(); render(); closeModal();
    notify(decision === "Approved in demo" ? "Decision recorded in the demo. No external action was taken." : "Your decision was recorded in the demo.");
  }

  document.addEventListener("click", (event) => {
    const nav = event.target.closest("[data-view]");
    if (nav && nav.matches(".nav-item")) { showView(nav.dataset.view); return; }
    const go = event.target.closest("[data-go]");
    if (go) { showView(go.dataset.go); return; }
    const campaignFilter = event.target.closest("[data-campaign-filter]");
    if (campaignFilter) { activeCampaignFilter = campaignFilter.dataset.campaignFilter; renderCampaigns(); return; }
    const opportunityFilter = event.target.closest("[data-opportunity-filter]");
    if (opportunityFilter) { activeOpportunityFilter = opportunityFilter.dataset.opportunityFilter; renderOpportunities(); return; }
    const actionElement = event.target.closest("[data-action]");
    if (!actionElement) return;
    const { action, id } = actionElement.dataset;
    if (action === "new-campaign") createCampaign();
    if (action === "close-modal") closeModal();
    if (action === "edit-passport") editPassport();
    if (action === "campaign-open") openCampaign(id);
    if (action === "campaign-edit") editCampaign(id);
    if (action === "campaign-transition") openCampaignTransition(id, actionElement.dataset.status);
    if (action === "campaign-transition-confirm") {
      const checkbox = $("#campaign-transition-confirmation", modalContent);
      const campaign = state.campaigns.find((item) => item.id === id);
      const nextStatus = actionElement.dataset.status;
      if (!checkbox?.checked || !campaign) { notify("Confirm that you understand this is a local plan change.", true); return; }
      if (nextStatus === "Active" && campaignActivationBlockers(campaign).length) { notify("The campaign no longer meets its activation checks.", true); return; }
      campaign.status = nextStatus;
      campaign.autopilotAuthorized = nextStatus === "Active" && Boolean(campaign.freeActionPermission);
      campaign.updated = "Just now";
      addAudit(`Campaign plan ${nextStatus.toLowerCase()}: ${campaign.title}`);
      save(); render(); closeModal(); notify(`Campaign plan marked ${nextStatus.toLowerCase()}. No external action was taken.`);
    }
    if (action === "campaign-checklist") { closeModal(); showView("passport"); }
    if (action === "opportunity-details") openOpportunityDetails(id);
    if (action === "toggle-save") {
      const position = state.savedOpportunityIds.indexOf(id);
      const item = opportunities.find((opportunity) => opportunity.id === id);
      if (state.suppressedOpportunityIds.includes(id)) { notify("This source is suppressed and cannot be saved.", true); return; }
      if (position === -1) { state.savedOpportunityIds.push(id); addAudit(`Opportunity saved for review: ${item ? item.name : "Sample opportunity"}`); notify("Sample opportunity saved for later."); }
      else { state.savedOpportunityIds.splice(position, 1); notify("Opportunity removed from your saved list."); }
      save(); renderOpportunities(); renderActivity();
    }
    if (action === "suppress-opportunity") {
      if (!state.suppressedOpportunityIds.includes(id)) {
        state.suppressedOpportunityIds.push(id);
        state.savedOpportunityIds = state.savedOpportunityIds.filter((savedId) => savedId !== id);
        const item = opportunities.find((opportunity) => opportunity.id === id);
        addAudit(`Opportunity suppressed: ${item ? item.name : "Source"}`);
      }
      save(); render(); closeModal(); notify("Source added to your local do-not-contact list.");
    }
    if (action === "request-review") {
      const item = opportunities.find((opportunity) => opportunity.id === id);
      if (item && !state.suppressedOpportunityIds.includes(id) && !state.approvals.some((approval) => approval.opportunityId === item.id && approval.status !== "Declined")) {
        state.approvals.unshift({ id: `approval-${Date.now()}`, opportunityId: item.id, kind: "Opportunity review", icon: "icon-compass", title: `${item.name} · Opportunity review`, description: "Review this sample opportunity and decide whether to explore it further.", detail: "This creates a note for your team to review the source and terms with you. It will not contact the organization or share your music.", requestedBy: state.artist.name, requested: "Just now", status: "Pending" });
        addAudit(`Internal review requested: ${item.name}`); save(); render(); closeModal(); showView("approvals"); notify("Internal review request added locally.");
      }
    }
    if (action === "approval-details") openApprovalDetails(id);
    if (action === "decide") decide(id, actionElement.dataset.decision);
    if (action === "later") notify("Left in your approvals for whenever you’re ready.");
    if (action === "go-approvals") { closeModal(); showView("approvals"); }
    if (action === "record-outcome") { openModal(outcomeForm(), "icon-chart"); }
  });

  document.addEventListener("submit", formSubmit);
  $("#new-campaign").addEventListener("click", createCampaign);
  $("#new-campaign-alt").addEventListener("click", createCampaign);
  $("#edit-passport").addEventListener("click", editPassport);
  $("#settings-edit-profile").addEventListener("click", editArtistProfile);
  $("#modal-close").addEventListener("click", closeModal);
  modalBackdrop.addEventListener("click", (event) => { if (event.target === modalBackdrop) closeModal(); });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") { if (!modalBackdrop.hidden) closeModal(); else closeSidebar(); }
    if (event.key === "Tab" && !modalBackdrop.hidden) {
      const focusable = $$("button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),a[href]", modalBackdrop);
      const first = focusable[0]; const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });
  $("#open-menu").addEventListener("click", openSidebar);
  $("#close-menu").addEventListener("click", closeSidebar);
  $("#sidebar-scrim").addEventListener("click", closeSidebar);
  $("#notification-button").addEventListener("click", () => notify(state.approvals.some((item) => item.status === "Pending") ? "You have local sample approvals to review." : "No new local workspace notifications."));
  $("#account-menu").addEventListener("click", () => notify("This is a single-user local prototype. Account authentication is not implemented."));
  $("#activity-more").addEventListener("click", () => showView("approvals"));
  $("#sort-campaigns").addEventListener("click", () => { state.campaigns.reverse(); renderCampaigns(); notify("Campaign order updated."); });
  $("#opportunity-sort").addEventListener("click", (event) => { opportunitySort = opportunitySort === "fit" ? "name" : "fit"; event.currentTarget.innerHTML = `${opportunitySort === "fit" ? "Best fit" : "Recently added"} <span class="icon icon-chevron"></span>`; renderOpportunities(); });
  $("#run-readiness").addEventListener("click", () => { state.readinessRun = { at: new Date().toISOString() }; addAudit("Optional release readiness check run"); save(); render(); notify("Readiness check complete. Findings are advisory only."); });
  $("#record-outcome").addEventListener("click", () => openModal(outcomeForm(), "icon-chart"));
  $("#opportunity-info").addEventListener("click", () => openModal(`${modalTitle("How NOTE matching works", "Matching should help you decide what deserves a closer look.")}<div class="detail-source"><strong>Signals considered</strong><p>Release timing, genres and moods you share, the kind of opportunity, audience and location fit, and terms that may need checking.</p></div><ul class="modal-list"><li><span class="icon icon-check"></span>Every match includes the reasons it appeared.</li><li><span class="icon icon-check"></span>A higher fit score is only a sorting aid, not a promise.</li><li><span class="icon icon-check"></span>Sample entries are fictional and have not been verified as real opportunities.</li></ul><div class="modal-footer"><button class="button button-primary" data-action="close-modal">Got it</button></div>`, "icon-info"));
  $("#add-clean").addEventListener("click", () => openModal(`${modalTitle("Note a clean version", "Record whether a clean version is available outside NOTE.")}<div class="modal-warning"><span class="icon icon-info"></span><span>This records a note only. It does not upload, store, or verify an audio file.</span></div><div class="modal-footer"><button class="button button-secondary" data-action="close-modal">Cancel</button><button class="button button-primary" id="confirm-clean">Record note</button></div>`, "icon-wave"));
  $("#rights-info").addEventListener("click", () => openModal(`${modalTitle("Rights & credits", "Ownership details should be clear before music or likeness is shared.")}<div class="detail-source"><strong>Artist-provided status</strong><p>${state.release.rightsConfirmed ? "The artist has self-reported authority to promote this recording." : "The artist has not self-confirmed authority to promote this recording."} ${state.release.masterOwnership ? `${escapeHTML(state.release.masterOwnership)}. ` : ""}No contracts or ownership documents have been checked.</p><p>Permitted uses recorded: ${escapeHTML(state.release.permittedUses.join(", ") || "None recorded")}. Samples / covers / remixes: ${escapeHTML(state.release.sampleStatus || "Not declared")}.</p></div><div class="modal-warning"><span class="icon icon-shield"></span><span>NOTE does not give legal advice. Agreements, licenses, exclusivity, and rights transfers require your own review and explicit approval.</span></div><div class="modal-footer"><button class="button button-primary" data-action="close-modal">Understood</button></div>`, "icon-lock"));
  $("#add-link").addEventListener("click", editPassport);
  $("#ask-manager").addEventListener("click", () => notify("Team messaging is not connected in this demo."));
  $("#invite-team").addEventListener("click", () => notify("Team invites are disabled in this demo. No email was sent."));
  $("#export-report").addEventListener("click", () => {
    const exportPayload = { product: "NOTE Promotion local prototype", exportedAt: new Date().toISOString(), data: state };
    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob); const anchor = document.createElement("a");
    anchor.href = url; anchor.download = "note-workspace-export.json"; anchor.click(); URL.revokeObjectURL(url); notify("Workspace data exported as JSON.");
  });

  modalContent.addEventListener("click", (event) => {
    if (event.target.closest("#confirm-clean")) { state.cleanVersion = true; addAudit("Clean version availability noted; no file stored"); save(); renderReadiness(); renderActivity(); closeModal(); notify("Availability note recorded. No file was uploaded."); }
  });

  render();
  loadServerState();
})();
