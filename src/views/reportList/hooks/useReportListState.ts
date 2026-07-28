"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import type {
  ActionResult,
  ReportsResponse,
  ReportStateItem,
  ReportCategoryItem,
  ReportDetail,
  ReportItem,
  ReportHistoryItem,
} from "@/models";
import {
  getAllReportsAction,
  getReportStatesAction,
  getReportCategoriesAction,
  getReportByIdAction,
  getReportHistoryAction,
} from "@/controllers/report.controller";
import { USER_COOKIE } from "@/lib/config";

const ITEMS_PER_PAGE = 10;

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
}

export function useReportListState({
  initialReportsResult,
  initialStatesResult,
  initialCategoriesResult,
}: UseReportListStateParams) {
  const [reports, setReports] = useState<ReportItem[]>(() => {
    if (initialReportsResult?.ok) {
      return extractReports(initialReportsResult.data);
    }
    return [];
  });

  const [states, setStates] = useState<ReportStateItem[]>(() => {
    if (initialStatesResult?.ok && Array.isArray(initialStatesResult.data)) {
      return initialStatesResult.data;
    }
    return [];
  });

  const [categories, setCategories] = useState<ReportCategoryItem[]>(() => {
    if (initialCategoriesResult?.ok && Array.isArray(initialCategoriesResult.data)) {
      return initialCategoriesResult.data;
    }
    return [];
  });

  // Filtros de búsqueda multi-selección
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStateIds, setSelectedStateIds] = useState<number[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  // Modal de Detalle
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<ReportDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [detailError, setDetailError] = useState("");
  const [initialShowStateForm, setInitialShowStateForm] = useState(false);

  // Modal de Historial de Seguimiento (Auditoría)
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [historyReportId, setHistoryReportId] = useState<number | null>(null);
  const [reportHistory, setReportHistory] = useState<ReportHistoryItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [historyError, setHistoryError] = useState("");

  const [currentUserRole, setCurrentUserRole] = useState<string>("");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== "undefined") {
      const match = document.cookie.match(
        new RegExp(`(^| )${USER_COOKIE}=([^;]+)`)
      );
      if (match) {
        try {
          const u = JSON.parse(decodeURIComponent(match[2]));
          setCurrentUserRole(u?.role || "");
        } catch (e) {}
      }
    }
  }, []);

  // Carga inicial o recarga de datos si no venían del servidor
  const refreshData = useCallback(async () => {
    const [reportsRes, statesRes, categoriesRes] = await Promise.all([
      getAllReportsAction(1, 100),
      getReportStatesAction(),
      getReportCategoriesAction(),
    ]);

    if (reportsRes.ok) {
      setReports(extractReports(reportsRes.data));
    }
    if (statesRes.ok && Array.isArray(statesRes.data)) {
      setStates(statesRes.data);
    }
    if (categoriesRes.ok && Array.isArray(categoriesRes.data)) {
      setCategories(categoriesRes.data);
    }
  }, []);

  useEffect(() => {
    if (!initialReportsResult?.ok || reports.length === 0) {
      refreshData();
    }
  }, [initialReportsResult, refreshData, reports.length]);

  // Manejo de Toggle para Multi-Selección de Estado
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
    setCurrentPage(1);
  };

  // Manejo de Toggle para Multi-Selección de Categoría
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
    setCurrentPage(1);
  };

  // Filtrado reactivo en cliente con multi-selección simultánea
  const filteredReports = useMemo(() => {
    return reports.filter((rep) => {
      // 1. Filtro por Estado (Multi-Selección)
      if (selectedStateIds.length > 0) {
        const latestStateId = rep.reportHistory?.[0]?.state?.id;
        if (!latestStateId || !selectedStateIds.includes(latestStateId)) {
          return false;
        }
      }

      // 2. Filtro por Categoría (Multi-Selección)
      if (selectedCategoryIds.length > 0) {
        const catId = rep.category?.id;
        if (!catId || !selectedCategoryIds.includes(catId)) {
          return false;
        }
      }

      // 3. Filtro por Búsqueda de Texto (Dirección / Zona / Descripción / ID)
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase().trim();
        const addressMatch = rep.address?.toLowerCase().includes(q);
        const descMatch = rep.description?.toLowerCase().includes(q);
        const idMatch = String(rep.id).includes(q);

        if (!addressMatch && !descMatch && !idMatch) {
          return false;
        }
      }

      return true;
    });
  }, [reports, searchQuery, selectedStateIds, selectedCategoryIds]);

  // Paginación
  const totalItems = filteredReports.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE) || 1;

  const paginatedReports = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredReports.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredReports, currentPage]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedStateIds([]);
    setSelectedCategoryIds([]);
    setCurrentPage(1);
  };

  const handleViewReportDetail = async (reportId: number, openStateForm = false) => {
    setInitialShowStateForm(openStateForm);
    setIsModalOpen(true);
    setLoadingDetail(true);
    setDetailError("");
    setSelectedReport(null);

    const res = await getReportByIdAction(reportId);
    setLoadingDetail(false);

    if (res.ok) {
      setSelectedReport(res.data);
    } else {
      setDetailError(res.error || "No se pudieron obtener los datos del reporte.");
    }
  };

  const handleViewReportHistory = async (reportId: number) => {
    setHistoryReportId(reportId);
    setIsHistoryModalOpen(true);
    setLoadingHistory(true);
    setHistoryError("");
    setReportHistory([]);

    const res = await getReportHistoryAction(reportId);
    setLoadingHistory(false);

    if (res.ok) {
      setReportHistory(res.data);
    } else {
      setHistoryError(res.error || "No se pudo obtener el historial de seguimiento.");
    }
  };

  return {
    reports,
    states,
    categories,
    searchQuery,
    setSearchQuery,
    selectedStateIds,
    handleToggleState,
    selectedCategoryIds,
    handleToggleCategory,
    currentPage,
    setCurrentPage,
    filteredReports,
    totalItems,
    totalPages,
    paginatedReports,
    ITEMS_PER_PAGE,
    handleResetFilters,
    isModalOpen,
    setIsModalOpen,
    selectedReport,
    loadingDetail,
    detailError,
    initialShowStateForm,
    handleViewReportDetail,
    isHistoryModalOpen,
    setIsHistoryModalOpen,
    historyReportId,
    reportHistory,
    loadingHistory,
    historyError,
    handleViewReportHistory,
    currentUserRole,
    isMounted,
    refreshData,
  };
}
