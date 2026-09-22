# NOTE — Music Promotion

NOTE is an artist-first platform for independent music creators. This repository specifies NOTE's Promotion pillar and its first implementation scope.

The official product name is NOTE. This repository covers Promotion; it does not define or implement all ten NOTE platform pillars. The Promotion MVP remains artist-first and does not add recipient accounts or a curator-facing submission portal.

## Product status

## Interactive demo

A runnable front-end prototype is in [`demo/`](demo/README.md). It uses fictional opportunities and illustrative metrics; approval controls record local demo decisions and do not contact anyone, publish content, or spend money.

This repository contains the implementation specification for NOTE's Promotion product. The name is NOTE. The MVP scope and acceptance criteria are defined below.

## 1. Product vision

NOTE's Promotion pillar should make professional music promotion accessible to creators who make and release music but do not have a label, promotion team, large network, or live-performance career.

Today, music promotion is fragmented. Artists must discover suitable YouTube channels, radio stations, playlists, blogs, podcasts, creators, communities, and submission platforms; understand different requirements; write messages; complete forms; follow up; and manually combine the resulting statistics and income reports. This work is repetitive, difficult to track, and often produces no response.

The product should turn that fragmented process into one controlled workflow:

1. The artist creates a reusable artist profile.
2. The artist adds a track and its release, rights, and promotional information.
3. The system identifies suitable legitimate promotion opportunities.
4. The artist approves campaign boundaries once.
5. The system executes permitted promotion work autonomously.
6. The artist sees exactly what was attempted and what happened.
7. The system learns from each campaign.
8. Promotion, usage, rights, and revenue information are connected after release.

The primary product is promotion. Metadata, rights, attribution, and revenue administration form the supporting back office; they must not become a barrier that prevents an artist from launching a campaign.

## 2. Product principles

### Artist-only product

The application is built exclusively for artists and their authorized team members. It must not contain curator, playlist-owner, radio-station, blogger, or creator accounts or a recipient-facing submission portal.

A future partner network may be managed through internal administration, integrations, or commercial partnerships, but the customer-facing product remains artist-only.

### Autopilot with boundaries

After setup and campaign authorization, the system may autonomously perform free, reversible, and pre-approved promotional actions.

Separate artist approval is always required before:

- spending money;
- accepting a paid placement;
- entering an agreement;
- granting a licence;
- granting exclusivity;
- transferring rights;
- accepting revenue-sharing terms;
- authorizing sensitive associations;
- taking another legally binding or difficult-to-reverse action.

An artist may optionally establish a pre-approved budget and explicit spending rules. Every expense must still be logged.

### Activity, not outcome, guarantee

The product guarantees a configurable minimum amount of qualified promotional activity. It does not guarantee streams, listeners, playlist placement, radio play, editorial coverage, followers, revenue, or commercial success.

A campaign must never be presented as successful merely because a large number of low-quality messages were sent.

### Legitimate promotion only

The product must never use or facilitate:

- artificial streams, views, followers, likes, saves, or comments;
- bots, click farms, listener incentives, or engagement exchanges;
- paid services that guarantee Spotify streams or playlist placement;
- undisclosed sponsorship or paid placement;
- repetitive indiscriminate messaging;
- deceptive identities or impersonation;
- unauthorized uploads or unlicensed use of copyrighted material;
- circumvention of platform controls, access rules, or rate limits.

### No artistic gatekeeping

The system must not reject music because an AI model, employee, or operator predicts that it will not be commercially successful.

Campaign eligibility may be restricted only for objective reasons such as unlawful content, missing authority to promote the recording, incompatible technical files, fraud, safety, unavailable delivery routes, or platform-policy constraints. The user must receive a clear reason and a remedy where possible.

### One canonical source of truth

Artist, track, release, rights, promotion, placement, and revenue data should be connected rather than copied into unrelated modules.

## 3. Target users

The initial target user is an independent artist, bedroom producer, composer-producer, or small music project that:

- releases original music without a full promotion team;
- may not perform live;
- has limited industry contacts;
- wants promotion to continue without daily manual work;
- needs a transparent record of promotional activity;
- may be registered with a performing-rights organisation such as Buma/Stemra;
- wants to understand where attention and possible income originated.

