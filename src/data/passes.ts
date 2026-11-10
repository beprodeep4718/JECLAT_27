import type { Pass } from "./types";

/** Demo passes, styled as record pressings. Prices are placeholders, in rupees. */
export const passes: Pass[] = [
  {
    id: "single",
    format: "7″ Single",
    inches: 7,
    rpm: "45",
    title: "Day Pass",
    price: 299,
    per: "/ day",
    perks: ["One verse of your choice", "All events and that night's show", "Standing zone at the Pro Night"],
    cta: "Get the Single",
  },
  {
    id: "ep",
    format: "10″ EP",
    inches: 10,
    rpm: "33⅓",
    title: "Fest Pass",
    price: 699,
    per: "/ 3 days",
    perks: ["All three verses", "Both Pro Nights", "Fast-lane entry at the gate"],
    cta: "Get the EP",
  },
  {
    id: "lp",
    format: "12″ LP · Deluxe",
    inches: 12,
    rpm: "33⅓",
    title: "Deluxe Pass",
    price: 1499,
    per: "/ 3 days",
    perks: ["All three verses", "Fan pit at both Pro Nights", "JECLAT tee and the mask"],
    cta: "Get the LP",
    badge: "Only 300 pressed",
  },
];
