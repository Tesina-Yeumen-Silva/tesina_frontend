"use client";
import React from "react";
import { Table } from "@heroui/react";
import { MdPlace, MdCalendarToday, MdVisibility, MdHistory, MdEdit } from "react-icons/md";
import type { ReportItem } from "@/models";
import { UserPagination } from "@/components/users/UserPagination";
import { getCategoryIcon } from "@/utils/categoryIcons";

interface ReportTableProps {
  reports: ReportItem[];
  isMounted: boolean;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  limit: number;
  onPageChange: (page: number) => void;
  onViewReportDetail: (reportId: number, openStateForm?: boolean) => void;
  onViewReportHistory: (reportId: number) => void;
}

export const ReportTable: React.FC<ReportTableProps> = ({
  reports,
  isMounted,
  currentPage,
  totalPages,
  totalItems,
  limit,
  onPageChange,
  onViewReportDetail,
  onViewReportHistory,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/70 shadow-sm overflow-hidden w-full">
      <Table>
        <Table.ScrollContainer>
          <Table.Content aria-label="Tabla de reportes" className="min-w-[850px]">
            <Table.Header>
              <Table.Column isRowHeader>#ID</Table.Column>
              <Table.Column>Categoría</Table.Column>
              <Table.Column>Dirección / Ubicación</Table.Column>
              <Table.Column>Estado</Table.Column>
              <Table.Column>Fecha</Table.Column>
              <Table.Column className="text-right">Acciones</Table.Column>
            </Table.Header>
            <Table.Body>
              {reports.length === 0 ? (
                <Table.Row>
                  <Table.Cell className="py-8 text-center text-sm text-slate-400">
                    No se encontraron reportes con los criterios de búsqueda aplicados.
                  </Table.Cell>
                  <Table.Cell className="hidden">-</Table.Cell>
                  <Table.Cell className="hidden">-</Table.Cell>
                  <Table.Cell className="hidden">-</Table.Cell>
                  <Table.Cell className="hidden">-</Table.Cell>
                  <Table.Cell className="hidden">-</Table.Cell>
                </Table.Row>
              ) : (
                reports.map((report) => {
                  const latestHistory = report.reportHistory?.[0];
                  const stateName = latestHistory?.state?.name || "Desconocido";
                  const stateColor = latestHistory?.state?.color || "#3b82f6";
                  const categoryName = report.category?.name || "Sin categoría";

                  return (
                    <Table.Row key={report.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* ID */}
                      <Table.Cell className="font-extrabold text-xs text-slate-800">
                        #{report.id}
                      </Table.Cell>

                      {/* Categoría con Icono */}
                      <Table.Cell>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-bold border border-slate-200/60">
                          {getCategoryIcon(categoryName, 14)}
                          <span>{categoryName}</span>
                        </span>
                      </Table.Cell>

                      {/* Dirección / Ubicación */}
                      <Table.Cell>
                        <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium max-w-xs truncate">
                          <MdPlace size={16} className="text-rose-500 shrink-0" />
                          <span className="truncate" title={report.address}>
                            {report.address || "Sin dirección"}
                          </span>
                        </div>
                      </Table.Cell>

                      {/* Estado Clickeable */}
                      <Table.Cell>
                        <button
                          type="button"
                          onClick={() => onViewReportDetail(report.id, true)}
                          className="inline-block px-3 py-1 rounded-full text-xs font-extrabold text-white shadow-2xs hover:scale-105 hover:shadow-md transition-all cursor-pointer"
                          style={{ backgroundColor: stateColor }}
                          title="Hacer clic para modificar estado"
                        >
                          {stateName}
                        </button>
                      </Table.Cell>

                      {/* Fecha */}
                      <Table.Cell className="text-xs text-slate-500 font-semibold">
                        <div className="flex items-center gap-1">
                          <MdCalendarToday size={13} className="text-slate-400" />
                          <span>
                            {new Date(report.createdAt).toLocaleDateString("es-AR")}
                          </span>
                        </div>
                      </Table.Cell>

                      {/* Acciones */}
                      <Table.Cell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          {/* Botón Modificar Estado */}
                          <button
                            type="button"
                            onClick={() => onViewReportDetail(report.id, true)}
                            className="p-2 text-slate-600 hover:text-amber-700 hover:bg-amber-50 rounded-xl transition cursor-pointer"
                            title="Modificar estado del reporte"
                            aria-label={`Modificar estado del reporte #${report.id}`}
                          >
                            <MdEdit size={18} />
                          </button>

                          {/* Botón Ver Historial / Auditoría */}
                          <button
                            type="button"
                            onClick={() => onViewReportHistory(report.id)}
                            className="p-2 text-slate-600 hover:text-blue-900 hover:bg-blue-50 rounded-xl transition cursor-pointer"
                            title="Ver historial de seguimiento y auditoría"
                            aria-label={`Ver historial del reporte #${report.id}`}
                          >
                            <MdHistory size={18} />
                          </button>

                          {/* Botón Ver Detalle Completo */}
                          <button
                            type="button"
                            onClick={() => onViewReportDetail(report.id, false)}
                            className="p-2 text-blue-900 hover:text-blue-700 hover:bg-blue-50 rounded-xl transition cursor-pointer"
                            title="Ver detalle completo del reporte"
                            aria-label={`Ver detalle del reporte #${report.id}`}
                          >
                            <MdVisibility size={18} />
                          </button>
                        </div>
                      </Table.Cell>
                    </Table.Row>
                  );
                })
              )}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>

        <Table.Footer>
          {isMounted && (
            <UserPagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              limit={limit}
              onPageChange={onPageChange}
            />
          )}
        </Table.Footer>
      </Table>
    </div>
  );
};
