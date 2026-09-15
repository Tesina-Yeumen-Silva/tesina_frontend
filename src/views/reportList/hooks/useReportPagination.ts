import { useState } from "react";

export function useReportPagination(initialLimit: number = 10) {
  const [currentPage, setCurrentPage] = useState(1);
  const [ITEMS_PER_PAGE] = useState(initialLimit);

  return {
    currentPage,
    setCurrentPage,
    ITEMS_PER_PAGE,
  };
}
