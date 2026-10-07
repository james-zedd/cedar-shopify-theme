import { notFound, redirect } from "next/navigation";
import { getCollection } from "@/lib/queries/collection";
import type { CollectionWithProducts } from "@/lib/queries/collection";
import CollectionGrid from "@/components/CollectionGrid";
import Pagination from "@/components/Pagination";

const PAGE_SIZE = 2;

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function CollectionPage(
  props: PageProps<"/collections/[handle]">
) {
  const { handle } = await props.params;
  const searchParams = await props.searchParams;

  const after = firstValue(searchParams.after);
  const before = firstValue(searchParams.before);
  const basePath = `/collections/${handle}`;

  let collection: CollectionWithProducts | null;

  try {
    collection = await getCollection(handle, { pageSize: PAGE_SIZE, after, before });
  } catch (error) {
    if (after || before) {
      redirect(basePath);
    }
    throw error;
  }

  if (!collection) {
    notFound();
  }

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">{collection.title}</h1>
      <section className="mt-6">
        <CollectionGrid products={collection.products.nodes} />
      </section>
      <Pagination
        basePath={basePath}
        pageInfo={collection.products.pageInfo}
      />
    </main>
  )
}