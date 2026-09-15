"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import type {
  ActionResult,
  ReportsResponse,
  ReportStateItem,
  ReportCategoryItem,
  ReportItem,
} from "@/models";
import { getAllReportsAction, getReportStatesAction, getReportCategoriesAction } from "@/controllers/report.controller";

import { useReportFilters } from "./useReportFilters";
import { useReportPagination } from "./useReportPagination";
import { useReportModals } from "./useReportModals";

export type SortOption = "date" | "adhesions";
export type SortOrder = "asc" | "desc";

const extractReports = (data: any): ReportItem[] => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.reports)) return data.reports;
  if (Array.isArray(data.data)) return data.data;
  return [];
};

interface UseReportListStateParams {
  initialReportsResult?: ActionResult<ReportsResponse | ReportItem[]>;
  initialStatesResult?: ActionResult<ReportStateItem[]>;
  initialCategoriesResult?: ActionResult<ReportCategoryItem[]>;
  initialUserRole?: string;
}

export function useReportListState({
  initialReportsResult,
  initialStatesResult,
  initialCategoriesResult,
  initialUserRole,
}: UseReportListStateParams) {
  const [reports, setReports] = useState<ReportItem[]>(() => {
    if (initialReportsResult?.ok) return extractReports(initialReportsResult.data);
    return [];
  });
  const [totalItems, setTotalItems] = useState(() => {
    if (initialReportsResult?.ok && (initialReportsResult.data as any)?.totalReports !== undefined) {
      return (initialReportsResult.data as any).totalReports;
    }
    return 0;
  });

  const [states, setStates] = useState<ReportStateItem[]>(() => {
    if (initialStatesResult?.ok && Array.isArray(initialStatesResult.data)) return initialStatesResult.data;
    return [];
  });

  const [categories, setCategories] = useState<ReportCategoryItem[]>(() => {
    if (initialCategoriesResult?.ok && Array.isArray(initialCategoriesResult.data)) return initialCategoriesResult.data;
    return [];
  });

  const [currentUserRole, setCurrentUserRole] = useState<string>(initialUserRole || "");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const filters = useReportFilters();
  const pagination = useReportPagination(10);
  const modals = useReportModals();

  // Reset to page 1 when filters change
  useEffect(() => {
    pagination.setCurrentPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.searchQuery, filters.selectedStateIds, filters.selectedCategoryIds, filters.sortBy, filters.sortOrder]);

  const refreshData = useCallback(async () => {
    const query = {
      search: filters.searchQuery || undefined,
      stateId: filters.selectedStateIds.length > 0 ? filters.selectedStateIds.join(",") : undefined,
      categoryId: filters.selectedCategoryIds.length > 0 ? filters.selectedCategoryIds.join(",") : undefined,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
    };

    const res = await getAllReportsAction(pagination.currentPage, pagination.ITEMS_PER_PAGE, query);
    
    if (res.ok) {
      setReports(extractReports(res.data));
      if ((res.data as any)?.totalReports !== undefined) {
        setTotalItems((res.data as any).totalReports);
      }
    }
  }, [pagination.currentPage, pagination.ITEMS_PER_PAGE, filters.searchQuery, filters.selectedStateIds, filters.selectedCategoryIds, filters.sortBy, filters.sortOrder]);

  // Fetch when page or filters change (unless it's the very first render and we have initial data)
  useEffect(() => {
    if (isMounted) {
      refreshData();
    }
  }, [pagination.currentPage, filters.searchQuery, filters.selectedStateIds, filters.selectedCategoryIds, filters.sortBy, filters.sortOrder, isMounted, refreshData]);

  // If we don't get total items from backend we fallback to local length if it's the only page
  const totalItemsFinal = totalItems > 0 ? totalItems : reports.length;
  const totalPages = Math.max(1, Math.ceil(totalItemsFinal / pagination.ITEMS_PER_PAGE));

  return {
    reports,
    states,
    categories,
    ...filters,
    ...pagination,
    ...modals,
    filteredReports: reports, // Already filtered server-side
    paginatedReports: reports, // Already paginated server-side
    totalItems: totalItemsFinal,
    totalPages,
    currentUserRole,
    isMounted,
    refreshData,
  };
}
