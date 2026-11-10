import type { Metadata, Viewport } from "next";
import { Big_Shoulders, Familjen_Grotesk, Galada, Martian_Mono } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";
import { Providers } from "@/components/providers/Providers";
import { fest } from "@/data/fest";
import { seo, SITE_URL } from "@/lib/site";

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

// The share image itself comes from app/opengraph-image.tsx; Next adds og:image / twitter:image for it.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: seo.title, template: `%s | ${seo.name}` },
  description: seo.description,
  applicationName: seo.name,
  keywords: seo.keywords,
  authors: [{ name: `${fest.name} organising committee, ${fest.collegeShort}` }],
  creator: `${fest.name}, ${fest.college}`,
  publisher: fest.college,
  category: "event",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: seo.name,
    title: seo.socialTitle,
    description: seo.description,
    locale: "en_IN",
  },
  twitter: { card: "summary_large_image", title: seo.socialTitle, description: seo.description },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  // Paste the code from Google Search Console into this Vercel env var to verify ownership.
  verification: process.env.GOOGLE_SITE_VERIFICATION ? { google: process.env.GOOGLE_SITE_VERIFICATION } : undefined,
  formatDetection: { telephone: false, email: false, address: false },
  appleWebApp: { title: fest.name, statusBarStyle: "black-translucent" },
};

export const viewport: Viewport = {
  themeColor: "#13070b",
  colorScheme: "dark",
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-IN" className={`${display.variable} ${body.variable} ${mono.variable} ${bangla.variable}`}>
      <body>
        <Providers>{children}</Providers>
        <div className="grain" aria-hidden="true" />
      </body>
    </html>
  );
}
