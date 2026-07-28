"use client";

import React from "react";
import type {
  ActionResult,
  ReportsResponse,
  ReportStateItem,
  ReportCategoryItem,
  ReportItem,
} from "@/models";
import { ReportHeaderBanner } from "@/components/reports/ReportHeaderBanner";
import { ReportSearchFilters } from "@/components/reports/ReportSearchFilters";
import { ReportTable } from "@/components/reports/ReportTable";
import { ReportDetailModal } from "@/components/reportMap/ReportDetailModal";
import { ReportHistoryModal } from "@/components/reports/ReportHistoryModal";
import { useReportListState } from "./hooks/useReportListState";

interface ReportListViewProps {
  initialReportsResult?: ActionResult<ReportsResponse | ReportItem[]>;
  initialStatesResult?: ActionResult<ReportStateItem[]>;
  initialCategoriesResult?: ActionResult<ReportCategoryItem[]>;
}

const ReportListView: React.FC<ReportListViewProps> = ({
  initialReportsResult,
  initialStatesResult,
  initialCategoriesResult,
}) => {
  const {
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
  } = useReportListState({
    initialReportsResult,
    initialStatesResult,
    initialCategoriesResult,
  });

  return (
    <div className="w-full min-h-[100dvh] bg-slate-50 p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
      {/* Encabezado Principal Banner Azul */}
      <ReportHeaderBanner totalItems={filteredReports.length} />

      {/* Barra de Búsqueda y Filtros Multi-Selección de Estado/Categoría */}
      <ReportSearchFilters
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          setCurrentPage(1);
        }}
        selectedStateIds={selectedStateIds}
        onToggleState={handleToggleState}
        selectedCategoryIds={selectedCategoryIds}
        onToggleCategory={handleToggleCategory}
        states={states}
        categories={categories}
        onResetFilters={handleResetFilters}
      />

      {/* Tabla Reutilizable de Reportes */}
      <ReportTable
        reports={paginatedReports}
        isMounted={isMounted}
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        limit={ITEMS_PER_PAGE}
        onPageChange={setCurrentPage}
        onViewReportDetail={handleViewReportDetail}
        onViewReportHistory={handleViewReportHistory}
      />

      {/* Modal Reutilizable de Detalle de Reporte y Cambio de Estado */}
      <ReportDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        report={selectedReport}
        loading={loadingDetail}
        error={detailError}
        currentUserRole={currentUserRole}
        initialShowStateForm={initialShowStateForm}
        onReportUpdated={refreshData}
      />

      {/* Modal de Historial de Seguimiento (Auditoría Timeline) */}
      <ReportHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        reportId={historyReportId}
        history={reportHistory}
        loading={loadingHistory}
        error={historyError}
      />
    </div>
  );
};

export default ReportListView;
