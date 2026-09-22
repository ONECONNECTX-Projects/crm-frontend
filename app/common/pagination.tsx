"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export default function Pagination({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  const totalPages = Math.ceil(totalItems / pageSize);
  const pageSizes = [5, 10, 20, 100];

  // ---------- SMART PAGINATION ----------
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 6) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    pages.push(1);

    if (currentPage > 3) pages.push("...");

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) pages.push("...");

    pages.push(totalPages);

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className="flex flex-col items-center justify-between gap-4 border-t border-border py-4 sm:flex-row">
      {/* LEFT: Page Size Dropdown */}
      <div className="flex items-center gap-2 order-2 sm:order-1">
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="rounded-lg border border-border bg-background px-2 py-1.5 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-brand-500/15 sm:px-3"
        >
          {pageSizes.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>

        <span className="text-muted-foreground text-xs sm:text-sm">entries per page</span>
      </div>

      {/* CENTER: Pagination */}
      <div className="flex items-center gap-1 sm:gap-2 order-1 sm:order-2 sm:flex-1 sm:justify-center">
        {/* Prev */}
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-40"
        >
          <ChevronLeft size={16} />
        </button>

        {/* Page numbers */}
        <div className="flex items-center gap-1 sm:gap-2">
          {pages.map((p, i) =>
            p === "..." ? (
              <span key={`ellipsis-${i}`} className="text-muted-foreground px-1 sm:px-2 text-sm">
                ...
              </span>
            ) : (
              <button
                key={p}
                onClick={() => onPageChange(p as number)}
                className={`min-w-[30px] rounded-md px-2 py-1.5 text-xs font-medium transition-colors sm:min-w-[34px] sm:px-3 sm:text-sm ${
                  currentPage === p
                    ? "bg-brand-500 text-white"
                    : "border border-border bg-background text-foreground hover:bg-muted"
                }`}
              >
                {p}
              </button>
            ),
          )}
        </div>

        {/* Next */}
        <button
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-40"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* RIGHT: Page counter */}
      <span className="order-3 text-xs text-muted-foreground sm:text-sm">
        Page <span className="font-semibold text-foreground">{currentPage}</span>{" "}
        of <span className="font-semibold text-foreground">{totalPages || 1}</span>
      </span>
    </div>
  );
}
