import { shopifyFetch } from "@/lib/shopify";
import type { Product } from "@shopify/hydrogen-react/storefront-api-types";

const PRODUCT_QUERY = `#graphql
  query ProductQuery {
    products(first: 1) {
      nodes {
        id
        title
        description
      }
    }
  }
`;

type ProductQuery = {
  products: { nodes: Pick<Product, "id" | "title" | "description">[] };
};

export default async function Home() {
  const data = await shopifyFetch<ProductQuery>(PRODUCT_QUERY);
  const product = data.products.nodes[0];

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">
        {product ? product.title : "No product found"}
      </h1>
      {product?.description && <p className="mt-2 text-lg">{product.description}</p>}
    </main>
  );
}