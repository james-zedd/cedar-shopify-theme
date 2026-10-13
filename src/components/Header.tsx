import Link from "next/link";
import CartDrawer from "@/components/CartDrawer";
import MobileNav from "@/components/MobileNav";
import { NAV_LINKS } from "@/lib/constants";

export default function Header() {
  return (
    <header className="relative flex items-center justify-between border-b px-8 py-4">
      <div className="flex items-center gap-4">
        <MobileNav />
        <Link href="/" className="text-xl font-bold">Cedar</Link>
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
    </header>
  );
}