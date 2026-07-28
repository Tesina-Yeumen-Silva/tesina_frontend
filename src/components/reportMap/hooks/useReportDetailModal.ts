"use client";

import { useState, useEffect, useCallback } from "react";
import type {
  ReportDetail,
  ReportStateItem,
  ReportHistoryItem,
} from "@/models";
import {
  getReportStatesAction,
  changeReportStateAction,
  getReportHistoryAction,
} from "@/controllers/report.controller";

const ALLOWED_TARGET_NAMES = ["resuelto", "en progreso", "rechazado"];

const normalizeStr = (str: string) =>
  str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

interface UseReportDetailModalParams {
  isOpen: boolean;
  report: ReportDetail | null;
  currentUserRole?: string;
  initialShowStateForm?: boolean;
  onReportUpdated?: () => void;
}

export function useReportDetailModal({
  isOpen,
  report,
  currentUserRole,
  initialShowStateForm = false,
  onReportUpdated,
}: UseReportDetailModalParams) {
  const [showImage, setShowImage] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);

  const [availableStates, setAvailableStates] = useState<ReportStateItem[]>([]);
  const [showStateForm, setShowStateForm] = useState(initialShowStateForm);
  const [selectedStateId, setSelectedStateId] = useState<number | "">("");
  const [observation, setObservation] = useState("");
  const [submittingState, setSubmittingState] = useState(false);
  const [stateError, setStateError] = useState("");
  const [stateSuccess, setStateSuccess] = useState("");

  const [historyItems, setHistoryItems] = useState<ReportHistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const canChangeState =
    currentUserRole === "admin" || currentUserRole === "muni";

  useEffect(() => {
    if (isOpen) {
      setShowImage(false);
      setImageLoading(false);
      setShowStateForm(initialShowStateForm);
      setObservation("");
      setStateError("");
      setStateSuccess("");
      setShowHistory(false);

      getReportStatesAction().then((res) => {
        if (res.ok && Array.isArray(res.data)) {
          const filtered = res.data.filter((s) => {
            const normName = normalizeStr(s.name);
            return ALLOWED_TARGET_NAMES.some(
              (target) => normalizeStr(target) === normName,
            );
          });

          setAvailableStates(filtered);
          if (filtered.length > 0) {
            setSelectedStateId(filtered[0].id);
          }
        }
      });

      if (report?.id) {
        setLoadingHistory(true);
        getReportHistoryAction(report.id).then((res) => {
          setLoadingHistory(false);
          if (res.ok && Array.isArray(res.data)) {
            setHistoryItems(res.data);
          }
        });
      }
    }
  }, [isOpen, report?.id, initialShowStateForm]);

  const handleLoadImage = useCallback(() => {
    setShowImage(true);
    setImageLoading(true);
  }, []);

  const handleImageLoaded = useCallback(() => {
    setImageLoading(false);
  }, []);

  const handleSubmitStateChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!report || !selectedStateId) return;

    setStateError("");
    setStateSuccess("");

    const obsTrimmed = observation.trim();
    setSubmittingState(true);

    const res = await changeReportStateAction(report.id, {
      stateId: Number(selectedStateId),
      observation: obsTrimmed || undefined,
    });

    setSubmittingState(false);

    if (res.ok) {
      const newStateObj = availableStates.find(
        (s) => s.id === Number(selectedStateId),
      );
      if (newStateObj && report) {
        report.status = newStateObj.name;
        report.statusColor = newStateObj.color;
      }

      setStateSuccess("¡Estado del reporte actualizado exitosamente!");

      if (report.id) {
        getReportHistoryAction(report.id).then((histRes) => {
          if (histRes.ok && Array.isArray(histRes.data)) {
            setHistoryItems(histRes.data);
          }
        });
      }

      setTimeout(() => {
        setShowStateForm(false);
        setStateSuccess("");
        if (onReportUpdated) onReportUpdated();
      }, 1200);
    } else {
      setStateError(
        res.error || "No se pudo actualizar el estado del reporte.",
      );
    }
  };

  return {
    showImage,
    imageLoading,
    handleLoadImage,
    handleImageLoaded,
    canChangeState,
    availableStates,
    showStateForm,
    setShowStateForm,
    selectedStateId,
    setSelectedStateId,
    observation,
    setObservation,
    submittingState,
    stateError,
    stateSuccess,
    handleSubmitStateChange,
    historyItems,
    showHistory,
    setShowHistory,
    loadingHistory,
  };
}
