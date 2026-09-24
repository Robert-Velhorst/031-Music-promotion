export type Profile = {
    id?: string;
    artistName: string;
    genre: string;
    bio: string;
    homeTerritory: string;
    languages: string[];
    territories: string[];
    website: string;
    distributor: string;
    publisher: string;
    pro: string;
    neighbouringRights: string;
    prohibitedContexts: string;
    contactPreferences: string;
};

export type Release = {
    id?: string;
    title: string;
    version: string;
    releaseType: 'Single' | 'EP' | 'Album' | 'Other';
    genre: string;
    language: string;
    releaseDate: string;
    territories: string[];
    isrc: string;
    iswc: string;
    upc: string;
    contributors: string;
    ownershipNote: string;
    sampleClearance: string;
    permittedUses: string;
    publicLink: string;
    artistAuthorityConfirmed: boolean;
    rightsEvidenceNote: string;
    archived?: boolean;
};

export type Campaign = {
    id?: string;
    title: string;
    releaseId: string;
    objective: string;
    startDate: string;
    endDate: string;
    channels: string[];
    territories: string[];
    languages: string[];
    exclusions: string;
    budgetCap: number;
    budgetCurrency: string;
    actionTarget: number | null;
    pitchDraft: string;
    pitchApproved: boolean;
    status?: 'Draft' | 'Ready' | 'Active' | 'Paused' | 'Completed';
};

export type Lead = {
    id?: string;
    name: string;
    channel: string;
    publicUrl: string;
    territory: string;
    fitReason: string;
    requirements: string;
    contactRoute: string;
    feeDisclosure: string;
    contactReviewed: boolean;
    suppressed: boolean;
    suppressionReason?: string;
};

export type Activity = {
    id?: string;
    campaignId: string;
    leadId: string;
    eventType: string;
    occurredOn: string;
    notes: string;
    evidenceUrl: string;
};

export type Royalty = {
    id?: string;
    releaseId: string;
    category: string;
    source: string;
    reportingPeriod: string;
    statementDate: string;
    currency: string;
    amount: number;
    statementReference: string;
    provenance: string;
    lineNumber?: number;
    sourceCategory?: string;
    importKey?: string;
};

export type RecordKind = 'releases' | 'campaigns' | 'leads' | 'actions' | 'royalties';
export type PageKind = 'profiles' | RecordKind;

export type Workspace = {
    profile: Profile | null;
    releases: Release[];
    campaigns: Campaign[];
    leads: Lead[];
    actions: Activity[];
    royalties: Royalty[];
    pages: Record<PageKind, string | null>;
};

export const emptyProfile: Profile = {
    artistName: '', genre: '', bio: '', homeTerritory: '', languages: [], territories: [],
    website: '', distributor: '', publisher: '', pro: '', neighbouringRights: '',
    prohibitedContexts: '', contactPreferences: '',
};

export const emptyRelease: Release = {
    title: '', version: '', releaseType: 'Single', genre: '', language: '', releaseDate: '',
    territories: [], isrc: '', iswc: '', upc: '', contributors: '', ownershipNote: '',
    sampleClearance: '', permittedUses: '', publicLink: '', artistAuthorityConfirmed: false,
    rightsEvidenceNote: '',
};

export const emptyCampaign: Campaign = {
    title: '', releaseId: '', objective: '', startDate: '', endDate: '', channels: [],
    territories: [], languages: [], exclusions: '', budgetCap: 0, budgetCurrency: 'EUR',
    actionTarget: null, pitchDraft: '', pitchApproved: false, status: 'Draft',
};

export const emptyLead: Lead = {
    name: '', channel: 'Editorial', publicUrl: '', territory: '', fitReason: '', requirements: '',
    contactRoute: '', feeDisclosure: '', contactReviewed: false, suppressed: false,
};

export const emptyActivity: Activity = {
    campaignId: '', leadId: '', eventType: 'Researched', occurredOn: '', notes: '', evidenceUrl: '',
};

export const emptyRoyalty: Royalty = {
    releaseId: '', category: 'Master royalties', source: '', reportingPeriod: '', statementDate: '',
    currency: 'EUR', amount: 0, statementReference: '', provenance: 'Artist-entered',
};

export const recordKinds: RecordKind[] = ['releases', 'campaigns', 'leads', 'actions', 'royalties'];

export const countries = [
    ['AU', 'Australia'], ['BE', 'Belgium'], ['BR', 'Brazil'], ['CA', 'Canada'], ['DE', 'Germany'],
    ['DK', 'Denmark'], ['ES', 'Spain'], ['FR', 'France'], ['GB', 'United Kingdom'], ['IE', 'Ireland'],
    ['IT', 'Italy'], ['JP', 'Japan'], ['NL', 'Netherlands'], ['NO', 'Norway'], ['SE', 'Sweden'],
    ['US', 'United States'],
] as const;

export const channels = ['Editorial', 'Radio', 'Press', 'Podcast', 'Creator', 'Sync', 'Community', 'Direct-to-fan', 'Other'];
export const activityTypes = ['Researched', 'Prepared', 'Sent by artist', 'Response', 'Accepted', 'Published', 'Declined', 'Follow-up', 'Other'];
export const royaltyCategories = ['Master royalties', 'Composition/performance', 'Neighbouring rights', 'Sync/licence', 'Direct-to-fan', 'Live', 'Other'];
