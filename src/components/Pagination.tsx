import Link from "next/link";
import type { CollectionWithProducts } from "@/lib/queries/collection";

type PaginationProps = {
  basePath: string;
  pageInfo: CollectionWithProducts["products"]["pageInfo"];
  query?: Record<string, string>;
};

export default function Pagination({ basePath, pageInfo, query = {} }: PaginationProps) {
  const { hasPreviousPage, hasNextPage, startCursor, endCursor } = pageInfo;

  if (!hasPreviousPage && !hasNextPage) {
    return null;
  }

  return (
    <nav aria-label="Pagination" className="mt-10 flex justify-between">
      {hasPreviousPage && startCursor ? (
        <Link
          href={{ pathname: basePath, query: { ...query, before: startCursor } }}
          className="rounded border px-4 py-2 hover:bg-muted"
        >
          ← Previous
        </Link>
      ) : (
        <span />
      )}
      {hasNextPage && endCursor ? (
        <Link
          href={{ pathname: basePath, query: { ...query, after: endCursor } }}
          className="rounded border px-4 py-2 hover:bg-muted"
        >
          Next →
        </Link>
      ) : (
        <span />
      )}
    </nav>
  )
}