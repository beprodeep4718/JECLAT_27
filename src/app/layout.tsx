import type { Metadata, Viewport } from "next";
import { Big_Shoulders, Familjen_Grotesk, Galada, Martian_Mono } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";
import { Providers } from "@/components/providers/Providers";
import { fest } from "@/data/fest";

// Big Shoulders' optical-size axis picks the tall display cut automatically at large sizes.
const display = Big_Shoulders({
  subsets: ["latin"],
  axes: ["opsz"],
  variable: "--font-display",
  display: "swap",
  // next/font has no metric overrides for this family, so name the fallbacks ourselves
  adjustFontFallback: false,
  fallback: ["Arial Narrow", "Impact", "sans-serif"],
});
const body = Familjen_Grotesk({ subsets: ["latin"], variable: "--font-body", display: "swap" });
const mono = Martian_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });
const bangla = Galada({ subsets: ["bengali"], weight: "400", variable: "--font-bangla", display: "swap", preload: false });

const title = `${fest.name} ${fest.year} · ${fest.theme.title}: ${fest.theme.subtitle}`;
const description = `${fest.tagline}. ${fest.dateRange} at ${fest.college}.`;

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: { default: title, template: `%s · ${fest.name} ${fest.year}` },
  description,
  openGraph: { title, description, type: "website", locale: "en_IN", siteName: `${fest.name} ${fest.year}` },
  twitter: { card: "summary_large_image", title, description },
};

export const viewport: Viewport = {
  themeColor: "#13070b",
  colorScheme: "dark",
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable} ${bangla.variable}`}>
      <body>
        <Providers>{children}</Providers>
        <div className="grain" aria-hidden="true" />
      </body>
    </html>
  );
}