Authorized managers or collaborators may be supported through artist-team roles, but the artist remains the principal customer.

## 4. Core user journey

### 4.1 Create an artist profile

Collect reusable information once:

- legal and artist names;
- biography and canonical artist story;
- genres, subgenres, moods, themes, and languages;
- home territory and permitted promotion territories;
- official website and social/platform profiles;
- press photographs and approved artwork;
- distributor, label, publisher, PRO/CMO, and neighbouring-rights organisation;
- team members and their permissions;
- prohibited associations or contexts;
- default campaign, contact, approval, and budget preferences.

### 4.2 Create the Song Passport

Each track receives a permanent canonical record containing, where applicable:

- title and version name;
- audio master and approved preview;
- recording type and duration;
- primary and featured artists;
- composers, lyricists, producers, performers, and other contributors;
- master ownership and composition splits;
- ISRC for each distinct recording;
- ISWC when available;
- UPC/EAN for the release;
- distributor and delivery information;
- PRO/CMO work-registration references;
- release date, territories, and platform links;
- lyrics, explicit-content status, genre, mood, language, themes, and instrumentation;
- artwork and press assets;
- sample, cover, remix, and licence information;
- permitted promotional uses;
- an audit history of changes.

An identifier is not proof of ownership. The data model must distinguish identifiers, ownership assertions, registrations, licences, and verified evidence.

A music-video recording and an audio recording may require separate identifiers and records.

### 4.3 Optional Release Readiness Check

The system offers an advisory check for:

- missing contributors or split information;
- missing or inconsistent identifiers;
- broken links or absent assets;
- release timing that limits pre-release opportunities;
- incomplete distributor or PRO information;
- obvious artwork or file-format problems;
- samples, covers, or collaborations that may require clearance;
- inconsistent artist, track, and release metadata.

Most findings are warnings and do not block promotion. The artist may continue after acknowledging them.

A hard block is permitted only where proceeding would create a clear legal, security, fraud, or platform-policy risk. The product must explain the specific blocker and how it can be resolved. It must not claim to provide legal clearance unless the relevant evidence has actually been verified.

### 4.4 Configure a campaign

The artist selects or confirms:

- track and release;
- campaign objective;
- start and end dates;
- territories and languages;
- channel categories;
- exclusions;
- activity package or minimum qualified-action commitment;
- free-action permissions;
- optional budget and spending controls;
- approval rules;
- communication identity and sending account;
- sensitive-use restrictions.

The interface must show, in plain language, what the autopilot may do without further approval.

### 4.5 Plan before and after release

The campaign planner supports:

- pre-release preparation and pitching;
- platform-specific submission windows;
- release-day activity;
- initial post-release outreach;
- follow-up;
- later re-promotion;
- event-, season-, theme-, or trend-related catalog opportunities.

The scheduler must understand that some official opportunities are available only before release. Platform rules and deadlines must be maintained as versioned configuration, not hard-coded assumptions.

### 4.6 Discover and rank opportunities

Find relevant existing and creative promotion routes, including:

- YouTube music channels and suitable video creators;
- terrestrial, online, community, student, and niche radio;
- legitimate independent playlists and official editorial submission routes;
- music blogs, magazines, newsletters, and reviewers;
- podcasts and interview formats;
- DJs, remixers, reaction creators, dancers, streamers, and other relevant creators;
- genre, culture, hobby, game, fitness, film, and other niche communities where the music genuinely fits;
- sync and licensing opportunities;
- local or thematic media;
- approved advertising and platform campaign tools;
- distributor, aggregator, or industry submission services.

Rank opportunities using explainable evidence such as:

- musical and editorial fit;
- audience fit;
- territory and language compatibility;
- submission requirements;
- current activity and contact validity;
- historical response and placement rates;
- observed audience quality;
- expected effort;
- previous relationship with the artist;
- cost and declared commercial terms;
- policy and fraud risk.

The ranking must not create a false claim that a recipient will accept the track.

### 4.7 Prepare approved text materials

AI may assist with text-based promotion, limited to the artist's supplied facts and approved creative boundaries. Supported outputs may include:

