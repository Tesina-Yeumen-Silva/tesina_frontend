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
    <Table.Footer className="border-t border-slate-100 px-6 py-3.5 w-full">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
        <span className="text-slate-500 text-xs font-semibold shrink-0">
          Mostrando <strong className="text-slate-800 font-extrabold">{start}</strong> a{" "}
          <strong className="text-slate-800 font-extrabold">{end}</strong> de{" "}
          <strong className="text-slate-800 font-extrabold">{totalItems}</strong> resultados
        </span>

        <div className="flex items-center justify-end ml-auto">
          <Pagination size="sm">
            <Pagination.Content className="flex items-center gap-1 justify-end ml-auto">
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
        </div>
      </div>
    </Table.Footer>
  );
};
