import React from "react";
import { MdLocationOn, MdPersonAdd } from "react-icons/md";

interface UserHeaderBannerProps {
  totalItems: number;
  onCreateClick?: () => void;
}

export const UserHeaderBanner: React.FC<UserHeaderBannerProps> = ({
  totalItems,
  onCreateClick,
}) => {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 px-8 py-7 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-6">
      <div>
        <div className="flex items-center gap-3 mb-3">
          <span className="w-9 h-9 rounded-xl bg-blue-500/30 flex items-center justify-center">
            <MdLocationOn size={20} className="text-blue-200" />
          </span>
          <span className="text-blue-200 text-sm font-semibold tracking-wide">
            Mendoza Reporta
          </span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-white">
          Administración de Usuarios
        </h1>
        <p className="text-blue-200/80 text-sm mt-1">
          Gestiona y visualiza todos los usuarios registrados en Mendoza Reporta.
        </p>
        <div className="mt-4 flex items-center gap-6 text-blue-100">
          <div>
            <div className="text-2xl font-bold text-white">{totalItems}</div>
            <div className="text-xs text-blue-200/80">usuarios totales</div>
          </div>
        </div>
      </div>

      {onCreateClick && (
        <button
          onClick={onCreateClick}
          className="self-start md:self-center flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-blue-950 hover:bg-blue-50 font-semibold text-sm shadow-md hover:shadow-lg transition cursor-pointer"
        >
          <MdPersonAdd size={20} className="text-blue-900" />
          <span>Nuevo Usuario</span>
        </button>
      )}
    </div>
  );
};
