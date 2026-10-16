import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProduct } from "@/lib/queries/product";
import ProductDetails from "@/components/ProductDetails";
import ProductGallery from "@/components/ProductGallery";
import { sanitizeProductHtml } from "@/lib/sanitize";
import { sharedOpenGraph, toOpenGraphImages } from "@/lib/seo";

export async function generateMetadata(
  props: PageProps<"/products/[handle]">
): Promise<Metadata> {
  const { handle } = await props.params;
  const product = await getProduct(handle);

  if (!product) {
    return { title: "Product not found" };
  }

  const title = product.seo.title || product.title;
  const description = product.seo.description || product.description;
  const url = `/products/${product.handle}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      ...sharedOpenGraph,
      title,
      description,
      url,
      images: toOpenGraphImages(product.images.nodes[0], product.title),
    },
  };
}

export default async function ProductPage(
  props: PageProps<"/products/[handle]">
) {
  const { handle } = await props.params;
  const product = await getProduct(handle);

  if (!product) {
    notFound();
  }

  const author = product.metafields.find((field) => field?.key === "author")?.value;
  const pageCount = product.metafields.find((field) => field?.key === "page_count")?.value;

  return (
    <main className="grid gap-8 p-8 md:grid-cols-2">
      <ProductGallery images={product.images.nodes} title={product.title} />
      <section>
        <ProductDetails product={product} />
        <div
          className="mt-6 space-y-4 text-gray-700"
          dangerouslySetInnerHTML={{ __html: sanitizeProductHtml(product.descriptionHtml) }}
        />
        {(author || pageCount) && (
          <dl className="mt-6 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
            {author && (
              <>
                <dt className="font-medium">Author</dt>
                <dd>{author}</dd>
              </>
            )}
            {pageCount && (
              <>
                <dt className="font-medium">Pages</dt>
                <dd>{pageCount}</dd>
              </>
            )}
          </dl>
        )}
      </section>
    </main>
  )
}