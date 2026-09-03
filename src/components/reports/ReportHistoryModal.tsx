"use client";
import React from "react";
import { MdClose, MdHistory, MdRefresh, MdAccessTime, MdComment } from "react-icons/md";
import type { ReportHistoryItem } from "@/models";

interface ReportHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportId: number | null;
  history: ReportHistoryItem[];
  loading: boolean;
  error?: string;
}

export const ReportHistoryModal: React.FC<ReportHistoryModalProps> = ({
  isOpen,
  onClose,
  reportId,
  history,
  loading,
  error,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 relative max-h-[85dvh] flex flex-col overflow-hidden">
        {/* Botón de Cierre */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition cursor-pointer z-10"
          aria-label="Cerrar modal"
        >
          <MdClose size={20} />
        </button>

        {/* Encabezado del Modal */}
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 pr-8">
          <div className="p-2.5 rounded-2xl bg-blue-50 text-blue-900 border border-blue-100">
            <MdHistory size={22} />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-slate-800">
              Historial de Seguimiento
            </h3>
            <p className="text-xs font-semibold text-slate-500">
              {reportId ? `Reporte #${reportId}` : "Línea de tiempo de cambios de estado"}
            </p>
          </div>
        </div>

        {/* Contenido / Timeline */}
        <div className="py-4 overflow-y-auto flex-1 pr-1">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <MdRefresh size={30} className="text-blue-900 animate-spin" />
              <p className="text-xs font-semibold text-slate-500">
                Cargando historial de estados...
              </p>
            </div>
          ) : error || history.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-xs font-semibold text-slate-500">
                {error || "No se encontraron registros de historial para este reporte."}
              </p>
            </div>
          ) : (
            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {history.map((item, idx) => {
                const stateName = item.state?.name || "Desconocido";
                const stateColor = item.state?.color || "#3b82f6";
                const isLatest = idx === history.length - 1;

                return (
                  <div key={item.id || idx} className="relative group">
                    {/* Punto del Timeline */}
                    <div
                      className={`absolute -left-[19px] top-1 w-4 h-4 rounded-full border-2 border-white shadow-xs transition-transform ${
                        isLatest ? "scale-125 ring-2 ring-blue-800/20" : ""
                      }`}
                      style={{ backgroundColor: stateColor }}
                    />

                    {/* Tarjeta del Historial */}
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 flex flex-col gap-2 shadow-2xs">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span
                          className="px-2.5 py-0.5 rounded-full text-xs font-extrabold text-white shadow-2xs"
                          style={{ backgroundColor: stateColor }}
                        >
                          {stateName}
                        </span>

                        <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                          <MdAccessTime size={13} />
                          {new Date(item.createdAt).toLocaleString("es-AR", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>

                      {/* Observación / Nota de auditoría */}
                      {item.observation && (
                        <div className="text-xs text-slate-600 bg-white p-2.5 rounded-xl border border-slate-100 flex items-start gap-1.5 font-medium mt-1">
                          <MdComment size={14} className="text-slate-400 shrink-0 mt-0.5" />
                          <span className="italic">{item.observation}</span>
                        </div>
                      )}

                      {/* Operador / Administrador que respondió */}
                      {item.user && (
                        <div className="text-[11.5px] text-slate-500 font-medium pl-1 flex items-center gap-1.5">
                          <span>👤 Respondido por:</span>
                          <strong className="text-slate-700 font-semibold">{item.user.name}</strong>
                          {item.user.role?.name && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold uppercase tracking-wider">
                              {item.user.role.name === "operador" ? "Operador" : item.user.role.name === "admin" ? "Admin" : item.user.role.name}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Pie del Modal */}
        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-slate-800 hover:bg-slate-900 transition cursor-pointer shadow-xs"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
