import { useState } from "react";

export function usePagination<T>(items: T[], itemsPerPage: number) {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(Math.ceil(items.length / itemsPerPage), 1);
  const currentPage = Math.min(page, totalPages);

  const firstIndex = (currentPage - 1) * itemsPerPage;
  const pageItems = items.slice(firstIndex, firstIndex + itemsPerPage);

  return {
    currentPage,
    totalPages,
    pageItems,
    nextPage: () => setPage(Math.min(currentPage + 1, totalPages)),
    prevPage: () => setPage(Math.max(currentPage - 1, 1)),
    resetPage: () => setPage(1),
  };
}
