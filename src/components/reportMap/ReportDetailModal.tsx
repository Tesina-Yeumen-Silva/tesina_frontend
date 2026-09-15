"use client";

import React from "react";
import { MdRefresh, MdOpenInNew } from "react-icons/md";
import type { ReportDetail } from "@/models";
import { useReportDetailModal } from "./hooks/useReportDetailModal";
import { ReportModalHeader } from "./modalParts/ReportModalHeader";
import { ReportModalMetadata } from "./modalParts/ReportModalMetadata";
import { ReportModalStateForm } from "./modalParts/ReportModalStateForm";
import { ReportModalHistory } from "./modalParts/ReportModalHistory";
import { ReportModalImage } from "./modalParts/ReportModalImage";

interface ReportDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: ReportDetail | null;
  loading: boolean;
  error?: string;
  currentUserRole?: string;
  initialShowStateForm?: boolean;
  onReportUpdated?: () => void;
}

export const ReportDetailModal: React.FC<ReportDetailModalProps> = ({
  isOpen,
  onClose,
  report,
  loading,
  error,
  currentUserRole,
  initialShowStateForm = false,
  onReportUpdated,
}) => {
  const {
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
  } = useReportDetailModal({
    isOpen,
    report,
    currentUserRole,
    initialShowStateForm,
    onReportUpdated,
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 relative max-h-[90dvh] flex flex-col overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <MdRefresh size={32} className="text-blue-900 animate-spin" />
            <p className="text-xs font-semibold text-slate-500">
              Cargando detalles del reporte...
            </p>
          </div>
        ) : error || !report ? (
          <div className="py-12 text-center">
            <p className="text-sm font-semibold text-rose-600 mb-4">
              {error || "No se pudieron obtener los detalles del reporte."}
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200 transition cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4 overflow-y-auto pr-1">
            {/* Header del Modal */}
            <ReportModalHeader
              reportId={report.id}
              category={report.category}
              status={report.status}
              statusColor={report.statusColor}
              onClose={onClose}
            />

            {/* Metadatos y Descripción */}
            <ReportModalMetadata report={report} />

            {/* Formulario de Cambio de Estado*/}
            {canChangeState && (
              <ReportModalStateForm
                showStateForm={showStateForm}
                setShowStateForm={setShowStateForm}
                availableStates={availableStates}
                selectedStateId={selectedStateId}
                setSelectedStateId={setSelectedStateId}
                observation={observation}
                setObservation={setObservation}
                submittingState={submittingState}
                stateError={stateError}
                stateSuccess={stateSuccess}
                onSubmit={handleSubmitStateChange}
              />
            )}

            {/* Historial de Auditoría Desplegable */}
            <ReportModalHistory
              historyItems={historyItems}
              showHistory={showHistory}
              setShowHistory={setShowHistory}
              loadingHistory={loadingHistory}
            />

            {/* Evidencia Fotográfica (Lazy Load On-Demand) */}
            <ReportModalImage
              imageUrl={report.imageUrl}
              showImage={showImage}
              imageLoading={imageLoading}
              onLoadImage={handleLoadImage}
              onImageLoaded={handleImageLoaded}
              reportId={report.id}
            />

            {/* Pie del Modal con Acciones */}
            <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100 mt-2">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${report.latitude},${report.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-blue-900 bg-blue-50 hover:bg-blue-100 transition cursor-pointer border border-blue-200"
              >
                <MdOpenInNew size={14} />
                Abrir en Google Maps
              </a>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-slate-800 hover:bg-slate-900 transition cursor-pointer shadow-xs"
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
