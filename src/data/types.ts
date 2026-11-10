export type Stat = {
  value: number;
  label: string;
  decimals?: number;
  prefix?: string;
  suffix?: string;
};

export type Track = {
  time: string; // 24h, IST
  title: string;
  venue: string;
  category: string;
  /** Culture / Pro Night rows get the crimson treatment */
  highlight?: boolean;
};

export type Verse = {
  id: string;
  /** Bengali numeral shown on the tab */
  numeral: string;
  name: string;
  dateLabel: string;
  chapter: string;
  /** Vinyl side letter used for track positions (A1, A2, ...) */
  side: "A" | "B" | "C" | "D";
  blurb: string;
  tracks: Track[];
};

export type Act = {
  name: string;
  initials: string;
  genre: string;
  slot: string;
  tier: 1 | 2 | 3;
  photo?: string;
  /** Headliner teaser: name hidden behind a peel-off strip until revealed */
  masked?: { label: string; hint: string; revealNote: string };
};

export type Competition = {
  slug: string;
  name: string;
  category: string;
  verses: string;
  /** Big outlined letter in the card corner */
  glyph: string;
  description: string;
  /** In rupees */
  prizePool: number;
  team: string;
  registerUrl?: string;
};

export type Pass = {
  id: "single" | "ep" | "lp";
  format: string;
  inches: 7 | 10 | 12;
  rpm: "45" | "33⅓";
  title: string;
  /** In rupees */
  price: number;
  per: string;
  perks: string[];
  cta: string;
  badge?: string;
  buyUrl?: string;
};

export type Faq = { question: string; answer: string };

export type Partner = { tier: string; name?: string; logo?: string; href?: string };

export type ReachItem = { label: string; value: string };

export type Social = { label: string; handle: string; href?: string };
