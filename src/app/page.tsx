import { getCollection } from "@/lib/queries/collection";

const FEATURED_COLLECTION_HANDLE = "frontpage";

type CollectionsMapProps = {
  products: {
    id: string;
    title: string;
    handle: string;
  }[];
};

export const collectionsMap = ({ products }: CollectionsMapProps) => {
  return (
    <ul className="p-8">
      {
        products.map((product) => (
          <li key={product.id}>{product.title} ({product.handle})</li>
        ))
      }
    </ul>
  )
};

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
      {/* Temporary swap for <CollectionGrid products={ ... } /> once ProductCard is implemented */}
      {collectionsMap({ products: collection.products.nodes })}
    </main>
  )
}