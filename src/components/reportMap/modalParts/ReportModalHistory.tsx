"use client";

import React from "react";
import { MdHistory, MdExpandMore, MdExpandLess, MdComment } from "react-icons/md";
import type { ReportHistoryItem } from "@/models";

interface ReportModalHistoryProps {
  historyItems: ReportHistoryItem[];
  showHistory: boolean;
  setShowHistory: (show: boolean) => void;
  loadingHistory: boolean;
}

export const ReportModalHistory: React.FC<ReportModalHistoryProps> = ({
  historyItems,
  showHistory,
  setShowHistory,
  loadingHistory,
}) => {
  return (
    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 flex flex-col gap-2 w-full">
      <button
        type="button"
        onClick={() => setShowHistory(!showHistory)}
        className="w-full flex items-center justify-between text-xs font-bold text-slate-700 hover:text-blue-900 transition cursor-pointer"
      >
        <span className="flex items-center gap-1.5">
          <MdHistory size={16} className="text-blue-800" />
          <span>Historial de Seguimiento ({historyItems.length})</span>
        </span>
        {showHistory ? <MdExpandLess size={18} /> : <MdExpandMore size={18} />}
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
                    style={{ backgroundColor: h.state?.color || "#3b82f6" }}
                  />
                  <div className="flex items-center justify-between gap-2 font-bold text-slate-800">
                    <span style={{ color: h.state?.color || "#3b82f6" }}>
                      {h.state?.name || "Desconocido"}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400">
                      {new Date(h.createdAt).toLocaleDateString("es-AR")}
                    </span>
                  </div>
                  {h.observation && (
                    <p className="text-[11px] text-slate-600 italic mt-1 bg-white p-2 rounded-xl border border-slate-100">
                      <MdComment size={12} className="inline mr-1 text-slate-400" />
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
  );
};
