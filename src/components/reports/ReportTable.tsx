"use client";

import React from "react";
import { Table } from "@heroui/react";
import type { ReportItem } from "@/models";
import { UserPagination } from "@/components/users/UserPagination";
import { ReportTableRow } from "./ReportTableRow";

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
                reports.map((report) => (
                  <ReportTableRow
                    key={report.id}
                    report={report}
                    onViewReportDetail={onViewReportDetail}
                    onViewReportHistory={onViewReportHistory}
                  />
                ))
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
