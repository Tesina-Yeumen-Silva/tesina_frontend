"use client";

import React from "react";
import { MdEdit, MdCheckCircle } from "react-icons/md";
import type { ReportStateItem } from "@/models";

interface ReportModalStateFormProps {
  showStateForm: boolean;
  setShowStateForm: (show: boolean) => void;
  availableStates: ReportStateItem[];
  selectedStateId: number | "";
  setSelectedStateId: (id: number) => void;
  observation: string;
  setObservation: (obs: string) => void;
  submittingState: boolean;
  stateError: string;
  stateSuccess: string;
  onSubmit: (e: React.FormEvent) => void;
}

export const ReportModalStateForm: React.FC<ReportModalStateFormProps> = ({
  showStateForm,
  setShowStateForm,
  availableStates,
  selectedStateId,
  setSelectedStateId,
  observation,
  setObservation,
  submittingState,
  stateError,
  stateSuccess,
  onSubmit,
}) => {
  return (
    <div className="bg-blue-50/70 p-3.5 rounded-2xl border border-blue-100 flex flex-col gap-3 w-full">
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
        <form onSubmit={onSubmit} className="flex flex-col gap-3">
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
              onChange={(e) => setSelectedStateId(Number(e.target.value))}
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
            {submittingState ? "Guardando..." : "Confirmar Cambio de Estado"}
          </button>
        </form>
      )}
    </div>
  );
};
