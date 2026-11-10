import type { Act } from "./types";

/** Demo lineup. These artist names are fictional placeholders. */
export const lineup: Act[] = [
  {
    name: "Kaalo Megh",
    initials: "KM",
    genre: "Desi hip-hop, live band",
    slot: "Sun 11 Apr · 21:30 · Pro Night II, closing set",
    tier: 1,
    masked: { label: "Headliner unmasks 01 Mar", hint: "Tap to peek", revealNote: "Headliner · revealed 01 Mar" },
  },
  { name: "DJ Teesta", initials: "DT", genre: "Bass, Desi trap", slot: "Sat 10 Apr · 21:00", tier: 2 },
  { name: "Boombap Baul", initials: "BB", genre: "Baul folk over boom bap", slot: "Sun 11 Apr · 20:00", tier: 2 },
  { name: "Dooars Drift", initials: "DD", genre: "Indie rap collective", slot: "Sat 10 Apr · 20:00", tier: 3 },
  { name: "Rhyme Rickshaw", initials: "RR", genre: "Bangla rap", slot: "Fri 9 Apr · 20:30", tier: 3 },
  { name: "Naya Nukkad", initials: "NN", genre: "Street-theatre hip-hop", slot: "Fri 9 Apr · 19:30", tier: 3 },
  { name: "Mahananda MCs", initials: "MM", genre: "Cypher crew", slot: "Sat 10 Apr · 19:00", tier: 3 },
];
