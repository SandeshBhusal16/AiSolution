/**
 * Shared option lists and labels used across forms, validation and the admin
 * dashboard. Keeping them in one place means the public forms and the admin
 * analytics always agree on the same set of values.
 */

/** Services AI-Solution offers (used by demo + contact forms). */
export const SERVICES = [
  "AI-powered virtual assistant",
  "Prototyping solution",
  "Software assistance",
  "Sales representative",
] as const;

export type Service = (typeof SERVICES)[number];

/** Inquiry types for the general contact form. */
export const INQUIRY_TYPES = [
  "Schedule demo",
  "Join promotional event",
  "AI virtual assistant",
  "Prototyping solution",
  "Sales representative",
] as const;

export type InquiryType = (typeof INQUIRY_TYPES)[number];

/** Workflow status applied to every customer record. */
export const STATUSES = ["New", "Contacted", "In Progress", "Completed"] as const;

export type Status = (typeof STATUSES)[number];

export const DEFAULT_STATUS: Status = "New";

/** Reasonable country list for the prototype (not exhaustive). */
export const COUNTRIES = [
  "United Kingdom",
  "United States",
  "Canada",
  "Ireland",
  "Germany",
  "France",
  "Spain",
  "Italy",
  "Netherlands",
  "Sweden",
  "Norway",
  "Denmark",
  "Switzerland",
  "Australia",
  "New Zealand",
  "India",
  "Nepal",
  "Bangladesh",
  "Pakistan",
  "Sri Lanka",
  "China",
  "Japan",
  "South Korea",
  "Singapore",
  "Malaysia",
  "United Arab Emirates",
  "Saudi Arabia",
  "Qatar",
  "South Africa",
  "Nigeria",
  "Kenya",
  "Brazil",
  "Mexico",
  "Argentina",
  "Other",
] as const;

export type Country = (typeof COUNTRIES)[number];

/** Colour palette for Recharts (brand blue / cyan / purple family). */
export const CHART_COLORS = [
  "#2563eb",
  "#06b6d4",
  "#7c3aed",
  "#0ea5e9",
  "#8b5cf6",
  "#14b8a6",
  "#f59e0b",
  "#ef4444",
  "#10b981",
  "#ec4899",
];

/** Allowed image upload mime types + extensions for event images. */
export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const ALLOWED_IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];

export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

/** Public marketing navigation. */
export const PUBLIC_NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/schedule-demo", label: "Schedule Demo" },
  { href: "/events", label: "Events" },
  { href: "/contact", label: "Contact" },
];