- a concise canonical story about the track;
- short and long pitches;
- an electronic press-kit summary;
- a press release;
- submission-form answers;
- factual captions or descriptions;
- follow-up messages.

The system must not invent personal history, achievements, quotes, reviews, audience statistics, endorsements, or musical meaning.

The initial product does not generate videos, artwork, visualizers, audiograms, or demographic/country-specific creative variants. It must not automatically alter the artist's artistic identity to target different markets.

Artists can review and edit reusable canonical text. Generated messages should be adapted only as needed to satisfy the genuine requirements and context of a particular opportunity, not to manipulate recipients.

### 4.8 Execute promotion

Use provider adapters in this order of preference:

1. official APIs and platform integrations;
2. official artist or editorial submission routes;
3. public forms that explicitly permit the intended submission and automation method;
4. permission-based email and other legally permitted direct communication;
5. artist tasks with precise instructions when automation is unavailable or prohibited.

The system may prepare but must not bypass CAPTCHAs, authentication controls, anti-automation measures, terms, or rate limits.

Each attempt runs as an idempotent background job. Retries must be bounded and must not create duplicate submissions.

### 4.9 Follow up and remember relationships

Maintain a complete relationship history for every opportunity:

- discovery source and qualification evidence;
- contact route and preferences;
- previous tracks submitted;
- messages and form submissions;
- delivery/open data when lawfully available;
- replies and feedback;
- promised and completed placements;
- follow-up dates;
- opt-outs, complaints, blocks, and do-not-contact status;
- historical performance for this artist and across the service.

Follow-up rules must be channel-specific, respectful, rate-limited, and immediately stopped after an opt-out or rejection that prohibits further contact.

### 4.10 Track outcomes

Classify campaign events separately:

- discovered;
- qualified;
- prepared;
- awaiting artist action;
- submitted;
- delivered;
- opened, when legitimately measurable;
- replied;
- rejected;
- accepted;
- scheduled;
- published or aired;
- verified placement;
- expired;
- blocked;
- failed;
- withdrawn.

Never equate acceptance, publication, estimated reach, a click, a play, and revenue.

### 4.11 Connect promotion to usage and revenue

Where integrations and data permit, connect:

- campaign actions;
- tracking links;
- placements and airplay;
- platform audience and engagement data;
- distributor statements;
- PRO/CMO registrations and statements;
- master royalties;
- composition/performance royalties;
- neighbouring rights;
- advertising or platform revenue;
- sync/licensing income;
- invoices and settlement status.

Show whether a value is verified, imported, estimated, artist-entered, or inferred. Never present estimated revenue as receivable or paid revenue.

The system should highlight missing registrations, expected reporting periods, unmatched usage, conflicting metadata, and possible under-reporting. It must not claim that PRO registration alone captures every type of music revenue.

## 5. Qualified Promotion Action

A campaign activity counts toward the guarantee only if all applicable rules are satisfied:

1. The opportunity was active and reachable when selected.
2. There is documented evidence of track, audience, editorial, geographic, or contextual fit.
3. The submission follows the recipient's published requirements.
4. The recipient has not opted out and is not on a suppression list.
5. The action is legally and contractually permitted.
6. The message or form content is accurate and sufficiently specific to the opportunity.
7. The action is not an unnecessary duplicate.
8. The action is technically confirmed or its failure is recorded.
9. The action is visible in the artist's audit log.
10. The action is not purchased or manufactured engagement.

Discovery, preparation, failed delivery, and artist-blocked actions are reported but do not automatically count as completed qualified actions.

Campaign packages must define their activity commitment in configuration. Do not hard-code a commercial quantity into the domain model.

If the system cannot complete the promised qualified activity because too few legitimate opportunities exist, it must state this transparently and apply the commercial remedy configured for the package. It must never lower quality thresholds merely to satisfy a counter.

## 6. Opportunity reputation and safety

Maintain an internal reputation profile for promotion sources. Signals may include:

