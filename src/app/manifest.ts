import type { MetadataRoute } from "next";
import { fest } from "@/data/fest";
import { seo } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: seo.socialTitle,
    short_name: fest.name,
    description: seo.description,
    start_url: "/",
    display: "standalone",
    background_color: "#13070b",
    theme_color: "#13070b",
    lang: "en-IN",
    categories: ["events", "entertainment", "education"],
    icons: [
      { src: "/icon.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
