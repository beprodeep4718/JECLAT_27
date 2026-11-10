import { cacheLife } from "next/cache";
import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fest } from "@/data/fest";
import { seo, SITE_URL } from "@/lib/site";

// The link-preview card shown by WhatsApp, Instagram, X, Slack, Google Discover.
// Built at deploy time from src/data/fest.ts, so new dates show up automatically.
export const alt = seo.ogAlt;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const C = {
  night: "#13070b",
  blood: "#a9324b",
  bloodDeep: "#5c1426",
  haldi: "#f5c744",
  paper: "#eee4de",
  smoke: "#c0aaaa",
};

// Cached so the file reads don't make the route dynamic under Cache Components:
// the image is prerendered at build time and served as a static file.
async function loadAssets() {
  "use cache";
  cacheLife("max");
  const read = (path: string) => readFile(join(process.cwd(), "src/assets", path), "base64");
  const [display, mono, body, mask] = await Promise.all([
    read("fonts/BigShoulders-Black.ttf"),
    read("fonts/MartianMono-SemiBold.ttf"),
    read("fonts/FamiljenGrotesk-Medium.ttf"),
    read("og-mask.png"),
  ]);
  return { display, mono, body, mask };
}

export default async function Image() {
  const a = await loadAssets();
  const [display, mono, body] = [a.display, a.mono, a.body].map((b64) => Buffer.from(b64, "base64"));
  const maskSrc = `data:image/png;base64,${a.mask}`;
  const domain = new URL(SITE_URL).host.replace(/^www\./, "");
  const maskH = 470;
  const maskW = Math.round((maskH * 832) / 900);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          backgroundColor: C.night,
          backgroundImage: "radial-gradient(circle at 24% 46%, rgba(169,50,75,0.6) 0%, rgba(19,7,11,0) 52%)",
          color: C.paper,
          fontFamily: "Familjen",
        }}
      >
        {/* halftone dots */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            backgroundImage: `radial-gradient(circle, ${C.bloodDeep} 1.6px, rgba(0,0,0,0) 2.2px)`,
            backgroundSize: "12px 12px",
            opacity: 0.5,
          }}
        />

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 500, height: 574 }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse needs a plain <img> */}
          <img src={maskSrc} width={maskW} height={maskH} alt="" />
        </div>

        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", flex: 1, height: 574, paddingRight: 56 }}>
          <div style={{ display: "flex", fontFamily: "Martian", fontSize: 19, letterSpacing: 3, color: C.haldi, textTransform: "uppercase" }}>
            {`// ${fest.collegeShort} Jalpaiguri presents`}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              marginTop: 18,
              fontFamily: "BigShoulders",
              fontSize: 196,
              lineHeight: 0.8,
              color: C.haldi,
              textShadow: `8px 8px 0 ${C.blood}`,
            }}
          >
            {fest.name}
            <span style={{ marginLeft: 10, marginTop: 10, fontSize: 52, color: C.paper, textShadow: "none" }}>{fest.shortYear}</span>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: 26,
              fontFamily: "BigShoulders",
              fontSize: 64,
              lineHeight: 0.9,
              textTransform: "uppercase",
            }}
          >
            <span style={{ color: C.haldi }}>{`${fest.theme.title}:`}</span>
            <span>{fest.theme.subtitle}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", marginTop: 30 }}>
            <div
              style={{
                display: "flex",
                padding: "10px 18px",
                backgroundColor: C.haldi,
                color: C.night,
                fontFamily: "Martian",
                fontSize: 24,
                letterSpacing: 1,
                textTransform: "uppercase",
                boxShadow: `5px 5px 0 ${C.blood}`,
              }}
            >
              {fest.dateRange}
            </div>
            <div style={{ display: "flex", marginLeft: 22, fontSize: 24, color: C.smoke }}>{fest.venue}</div>
          </div>
        </div>

        {/* bottom band, like the site's ticker */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: 56,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 40px",
            backgroundColor: C.haldi,
            color: C.night,
            fontFamily: "BigShoulders",
            fontSize: 30,
            textTransform: "uppercase",
          }}
        >
          <span>{fest.tagline}</span>
          <span style={{ color: C.blood }}>{domain}</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "BigShoulders", data: display, weight: 900, style: "normal" },
        { name: "Martian", data: mono, weight: 600, style: "normal" },
        { name: "Familjen", data: body, weight: 500, style: "normal" },
      ],
    },
  );
}