- verified ownership or identity;
- active public presence;
- contact validity;
- actual response history;
- fulfilled versus unfulfilled commitments;
- evidence of genuine audience activity;
- complaint and opt-out rates;
- suspicious traffic patterns;
- undisclosed fees;
- requests for passwords or unsafe access;
- guarantees of streams or playlist placement;
- platform-policy violations;
- repeated artist reports.

Risky sources should be warned, quarantined, or excluded. Automated enforcement must be appealable to an administrator and must preserve evidence.

The product must distinguish a legitimate paid advertisement, disclosed sponsorship, or professional service from prohibited payment for fake engagement or guaranteed editorial placement.

## 7. Catalog Mode

Artists can manage and promote multiple releases as one catalog.

Catalog Mode should:

- identify older tracks with relevant new opportunities;
- detect renewed organic attention;
- match tracks to seasons, events, themes, and legitimate trends;
- avoid repeatedly contacting the same recipient with unsuitable tracks;
- coordinate campaigns so the artist does not compete against their own releases;
- suggest when to start, pause, resume, or retire promotion;
- compare performance without treating popularity as artistic quality.

## 8. Dashboard

The default dashboard answers five questions:

1. What is the system doing now?
2. What has been completed?
3. What needs my approval or action?
4. What produced a response or placement?
5. What usage or revenue may have followed?

Required dashboard areas:

- campaign health and activity commitment;
- actions completed, qualified, failed, and remaining;
- upcoming submission deadlines;
- approvals and artist tasks;
- replies and follow-ups;
- placements and verification status;
- opportunity/channel performance;
- catalog recommendations;
- promotion-source attribution;
- rights and metadata warnings;
- revenue and reconciliation status;
- a complete exportable audit log.

Use accessible language and progressive disclosure. The main interface should not require music-industry or advertising expertise.

## 9. Learning system

The system learns from campaign history to improve:

- opportunity ranking;
- contact validity;
- likely response;
- optimal timing;
- suitable message length and information;
- channel fit;
- follow-up timing;
- fraud detection;
- attribution confidence.

Learning must use legitimate outcomes rather than optimizing for message volume.

For every recommendation or autonomous selection, store:

- model/rule version;
- key input evidence;
- human-readable reason;
- confidence;
- resulting action and outcome.

Artists must be able to correct classifications and exclude opportunities. High-impact policy, legal, financial, or rights decisions may not be delegated solely to a generative model.

## 10. Functional modules

### Artist and team management

- authentication and account recovery;
- artist/team roles;
- least-privilege access;
- approval authority;
- artist and catalog profiles.

### Song Passport and asset store

- structured metadata;
- immutable identifier history;
- contributor and rights records;
- secure object storage;
- versioned assets;
- validation and deduplication.

### Campaign planner

- release-aware scheduling;
- activity commitments;
- channel selection;
- budgets and approvals;
- pause/resume/cancel;
- catalog coordination.

### Opportunity intelligence

- source discovery;
- normalization and deduplication;
- contact verification;
- requirement extraction;
- fit ranking and explanations;
- reputation and risk.

### Promotion executor

- adapter framework;
- email/form/platform jobs;
- message preparation;
- idempotency, retries, and rate limits;
- response ingestion;
- suppression lists;
- complete audit logging.

### Placement and analytics

- placement verification;
- tracking links;
- metric imports;
- source attribution;
- verified versus estimated labels;
- campaign reporting.

### Rights and revenue back office

- identifiers and registrations;
- rights splits and evidence;
- statement imports;
- revenue categories;
- usage-to-revenue matching;
- discrepancy flags;
- exports for accountants or advisers.

### Internal administration

- policy and platform-rule configuration;
- opportunity review;
- abuse and fraud review;
- guarantee-package configuration;
- adapter health;
- manual correction with audit trails.

Internal administration is not a curator product and is not exposed as recipient accounts.

## 11. Suggested technical architecture

Start with a modular monolith and independently running background workers. Avoid premature microservices while preserving clear module boundaries.

Suggested components:

- responsive web client;
- typed application API;
- PostgreSQL as the transactional source of truth;
- encrypted object storage for audio, artwork, evidence, and statements;
- queue/scheduler for discovery, submission, follow-up, imports, and reconciliation;
- provider-neutral AI interface;
- provider adapter framework;
- search/index layer when opportunity volume requires it;
- analytics/event pipeline;
- immutable security and campaign audit logs;
- internal operations console.

