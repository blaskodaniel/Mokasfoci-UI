import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize: number;
  onPageSizeChange?: (size: number) => void;
  total: number;
  showPageSize?: boolean;
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  onPageSizeChange,
  total,
  showPageSize = false,
}: PaginationProps) => {
  const canPreviousPage = currentPage > 0;
  const canNextPage = currentPage < totalPages - 1;

  const startItem = currentPage * pageSize + 1;
  const endItem = Math.min((currentPage + 1) * pageSize, total);

  return (
    <div className="flex items-center justify-between px-2 py-4">
      <div className="flex-1 text-sm text-muted-foreground">
        Oldal {currentPage + 1} / {totalPages || 1}
      </div>
      <div className="flex items-center space-x-6 lg:space-x-8">
        {showPageSize && onPageSizeChange && (
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Sorok száma</p>
            <select
              value={pageSize}
              onChange={(e) => {
                onPageSizeChange(Number(e.target.value));
              }}
              className="h-8 w-[70px] rounded-md border border-input bg-background px-2 text-sm"
            >
              {[10, 20, 30, 40, 50].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          {startItem} - {endItem} / {total}
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" className="h-8 w-8 p-0" onClick={() => onPageChange(0)} disabled={!canPreviousPage}>
            <span className="sr-only">Első oldal</span>«
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={!canPreviousPage}
          >
            <span className="sr-only">Előző oldal</span>‹
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={!canNextPage}
          >
            <span className="sr-only">Következő oldal</span>›
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => onPageChange(totalPages - 1)}
            disabled={!canNextPage}
          >
            <span className="sr-only">Utolsó oldal</span>»
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
