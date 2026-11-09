import Image from "next/image";
import Link from "next/link";
import CartDrawer from "@/components/CartDrawer";
import MobileNav from "@/components/MobileNav";
import { NAV_LINKS } from "@/lib/constants";
import { getShop } from "@/lib/queries/shop";

export default async function Header() {
  // The logo is decorative enough that a failed brand fetch shouldn't take the header down.
  const shop = await getShop().catch(() => null);
  const logo = shop?.brand?.logo?.image;

  return (
    <header className="relative border-b">
      <div className="page-container flex items-center justify-between py-4">
        <div className="flex items-center gap-2 md:gap-4">
          <MobileNav />
          <Link href="/" className="text-xl font-semibold tracking-tight">
            {logo ? (
              <Image
                src={logo.url}
                alt={logo.altText || shop.name}
                width={logo.width ?? 160}
                height={logo.height ?? 40}
                loading="eager"
                sizes="160px"
                className="h-8 w-auto"
              />
            ) : (
              "Cedar"
            )}
          </Link>
        </div>
        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex gap-6">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm font-medium hover:underline">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <CartDrawer />
      </div>
    </header>
  );
}
