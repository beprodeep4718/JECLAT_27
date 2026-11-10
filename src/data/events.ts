import type { Competition } from "./types";

/** Demo competitions. Prize pools are placeholders, in rupees. */
export const competitions: Competition[] = [
  { slug: "cypher", name: "Cypher", category: "Rap", verses: "Verse II–III", glyph: "C", description: "Rap battle. One beat, sixty seconds a round, and the crowd breaks the tie.", prizePool: 50000, team: "Solo" },
  { slug: "beatbox", name: "Beatbox Battle", category: "Rap", verses: "Verse II", glyph: "B", description: "Mouth, mic and nothing else. A knockout bracket of sixteen.", prizePool: 20000, team: "Solo" },
  { slug: "crew-clash", name: "Crew Clash", category: "Dance", verses: "Verse II", glyph: "X", description: "Street dance crews face off in hip-hop, krump, popping and house.", prizePool: 60000, team: "6–12" },
  { slug: "battle-of-bands", name: "Battle of Bands", category: "Music", verses: "Verse II", glyph: "B", description: "Twenty-five minute live sets. Original songs earn bonus points.", prizePool: 75000, team: "3–8" },
  { slug: "mukhosh-walk", name: "Mukhosh Walk", category: "Fashion", verses: "Verse I–III", glyph: "M", description: "The theme fashion show. Build a look around the mask you wear.", prizePool: 40000, team: "8–14" },
  { slug: "nukkad-natak", name: "Nukkad Natak", category: "Theatre", verses: "Verse I–III", glyph: "N", description: "Street play with no stage and no mics. Fifteen minutes to hold the crowd.", prizePool: 35000, team: "10–20" },
  { slug: "kobita-slam", name: "Kobita Slam", category: "Spoken word", verses: "Verse I–III", glyph: "K", description: "Poetry in Bangla, Hindi or English. Three minutes, no props.", prizePool: 15000, team: "Solo" },
  { slug: "graffiti-jam", name: "Graffiti Jam", category: "Art", verses: "Verse I–II", glyph: "G", description: "One wall, one theme, forty-eight hours. Spray, stencil or brush.", prizePool: 25000, team: "Duo" },
];

export const totalPrizePool = competitions.reduce((sum, c) => sum + c.prizePool, 0);
