import CollectionGridSkeleton from "@/components/CollectionGridSkeleton";
import Skeleton from "@/components/Skeleton";

export default function Loading() {
  return (
    <main className="page-container py-8" aria-busy="true">
      <p role="status" className="sr-only">Loading search results…</p>
      <Skeleton className="h-8 w-72 sm:h-9" />
      <div className="mt-4 flex max-w-md gap-2">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-20" />
      </div>
      <section className="mt-6">
        <Skeleton className="mb-4 h-4 w-20" />
        <CollectionGridSkeleton />
      </section>
    </main>
  );
}
