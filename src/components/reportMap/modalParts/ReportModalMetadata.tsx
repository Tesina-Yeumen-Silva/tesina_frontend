"use client";

import React from "react";
import { MdPerson, MdThumbUp, MdAccessTime, MdPlace } from "react-icons/md";
import type { ReportDetail } from "@/models";

interface ReportModalMetadataProps {
  report: ReportDetail;
}

export const ReportModalMetadata: React.FC<ReportModalMetadataProps> = ({
  report,
}) => {
  return (
    <div className="flex flex-col gap-3.5 w-full">
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
    </div>
  );
};
