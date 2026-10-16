import Link from "next/link";
import { FEATURED_COLLECTION_HANDLE } from "@/lib/constants";

export default function NotFound() {
  return (
    <main className="page-container">
      <div className="mx-auto max-w-md py-16 text-center">
        <p className="text-sm font-medium text-muted-foreground">404</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">Page not found</h1>
        <p className="mt-3 text-muted-foreground">
          We couldn&apos;t find what you were looking for. It may have sold out or moved.
        </p>
        <Link
          href={`/collections/${FEATURED_COLLECTION_HANDLE}`}
          className="mt-8 inline-block rounded bg-primary px-6 py-3 font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          Continue shopping
        </Link>
      </div>
    </main>
  );
}
