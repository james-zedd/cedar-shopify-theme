import Form from "next/form";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getSearchResults, type SearchResults } from "@/lib/queries/search";
import { getCollections, type CollectionSummary } from "@/lib/queries/collection";
import CollectionGrid from "@/components/CollectionGrid";
import Pagination from "@/components/Pagination";

const PAGE_SIZE = 12;

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function searchTerm(searchParams: Record<string, string | string[] | undefined>): string {
  return firstValue(searchParams.q)?.trim() ?? "";
}

export async function generateMetadata(props: PageProps<"/search">): Promise<Metadata> {
  const term = searchTerm(await props.searchParams);

  return {
    title: term ? `Search results for “${term}”` : "Search",
    // Every search term is its own URL, so keep them out of search engine indexes.
    robots: { index: false, follow: true },
  };
}

// Collections to browse when nothing matched. The suggestions are optional, so a
// failed request just leaves them out.
async function getSuggestedCollections(): Promise<CollectionSummary[]> {
  try {
    return await getCollections();
  } catch {
    return [];
  }
}

function SearchForm({ term }: { term: string }) {
  return (
    // Keyed by the term so the input shows the new term after a client-side navigation.
    <Form key={term} action="/search" role="search" className="flex max-w-md gap-2">
      <input
        type="search"
        name="q"
        aria-label="Search products"
        defaultValue={term}
        placeholder="Search products"
        required
        className="min-w-0 flex-1 rounded-md border bg-background px-3 py-2 text-base placeholder:text-muted-foreground md:text-sm"
      />
      <button type="submit" className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted">
        Search
      </button>
    </Form>
  );
}

function NoResults({ term, collections }: { term: string; collections: CollectionSummary[] }) {
  return (
    <div className="max-w-prose">
      <p>
        No products match <span className="font-medium">“{term}”</span>.
      </p>
      <ul className="mt-4 list-disc space-y-1 pl-5 text-muted-foreground">
        <li>Check the spelling.</li>
        <li>Try fewer or more general words.</li>
      </ul>
      {collections.length > 0 && (
        <nav aria-labelledby="browse-collections" className="mt-8">
          <h2 id="browse-collections" className="text-lg font-semibold">
            Browse our collections
          </h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {collections.map((collection) => (
              <li key={collection.id}>
                <Link
                  href={`/collections/${collection.handle}`}
                  className="inline-block rounded-full border px-4 py-1.5 text-sm hover:bg-muted"
                >
                  {collection.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}

export default async function SearchPage(props: PageProps<"/search">) {
  const searchParams = await props.searchParams;
  const term = searchTerm(searchParams);

  if (!term) {
    return (
      <main className="page-container py-8">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Search</h1>
        <div className="mt-4">
          <SearchForm term="" />
        </div>
        <p className="mt-6 text-muted-foreground">Enter a search term to find products.</p>
      </main>
    );
  }

  const after = firstValue(searchParams.after);
  const before = firstValue(searchParams.before);
  const termQuery = { q: term };

  let results: SearchResults;

  try {
    results = await getSearchResults(term, { pageSize: PAGE_SIZE, after, before });
  } catch (error) {
    // A stale or hand-edited cursor makes the API reject the request; start over from page one.
    if (after || before) {
      redirect(`/search?${new URLSearchParams(termQuery)}`);
    }
    throw error;
  }

  const { totalCount, products, pageInfo } = results;
  const suggestedCollections = products.length === 0 ? await getSuggestedCollections() : [];

  return (
    <main className="page-container py-8">
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
        Search results for “{term}”
      </h1>
      <div className="mt-4">
        <SearchForm term={term} />
      </div>
      <section aria-label="Search results" className="mt-6">
        {products.length > 0 ? (
          <>
            <p className="mb-4 text-sm text-muted-foreground">
              {totalCount} {totalCount === 1 ? "result" : "results"}
            </p>
            <CollectionGrid products={products} />
          </>
        ) : (
          <NoResults term={term} collections={suggestedCollections} />
        )}
      </section>
      <Pagination basePath="/search" pageInfo={pageInfo} query={termQuery} />
    </main>
  );
}
