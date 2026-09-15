import React, { useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { MdClose, MdFileDownload } from 'react-icons/md';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: any[];
}

const ALL_COLUMNS = [
  { key: 'id', label: 'ID' },
  { key: 'fechaCreacion', label: 'Fecha' },
  { key: 'direccion', label: 'Dirección' },
  { key: 'categoria', label: 'Categoría' },
  { key: 'estadoActual', label: 'Estado' },
  { key: 'adhesiones', label: 'Adhesiones' },
  { key: 'esAnonimo', label: 'Anónimo' },
  { key: 'fechaResolucion', label: 'Fecha Resolución' },
  { key: 'horasResolucion', label: 'Horas Resolución' }
];

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, data }) => {
  const [selectedColumns, setSelectedColumns] = useState<string[]>(ALL_COLUMNS.map(c => c.key));
  const [exportType, setExportType] = useState<'csv' | 'pdf'>('pdf');

  if (!isOpen) return null;

  const toggleColumn = (key: string) => {
    if (selectedColumns.includes(key)) {
      if (selectedColumns.length > 1) setSelectedColumns(prev => prev.filter(k => k !== key));
    } else {
      setSelectedColumns(prev => [...prev, key]);
    }
  };

  const handleExport = () => {
    const columnsToExport = ALL_COLUMNS.filter(c => selectedColumns.includes(c.key));
    const headers = columnsToExport.map(c => c.label);
    
    const rows = data.map(r => {
      return columnsToExport.map(c => {
        let val = r[c.key];
        if (c.key === 'fechaCreacion' || c.key === 'fechaResolucion') {
          val = val ? new Date(val).toLocaleDateString() : '';
        }
        if (c.key === 'esAnonimo') {
          val = val ? 'Sí' : 'No';
        }
        return val !== null && val !== undefined ? String(val) : '';
      });
    });

    if (exportType === 'csv') {
      const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].map(e => e.map(cell => `"${cell.replace(/"/g, '""')}"`).join(",")).join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "informe_reportes.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      const doc = new jsPDF();
      doc.text("Informe de Reportes", 14, 15);
      autoTable(doc, {
        head: [headers],
        body: rows,
        startY: 20,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [59, 130, 246] }
      });
      doc.save("informe_reportes.pdf");
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 flex flex-col gap-6 relative animate-in fade-in zoom-in-95 duration-200">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition bg-slate-100 hover:bg-slate-200 p-2 rounded-full">
          <MdClose size={20} />
        </button>
        
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800">Exportar Datos</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">Selecciona el formato y las columnas a exportar.</p>
        </div>

        <div className="flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input type="radio" name="exportType" checked={exportType === 'pdf'} onChange={() => setExportType('pdf')} className="w-4 h-4 text-blue-600 focus:ring-blue-500" />
            <span className="font-semibold text-slate-700 group-hover:text-blue-600 transition">Documento PDF</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer group">
            <input type="radio" name="exportType" checked={exportType === 'csv'} onChange={() => setExportType('csv')} className="w-4 h-4 text-blue-600 focus:ring-blue-500" />
            <span className="font-semibold text-slate-700 group-hover:text-blue-600 transition">Archivo CSV</span>
          </label>
        </div>

        {exportType === 'csv' && (
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold text-slate-700 text-sm">Columnas a incluir (CSV):</h3>
            <div className="grid grid-cols-2 gap-3 max-h-48 overflow-y-auto p-3 border border-slate-200 rounded-xl bg-slate-50 shadow-inner">
              {ALL_COLUMNS.map(col => (
                <label key={col.key} className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-600 hover:text-slate-900 transition">
                  <input type="checkbox" checked={selectedColumns.includes(col.key)} onChange={() => toggleColumn(col.key)} className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4" />
                  {col.label}
                </label>
              ))}
            </div>
          </div>
        )}

        <button onClick={handleExport} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition shadow-md mt-2">
          <MdFileDownload size={22} /> Descargar {exportType.toUpperCase()}
        </button>
      </div>
    </div>
  );
};
