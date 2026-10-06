import ProductCard from "@/components/ProductCard";
import type { CollectionProduct } from "@/lib/queries/collection";

type CollectionGridProps = {
  products: CollectionProduct[];
};

export default function CollectionGrid({ products }: CollectionGridProps) {
  if (products.length === 0) {
    return <p className="text-gray-500">No products in this collection yet.</p>;
  }

  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-10">
      {products.map((product) => (
        <li key={product.id}>
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  );
}