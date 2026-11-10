import type { Faq, Partner } from "./types";

/** Demo answers. */
export const faqs: Faq[] = [
  { question: "Who can attend?", answer: "Students from any college with a valid ID, plus anyone holding a pass. JGEC students get in with their college ID." },
  { question: "Do competitions need a pass?", answer: "Competition registration is separate from fest entry. Registered participants get a participant band for the days they compete." },
  { question: "Is there accommodation?", answer: "Outstation teams can request limited hostel accommodation when they register. Requests close on 1 April." },
  { question: "Can I transfer my pass?", answer: "Passes are non-refundable but can be transferred to another person until 7 April." },
];

/** Sponsor slots. Add `name` and `logo` (a path in /public) as deals close. */
export const partners: Partner[] = [
  { tier: "Title sponsor" },
  { tier: "Powered by" },
  { tier: "Associate" },
  { tier: "Media partner" },
  { tier: "Food partner" },
  { tier: "Merch partner" },
];
