import { useState } from "react";
import type { ReportDetail, ReportHistoryItem } from "@/models";
import { getReportByIdAction, getReportHistoryAction } from "@/controllers/report.controller";

export function useReportModals() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<ReportDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [detailError, setDetailError] = useState("");
  const [initialShowStateForm, setInitialShowStateForm] = useState(false);

  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [historyReportId, setHistoryReportId] = useState<number | null>(null);
  const [reportHistory, setReportHistory] = useState<ReportHistoryItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [historyError, setHistoryError] = useState("");

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
  };
}
