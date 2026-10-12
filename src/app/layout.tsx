import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ShopifyProviders from "@/providers/ShopifyProviders";
import Link from "next/link";
import CartDrawer from "@/components/CartDrawer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cedar Shopify Theme",
  description: "A Shopify theme for headless CMS",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <ShopifyProviders>
          <header className="flex items-center justify-between border-b px-8 py-4">
            <Link href="/" className="text-xl font-bold">Cedar</Link>
            <CartDrawer />
          </header>
          {children}
        </ShopifyProviders>
      </body>
    </html>
  );
}
