import type { Metadata } from "next";
import "./globals.css";
import { Layout } from "@/components/layout";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ImageUpgradeButton } from "@/components/dev/ImageUpgradeButton";

export const metadata: Metadata = {
  metadataBase: new URL('https://haki-anime.vercel.app'),
  title: {
    default: "Haki | The Ultimate Anime Rating System",
    template: "%s | Haki"
  },
  description: "Haki is the definitive way to rate and discover anime. Analyze shows through our four pillars: Visuals, Music, Story, and Characters.",
  keywords: ["haki", "anime", "reviews", "ratings", "visual", "music", "story", "character", "one piece", "anime analysis"],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://haki-anime.vercel.app',
    siteName: 'Haki Anime Reviews',
    images: [
      {
        url: '/og-image.jpg', // Ensure this exists or use a placeholder
        width: 1200,
        height: 630,
        alt: 'Haki Anime Reviews',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@haki_anime', // Placeholder
    creator: '@haki_anime',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head />
      <body className="antialiased" suppressHydrationWarning>
        <ThemeProvider>
          <Layout>
            {children}
          </Layout>
          {/* Dev Tools - Hidden button for image upgrades */}
          <ImageUpgradeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
