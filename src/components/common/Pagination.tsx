// src/components/common/Pagination.tsx
import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function createPaginationRange(
  current: number,
  total: number,
  delta = 2
): (number | "...")[] {
  const range = [];
  const rangeWithDots: (number | "...")[] = [];
  let l: number | null = null;

  for (let i = 1; i <= total; i++) {
    if (
      i === 1 ||
      i === total ||
      (i >= current - delta && i <= current + delta)
    ) {
      range.push(i);
    }
  }

  // eslint-disable-next-line prefer-const
  for (let i of range) {
  if (l !== null) {
    if (i - l === 2) {
      rangeWithDots.push(l + 1);
    } else if (i - l !== 1) {
      rangeWithDots.push("...");
    }
  }
  rangeWithDots.push(i);
  l = i;
}

  return rangeWithDots;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null; // No need to render if only 1 page

  const paginationRange = createPaginationRange(currentPage, totalPages);

  return (
    <nav
      className="flex items-center justify-center space-x-3 mt-6 select-none"
      aria-label="Pagination Navigation"
    >
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 rounded-full border border-(--color-border) text-(--color-text-primary) transition
          disabled:opacity-40 disabled:cursor-not-allowed
          hover:bg-(--color-hover) hover:text-white"
        aria-label="Previous Page"
      >
        Prev
      </button>

      {paginationRange.map((page, idx) =>
        page === "..." ? (
          <span
            key={`dots-${idx}`}
            className="px-3 text-gray-400 select-none"
            aria-hidden="true"
          >
            &hellip;
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page as number)}
            className={`px-4 py-2 rounded-full border font-semibold transition
              ${
                page === currentPage
                  ? "bg-(--color-brand-primary) text-(--color-text-inverse) border-(--color-brand-primary)"
                  : "border-(--color-border) text-(--color-text-primary) hover:bg-(--color-hover) hover:text-white"
              }`}
            aria-current={page === currentPage ? "page" : undefined}
            aria-label={page === currentPage ? `Page ${page}, current page` : `Go to page ${page}`}
          >
            {page}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 rounded-full border border-(--color-border) text-(--color-text-primary) transition
          disabled:opacity-40 disabled:cursor-not-allowed
          hover:bg-(--color-hover) hover:text-white"
        aria-label="Next Page"
      >
        Next
      </button>
    </nav>
  );
}
