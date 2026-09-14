"use client";
import React, { useEffect, useState } from "react";
import { getDashboardMetricsAction, DashboardMetrics } from "@/controllers/metrics.controller";
import { MdDownload, MdCheckCircle, MdSpeed, MdAssessment } from "react-icons/md";

export const MetricsView = () => {
  const [data, setData] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardMetricsAction().then(res => {
      if (res.ok) setData(res.data);
      setLoading(false);
    });
  }, []);

  const handleExportCSV = () => {
    if (!data) return;
    const headers = ["ID", "Fecha", "Direccion", "Categoria", "Estado", "Adhesiones", "Anonimo", "Fecha Resolucion", "Horas Resolucion"];
    const rows = data.exportData.map(r => [
      r.id,
      new Date(r.fechaCreacion).toLocaleDateString(),
      `"${r.direccion}"`,
      r.categoria,
      r.estadoActual,
      r.adhesiones,
      r.esAnonimo,
      r.fechaResolucion ? new Date(r.fechaResolucion).toLocaleDateString() : "",
      r.horasResolucion || ""
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "informe_reportes.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <div className="p-8 font-semibold text-slate-500">Cargando métricas y construyendo reportes...</div>;
  if (!data) return <div className="p-8 text-rose-500 font-bold">Error cargando métricas</div>;

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto flex flex-col gap-8 w-full min-h-screen bg-slate-50">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800">Dashboard de Métricas</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Resumen general y exportación de datos.</p>
        </div>
        <button onClick={handleExportCSV} className="bg-emerald-600 text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-emerald-700 shadow-md transition">
          <MdDownload size={20} /> Exportar Reporte CSV
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col gap-2">
          <h3 className="text-slate-500 font-bold text-sm uppercase tracking-wide flex items-center gap-2"><MdAssessment size={18}/>Total Reportes</h3>
          <p className="text-5xl font-black text-slate-800">{data.metrics.totalReports}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col gap-2">
          <h3 className="text-slate-500 font-bold text-sm uppercase tracking-wide flex items-center gap-2"><MdCheckCircle size={18}/>Solucionados</h3>
          <p className="text-5xl font-black text-emerald-600">{data.metrics.totalSolved}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col gap-2">
          <h3 className="text-slate-500 font-bold text-sm uppercase tracking-wide flex items-center gap-2"><MdSpeed size={18}/>Tiempo Promedio (hs)</h3>
          <p className="text-5xl font-black text-blue-600">{data.metrics.averageResolutionTimeHours.toFixed(1)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="font-bold text-lg mb-4 text-slate-800 border-b pb-2">Por Categoría</h3>
          <ul className="flex flex-col gap-3">
            {data.metrics.reportsByCategory.map(c => (
              <li key={c.name} className="flex justify-between items-center group">
                <span className="font-medium text-slate-600 group-hover:text-slate-900 transition">{c.name}</span>
                <span className="font-bold bg-slate-100 text-slate-700 px-3 py-1 rounded-lg">{c.count}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="font-bold text-lg mb-4 text-slate-800 border-b pb-2">Por Estado</h3>
          <ul className="flex flex-col gap-3">
            {data.metrics.reportsByState.map(s => (
              <li key={s.name} className="flex justify-between items-center group">
                <span className="font-medium text-slate-600 group-hover:text-slate-900 transition">{s.name}</span>
                <span className="font-bold bg-slate-100 text-slate-700 px-3 py-1 rounded-lg">{s.count}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