All external integrations must declare:

- supported actions;
- authorization method;
- rate limits;
- data provenance;
- current terms/policy version;
- geographic constraints;
- retry and idempotency behavior;
- required human approval;
- capability status and last successful health check.

Platform-specific rules must be updatable without deploying the entire application.

## 12. Conceptual data model

Core entities:

- User
- Artist
- ArtistTeamMember
- ArtistPolicy
- Track
- RecordingVersion
- Release
- Contributor
- RightsShare
- LicenceEvidence
- Identifier
- Registration
- Asset
- Campaign
- CampaignPolicy
- ActivityCommitment
- Opportunity
- PromotionChannel
- ContactMethod
- OpportunityRequirement
- OpportunityReputation
- CampaignAction
- Message
- Submission
- Response
- Approval
- Expense
- Placement
- MetricObservation
- TrackingLink
- UsageRecord
- RevenueStatement
- RevenueLine
- Attribution
- SuppressionEntry
- AuditEvent

Store source, collection time, verification status, and confidence for imported or inferred data.

## 13. Security, privacy, and compliance

Minimum requirements:

- encryption in transit and at rest;
- OAuth or delegated access instead of storing platform passwords where possible;
- encrypted secrets with rotation and revocation;
- least-privilege team roles;
- explicit consent and lawful-purpose records;
- regional direct-marketing rules;
- global and channel-specific suppression lists;
- data retention and deletion controls;
- export of artist data and audit history;
- malware scanning for uploaded files;
- signed URLs and short-lived asset access;
- abuse, fraud, and account-takeover detection;
- tamper-evident logs for approvals, expenses, rights, and submissions;
- incident response and integration kill switches.

Legal rules differ by territory. The production service requires specialist review before automated outreach is enabled in a jurisdiction.

## 14. Accessibility and usability

The product should be usable by artists without industry knowledge.

Requirements:

- WCAG 2.2 AA target;
- plain-language explanations;
- keyboard navigation;
- clear status labels;
- no color-only meaning;
- explicit consequences before approvals;
- reusable defaults;
- a guided first campaign;
- save-and-resume onboarding;
- actionable error messages;
- mobile-readable monitoring and approvals.

## 15. Notifications

Notifications should be event-based and configurable:

- approval required;
- deadline approaching;
- important reply received;
- placement accepted, scheduled, or verified;
- campaign at risk of missing its activity commitment;
- platform integration disconnected;
- potential rights or metadata conflict;
- suspicious promotion source;
- new usage or revenue data;
- reconciliation discrepancy.

Routine autonomous activity should be summarized rather than generating constant alerts.

## 16. MVP scope

Version 1 must include:

- user, artist, and team accounts;
- reusable artist profile and policy settings;
- Song Passport;
- optional advisory release-readiness check;
- campaign setup and explicit autopilot authorization;
- pre- and post-release scheduling;
- opportunity discovery, qualification, ranking, and explanations;
- internal opportunity reputation;
- canonical text story, pitches, press copy, form answers, and follow-ups;
- at least two real compliant promotion adapters;
- permission-based email where legally enabled;
- campaign execution, retries, suppression, and audit logs;
- Qualified Promotion Action accounting;
- configurable activity commitment;
- response and placement tracking;
- relationship memory;
- dashboard and exports;
- basic tracking-link attribution;
- rights, identifier, and revenue-record foundations;
- security, privacy, and administrative controls.

A mock-only integration does not satisfy the adapter requirement. At least one adapter should support an official platform/submission route and one should support another legitimate opportunity class.

## 17. Later phases

### Version 2

- Catalog Mode;
- broader adapter coverage;
- statement and analytics imports;
- usage and revenue reconciliation;
- improved attribution;
- advanced learning and experimentation;
- deeper team workflows;
- optional pre-approved budgets and approved advertising integrations.

### Version 3

- operator-managed partner network without recipient product accounts;
- international rights and royalty integrations;
- large-scale catalog intelligence;
- advanced anomaly and fraud detection;
- increasingly autonomous cross-channel optimization;
- white-label or distributor/label integrations, while preserving an artist-first product.

