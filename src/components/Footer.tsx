import Link from "next/link";
import { NAV_LINKS } from "@/lib/constants";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t text-sm text-muted-foreground">
      <div className="page-container flex flex-col gap-4 py-6 md:flex-row md:items-center md:justify-between">
        <nav aria-label="Footer">
          <ul className="flex gap-6">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-foreground hover:underline">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <p>&copy; {year} Cedar. All rights reserved.</p>
      </div>
    </footer>
  );
}
