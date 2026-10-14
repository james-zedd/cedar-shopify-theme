import Link from "next/link";

type AvailabilityFilterProps = {
  basePath: string;
  availableOnly: boolean;
};

const OPTIONS = [
  { label: "All products", availableOnly: false },
  { label: "In stock", availableOnly: true },
];

export default function AvailabilityFilter({ basePath, availableOnly }: AvailabilityFilterProps) {
  return (
    <nav aria-label="Filter by availability" className="flex gap-2">
      {OPTIONS.map((option) => {
        const isActive = option.availableOnly === availableOnly;

        return (
          <Link
            key={option.label}
            href={{ pathname: basePath, query: option.availableOnly ? { available: "true" } : {} }}
            aria-current={isActive ? "page" : undefined}
            className={`rounded-full border px-4 py-1 text-sm ${
              isActive
                ? "border-foreground bg-foreground text-background"
                : "border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800"
            }`}
          >
            {option.label}
          </Link>
        )
      })}
    </nav>
  )
}