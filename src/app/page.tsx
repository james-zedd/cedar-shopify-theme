import Link from "next/link";
import { getCollections } from "@/lib/queries/collection";
import CollectionGrid from "@/components/CollectionGrid";

export default async function Home() {
  const collections = await getCollections();

  if (collections.length === 0) {
    return (
      <main className="page-container py-8">
        <p>No collections found.</p>
      </main>
    )
  }

  return (
    <main className="page-container py-8">
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Shop our collections</h1>
      {collections.map((collection, index) => (
        <section key={collection.id} className="mt-10" aria-labelledby={`collection-${collection.handle}`}>
          <div className="mb-6 flex items-baseline justify-between gap-4">
            <h2 id={`collection-${collection.handle}`} className="text-xl font-semibold tracking-tight">
              {collection.title}
            </h2>
            <Link
              href={`/collections/${collection.handle}`}
              className="text-sm font-medium hover:underline"
              aria-label={`View all ${collection.title}`}
            >
              View all
            </Link>
          </div>
          <CollectionGrid
            products={collection.products.nodes}
            aboveTheFoldCount={index === 0 ? 4 : 0}
          />
        </section>
      ))}
    </main>
  )
}
