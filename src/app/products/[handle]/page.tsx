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
    <main className="page-container grid gap-8 py-8 md:grid-cols-2 lg:gap-12">
      <ProductGallery images={product.images.nodes} title={product.title} />
      <section>
        <ProductDetails product={product} />
        <div
          className="mt-8 space-y-4 leading-relaxed text-foreground/80 [&_a]:underline [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-foreground [&_h3]:font-semibold [&_h3]:text-foreground [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5"
          dangerouslySetInnerHTML={{ __html: sanitizeProductHtml(product.descriptionHtml) }}
        />
        {(author || pageCount) && (
          <dl className="mt-6 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 border-t pt-6 text-sm">
            {author && (
              <>
                <dt className="text-muted-foreground">Author</dt>
                <dd>{author}</dd>
              </>
            )}
            {pageCount && (
              <>
                <dt className="text-muted-foreground">Pages</dt>
                <dd>{pageCount}</dd>
              </>
            )}
          </dl>
        )}
      </section>
    </main>
  )
}