## 18. Explicit non-goals

The initial product is not:

- a music distributor;
- a record label;
- a PRO/CMO;
- a rights owner;
- a streaming service;
- a social network;
- a curator marketplace or curator portal;
- a generator of music, artwork, or promotional videos;
- a service that guarantees streams, playlist placement, radio play, or income;
- a replacement for legal, tax, or accounting advice;
- a system for judging whether music is artistically good enough.

## 19. Product success measures

Track both effectiveness and safety:

- percentage of promised qualified actions completed;
- time from campaign approval to first completed action;
- qualified opportunity rate;
- delivery, reply, acceptance, and verified-placement rates;
- percentage of actions requiring artist intervention;
- artist time spent per campaign;
- repeat campaign and catalog adoption;
- contact invalidity, complaint, and opt-out rates;
- suspicious-source detection;
- attribution coverage and confidence;
- percentage of placements connected to subsequent usage;
- percentage of revenue lines successfully reconciled;
- artist trust and clarity scores.

Do not use raw message volume as the primary success metric.

## 20. MVP acceptance criteria

The MVP is ready for controlled production testing when:

1. An artist can create a profile and complete a Song Passport.
2. The artist can run or skip the advisory readiness check.
3. The artist can create a release-aware campaign and understand the autopilot boundaries.
4. The system can find, deduplicate, qualify, and explain relevant opportunities.
5. The system excludes opted-out and high-risk contacts.
6. The artist can review canonical text facts and campaign policy before activation.
7. Authorized free actions execute automatically through compliant adapters.
8. Spending and legally binding actions cannot occur without applicable approval.
9. Every campaign action has provenance, status, timestamps, and an audit trail.
10. Only valid Qualified Promotion Actions count toward the configured commitment.
11. Failures and insufficient legitimate opportunities are disclosed rather than hidden.
12. Replies, placements, and follow-ups are connected to the correct artist, track, campaign, and opportunity.
13. The dashboard distinguishes activity, response, placement, usage, and revenue.
14. The system prevents duplicate submissions during retries.
15. The artist can pause or stop a campaign and future queued actions stop safely.
16. The artist can export campaign and Song Passport data.
17. No tested flow purchases or manufactures engagement.
18. Security, privacy, suppression, and incident controls pass review.

## 21. Policy references for implementation

Rules change and must be revalidated during implementation. Initial authoritative references include:

- [Spotify: artificial streaming and services that guarantee streams](https://support.spotify.com/us/artists/article/third-party-services-that-guarantee-streams/)
- [Spotify: pitching music and videos to playlist editors](https://support.spotify.com/us/artists/article/pitching-music-and-videos-to-spotify-playlist-editors/)
- [Spotify: promoting music](https://support.spotify.com/us/artists/article/promoting-music-on-spotify/)
- [YouTube spam policy](https://support.google.com/youtube/answer/2801973)
- [YouTube fake engagement policy](https://support.google.com/youtube/answer/3399767)
- [YouTube Content ID](https://support.google.com/youtube/answer/2797370)
- [IFPI International ISRC Registration Authority](https://isrc.ifpi.org/)
- [European Commission: third-party data and marketing](https://commission.europa.eu/law/law-topic/data-protection/information-business-and-organisations/legal-grounds-processing-data/can-data-received-third-party-be-used-marketing_en)
- [EU ePrivacy Directive](https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX%3A32002L0058)

## 22. First implementation steps

1. Validate the Qualified Promotion Action definition with independent artists.
2. Select the first two compliant opportunity adapters.
3. Model the Song Passport and campaign audit trail.
4. Prototype the guided first-campaign workflow.
5. Build adapter-policy and suppression foundations before enabling autopilot.
6. Run a closed pilot with real releases and manually review every autonomous action.
7. Compare promised activity, artist time saved, response quality, complaints, and placements.
8. Expand channel coverage only after the pilot demonstrates safe, useful execution.

The essential product promise is simple:

> Add a track, define the boundaries once, and receive transparent, legitimate promotional work without having to manage every submission yourself.
