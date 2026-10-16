import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ShopifyProviders from "@/providers/ShopifyProviders";
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { sharedOpenGraph } from "@/lib/seo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    template: `%s | ${SITE_NAME}`,
    default: SITE_NAME,
  },
  description: "A Shopify theme for headless CMS",
  openGraph: sharedOpenGraph,
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <ShopifyProviders>
          <Header />
          <div className="flex-1">
            {children}
          </div>
          <Footer />
        </ShopifyProviders>
      </body>
    </html>
  );
}
