"use client";
import React, { useState, useEffect } from "react";
import {
  MdClose,
  MdPlace,
  MdAccessTime,
  MdPerson,
  MdThumbUp,
  MdPhotoCamera,
  MdOpenInNew,
  MdRefresh,
  MdEdit,
  MdCheckCircle,
  MdHistory,
  MdComment,
  MdExpandMore,
  MdExpandLess,
} from "react-icons/md";
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
import { getCategoryIcon } from "@/utils/categoryIcons";

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

const ALLOWED_TARGET_NAMES = ["resuelto", "en progreso", "rechazado"];

const normalizeStr = (str: string) =>
  str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

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

  if (!isOpen) return null;

  const canChangeState =
    currentUserRole === "admin" || currentUserRole === "muni";

  const handleChangeStateSubmit = async (e: React.FormEvent) => {
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 relative max-h-[90dvh] flex flex-col overflow-hidden">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition cursor-pointer z-10"
          aria-label="Cerrar modal"
        >
          <MdClose size={20} />
        </button>

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
              className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200 transition"
            >
              Cerrar
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4 overflow-y-auto pr-1">
            <div className="flex flex-wrap items-center justify-between gap-2 pr-8 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-extrabold text-slate-800">
                  Reporte #{report.id}
                </h3>
                <span className="text-xs font-semibold text-slate-500 flex items-center gap-1 mt-0.5">
                  {getCategoryIcon(report.category, 15)}
                  <span>{report.category}</span>
                </span>
              </div>
              <div
                className="px-3 py-1 rounded-full text-xs font-extrabold text-white shadow-xs"
                style={{ backgroundColor: report.statusColor || "#3b82f6" }}
              >
                {report.status}
              </div>
            </div>

            {/* Fila de Metadatos (Autor, Adhesiones y Fecha) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Reportado por
                </span>
                <div className="flex items-center gap-1 text-xs font-bold text-slate-700 mt-0.5 truncate">
                  <MdPerson size={14} className="text-slate-400 shrink-0" />
                  <span className="truncate">{report.reporterName}</span>
                </div>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Apoyos vecinales
                </span>
                <div className="flex items-center gap-1 text-xs font-bold text-blue-900 mt-0.5">
                  <MdThumbUp size={14} className="text-blue-600" />
                  <span>{report.adhesionsCount} adhesiones</span>
                </div>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 col-span-2 sm:col-span-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Fecha
                </span>
                <div className="flex items-center gap-1 text-xs font-bold text-slate-700 mt-0.5">
                  <MdAccessTime size={14} className="text-slate-400 shrink-0" />
                  <span>
                    {new Date(report.createdAt).toLocaleDateString("es-AR")}
                  </span>
                </div>
              </div>
            </div>

            {/* Ubicación */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Ubicación
              </span>
              <div className="flex items-start gap-1.5 text-xs text-slate-700 font-semibold">
                <MdPlace size={16} className="text-rose-500 shrink-0 mt-0.5" />
                <span>{report.address || "Dirección no especificada"}</span>
              </div>
            </div>

            {/* Descripción */}
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Descripción
              </span>
              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100 font-medium whitespace-pre-line">
                {report.description || "Sin descripción proporcionada."}
              </p>
            </div>

            {/* Sección de Cambio de Estado (Admin y Muni) */}
            {canChangeState && (
              <div className="bg-blue-50/70 p-3.5 rounded-2xl border border-blue-100 flex flex-col gap-3">
                {!showStateForm ? (
                  <button
                    type="button"
                    onClick={() => setShowStateForm(true)}
                    className="w-full py-2.5 px-4 bg-blue-900 text-white rounded-xl text-xs font-bold hover:bg-blue-800 transition flex items-center justify-center gap-2 shadow-2xs cursor-pointer"
                  >
                    <MdEdit size={16} />
                    <span>Modificar Estado del Reporte</span>
                  </button>
                ) : (
                  <form
                    onSubmit={handleChangeStateSubmit}
                    className="flex flex-col gap-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-blue-950 flex items-center gap-1.5">
                        <MdEdit size={16} className="text-blue-800" />
                        Cambiar Estado del Reporte
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowStateForm(false)}
                        className="text-xs font-semibold text-slate-500 hover:text-slate-700 cursor-pointer"
                      >
                        Cancelar
                      </button>
                    </div>

                    {stateError && (
                      <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl">
                        {stateError}
                      </div>
                    )}

                    {stateSuccess && (
                      <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold rounded-xl flex items-center gap-1.5">
                        <MdCheckCircle size={16} />
                        {stateSuccess}
                      </div>
                    )}

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Nuevo Estado
                      </label>
                      <select
                        value={selectedStateId}
                        onChange={(e) =>
                          setSelectedStateId(Number(e.target.value))
                        }
                        className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-800 transition cursor-pointer"
                      >
                        {availableStates.map((st) => (
                          <option key={st.id} value={st.id}>
                            {st.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Observación / Nota (Opcional)
                      </label>
                      <textarea
                        value={observation}
                        onChange={(e) => setObservation(e.target.value)}
                        placeholder="Escribe el motivo del cambio de estado..."
                        rows={2}
                        className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs text-slate-700 focus:outline-none focus:border-blue-800 transition placeholder:text-slate-400 resize-none font-medium"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submittingState}
                      className="w-full py-2.5 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition shadow-xs disabled:opacity-50 cursor-pointer"
                    >
                      {submittingState
                        ? "Guardando..."
                        : "Confirmar Cambio de Estado"}
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* Historial de Seguimiento desplegable en el Modal */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => setShowHistory(!showHistory)}
                className="w-full flex items-center justify-between text-xs font-bold text-slate-700 hover:text-blue-900 transition cursor-pointer"
              >
                <span className="flex items-center gap-1.5">
                  <MdHistory size={16} className="text-blue-800" />
                  <span>Historial de Seguimiento ({historyItems.length})</span>
                </span>
                {showHistory ? (
                  <MdExpandLess size={18} />
                ) : (
                  <MdExpandMore size={18} />
                )}
              </button>

              {showHistory && (
                <div className="mt-2 pt-3 border-t border-slate-200/60 flex flex-col gap-3 max-h-56 overflow-y-auto pr-1">
                  {loadingHistory ? (
                    <div className="text-center py-4 text-xs text-slate-400">
                      Cargando historial...
                    </div>
                  ) : historyItems.length === 0 ? (
                    <div className="text-center py-4 text-xs text-slate-400">
                      Sin registros de historial.
                    </div>
                  ) : (
                    <div className="relative pl-5 space-y-3.5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                      {historyItems.map((h, idx) => (
                        <div key={h.id || idx} className="relative text-xs">
                          <div
                            className="absolute -left-[17px] top-1 w-3.5 h-3.5 rounded-full border-2 border-white shadow-2xs"
                            style={{
                              backgroundColor: h.state?.color || "#3b82f6",
                            }}
                          />
                          <div className="flex items-center justify-between gap-2 font-bold text-slate-800">
                            <span
                              style={{ color: h.state?.color || "#3b82f6" }}
                            >
                              {h.state?.name || "Desconocido"}
                            </span>
                            <span className="text-[10px] font-semibold text-slate-400">
                              {new Date(h.createdAt).toLocaleDateString(
                                "es-AR",
                              )}
                            </span>
                          </div>
                          {h.observation && (
                            <p className="text-[11px] text-slate-600 italic mt-1 bg-white p-2 rounded-xl border border-slate-100">
                              <MdComment
                                size={12}
                                className="inline mr-1 text-slate-400"
                              />
                              {h.observation}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="mt-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                Evidencia fotográfica
              </span>

              {!showImage ? (
                <button
                  type="button"
                  onClick={() => {
                    setShowImage(true);
                    setImageLoading(true);
                  }}
                  className="w-full py-3 px-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 border-dashed rounded-2xl flex items-center justify-center gap-2 text-xs font-bold text-slate-700 hover:text-blue-900 transition cursor-pointer group"
                >
                  <MdPhotoCamera
                    size={18}
                    className="text-slate-400 group-hover:text-blue-900 transition"
                  />
                  <span>Cargar imagen del reporte</span>
                </button>
              ) : (
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 max-h-64 flex items-center justify-center">
                  {imageLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-100 text-slate-400 text-xs font-semibold gap-2">
                      <MdRefresh
                        size={18}
                        className="animate-spin text-blue-900"
                      />
                      Cargando fotografía...
                    </div>
                  )}
                  {report.imageUrl ? (
                    <img
                      src={report.imageUrl}
                      alt={`Evidencia reporte #${report.id}`}
                      onLoad={() => setImageLoading(false)}
                      onError={() => setImageLoading(false)}
                      className="w-full h-auto max-h-64 object-contain"
                    />
                  ) : (
                    <div className="py-8 text-center text-xs text-slate-400">
                      No hay fotografía adjunta para este reporte.
                    </div>
                  )}
                </div>
              )}
            </div>

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
