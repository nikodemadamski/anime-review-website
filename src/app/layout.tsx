import type { Metadata } from "next";
import "./globals.css";
import { Layout } from "@/components/layout";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ImageUpgradeButton } from "@/components/dev/ImageUpgradeButton";

export const metadata: Metadata = {
  title: "Haki | The Ultimate Anime Rating System",
  description: "Haki is the definitive way to rate and discover anime. Analyze shows through our four pillars: Visuals, Music, Story, and Characters.",
  keywords: "haki, anime, reviews, ratings, visual, music, story, character, one piece",
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
