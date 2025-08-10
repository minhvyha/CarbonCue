import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  onPageChange: (page: number) => void;
  disableNext?: boolean;
}

export function Pagination({ currentPage, onPageChange, disableNext }: PaginationProps) {
  return (
    <div className="flex items-center justify-center gap-4 mt-8">
      <Button
        variant="outline"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Previous
      </Button>

      <span className="text-sm">Page {currentPage}</span>

      <Button
        variant="outline"
        disabled={disableNext}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
      </Button>
    </div>
  );
}
