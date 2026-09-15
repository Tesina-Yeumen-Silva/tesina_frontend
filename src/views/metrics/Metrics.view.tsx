"use client";
import React, { useEffect, useState, useCallback } from "react";
import { getDashboardMetricsAction, DashboardMetrics, MetricsFilter } from "@/controllers/metrics.controller";
import { MdDownload, MdCheckCircle, MdSpeed, MdAssessment } from "react-icons/md";
import { MetricsFilters } from "@/components/metrics/Filters";
import { MetricsCharts } from "@/components/metrics/Charts";
import { ExportModal } from "@/components/metrics/ExportModal";

export const MetricsView = () => {
  const [data, setData] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<MetricsFilter>({});
  const [isExportModalOpen, setExportModalOpen] = useState(false);

  const fetchMetrics = useCallback(async () => {
    setLoading(true);
    const res = await getDashboardMetricsAction(filters);
    if (res.ok) setData(res.data);
    setLoading(false);
  }, [filters]);

  useEffect(() => {
    fetchMetrics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading && !data) return <div className="p-8 font-semibold text-slate-500 flex justify-center items-center h-64 text-lg">Cargando métricas y construyendo reportes...</div>;
  if (!data) return <div className="p-8 text-rose-500 font-bold flex justify-center items-center h-64 text-lg">Error cargando métricas</div>;

  return (
    <div className="p-4 sm:p-8 max-w-[1400px] mx-auto flex flex-col gap-8 w-full min-h-screen bg-slate-50/50">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800">Dashboard de Métricas</h1>
          <p className="text-sm font-medium text-slate-500 mt-2">Análisis detallado y exportación de datos de los reportes.</p>
        </div>
        <button onClick={() => setExportModalOpen(true)} className="bg-blue-600 text-white px-6 py-3.5 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 shadow-md transition transform hover:-translate-y-0.5">
          <MdDownload size={22} /> Exportar Reporte
        </button>
      </div>

      <MetricsFilters filters={filters} setFilters={setFilters} onApply={fetchMetrics} />

      {loading && <div className="text-blue-600 text-sm font-semibold animate-pulse">Actualizando datos...</div>}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-7 rounded-2xl shadow-sm border border-slate-200 flex flex-col gap-3 relative overflow-hidden group hover:shadow-md transition">
          <div className="absolute top-0 left-0 w-1 h-full bg-slate-800"></div>
          <h3 className="text-slate-500 font-bold text-sm uppercase tracking-wider flex items-center gap-2"><MdAssessment size={20} className="text-slate-400"/>Total Reportes</h3>
          <p className="text-5xl font-black text-slate-800">{data.metrics.totalReports}</p>
        </div>
        <div className="bg-white p-7 rounded-2xl shadow-sm border border-slate-200 flex flex-col gap-3 relative overflow-hidden group hover:shadow-md transition">
          <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
          <h3 className="text-slate-500 font-bold text-sm uppercase tracking-wider flex items-center gap-2"><MdCheckCircle size={20} className="text-emerald-500"/>Solucionados</h3>
          <p className="text-5xl font-black text-emerald-600">{data.metrics.totalSolved}</p>
        </div>
        <div className="bg-white p-7 rounded-2xl shadow-sm border border-slate-200 flex flex-col gap-3 relative overflow-hidden group hover:shadow-md transition">
          <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
          <h3 className="text-slate-500 font-bold text-sm uppercase tracking-wider flex items-center gap-2"><MdSpeed size={20} className="text-blue-500"/>Tiempo Promedio (hs)</h3>
          <p className="text-5xl font-black text-blue-600">{data.metrics.averageResolutionTimeHours.toFixed(1)}</p>
        </div>
      </div>

      <MetricsCharts metrics={data.metrics} />

      <ExportModal 
        isOpen={isExportModalOpen} 
        onClose={() => setExportModalOpen(false)} 
        data={data.exportData} 
      />
    </div>
  );
};
