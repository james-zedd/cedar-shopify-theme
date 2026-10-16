import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import ShopifyProviders from "@/providers/ShopifyProviders";
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { GA_MEASUREMENT_ID, SITE_NAME, SITE_URL } from "@/lib/constants";
import { sharedOpenGraph } from "@/lib/seo";
import { GoogleAnalytics } from "@next/third-parties/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL ?? "http://localhost:3000"),
  title: {
    template: `%s | ${SITE_NAME}`,
    default: SITE_NAME,
  },
  description: "A Shopify theme for headless CMS",
  openGraph: sharedOpenGraph,
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={geistSans.variable}>
      <body>
        <ShopifyProviders>
          <Header />
          <div className="flex-1">
            {children}
          </div>
          <Footer />
        </ShopifyProviders>
      </body>
      {GA_MEASUREMENT_ID && <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />}
    </html>
  );
}
