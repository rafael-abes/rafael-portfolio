import type { Metadata, Viewport } from "next";
import "@fontsource/instrument-serif/400.css";
import "@fontsource/instrument-serif/400-italic.css";
import "@fontsource-variable/dm-sans";
import "@fontsource/caveat/400.css";
import "@fontsource/caveat/600.css";
import "./globals.css";
import { sameAs, siteDescription, siteTitle, siteUrl } from "@/src/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: siteTitle,
  description: siteDescription,
  authors: [{ name: "Rafael Abes" }],
  openGraph: {
    type: "website",
    siteName: "Rafael Abes",
    title: siteTitle,
    description: siteDescription,
  },
  twitter: { card: "summary_large_image", title: siteTitle, description: siteDescription },
};

export const viewport: Viewport = {
  themeColor: "#F5F0E6",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        {/* Returning visitors skip the cover. This runs before first paint so they never see it flash. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem("alr:visited")==="1")document.documentElement.dataset.returning="1"}catch(e){}`,
          }}
        />
        {/* Without JavaScript the cover can't be opened, so don't show it. */}
        <noscript>
          <style>{`[data-cover]{display:none!important}`}</style>
        </noscript>
      </head>
      <body>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Rafael Abes",
              url: siteUrl,
              ...(sameAs.length ? { sameAs } : {}),
            }),
          }}
        />
      </body>
    </html>
  );
}
