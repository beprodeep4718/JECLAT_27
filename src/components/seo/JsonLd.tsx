import { fest, IS_DEMO } from "@/data/fest";
import { lineup } from "@/data/lineup";
import { passes } from "@/data/passes";
import { seo, SITE_URL } from "@/lib/site";

/**
 * schema.org data so Google can show JECLAT as an event (date, venue, organiser)
 * in search results. Ticket prices and performers are left out while IS_DEMO is
 * true, so placeholder prices and artist names never reach search results.
 * Check it with https://search.google.com/test/rich-results after deploying.
 */
export function JsonLd() {
  const orgId = `${SITE_URL}/#organizer`;
  const address = {
    "@type": "PostalAddress",
    addressLocality: fest.postal.locality,
    addressRegion: fest.postal.region,
    postalCode: fest.postal.postalCode,
    addressCountry: fest.postal.country,
  };
  const sameAs = fest.socials.flatMap((s) => ("href" in s && s.href ? [s.href] : []));

  const event: Record<string, unknown> = {
    "@type": "Festival",
    "@id": `${SITE_URL}/#event`,
    name: seo.name,
    alternateName: `${seo.name}: ${fest.theme.title}, ${fest.theme.subtitle}`,
    description: seo.description,
    url: `${SITE_URL}/`,
    image: [`${SITE_URL}/opengraph-image`],
    startDate: fest.startsAt,
    endDate: fest.endsAt,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    inLanguage: ["en", "bn", "hi"],
    location: { "@type": "Place", name: fest.college, address },
    organizer: { "@id": orgId },
  };

  if (!IS_DEMO) {
    event.offers = passes.map((p) => ({
      "@type": "Offer",
      name: p.title,
      price: p.price,
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
      url: p.buyUrl ?? `${SITE_URL}/#passes`,
    }));
    event.performer = lineup.map((a) => ({ "@type": "PerformingGroup", name: a.name }));
  }

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollegeOrUniversity",
        "@id": orgId,
        name: fest.college,
        alternateName: fest.collegeShort,
        address,
        ...(sameAs.length ? { sameAs } : {}),
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: `${SITE_URL}/`,
        name: seo.name,
        inLanguage: "en-IN",
        publisher: { "@id": orgId },
      },
      event,
    ],
  };

  return (
    <script
      type="application/ld+json"
      // escape "<" so nothing in the data can close the script tag
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph).replace(/</g, "\\u003c") }}
    />
  );
}
