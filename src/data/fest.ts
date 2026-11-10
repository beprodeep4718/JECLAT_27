import type { ReachItem, Social, Stat } from "./types";

/**
 * While true, every section shows a small "Demo" badge so nobody mistakes
 * placeholder content for the real announcement. Flip to false once the
 * official data is in.
 */
export const IS_DEMO = true;

export const fest = {
  name: "JECLAT",
  year: 2027,
  shortYear: "’27",
  tagline: "North Bengal's biggest socio-cultural fest",
  college: "Jalpaiguri Government Engineering College",
  collegeShort: "JGEC",
  /**
   * Canonical address of the site (the domain that does NOT redirect).
   * Vercel's NEXT_PUBLIC_SITE_URL env var overrides it.
   */
  siteUrl: "https://www.jeclat.in",
  /** Countdown target (IST) */
  startsAt: "2027-04-09T10:00:00+05:30",
  /** Used for search-engine event data */
  endsAt: "2027-04-11T23:00:00+05:30",
  dateLabel: "9 · 10 · 11 Apr 2027",
  dateRange: "9–11 Apr 2027",
  venue: "JGEC campus, Jalpaiguri",
  address: ["Jalpaiguri Government Engineering College", "Jalpaiguri, West Bengal 735102"],
  postal: { locality: "Jalpaiguri", region: "West Bengal", postalCode: "735102", country: "IN" },
  heroLede:
    "North Bengal's biggest socio-cultural fest. Three nights of Desi hip-hop, street theatre, cyphers and crew battles.",

  theme: {
    title: "Mosphit",
    subtitle: "The Final Verse",
    inspirationBn: "মুখোশ",
    inspirationEn: "Mukhosh",
    inspirationNote: "the mask we show the world",
    paragraphs: [
      "Inspired by Mukosh, a journey — it’s a lyrical war between the identity we show the world and the truth we bury within. Fueled by the raw energy of Desi hip-hop, hard-hitting bass, street-inspired flows, and poetry that cuts deep, every beat speaks of rebellion.",
      "As the bass drops, the streets echo, we dive into a world of inner conflicts and broken identities. Through unfiltered lyrics, explosive rhythms the masks begin to crack, the silence turns into beat.",
    ],
    quote: "This isn't just hip-hop. This is the sound of the masks falling.",
  },

  stats: [
    { value: 3, label: "Nights, from Verse I to the Final Verse" },
    { value: 25, suffix: "+", label: "Events across music, dance, theatre and art" },
    { value: 3.2, decimals: 1, prefix: "₹", suffix: "L", label: "Prize pool across eight competitions" },
    { value: 20, suffix: "K+", label: "Expected footfall over three days" },
  ] satisfies readonly Stat[],

  reach: [
    { label: "New Jalpaiguri (NJP) railway station", value: "~40 km" },
    { label: "Bagdogra Airport (IXB)", value: "~50 km" },
    { label: "Fest shuttle", value: "Town station ↔ JGEC" },
    { label: "Gates open", value: "09:30 daily" },
  ] satisfies readonly ReachItem[],

  socials: [
    { label: "Instagram", handle: "@jeclat.jgec" },
    { label: "YouTube", handle: "JECLAT Official" },
    { label: "Facebook", handle: "JECLAT JGEC" },
  ] satisfies readonly Social[],

  contacts: ["Contacts to be added", "Sponsorship enquiries to be added"],

  rewind: {
    title: "JECLAT ’26",
    sub: "Last year's aftermovie and photo galleries go here once the media team sends them over.",
    film: { caption: "Aftermovie · JECLAT ’26 · 02:48", href: undefined as string | undefined },
    frames: ["Photo slot · Pro Night ’26", "Photo slot · Crew Clash ’26"],
  },

  notes: {
    stats: "Figures are placeholders until official numbers are in.",
    passes: "JGEC students enter free with college ID. Pro Night pit access needs a Deluxe Pass.",
    faq: "Final rules come from the organising committee.",
  },
} as const;

export type Fest = typeof fest;
