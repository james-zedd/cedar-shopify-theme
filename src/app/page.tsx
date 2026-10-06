import { getCollection } from "@/lib/queries/collection";
import CollectionGrid from "@/components/CollectionGrid";

const FEATURED_COLLECTION_HANDLE = "jokes-for-kids";

export default async function Home() {
  const collection = await getCollection(FEATURED_COLLECTION_HANDLE);

  if (!collection) {
    return (
      <main className="p-8">
        <p>Featured collection not found.</p>
      </main>
    )
  }

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">{collection.title}</h1>
      <section className="mt-6">
        <CollectionGrid products={collection.products.nodes} />
      </section>
    </main>
  )
}