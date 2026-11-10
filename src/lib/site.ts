import { fest } from "@/data/fest";

/** Canonical origin, no trailing slash. NEXT_PUBLIC_SITE_URL (set in Vercel) wins over the value in fest.ts. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || fest.siteUrl).replace(/\/+$/, "");

const festName = `${fest.name} ${fest.year}`;
const themeName = `${fest.theme.title}: ${fest.theme.subtitle}`;

export const seo = {
  name: festName,
  /** <title>: ~55 characters so Google doesn't cut it */
  title: `${festName} – ${themeName} | ${fest.collegeShort} Jalpaiguri`,
  /** Shorter title for WhatsApp / Instagram / X cards */
  socialTitle: `${festName} · ${themeName}`,
  /** ~155 characters */
  description: `${fest.tagline} at ${fest.college}. Desi hip-hop, cyphers, crew battles and Pro Nights, ${fest.dateRange}.`,
  keywords: [
    fest.name,
    festName,
    `${fest.name} ${fest.collegeShort}`,
    `${fest.collegeShort} fest`,
    fest.college,
    "JGEC Jalpaiguri",
    "North Bengal college fest",
    "socio-cultural fest West Bengal",
    "Jalpaiguri events",
    "Siliguri college fest",
    themeName,
    "Desi hip-hop fest",
  ],
  ogAlt: `${festName} – ${themeName}. ${fest.tagline}, ${fest.dateRange} at ${fest.collegeShort}, Jalpaiguri.`,
};
