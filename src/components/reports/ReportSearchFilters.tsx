"use client";
import React from "react";
import { MdSearch, MdClose, MdFilterList, MdCheck, MdCategory } from "react-icons/md";
import type { ReportStateItem, ReportCategoryItem } from "@/models";
import { getCategoryIcon } from "@/utils/categoryIcons";

interface ReportSearchFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedStateIds: number[];
  onToggleState: (stateId: number | "all") => void;
  selectedCategoryIds: number[];
  onToggleCategory: (categoryId: number | "all") => void;
  states: ReportStateItem[];
  categories: ReportCategoryItem[];
  onResetFilters: () => void;
}

export const ReportSearchFilters: React.FC<ReportSearchFiltersProps> = ({
  searchQuery,
  onSearchChange,
  selectedStateIds,
  onToggleState,
  selectedCategoryIds,
  onToggleCategory,
  states,
  categories,
  onResetFilters,
}) => {
  const isAllStatesSelected = selectedStateIds.length === 0;
  const isAllCategoriesSelected = selectedCategoryIds.length === 0;

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    !isAllStatesSelected ||
    !isAllCategoriesSelected;

  return (
    <div className="flex flex-col gap-4 bg-white p-5 rounded-2xl border border-slate-200/70 shadow-sm w-full">
      {/* Fila Superior: Buscador por Dirección / Zona / Palabra Clave */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <MdSearch
            size={20}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 z-10"
          />
          <input
            type="text"
            placeholder="Buscar por dirección, zona o palabra clave..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-9 py-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-800 focus:ring-2 focus:ring-blue-800/10 focus:bg-white transition"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition cursor-pointer"
              aria-label="Limpiar búsqueda"
            >
              <MdClose size={18} />
            </button>
          )}
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center gap-1.5 px-3.5 py-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-800 text-xs font-bold transition cursor-pointer shrink-0"
          >
            <MdFilterList size={16} />
            <span>Limpiar filtros</span>
          </button>
        )}
      </div>

      {/* Fila 2: Filtros Multi-Selección de Estado */}
      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
        <span className="text-xs font-bold text-slate-500 flex items-center gap-1 mr-1">
          <MdFilterList size={15} className="text-blue-900" />
          Estados:
        </span>

        <button
          type="button"
          onClick={() => onToggleState("all")}
          className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition cursor-pointer ${
            isAllStatesSelected
              ? "bg-blue-900 text-white border-blue-900 shadow-2xs font-bold"
              : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
          }`}
        >
          {isAllStatesSelected && <MdCheck size={14} />}
          Todos los estados
        </button>

        {states.map((st) => {
          const isSelected = selectedStateIds.includes(st.id);
          return (
            <button
              key={st.id}
              type="button"
              onClick={() => onToggleState(st.id)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition cursor-pointer ${
                isSelected
                  ? "bg-slate-900 text-white border-slate-900 shadow-2xs font-bold"
                  : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
              }`}
            >
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: st.color || "#3b82f6" }}
              />
              <span>{st.name}</span>
              {isSelected && <MdCheck size={14} />}
            </button>
          );
        })}
      </div>

      {/* Fila 3: Filtros Multi-Selección de Categoría con Iconos */}
      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
        <span className="text-xs font-bold text-slate-500 flex items-center gap-1 mr-1">
          <MdCategory size={15} className="text-blue-900" />
          Categorías:
        </span>

        <button
          type="button"
          onClick={() => onToggleCategory("all")}
          className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition cursor-pointer ${
            isAllCategoriesSelected
              ? "bg-blue-900 text-white border-blue-900 shadow-2xs font-bold"
              : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
          }`}
        >
          {isAllCategoriesSelected && <MdCheck size={14} />}
          Todas las categorías
        </button>

        {categories.map((cat) => {
          const isSelected = selectedCategoryIds.includes(cat.id);
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onToggleCategory(cat.id)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition cursor-pointer ${
                isSelected
                  ? "bg-blue-100 text-blue-900 border-blue-300 shadow-2xs font-bold"
                  : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
              }`}
            >
              {getCategoryIcon(cat.name, 14)}
              <span>{cat.name}</span>
              {isSelected && <MdCheck size={14} />}
            </button>
          );
        })}
      </div>
    </div>
  );
};
