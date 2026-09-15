import React from "react";
import { MdAssignment } from "react-icons/md";

interface ReportHeaderBannerProps {
  totalItems: number;
}

export const ReportHeaderBanner: React.FC<ReportHeaderBannerProps> = ({
  totalItems,
}) => {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 px-8 py-7 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-6 w-full">
      <div>
        <div className="flex items-center gap-3 mb-3">
          <span className="w-9 h-9 rounded-xl bg-blue-500/30 flex items-center justify-center">
            <MdAssignment size={20} className="text-blue-200" />
          </span>
          <span className="text-blue-200 text-sm font-semibold tracking-wide">
            Mendoza Reporta
          </span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-white">
          Gestión y Listado de Reportes
        </h1>
        <p className="text-blue-200/80 text-sm mt-1">
          Visualiza, filtra, audita y gestiona el estado de todos los reportes urbanos del sistema.
        </p>
        <div className="mt-4 flex items-center gap-6 text-blue-100">
          <div>
            <div className="text-2xl font-bold text-white">{totalItems}</div>
            <div className="text-xs text-blue-200/80">reportes en lista</div>
          </div>
        </div>
      </div>
    </div>
  );
};
