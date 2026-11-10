import type { Verse } from "./types";

/** Demo schedule. Each day is a "verse" of the theme: the mask goes on, cracks, falls. */
export const verses: Verse[] = [
  {
    id: "verse-1",
    numeral: "১",
    name: "Verse I",
    dateLabel: "Fri 9 Apr",
    chapter: "The Mask",
    side: "A",
    blurb: "The mask goes on. Opening ceremony, prelims and the first culture night.",
    tracks: [
      { time: "10:00", title: "Inauguration", venue: "Main Auditorium", category: "Ceremony" },
      { time: "11:30", title: "Kobita Slam prelims", venue: "Seminar Hall", category: "Spoken word" },
      { time: "13:00", title: "Nukkad Natak prelims", venue: "Admin Lawn", category: "Theatre" },
      { time: "15:00", title: "Graffiti Jam opens", venue: "Canteen Wall", category: "Art" },
      { time: "16:30", title: "Mukhosh Walk auditions", venue: "Main Stage", category: "Fashion" },
      { time: "19:30", title: "Culture Night: Naya Nukkad, Rhyme Rickshaw", venue: "Main Stage", category: "Night", highlight: true },
    ],
  },
  {
    id: "verse-2",
    numeral: "২",
    name: "Verse II",
    dateLabel: "Sat 10 Apr",
    chapter: "The Crack",
    side: "B",
    blurb: "The mask cracks. Battles from morning to sundown, then Pro Night I.",
    tracks: [
      { time: "10:00", title: "Cypher, round one", venue: "Open Air Theatre", category: "Rap" },
      { time: "12:00", title: "Beatbox Battle", venue: "Open Air Theatre", category: "Rap" },
      { time: "14:00", title: "Crew Clash", venue: "Main Stage", category: "Dance" },
      { time: "16:00", title: "Battle of Bands", venue: "Main Stage", category: "Music" },
      { time: "19:00", title: "Pro Night I: Mahananda MCs, Dooars Drift, DJ Teesta", venue: "Main Stage", category: "Night", highlight: true },
    ],
  },
  {
    id: "verse-3",
    numeral: "৩",
    name: "Final Verse",
    dateLabel: "Sun 11 Apr",
    chapter: "The Fall",
    side: "C",
    blurb: "The mask falls. Finals, prizes and the headline set.",
    tracks: [
      { time: "10:30", title: "Cypher finals", venue: "Open Air Theatre", category: "Rap" },
      { time: "12:30", title: "Nukkad Natak finals", venue: "Admin Lawn", category: "Theatre" },
      { time: "14:30", title: "Mukhosh Walk finals", venue: "Main Stage", category: "Fashion" },
      { time: "17:00", title: "Prize night", venue: "Main Auditorium", category: "Ceremony" },
      { time: "20:00", title: "Pro Night II: Boombap Baul and the headliner", venue: "Main Stage", category: "Night", highlight: true },
    ],
  },
];
