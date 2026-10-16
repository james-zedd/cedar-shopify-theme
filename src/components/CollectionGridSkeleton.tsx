import Skeleton from "@/components/Skeleton";

type CollectionGridSkeletonProps = {
  count?: number;
};

export default function CollectionGridSkeleton({ count = 4 }: CollectionGridSkeletonProps) {
  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-10">
      {Array.from({ length: count }, (_, index) => (
        <li key={index}>
          <Skeleton className="aspect-square rounded-lg" />
          <Skeleton className="mt-3 h-4 w-3/4" />
          <Skeleton className="mt-2 h-4 w-1/4" />
        </li>
      ))}
    </ul>
  );
}
