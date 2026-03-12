export interface FieldConfig {
  key: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  colSpan?: 2;
  type?: "url" | "date" | "select";
  options?: { value: string; label: string }[];
}

// ── People ──────────────────────────────────────────────────

export interface PeopleEntry {
  name: string;
  title: string;
  role: string;
}

export const emptyPerson: PeopleEntry = { name: "", title: "", role: "" };

export const PEOPLE_FIELDS: FieldConfig[] = [
  { key: "name", label: "Name", required: true, placeholder: "Full name" },
  { key: "title", label: "Title", placeholder: "e.g. CEO" },
  { key: "role", label: "Role", placeholder: "e.g. Founder" },
];

// ── Milestones ──────────────────────────────────────────────

export interface MilestoneEntry {
  title: string;
  description: string;
  date: string;
}

export const emptyMilestone: MilestoneEntry = { title: "", description: "", date: "" };

export const MILESTONE_FIELDS: FieldConfig[] = [
  { key: "title", label: "Title", required: true, placeholder: "e.g. Company Founded" },
  { key: "date", label: "Date", placeholder: "e.g. 2005-03" },
  { key: "description", label: "Description", placeholder: "Brief description", colSpan: 2 },
];

// ── Videos ──────────────────────────────────────────────────

export interface VideoEntry {
  url: string;
  title: string;
}

export const emptyVideo: VideoEntry = { url: "", title: "" };

export const VIDEO_FIELDS: FieldConfig[] = [
  { key: "url", label: "Video URL", required: true, placeholder: "https://youtube.com/...", type: "url" },
  { key: "title", label: "Title", placeholder: "Video title" },
];

// ── Tags ────────────────────────────────────────────────────

export interface TagEntry {
  tag: string;
}

export const emptyTag: TagEntry = { tag: "" };

export const TAG_FIELDS: FieldConfig[] = [
  { key: "tag", label: "Tag", required: true, placeholder: "e.g. cloud-hosting", colSpan: 2 },
];

// ── Funding ─────────────────────────────────────────────────

export interface FundingEntry {
  roundName: string;
  amount: string;
  date: string;
  investors: string;
}

export const emptyFunding: FundingEntry = { roundName: "", amount: "", date: "", investors: "" };

export const FUNDING_FIELDS: FieldConfig[] = [
  { key: "roundName", label: "Round", placeholder: "e.g. Series A" },
  { key: "amount", label: "Amount", placeholder: "e.g. $10M" },
  { key: "date", label: "Date", placeholder: "e.g. 2020-06" },
  { key: "investors", label: "Investors", placeholder: "e.g. Sequoia, a16z" },
];

// ── Acquisitions ────────────────────────────────────────────

export interface AcquisitionEntry {
  acquiredCompany: string;
  date: string;
  price: string;
  description: string;
}

export const emptyAcquisition: AcquisitionEntry = { acquiredCompany: "", date: "", price: "", description: "" };

export const ACQUISITION_FIELDS: FieldConfig[] = [
  { key: "acquiredCompany", label: "Acquired Company", required: true, placeholder: "Company name" },
  { key: "price", label: "Price", placeholder: "e.g. $500M" },
  { key: "date", label: "Date", placeholder: "e.g. 2019-01" },
  { key: "description", label: "Description", placeholder: "Brief description", colSpan: 2 },
];

// ── Exits ───────────────────────────────────────────────────

export interface ExitEntry {
  exitType: string;
  date: string;
  amount: string;
  acquirer: string;
  description: string;
}

export const emptyExit: ExitEntry = { exitType: "", date: "", amount: "", acquirer: "", description: "" };

export const EXIT_FIELDS: FieldConfig[] = [
  { key: "exitType", label: "Exit Type", required: true, placeholder: "e.g. IPO, Acquisition" },
  { key: "acquirer", label: "Acquirer", placeholder: "Acquiring company" },
  { key: "amount", label: "Amount", placeholder: "e.g. $1B" },
  { key: "date", label: "Date", placeholder: "e.g. 2021-03" },
  { key: "description", label: "Description", placeholder: "Brief description", colSpan: 2 },
];

// ── Partners ────────────────────────────────────────────────

export interface PartnerEntry {
  partnerName: string;
  description: string;
}

export const emptyPartner: PartnerEntry = { partnerName: "", description: "" };

export const PARTNER_FIELDS: FieldConfig[] = [
  { key: "partnerName", label: "Partner Name", required: true, placeholder: "Company name" },
  { key: "description", label: "Description", placeholder: "Partnership details" },
];

// ── Screenshots ─────────────────────────────────────────────

export interface ScreenshotEntry {
  imageUrl: string;
  caption: string;
}

