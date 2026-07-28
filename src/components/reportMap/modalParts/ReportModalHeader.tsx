"use client";

import React from "react";
import { MdClose } from "react-icons/md";
import { getCategoryIcon } from "@/utils/categoryIcons";

interface ReportModalHeaderProps {
  reportId: number;
  category: string;
  status: string;
  statusColor?: string;
  onClose: () => void;
}

export const ReportModalHeader: React.FC<ReportModalHeaderProps> = ({
  reportId,
  category,
  status,
  statusColor = "#3b82f6",
  onClose,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 pr-8 border-b border-slate-100 pb-3 w-full">
      <div>
        <h3 className="text-lg font-extrabold text-slate-800 tracking-tight">
          Reporte #{reportId}
        </h3>
        <span className="text-xs font-semibold text-slate-500 flex items-center gap-1 mt-0.5">
          {getCategoryIcon(category, 15)}
          <span>{category}</span>
        </span>
      </div>

      <div
        className="px-3 py-1 rounded-full text-xs font-extrabold text-white shadow-2xs"
        style={{ backgroundColor: statusColor }}
      >
        {status}
      </div>

      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition cursor-pointer z-10"
        aria-label="Cerrar modal"
      >
        <MdClose size={20} />
      </button>
    </div>
  );
};
