"use client";
import React from "react";
import { Table, Pagination } from "@heroui/react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

interface UserPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  limit: number;
  onPageChange: (page: number) => void;
}

export const UserPagination: React.FC<UserPaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  limit,
  onPageChange,
}) => {
  const start = totalItems === 0 ? 0 : (currentPage - 1) * limit + 1;
  const end = Math.min(currentPage * limit, totalItems);
  const safeTotalPages = Math.max(1, totalPages);
  const pages = Array.from({ length: safeTotalPages }, (_, i) => i + 1);

  return (
    <Table.Footer className="border-t border-slate-100 px-4 py-3">
      <Pagination size="sm">
        <Pagination.Summary className="text-slate-500 text-xs">
          {start} a {end} de {totalItems} resultados
        </Pagination.Summary>
        <Pagination.Content>
          <Pagination.Item>
            <Pagination.Previous
              isDisabled={currentPage <= 1}
              onPress={() => onPageChange(Math.max(1, currentPage - 1))}
              className="text-slate-600 hover:text-blue-900 cursor-pointer"
            >
              <MdChevronLeft size={16} />
              Anterior
            </Pagination.Previous>
          </Pagination.Item>

          {pages.map((p) => (
            <Pagination.Item key={p}>
              <Pagination.Link
                isActive={p === currentPage}
                onPress={() => onPageChange(p)}
                className={
                  p === currentPage
                    ? "bg-blue-900 text-white rounded-lg cursor-pointer font-semibold"
                    : "text-slate-600 hover:text-blue-900 rounded-lg cursor-pointer"
                }
              >
                {p}
              </Pagination.Link>
            </Pagination.Item>
          ))}

          <Pagination.Item>
            <Pagination.Next
              isDisabled={currentPage >= safeTotalPages}
              onPress={() => onPageChange(Math.min(safeTotalPages, currentPage + 1))}
              className="text-slate-600 hover:text-blue-900 cursor-pointer"
            >
              Siguiente
              <MdChevronRight size={16} />
            </Pagination.Next>
          </Pagination.Item>
        </Pagination.Content>
      </Pagination>
    </Table.Footer>
  );
};