export const emptyScreenshot: ScreenshotEntry = { imageUrl: "", caption: "" };

export const SCREENSHOT_FIELDS: FieldConfig[] = [
  { key: "imageUrl", label: "Image URL", required: true, placeholder: "https://...", type: "url" },
  { key: "caption", label: "Caption", placeholder: "Screenshot description" },
];

// ── Datacenter Links ────────────────────────────────────────

export interface DatacenterLinkEntry {
  datacenterName: string;
}

export const emptyDatacenterLink: DatacenterLinkEntry = { datacenterName: "" };

export const DATACENTER_LINK_FIELDS: FieldConfig[] = [
  { key: "datacenterName", label: "Datacenter Name", required: true, placeholder: "e.g. Equinix DC10", colSpan: 2 },
];

// ── News ────────────────────────────────────────────────────

export interface NewsEntry {
  title: string;
  url: string;
  source: string;
  date: string;
}

export const emptyNews: NewsEntry = { title: "", url: "", source: "", date: "" };

export const NEWS_FIELDS: FieldConfig[] = [
  { key: "title", label: "Title", required: true, placeholder: "Article headline" },
  { key: "url", label: "URL", placeholder: "https://...", type: "url" },
  { key: "source", label: "Source", placeholder: "e.g. TechCrunch" },
  { key: "date", label: "Date", placeholder: "e.g. 2024-01-15" },
];

// ── External Links ──────────────────────────────────────────

export interface ExternalLinkEntry {
  title: string;
  url: string;
}

export const emptyExternalLink: ExternalLinkEntry = { title: "", url: "" };

export const EXTERNAL_LINK_FIELDS: FieldConfig[] = [
  { key: "title", label: "Title", required: true, placeholder: "Link label" },
  { key: "url", label: "URL", required: true, placeholder: "https://...", type: "url" },
];

// ── Sources ─────────────────────────────────────────────────

export interface SourceEntry {
  title: string;
  url: string;
}

export const emptySource: SourceEntry = { title: "", url: "" };

export const SOURCE_FIELDS: FieldConfig[] = [
  { key: "title", label: "Title", placeholder: "Source name" },
  { key: "url", label: "URL", required: true, placeholder: "https://...", type: "url" },
];

// ── Coupons ─────────────────────────────────────────────────

export interface CouponEntry {
  code: string;
  discount: string;
  expiresAt: string;
}

export const emptyCoupon: CouponEntry = { code: "", discount: "", expiresAt: "" };

export const COUPON_FIELDS: FieldConfig[] = [
  { key: "code", label: "Coupon Code", required: true, placeholder: "e.g. SAVE20" },
  { key: "discount", label: "Discount", required: true, placeholder: "e.g. 20% off" },
  { key: "expiresAt", label: "Expires", placeholder: "e.g. 2025-12-31", type: "date" },
];

// ── Degrees ─────────────────────────────────────────────────

export interface DegreeEntry {
  institution: string;
  subject: string;
  degreeType: string;
  graduationYear: string;
}

export const emptyDegree: DegreeEntry = { institution: "", subject: "", degreeType: "", graduationYear: "" };

export const DEGREE_FIELDS: FieldConfig[] = [
  { key: "institution", label: "Institution", required: true, placeholder: "e.g. MIT", colSpan: 2 },
  { key: "subject", label: "Subject", placeholder: "e.g. Computer Science" },
  { key: "degreeType", label: "Degree Type", placeholder: "e.g. B.S., M.S., Ph.D." },
  { key: "graduationYear", label: "Graduation Year", placeholder: "e.g. 2010" },
];

// ── IP Ranges ──────────────────────────────────────────────

export interface IpRangeEntry {
  type: string;
  cidr: string;
  description: string;
}

export const emptyIpRange: IpRangeEntry = { type: "ipv4", cidr: "", description: "" };

export const IP_RANGE_FIELDS: FieldConfig[] = [
  { key: "type", label: "Type", required: true, type: "select", options: [{ value: "ipv4", label: "IPv4" }, { value: "ipv6", label: "IPv6" }] },
  { key: "cidr", label: "CIDR", required: true, placeholder: "e.g. 104.16.0.0/12" },
  { key: "description", label: "Description", placeholder: "e.g. Primary range", colSpan: 2 },
];

// ── Control Panels ─────────────────────────────────────────

export interface ControlPanelEntry {
  name: string;
  version: string;
  isDefault: boolean;
}

export const emptyControlPanel: ControlPanelEntry = { name: "", version: "", isDefault: false };

export const CONTROL_PANEL_FIELDS: FieldConfig[] = [
  { key: "name", label: "Panel Name", required: true, placeholder: "e.g. cPanel" },
  { key: "version", label: "Version", placeholder: "e.g. 11.110" },
];
