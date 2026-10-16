type SkeletonProps = {
  className?: string;
};

export default function Skeleton({ className = "" }: SkeletonProps) {
  return <div aria-hidden="true" className={`animate-pulse rounded bg-muted motion-reduce:animate-none ${className}`} />;
}
