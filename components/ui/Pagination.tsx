import { Button } from "@/components/ui/Button";

interface PaginationProps {
  page: number;
  totalPages: number;
  buildHref: (page: number) => string;
}

export function Pagination({ page, totalPages, buildHref }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav aria-label="Pagination" className="mt-8 flex items-center justify-center gap-3">
      <Button
        href={buildHref(Math.max(1, page - 1))}
        variant="secondary"
        aria-label="Previous page"
        className={page <= 1 ? "pointer-events-none opacity-40" : undefined}
      >
        Previous
      </Button>
      <p className="text-sm font-bold text-tm-muted">
        Page {page} of {totalPages}
      </p>
      <Button
        href={buildHref(Math.min(totalPages, page + 1))}
        variant="secondary"
        aria-label="Next page"
        className={page >= totalPages ? "pointer-events-none opacity-40" : undefined}
      >
        Next
      </Button>
    </nav>
  );
}
