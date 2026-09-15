import React, { useEffect, useState } from 'react';
import { getReportCategoriesAction, getReportStatesAction } from '@/controllers/report.controller';
import type { ReportCategoryItem, ReportStateItem } from '@/models';

interface FiltersProps {
  filters: {
    fromDate?: string;
    toDate?: string;
    categoryId?: string;
    stateId?: string;
    isAnonymous?: string;
  };
  setFilters: (filters: any) => void;
  onApply: () => void;
}

export const MetricsFilters: React.FC<FiltersProps> = ({ filters, setFilters, onApply }) => {
  const [categories, setCategories] = useState<ReportCategoryItem[]>([]);
  const [states, setStates] = useState<ReportStateItem[]>([]);

  useEffect(() => {
    getReportCategoriesAction().then(res => { if (res.ok) setCategories(res.data); });
    getReportStatesAction().then(res => { if (res.ok) setStates(res.data); });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-wrap gap-4 items-end">
      <div className="flex flex-col gap-1.5 flex-1 min-w-[140px]">
        <label className="text-sm font-semibold text-slate-600">Desde</label>
        <input type="date" name="fromDate" value={filters.fromDate || ''} onChange={handleChange} className="border border-slate-300 rounded-lg p-2.5 text-slate-700 w-full focus:ring-2 focus:ring-blue-500 outline-none" />
      </div>
      <div className="flex flex-col gap-1.5 flex-1 min-w-[140px]">
        <label className="text-sm font-semibold text-slate-600">Hasta</label>
        <input type="date" name="toDate" value={filters.toDate || ''} onChange={handleChange} className="border border-slate-300 rounded-lg p-2.5 text-slate-700 w-full focus:ring-2 focus:ring-blue-500 outline-none" />
      </div>
      <div className="flex flex-col gap-1.5 flex-1 min-w-[160px]">
        <label className="text-sm font-semibold text-slate-600">Categoría</label>
        <select name="categoryId" value={filters.categoryId || ''} onChange={handleChange} className="border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 bg-white">
          <option value="">Todas</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      <div className="flex flex-col gap-1.5 flex-1 min-w-[160px]">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Estado</label>
        <select name="stateId" value={filters.stateId || ''} onChange={handleChange} className="border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 bg-white">
          <option value="">Todos</option>
          {states.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>
      <div className="flex flex-col gap-1.5 flex-1 min-w-[140px]">
        <label className="text-sm font-semibold text-slate-600">Anonimato</label>
        <select name="isAnonymous" value={filters.isAnonymous || ''} onChange={handleChange} className="border border-slate-300 rounded-lg p-2.5 text-slate-700 w-full bg-white focus:ring-2 focus:ring-blue-500 outline-none">
          <option value="">Todos</option>
          <option value="true">Anónimos</option>
          <option value="false">No Anónimos</option>
        </select>
      </div>
      <div className="flex flex-col gap-1.5 w-full sm:w-auto mt-2 sm:mt-0">
        <button onClick={onApply} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-lg transition shadow-sm w-full sm:w-auto h-[46px]">
          Aplicar Filtros
        </button>
      </div>
    </div>
  );
};
