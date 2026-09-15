import { useState } from "react";
import type { SortOption, SortOrder } from "./useReportListState";

export function useReportFilters() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStateIds, setSelectedStateIds] = useState<number[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const handleToggleState = (stateId: number | "all") => {
    if (stateId === "all") {
      setSelectedStateIds([]);
    } else {
      setSelectedStateIds((prev) =>
        prev.includes(stateId)
          ? prev.filter((id) => id !== stateId)
          : [...prev, stateId]
      );
    }
  };

  const handleToggleCategory = (catId: number | "all") => {
    if (catId === "all") {
      setSelectedCategoryIds([]);
    } else {
      setSelectedCategoryIds((prev) =>
        prev.includes(catId)
          ? prev.filter((id) => id !== catId)
          : [...prev, catId]
      );
    }
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedStateIds([]);
    setSelectedCategoryIds([]);
  };

  return {
    searchQuery,
    setSearchQuery,
    selectedStateIds,
    handleToggleState,
    selectedCategoryIds,
    handleToggleCategory,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    handleResetFilters,
  };
}
