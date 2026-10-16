import CollectionGridSkeleton from "@/components/CollectionGridSkeleton";
import Skeleton from "@/components/Skeleton";

export default function Loading() {
  return (
    <main className="page-container py-8" aria-busy="true">
      <p role="status" className="sr-only">Loading…</p>
      <Skeleton className="h-8 w-56 sm:h-9" />
      <section className="mt-6">
        <CollectionGridSkeleton />
      </section>
    </main>
  );
}
