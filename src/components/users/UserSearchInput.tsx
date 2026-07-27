"use client";
import React from "react";
import { MdSearch, MdClose, MdFilterList, MdCheck } from "react-icons/md";

interface UserSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  selectedRoles: string[];
  onToggleRole: (roleKey: string) => void;
  currentUserRole?: string;
  placeholder?: string;
}

const ROLE_OPTIONS = [
  { key: "admin", label: "Administrador", activeBg: "bg-rose-100 text-rose-800 border-rose-300", badgeDot: "bg-rose-500" },
  { key: "muni", label: "Municipal", activeBg: "bg-sky-100 text-sky-800 border-sky-300", badgeDot: "bg-sky-500" },
  { key: "user", label: "Ciudadano", activeBg: "bg-emerald-100 text-emerald-800 border-emerald-300", badgeDot: "bg-emerald-500" },
];

export const UserSearchInput: React.FC<UserSearchInputProps> = ({
  value,
  onChange,
  selectedRoles,
  onToggleRole,
  currentUserRole,
  placeholder = "Buscar por nombre o correo electrónico...",
}) => {
  const isAllSelected = selectedRoles.length === 0;

  return (
    <div className="flex flex-col gap-4 bg-white p-5 rounded-2xl border border-slate-200/70 shadow-sm w-full">
      {/* Fila Superior: Buscador */}
      <div className="relative w-full">
        <MdSearch
          size={20}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 z-10"
        />
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-10 pr-9 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-blue-800 focus:ring-2 focus:ring-blue-800/10 focus:bg-white transition"
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition cursor-pointer"
            aria-label="Limpiar búsqueda"
          >
            <MdClose size={18} />
          </button>
        )}
      </div>

      {/* Fila Inferior: Filtros de Rol (Ocultos si es usuario municipal ya que solo ve ciudadanos) */}
      {currentUserRole !== "muni" && (
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1 mr-1">
            <MdFilterList size={16} className="text-blue-900" />
            Filtrar roles:
          </span>

          <button
            type="button"
            onClick={() => onToggleRole("all")}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition cursor-pointer ${
              isAllSelected
                ? "bg-blue-900 text-white border-blue-900 shadow-sm"
                : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
            }`}
          >
            {isAllSelected && <MdCheck size={14} />}
            Todos
          </button>

          {ROLE_OPTIONS.map((opt) => {
            const isSelected = selectedRoles.includes(opt.key);
            return (
              <button
                key={opt.key}
                type="button"
                onClick={() => onToggleRole(opt.key)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition cursor-pointer ${
                  isSelected
                    ? `${opt.activeBg} shadow-sm font-bold`
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    isSelected ? opt.badgeDot : "bg-slate-300"
                  }`}
                />
                {opt.label}
                {isSelected && <MdCheck size={14} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
