import Skeleton from "@/components/Skeleton";

export default function Loading() {
  return (
    <main className="page-container grid gap-8 py-8 md:grid-cols-2 lg:gap-12" aria-busy="true">
      <p role="status" className="sr-only">Loading product…</p>
      <Skeleton className="aspect-square rounded-lg" />
      <section>
        <Skeleton className="h-8 w-3/4 sm:h-9" />
        <Skeleton className="mt-3 h-6 w-20" />
        <Skeleton className="mt-8 h-12 w-full" />
        <div className="mt-8 space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </section>
    </main>
  );
}
