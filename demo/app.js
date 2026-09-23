(function () {
  "use strict";

  const STORAGE_KEY = "note-promotion-demo-v1";
  const seed = {
    artist: { name: "Mara Bloom", genre: "Indie pop" },
    release: { id: "glasshouse", title: "Glasshouse", version: "", kind: "Single", releaseDate: "2026-10-23", duration: "3:42", explicit: false, language: "English", territories: ["GB"], isrc: "", description: "A late-night song about finding your way back to yourself.", contributors: "Mara Bloom — songwriter, vocals; Ellis Park — producer", rightsConfirmed: true },
    cleanVersion: false,
    savedOpportunityIds: ["new-frequencies", "tidepool", "signal-bloom", "porchlight"],
    campaigns: [
      { id: "glasshouse-release", title: "Glasshouse — Release campaign", release: "Glasshouse", goal: "Build thoughtful discovery around your next single", status: "Planning", completion: 67, updated: "Sep 18", channels: ["Editorial", "Radio", "Press"], owner: "Mara Bloom", releaseDate: "Oct 23, 2026" },
      { id: "soft-focus", title: "Soft Focus — Discovery campaign", release: "Soft Focus EP", goal: "Reconnect with listeners who found the EP", status: "Active", completion: 86, updated: "Sep 16", channels: ["Editorial", "Community"], owner: "Ellis Park", releaseDate: "Sep 04, 2026" }
    ],
    approvals: [
      { id: "approval-campaign", kind: "Campaign plan", icon: "icon-spark", title: "Glasshouse · Campaign outline", description: "Ellis has prepared the release plan and is asking you to review its timing, channels, and next steps.", detail: "This approval marks the draft as ready for your team to work from. It does not publish anything or contact anyone.", requestedBy: "Ellis Park", requested: "Sep 18", status: "Pending" },
      { id: "approval-draft", kind: "Draft preparation", icon: "icon-edit", title: "New Frequencies · Draft intro", description: "Review a proposed short introduction before it is added to the campaign workspace.", detail: "Approving only lets your team prepare a draft for you to review. No email or pitch will be sent.", requestedBy: "Ellis Park", requested: "Sep 19", status: "Pending" },
      { id: "approval-spend", kind: "Paid opportunity", icon: "icon-lock", title: "Sample editorial package · $150", description: "A fictional paid placement proposal has been added for your consideration.", detail: "This is a sample item. Approving it records your demo decision only; it cannot spend money or reserve a placement.", requestedBy: "NOTE sample data", requested: "Sep 20", status: "Pending" }
    ],
    audit: [
      { text: "Song Passport audio master added", by: "Mara Bloom", time: "Sep 20 · Sample" },
      { text: "Opportunity saved for later review", by: "Mara Bloom", time: "Sep 19 · Sample" }
    ]
  };

  const opportunities = [
    { id: "new-frequencies", initials: "nf", name: "New Frequencies", category: "Editorial", type: "Independent editorial", fit: 96, description: "A small editorial series focused on emerging, self-releasing artists with an intimate, left-of-center sound.", tags: ["Strong genre fit", "Accepts singles", "No fee listed"], why: ["Features emerging independent artists", "Accepts releases in the four weeks before launch", "Looks for intimate vocal-forward production"], source: "Fictional example source · sample data" },
    { id: "tidepool", initials: "tp", name: "Tidepool Sessions", category: "Live", type: "Live session series", fit: 92, description: "An intimate filmed session format for new voices and stripped-back arrangements.", tags: ["Strong sound fit", "London-based", "Terms need review"], why: ["Acoustic arrangements are a regular part of the series", "The next recording window aligns with your release", "Travel and usage terms should be confirmed before you commit"], source: "Fictional example source · sample data" },
    { id: "signal-bloom", initials: "sb", name: "Signal Bloom Radio", category: "Radio", type: "Independent radio show", fit: 89, description: "A weekly radio hour sharing new alternative pop and artist stories with listeners across the UK.", tags: ["Genre fit", "UK audience", "No fee listed"], why: ["Regularly features alternative pop releases", "Audience geography matches your stated market", "The show requests a short artist introduction"], source: "Fictional example source · sample data" },
    { id: "porchlight", initials: "p", name: "Porchlight Picks", category: "Editorial", type: "Independent editorial", fit: 86, description: "A listening column about songs made for slow mornings and late-evening walks.", tags: ["Mood fit", "Accepts singles", "No fee listed"], why: ["The music mood matches recent features", "Accepts independent artist submissions", "Editorial timeline is compatible with your planned release"], source: "Fictional example source · sample data" },
    { id: "field-notes", initials: "fn", name: "Field Notes Live", category: "Live", type: "Showcase opportunity", fit: 80, description: "A community-run listening night that pairs emerging artists with local music audiences.", tags: ["Community fit", "London", "Details to confirm"], why: ["Highlights developing local artists", "Based in a market you selected", "Lineup, ticket terms, and recording permissions need review"], source: "Fictional example source · sample data" },
    { id: "soft-static", initials: "ss", name: "Soft Static", category: "Radio", type: "Podcast & radio", fit: 76, description: "A monthly conversation and listening session about how new independent music gets made.", tags: ["Story fit", "Interview format", "No fee listed"], why: ["Focuses on artist-led stories", "Pairs a conversation with a short music feature", "Review interview time commitment before replying"], source: "Fictional example source · sample data" }
  ];

  function mergeState(stored) {
    const source = stored && typeof stored === "object" ? stored : {};
    const artist = { ...seed.artist, ...(source.artist || {}) };
    const legacyTitle = artist.song;
    delete artist.song;
    const release = { ...seed.release, ...(source.release || {}) };
    if (!source.release && legacyTitle) release.title = legacyTitle;
    release.territories = Array.isArray(release.territories) ? release.territories : [...seed.release.territories];
    return {
      ...JSON.parse(JSON.stringify(seed)),
      ...source,
      artist,
      release,
      campaigns: Array.isArray(source.campaigns) ? source.campaigns : JSON.parse(JSON.stringify(seed.campaigns)),
      approvals: Array.isArray(source.approvals) ? source.approvals : JSON.parse(JSON.stringify(seed.approvals)),
      audit: Array.isArray(source.audit) ? source.audit : JSON.parse(JSON.stringify(seed.audit)),
      savedOpportunityIds: Array.isArray(source.savedOpportunityIds) ? source.savedOpportunityIds : [...seed.savedOpportunityIds]
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
    $("#active-campaigns").textContent = String(state.campaigns.filter((campaign) => campaign.status !== "Completed").length).padStart(2, "0");
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
      const statusClass = campaign.status === "Planning" ? "planning" : campaign.status === "Completed" ? "complete" : "";
      const artClass = campaign.status === "Active" ? "live" : campaign.status === "Completed" ? "archive" : "";
      const title = escapeHTML(campaign.title);
      const artTitle = campaign.release.split(" ").slice(0, 2).map(escapeHTML).join("<br>");
      return `<article class="campaign-card panel"><div class="campaign-card-main"><div class="campaign-art ${artClass}" aria-hidden="true">${artTitle}</div><div class="campaign-main-copy"><div class="campaign-title-line"><h2>${title}</h2><span class="state-pill ${statusClass}"><span class="status-dot"></span>${escapeHTML(campaign.status)}</span></div><p class="campaign-subtitle">${escapeHTML(campaign.goal)}</p><div class="campaign-meta"><span><span class="icon icon-music"></span>${escapeHTML(campaign.release)}</span><span><span class="icon icon-calendar">◷</span>${escapeHTML(campaign.releaseDate || "Date to be confirmed")}</span><span><span class="icon icon-users"></span>${escapeHTML(campaign.channels.join(" · "))}</span></div></div><div class="campaign-progress"><strong>${campaign.completion}% complete</strong><div class="campaign-progress-track"><span style="width:${campaign.completion}%"></span></div><span>Updated ${escapeHTML(campaign.updated)}</span></div></div><div class="campaign-bottom"><div class="team-stack" aria-label="Campaign team"><span class="team-mini">MB</span><span class="team-mini">EP</span><span class="campaign-team-label">Mara + Ellis</span></div><div class="campaign-actions"><button class="text-link" data-action="campaign-checklist" data-id="${escapeHTML(campaign.id)}">View checklist</button><button class="button button-secondary" data-action="campaign-open" data-id="${escapeHTML(campaign.id)}">Open campaign <span aria-hidden="true">→</span></button></div></div></article>`;
    }).join("");
  }

  function renderOpportunities() {
    const list = opportunities.filter((item) => activeOpportunityFilter === "All" || item.category === activeOpportunityFilter);
    $("#saved-opportunities").textContent = String(state.savedOpportunityIds.length).padStart(2, "0");
    $$("[data-opportunity-filter]").forEach((tab) => {
      const selected = tab.dataset.opportunityFilter === activeOpportunityFilter;
      tab.classList.toggle("active", selected);
      tab.setAttribute("aria-selected", String(selected));
    });
    $("#opportunity-list").innerHTML = list.map((item) => {
      const saved = state.savedOpportunityIds.includes(item.id);
      const logoClass = item.category === "Radio" ? "radio" : item.category === "Live" ? "live" : "editorial";
      const tags = item.tags.map((tag) => `<span>${escapeHTML(tag)}</span>`).join("");
      return `<article class="opportunity-card panel"><div class="opportunity-logo ${logoClass}" aria-hidden="true">${escapeHTML(item.initials.toUpperCase())}</div><div class="opportunity-main"><div class="opportunity-title-row"><h2>${escapeHTML(item.name)}</h2><span class="verified-label">● Sample source</span><span class="match-label">${escapeHTML(item.category)}</span></div><p class="opportunity-description">${escapeHTML(item.description)}</p><div class="opportunity-tags">${tags}</div></div><div class="opportunity-actions"><span class="fit-score">FIT <strong>${item.fit}%</strong></span><button class="button save-button ${saved ? "saved" : ""}" data-action="toggle-save" data-id="${escapeHTML(item.id)}"><span aria-hidden="true">${saved ? "✓" : "+"}</span> ${saved ? "Saved" : "Save for later"}</button><button class="text-link opportunity-detail-link" data-action="opportunity-details" data-id="${escapeHTML(item.id)}">Why this fit? <span aria-hidden="true">→</span></button></div></article>`;
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
    $("#audit-list").innerHTML = state.audit.slice(0, 5).map((entry) => `<div class="audit-row"><span class="icon icon-check" aria-hidden="true"></span><span><strong>${escapeHTML(entry.text)}</strong> · ${escapeHTML(entry.by)}</span><time>${escapeHTML(entry.time)}</time></div>`).join("");
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
    $("#detail-explicit").textContent = release.explicit ? "Yes" : "No";
    $("#detail-contributors").textContent = release.contributors || "Not added";
    $("#settings-artist-name").textContent = state.artist.name;
    $("#settings-artist-genre").textContent = `Independent artist · ${state.artist.genre}`;
    $("#passport-song-title").textContent = release.title;
    $("#passport-glance-title").textContent = `${release.title}, at a glance`;
    $("#passport-kind-label").textContent = release.kind.toUpperCase();
    $(".cover-title").innerHTML = escapeHTML(release.title.toUpperCase()).replace(/\s+/g, "<br>");
    $("#passport-artist-line").innerHTML = `${name} <span>·</span> ${escapeHTML(state.artist.genre)} <span>·</span> ${hasDate ? parsedDate.getUTCFullYear() : "Release date not set"}`;
    $("#passport-description").textContent = release.description || "No artist description added yet.";
    $("#passport-genre-tag").textContent = state.artist.genre;
    $("#passport-language-tag").textContent = release.language || "Language not set";
    $("#passport-explicit-tag").textContent = release.explicit ? "Explicit" : "Clean lyrics";
    $("#master-file-name").textContent = `${release.title.replace(/[^a-z0-9_-]+/gi, "_")}_master.wav`;
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
  }

  function renderReadiness() {
    const complete = state.cleanVersion ? 5 : 4;
    const readiness = Math.round((complete / 6) * 100);
    $("#readiness-label").textContent = `${complete} of 6 complete`;
    $("#readiness-bar").style.width = `${readiness}%`;
    const cleanRow = $(".missing-asset");
    if (state.cleanVersion) {
      const safeTitle = escapeHTML(state.release.title.replace(/[^a-z0-9_-]+/gi, "_"));
      cleanRow.innerHTML = `<span class="asset-file-icon"><span class="icon icon-check"></span></span><span class="asset-copy"><strong>${safeTitle}_clean.wav</strong><small>WAV audio <span>·</span> Added to demo</small></span><span class="asset-ready"><span class="status-dot status-green"></span> Ready</span>`;
    }
    if (state.cleanVersion) {
      $(".section-optional").textContent = "Complete";
      $(".score-inner strong").textContent = String(readiness);
      $(".score-ring").style.background = `conic-gradient(#76a383 0deg ${Math.round(readiness * 3.6)}deg,#edf0eb ${Math.round(readiness * 3.6)}deg 360deg)`;
    }
  }

  function render() {
    renderCampaigns();
    renderOpportunities();
    renderApprovals();
    renderArtist();
    renderReadiness();
  }

  function campaignForm() {
    return `${modalTitle("Start a campaign", "Make a focused plan for a release. You can add details and ask your team to review it later.")}<form class="modal-form" id="campaign-form"><div class="field"><label for="campaign-name">Campaign name</label><input id="campaign-name" name="title" required maxlength="80" placeholder="e.g. ${escapeHTML(state.release.title)} release plan" /></div><div class="field"><label for="campaign-release">Release</label><select id="campaign-release" name="release"><option>${escapeHTML(state.release.title)}</option><option>Soft Focus EP</option><option>Other release</option></select></div><div class="field"><label for="campaign-goal">What would you like to focus on?</label><select id="campaign-goal" name="goal"><option>Build thoughtful discovery around this release</option><option>Reconnect with existing listeners</option><option>Prepare a live release moment</option><option>Explore editorial opportunities</option></select></div><div class="modal-warning"><span class="icon icon-shield" aria-hidden="true"></span><span>This creates a draft in your demo workspace. It won’t contact anyone or set a budget.</span></div><div class="modal-footer"><button class="button button-secondary" type="button" data-action="close-modal">Cancel</button><button class="button button-primary" type="submit">Create draft <span aria-hidden="true">→</span></button></div></form>`;
  }

  function passportForm() {
    const release = state.release;
    return `${modalTitle("Edit Song Passport", "Record release facts and your rights confirmation. Identifiers and ownership details are not independently verified.")}<form class="modal-form" id="passport-form"><div class="field"><label for="artist-name">Primary artist</label><input id="artist-name" name="artist" required maxlength="70" value="${escapeHTML(state.artist.name)}" /></div><div class="field"><label for="song-name">Release or track title</label><input id="song-name" name="song" required maxlength="70" value="${escapeHTML(release.title)}" /></div><div class="field"><label for="genre-name">Primary genre</label><input id="genre-name" name="genre" required maxlength="50" value="${escapeHTML(state.artist.genre)}" /></div><div class="field"><label for="release-kind">Release type</label><select id="release-kind" name="kind">${["Single", "EP", "Album", "Compilation", "Other"].map((kind) => `<option ${release.kind === kind ? "selected" : ""}>${kind}</option>`).join("")}</select></div><div class="field"><label for="release-date">Planned release date</label><input id="release-date" name="releaseDate" type="date" value="${escapeHTML(release.releaseDate)}" /></div><div class="field"><label for="track-duration">Track duration</label><input id="track-duration" name="duration" inputmode="numeric" pattern="(?:[0-5]?[0-9]):[0-5][0-9]" maxlength="5" placeholder="3:42" value="${escapeHTML(release.duration)}" /><span class="field-hint">Minutes and seconds, such as 3:42. Leave blank if not known.</span></div><div class="field"><label for="release-language">Primary language</label><input id="release-language" name="language" maxlength="60" value="${escapeHTML(release.language)}" /></div><div class="field"><label for="release-territories">Promotion territories</label><input id="release-territories" name="territories" maxlength="150" value="${escapeHTML(release.territories.join(", "))}" /><span class="field-hint">ISO country codes separated by commas, for example GB, IE.</span></div><div class="field"><label for="release-isrc">ISRC, if assigned</label><input id="release-isrc" name="isrc" maxlength="12" pattern="[A-Za-z]{2}[A-Za-z0-9]{3}[0-9]{7}" value="${escapeHTML(release.isrc)}" placeholder="12-character ISRC" /><span class="field-hint">An ISRC identifies a recording; it does not prove ownership.</span></div><div class="field"><label for="track-description">Artist-provided track description</label><textarea id="track-description" name="description" maxlength="500" placeholder="A short, accurate description of the release">${escapeHTML(release.description)}</textarea><span class="field-hint">Use facts and wording you’re comfortable sharing.</span></div><div class="field"><label for="track-contributors">Contributors and roles</label><textarea id="track-contributors" name="contributors" maxlength="1000" placeholder="Name — role; name — role">${escapeHTML(release.contributors)}</textarea><span class="field-hint">Names and roles are informational. Add a separate rights agreement where needed.</span></div><div class="field checkbox-field"><input id="release-explicit" name="explicit" type="checkbox" ${release.explicit ? "checked" : ""} /><label for="release-explicit">This release contains explicit content.</label></div><div class="field checkbox-field"><input id="rights-confirmed" name="rightsConfirmed" type="checkbox" ${release.rightsConfirmed ? "checked" : ""} /><label for="rights-confirmed">I confirm I have authority to promote this recording.</label></div><div class="modal-warning"><span class="icon icon-shield" aria-hidden="true"></span><span>This is your self-reported confirmation, not legal clearance. Save changes only updates this local demo.</span></div><div class="modal-footer"><button class="button button-secondary" type="button" data-action="close-modal">Cancel</button><button class="button button-primary" type="submit">Save Song Passport</button></div></form>`;
  }

  function openOpportunityDetails(id) {
    const item = opportunities.find((opportunity) => opportunity.id === id);
    if (!item) return;
    const alreadyRequested = state.approvals.some((approval) => approval.opportunityId === item.id && approval.status === "Pending");
    const reasons = item.why.map((reason) => `<li><span class="icon icon-check" aria-hidden="true"></span>${escapeHTML(reason)}</li>`).join("");
    openModal(`${modalTitle(item.name, `${item.type} · ${item.fit}% fit for ${state.release.title}`)}<div class="detail-source"><strong>Why NOTE surfaced this sample</strong><p>Fit is an explanation of how an example opportunity relates to the release details in this demo. It is not an endorsement or guarantee.</p></div><ul class="modal-list">${reasons}</ul><div class="detail-source"><strong>Source &amp; terms</strong><p>${escapeHTML(item.source)}. Always verify the organization, terms, permissions, and any costs before taking action.</p></div><div class="modal-warning"><span class="icon icon-shield" aria-hidden="true"></span><span>Requesting a review only adds a sample approval item. NOTE won’t send a pitch or share release materials.</span></div><div class="modal-footer"><button class="button button-secondary" type="button" data-action="close-modal">Close</button><button class="button button-primary" type="button" data-action="request-review" data-id="${escapeHTML(item.id)}" ${alreadyRequested ? "disabled" : ""}>${alreadyRequested ? "Review requested" : "Ask team to review"}</button></div>`, "icon-compass");
  }

  function openApprovalDetails(id) {
    const item = state.approvals.find((approval) => approval.id === id);
    if (!item) return;
    openModal(`${modalTitle(item.title, item.description)}<div class="detail-source"><strong>Requested by ${escapeHTML(item.requestedBy)}</strong><p>${escapeHTML(item.detail)}</p></div><div class="modal-warning"><span class="icon icon-shield" aria-hidden="true"></span><span>Demo only: approving or declining records a local sample decision. No one is contacted, no content is published, and no money is spent.</span></div><div class="modal-footer"><button class="button button-secondary" type="button" data-action="close-modal">Close</button><button class="button button-quiet" type="button" data-action="decide" data-decision="Declined" data-id="${escapeHTML(item.id)}">Decline</button><button class="button button-primary" type="button" data-action="decide" data-decision="Approved in demo" data-id="${escapeHTML(item.id)}">Approve in demo</button></div>`, item.icon);
  }

  function openCampaign(id) {
    const campaign = state.campaigns.find((item) => item.id === id);
    if (!campaign) return;
    openModal(`${modalTitle(campaign.title, campaign.goal)}<div class="detail-source"><strong>Current plan</strong><p>${escapeHTML(campaign.release)} · ${escapeHTML(campaign.releaseDate || "Release date to be confirmed")}<br>Channels to explore: ${escapeHTML(campaign.channels.join(", "))}<br>Progress: ${campaign.completion}% · ${escapeHTML(campaign.status)}</p></div><div class="modal-warning"><span class="icon icon-shield" aria-hidden="true"></span><span>Your campaign is a planning space. No external outreach, spend, or commitments happen from this demo.</span></div><div class="modal-footer"><button class="button button-secondary" type="button" data-action="close-modal">Close</button><button class="button button-primary" type="button" data-action="go-approvals">Review approvals <span aria-hidden="true">→</span></button></div>`, "icon-spark");
  }

  function formSubmit(event) {
    const form = event.target;
    if (form.id === "campaign-form") {
      event.preventDefault();
      const data = new FormData(form);
      const title = String(data.get("title") || "").trim();
      if (!title) return;
      state.campaigns.unshift({ id: `campaign-${Date.now()}`, title, release: String(data.get("release")), goal: String(data.get("goal")), status: "Planning", completion: 0, updated: "Just now", channels: ["To be planned"], owner: state.artist.name, releaseDate: "Date to be confirmed" });
      addAudit(`Campaign draft created: ${title}`);
      save(); render(); closeModal(); showView("campaigns"); notify("Campaign draft created in this demo.");
    }
    if (form.id === "passport-form") {
      event.preventDefault();
      const data = new FormData(form);
      const previousTitle = state.release.title;
      const releaseDate = String(data.get("releaseDate") || "");
      const duration = String(data.get("duration") || "").trim();
      const isrc = String(data.get("isrc") || "").trim().toUpperCase();
      const territories = String(data.get("territories") || "")
        .split(",").map((code) => code.trim().toUpperCase()).filter(Boolean);
      if (duration && !/^(?:[0-5]?\d):[0-5]\d$/.test(duration)) {
        notify("Enter duration as minutes:seconds, such as 3:42.", true);
        return;
      }
      if (isrc && !/^[A-Z]{2}[A-Z0-9]{3}\d{7}$/.test(isrc)) {
        notify("An ISRC must contain 12 characters in the standard format.", true);
        return;
      }
      if (territories.some((code) => !/^[A-Z]{2}$/.test(code)) || new Set(territories).size !== territories.length) {
        notify("Use unique two-letter territory codes, separated by commas.", true);
        return;
      }
      state.artist.name = String(data.get("artist") || "Mara Bloom").trim();
      state.artist.genre = String(data.get("genre") || "Indie pop").trim();
      state.release = {
        ...state.release,
        title: String(data.get("song") || "Glasshouse").trim(),
        kind: String(data.get("kind") || "Single"),
        releaseDate,
        duration,
        language: String(data.get("language") || "").trim(),
        territories,
        isrc,
        description: String(data.get("description") || "").trim(),
        contributors: String(data.get("contributors") || "").trim(),
        explicit: data.has("explicit"),
        rightsConfirmed: data.has("rightsConfirmed")
      };
      const formattedDate = releaseDate
        ? new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(`${releaseDate}T12:00:00Z`))
        : "Date to be confirmed";
      state.campaigns.forEach((campaign) => {
        if (campaign.release === previousTitle) {
          campaign.release = state.release.title;
          campaign.releaseDate = formattedDate;
          if (campaign.title.startsWith(`${previousTitle} —`)) {
            campaign.title = `${state.release.title}${campaign.title.slice(previousTitle.length)}`;
          }
        }
      });
      addAudit("Song Passport release details updated");
      save(); render(); closeModal(); notify("Song Passport updated in this demo.");
    }
  }

  function createCampaign() { openModal(campaignForm()); }
  function editPassport() { openModal(passportForm(), "icon-edit"); }

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
    if (action === "campaign-open") openCampaign(id);
    if (action === "campaign-checklist") { closeModal(); showView("passport"); }
    if (action === "opportunity-details") openOpportunityDetails(id);
    if (action === "toggle-save") {
      const position = state.savedOpportunityIds.indexOf(id);
      const item = opportunities.find((opportunity) => opportunity.id === id);
      if (position === -1) { state.savedOpportunityIds.push(id); addAudit(`Opportunity saved for review: ${item ? item.name : "Sample opportunity"}`); notify("Sample opportunity saved for later."); }
      else { state.savedOpportunityIds.splice(position, 1); notify("Opportunity removed from your saved list."); }
      save(); renderOpportunities();
    }
    if (action === "request-review") {
      const item = opportunities.find((opportunity) => opportunity.id === id);
      if (item && !state.approvals.some((approval) => approval.opportunityId === item.id && approval.status === "Pending")) {
        state.approvals.unshift({ id: `approval-${Date.now()}`, opportunityId: item.id, kind: "Opportunity review", icon: "icon-compass", title: `${item.name} · Opportunity review`, description: "Review this sample opportunity and decide whether to explore it further.", detail: "This creates a note for your team to review the source and terms with you. It will not contact the organization or share your music.", requestedBy: state.artist.name, requested: "Just now", status: "Pending" });
        addAudit(`Review requested: ${item.name}`); save(); render(); closeModal(); showView("approvals"); notify("Review request added to your approvals.");
      }
    }
    if (action === "approval-details") openApprovalDetails(id);
    if (action === "decide") decide(id, actionElement.dataset.decision);
    if (action === "later") notify("Left in your approvals for whenever you’re ready.");
    if (action === "go-approvals") { closeModal(); showView("approvals"); }
  });

  document.addEventListener("submit", formSubmit);
  $("#new-campaign").addEventListener("click", createCampaign);
  $("#new-campaign-alt").addEventListener("click", createCampaign);
  $("#edit-passport").addEventListener("click", editPassport);
  $("#settings-edit-profile").addEventListener("click", editPassport);
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
  $("#notification-button").addEventListener("click", () => notify("You’re all caught up. This is a demo workspace."));
  $("#account-menu").addEventListener("click", () => notify("You’re signed in to the Mara Bloom demo workspace."));
  $("#activity-more").addEventListener("click", () => notify("Showing recent sample activity."));
  $("#range-select").addEventListener("click", (event) => { event.currentTarget.textContent = event.currentTarget.textContent.includes("30") ? "Last 7 days ⌄" : "Last 30 days ⌄"; notify("Chart range updated. Demo chart values are illustrative."); });
  $("#sort-campaigns").addEventListener("click", () => { state.campaigns.reverse(); renderCampaigns(); notify("Campaign order updated."); });
  $("#opportunity-sort").addEventListener("click", (event) => { event.currentTarget.textContent = event.currentTarget.textContent.includes("Best") ? "Recently added ⌄" : "Best fit ⌄"; notify("Sample opportunity order updated."); });
  $("#opportunity-info").addEventListener("click", () => openModal(`${modalTitle("How NOTE matching works", "Matching should help you decide what deserves a closer look.")}<div class="detail-source"><strong>Signals considered</strong><p>Release timing, genres and moods you share, the kind of opportunity, audience and location fit, and terms that may need checking.</p></div><ul class="modal-list"><li><span class="icon icon-check"></span>Every match includes the reasons it appeared.</li><li><span class="icon icon-check"></span>A higher fit score is only a sorting aid, not a promise.</li><li><span class="icon icon-check"></span>Sample entries are fictional and have not been verified as real opportunities.</li></ul><div class="modal-footer"><button class="button button-primary" data-action="close-modal">Got it</button></div>`, "icon-info"));
  $("#add-clean").addEventListener("click", () => openModal(`${modalTitle("Add a clean version", "For this demo, you can mark a sample clean version as included in your release kit.")}<div class="modal-warning"><span class="icon icon-info"></span><span>This only changes the sample Song Passport. It doesn’t upload a file.</span></div><div class="modal-footer"><button class="button button-secondary" data-action="close-modal">Cancel</button><button class="button button-primary" id="confirm-clean">Mark as added</button></div>`, "icon-wave"));
  $("#rights-info").addEventListener("click", () => openModal(`${modalTitle("Rights & credits", "Ownership details should be clear before music or likeness is shared.")}<div class="detail-source"><strong>Current sample status</strong><p>The artist has self-reported that they can promote this recording. No contracts or ownership documents have been checked.</p></div><div class="modal-warning"><span class="icon icon-shield"></span><span>NOTE does not give legal advice. Agreements, licenses, exclusivity, and rights transfers require your own review and explicit approval.</span></div><div class="modal-footer"><button class="button button-primary" data-action="close-modal">Understood</button></div>`, "icon-lock"));
  $("#add-link").addEventListener("click", () => openModal(`${modalTitle("Release link", "Link sharing is disabled in this local demo.")}<div class="field"><label for="release-link">Private preview link</label><input id="release-link" type="url" placeholder="https://…" disabled /><span class="field-hint">No connected services are enabled.</span></div><div class="modal-footer"><button class="button button-primary" data-action="close-modal">Close</button></div>`, "icon-link"));
  $("#ask-manager").addEventListener("click", () => notify("Team messaging is not connected in this demo."));
  $("#invite-team").addEventListener("click", () => notify("Team invites are disabled in this demo. No email was sent."));
  $("#export-report").addEventListener("click", () => {
    const rows = [["Metric", "Sample value"], ["People reached", "18420"], ["Intent signals", "1284"], ["Editorial features", "54%"], ["Radio & podcasts", "27%"], ["Live & events", "13%"], ["Other discovery", "6%"], ["Campaign spend", "$0.00"], ["Notice", "Illustrative sample data only"]];
    const csv = rows.map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob); const anchor = document.createElement("a");
    anchor.href = url; anchor.download = "note-sample-report.csv"; anchor.click(); URL.revokeObjectURL(url); notify("Sample report exported.");
  });

  modalContent.addEventListener("click", (event) => {
    if (event.target.closest("#confirm-clean")) { state.cleanVersion = true; addAudit("Clean version marked as added to sample Song Passport"); save(); renderReadiness(); closeModal(); notify("Sample clean version added to the Song Passport."); }
  });

  render();
  loadServerState();
})();
