import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// One page for now. Add an entry here for every new route (e.g. /events/cypher).
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 }];
}
