import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "leaflet/dist/leaflet.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Brutalist Britain — Britain's Concrete Landmarks",
  description: "Discover London's brutalist architecture. Explore concrete landmarks, housing estates, and civic monuments through an interactive map.",
  openGraph: {
    title: "Brutalist Britain — Britain's Concrete Landmarks",
    description: "Discover London's brutalist architecture. Explore concrete landmarks, housing estates, and civic monuments through an interactive map.",
    type: "website",
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
    title: "Brutalist Britain — Britain's Concrete Landmarks",
    description: "Discover London's brutalist architecture through an interactive map.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap"
        />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
