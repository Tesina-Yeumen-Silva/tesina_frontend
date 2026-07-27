"use client";
import React from "react";
import { Table } from "@heroui/react";
import { MdEmail, MdCalendarToday, MdEdit, MdDelete, MdVpnKey } from "react-icons/md";
import type { User } from "@/models";
import { UserRoleBadge, UserAvatar } from "./UserRoleBadge";
import { UserPagination } from "./UserPagination";

interface UserTableProps {
  users: User[];
  isMounted: boolean;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  limit: number;
  onPageChange: (page: number) => void;
  onEditUser?: (user: User) => void;
  onDeleteUser?: (user: User) => void;
  onResetPassword?: (user: User) => void;
}

export const UserTable: React.FC<UserTableProps> = ({
  users,
  isMounted,
  currentPage,
  totalPages,
  totalItems,
  limit,
  onPageChange,
  onEditUser,
  onDeleteUser,
  onResetPassword,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/70 shadow-sm overflow-hidden w-full">
      <Table>
        <Table.ScrollContainer>
          <Table.Content aria-label="Tabla de usuarios" className="min-w-[850px]">
            <Table.Header>
              <Table.Column isRowHeader>Usuario</Table.Column>
              <Table.Column>Correo Electrónico</Table.Column>
              <Table.Column>Rol</Table.Column>
              <Table.Column>Fecha de Registro</Table.Column>
              <Table.Column className="text-right">Acciones</Table.Column>
            </Table.Header>
            <Table.Body>
              {users.length === 0 ? (
                <Table.Row>
                  <Table.Cell className="py-8 text-center text-sm text-slate-400">
                    No se encontraron usuarios registrados.
                  </Table.Cell>
                  <Table.Cell className="hidden">-</Table.Cell>
                  <Table.Cell className="hidden">-</Table.Cell>
                  <Table.Cell className="hidden">-</Table.Cell>
                  <Table.Cell className="hidden">-</Table.Cell>
                </Table.Row>
              ) : (
                users.map((user) => {
                  const roleName = user.role?.name || "user";
                  return (
                    <Table.Row key={user.id} className="hover:bg-slate-50/80 transition-colors">
                      <Table.Cell>
                        <div className="flex items-center gap-3 py-1">
                          <UserAvatar name={user.name} roleName={roleName} />
                          <span className="font-medium text-slate-800">{user.name}</span>
                        </div>
                      </Table.Cell>
                      <Table.Cell>
                        <div className="flex items-center gap-2 text-slate-600">
                          <MdEmail size={16} className="text-slate-400" />
                          <span>{user.email}</span>
                        </div>
                      </Table.Cell>
                      <Table.Cell>
                        <UserRoleBadge roleName={roleName} />
                      </Table.Cell>
                      <Table.Cell>
                        <div className="flex items-center gap-2 text-slate-500">
                          <MdCalendarToday size={14} className="text-slate-400" />
                          <span>
                            {isMounted
                              ? new Date(user.createdAt).toLocaleDateString("es-AR")
                              : ""}
                          </span>
                        </div>
                      </Table.Cell>
                      <Table.Cell>
                        <div className="flex items-center justify-end gap-2">
                          {roleName !== "user" && onResetPassword && (
                            <button
                              onClick={() => onResetPassword(user)}
                              className="w-8 h-8 rounded-lg text-slate-500 hover:text-amber-700 hover:bg-amber-50 flex items-center justify-center transition cursor-pointer"
                              title="Cambiar contraseña"
                            >
                              <MdVpnKey size={18} />
                            </button>
                          )}
                          {roleName !== "user" && onEditUser && (
                            <button
                              onClick={() => onEditUser(user)}
                              className="w-8 h-8 rounded-lg text-slate-500 hover:text-blue-900 hover:bg-blue-50 flex items-center justify-center transition cursor-pointer"
                              title="Editar usuario"
                            >
                              <MdEdit size={18} />
                            </button>
                          )}
                          {roleName !== "user" && onDeleteUser && (
                            <button
                              onClick={() => onDeleteUser(user)}
                              className="w-8 h-8 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition cursor-pointer"
                              title="Eliminar usuario"
                            >
                              <MdDelete size={18} />
                            </button>
                          )}
                        </div>
                      </Table.Cell>
                    </Table.Row>
                  );
                })
              )}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
        <UserPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          limit={limit}
          onPageChange={onPageChange}
        />
      </Table>
    </div>
  );
};
