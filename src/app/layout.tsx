import type { Metadata } from "next";
import { Space_Grotesk, DM_Sans } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ReelForge - AI Faceless Video Generator",
  description: "Profesyonel kalitede faceless kısa videolar üretin. YouTube Shorts, TikTok, Instagram Reels için tam otonom video fabrikası.",
  keywords: ["AI video", "faceless video", "YouTube Shorts", "TikTok", "Instagram Reels", "video generator"],
  authors: [{ name: "ReelForge" }],
  openGraph: {
    title: "ReelForge - AI Faceless Video Generator",
    description: "Profesyonel kalitede faceless kısa videolar üretin.",
    type: "website",
  },
  other: {
    "material-icons": "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="dark">
      <body
        className={`${spaceGrotesk.variable} ${dmSans.variable} antialiased`}
        style={{ fontFamily: "var(--font-dm-sans), var(--font-body)" }}
      >
        {children}
      </body>
    </html>
  );
}
