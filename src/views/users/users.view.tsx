"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import { MdEmail } from "react-icons/md";
import type { ActionResult, ApiResponse, User } from "@/models";
import {
  createUserAction,
  updateUserAction,
  deleteUserAction,
  updateUserPasswordAction,
  getRolesAction,
} from "@/controllers/user.controller";
import type { RoleOption } from "@/services/user.service";
import { USER_COOKIE } from "@/lib/config";
import { UserHeaderBanner } from "@/components/users/UserHeaderBanner";
import { UserSearchInput } from "@/components/users/UserSearchInput";
import { UserTable } from "@/components/users/UserTable";
import { UserFormModal } from "@/components/users/UserFormModal";
import { UserDeleteModal } from "@/components/users/UserDeleteModal";
import { UserPasswordModal } from "@/components/users/UserPasswordModal";

interface UsersViewProps {
  initialResult: ActionResult<ApiResponse<User[]>>;
  initialSearch: string;
}

const DEFAULT_ROLES: RoleOption[] = [
  { id: 1, name: "user" },
  { id: 2, name: "admin" },
  { id: 3, name: "muni" },
];

const UsersView = ({
  initialResult,
  initialSearch,
}: UsersViewProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [searchVal, setSearchVal] = useState(initialSearch);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  const [isMounted, setIsMounted] = useState(false);
  const [roles, setRoles] = useState<RoleOption[]>(DEFAULT_ROLES);
  const [currentUserRole, setCurrentUserRole] = useState<string>("");

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [userToResetPassword, setUserToResetPassword] = useState<User | null>(null);

  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== "undefined") {
      const match = document.cookie.match(
        new RegExp(`(^| )${USER_COOKIE}=([^;]+)`)
      );
      if (match) {
        try {
          const u = JSON.parse(decodeURIComponent(match[2]));
          setCurrentUserRole(u?.role || "");
        } catch (e) {}
      }
    }

    getRolesAction().then((res) => {
      if (res.ok && res.data.length > 0) {
        setRoles(res.data);
      }
    });
  }, []);

  const handleToggleRole = (roleKey: string) => {
    if (roleKey === "all") {
      setSelectedRoles([]);
      return;
    }

    setSelectedRoles((prev) => {
      if (prev.includes(roleKey)) {
        return prev.filter((r) => r !== roleKey);
      } else {
        return [...prev, roleKey];
      }
    });
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      if (searchVal) {
        params.set("search", searchVal);
      } else {
        params.delete("search");
      }
      params.set("page", "1");
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    }, 350);

    return () => clearTimeout(delayDebounceFn);
  }, [searchVal, pathname, router]);

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", String(page));
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleOpenCreate = () => {
    setUserToEdit(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (user: User) => {
    setUserToEdit(user);
    setIsFormModalOpen(true);
  };

  const handleOpenDelete = (user: User) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const handleOpenResetPassword = (user: User) => {
    setUserToResetPassword(user);
    setIsPasswordModalOpen(true);
  };

  const handleFormSubmit = async (data: {
    name: string;
    email: string;
    password?: string;
    roleId: number;
  }) => {
    if (userToEdit) {
      const res = await updateUserAction(userToEdit.id, {
        name: data.name,
        email: data.email,
        roleId: data.roleId,
      });
      if (res.ok) {
        router.refresh();
        return { ok: true };
      }
      return { ok: false, error: res.error };
    } else {
      if (!data.password) {
        return { ok: false, error: "La contraseña es requerida." };
      }
      const res = await createUserAction({
        name: data.name,
        email: data.email,
        password: data.password,
        roleId: data.roleId,
      });
      if (res.ok) {
        router.refresh();
        return { ok: true };
      }
      return { ok: false, error: res.error };
    }
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return { ok: false, error: "Usuario no seleccionado." };
    const res = await deleteUserAction(userToDelete.id);
    if (res.ok) {
      router.refresh();
      return { ok: true };
    }
    return { ok: false, error: res.error };
  };

  const handlePasswordSubmit = async (password: string) => {
    if (!userToResetPassword) return { ok: false, error: "Usuario no seleccionado." };
    const res = await updateUserPasswordAction(userToResetPassword.id, password);
    if (res.ok) {
      return { ok: true };
    }
    return { ok: false, error: res.error };
  };

  if (!initialResult.ok) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70dvh] px-4 w-full bg-slate-50">
        <div className="bg-white border border-rose-100 rounded-2xl p-8 max-w-md w-full text-center shadow-sm">
          <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-4">
            <MdEmail size={22} />
          </div>
          <h2 className="text-slate-800 text-lg font-semibold mb-2">Error al cargar usuarios</h2>
          <p className="text-slate-500 text-sm mb-5">{initialResult.error}</p>
          <button
            onClick={() => router.refresh()}
            className="px-5 py-2.5 bg-blue-900 text-white rounded-xl text-sm font-semibold hover:bg-blue-800 transition"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  const rawData = initialResult.data;
  const serverUsers: User[] = Array.isArray(rawData)
    ? rawData
    : Array.isArray(rawData?.data)
    ? rawData.data
    : [];
  const meta = Array.isArray(rawData) ? undefined : rawData?.meta;

  const currentPage = meta?.currentPage || 1;
  const totalPages = meta?.totalPages || 1;
  const totalItems = meta?.totalItems || serverUsers.length;
  const limit = meta?.limit || 50;

  const filteredUsers = useMemo(() => {
    if (!Array.isArray(serverUsers)) return [];
    return serverUsers.filter((u) => {
      const matchesSearch =
        !searchVal.trim() ||
        u.name.toLowerCase().includes(searchVal.toLowerCase().trim()) ||
        u.email.toLowerCase().includes(searchVal.toLowerCase().trim());

      const userRole = u.role?.name || "user";
      const matchesRole =
        selectedRoles.length === 0 || selectedRoles.includes(userRole);

      return matchesSearch && matchesRole;
    });
  }, [serverUsers, searchVal, selectedRoles]);

  return (
    <div className="w-full min-h-[100dvh] bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col gap-6">
        <UserHeaderBanner
          totalItems={totalItems}
          onCreateClick={currentUserRole === "admin" ? handleOpenCreate : undefined}
        />

        <UserSearchInput
          value={searchVal}
          onChange={setSearchVal}
          selectedRoles={selectedRoles}
          onToggleRole={handleToggleRole}
          currentUserRole={currentUserRole}
        />

        <UserTable
          users={filteredUsers}
          isMounted={isMounted}
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={
            searchVal.trim() || selectedRoles.length > 0
              ? filteredUsers.length
              : totalItems
          }
          limit={limit}
          onPageChange={handlePageChange}
          onEditUser={handleOpenEdit}
          onDeleteUser={handleOpenDelete}
          onResetPassword={currentUserRole === "admin" ? handleOpenResetPassword : undefined}
        />

        <UserFormModal
          isOpen={isFormModalOpen}
          onClose={() => setIsFormModalOpen(false)}
          onSubmit={handleFormSubmit}
          userToEdit={userToEdit}
          roles={roles}
        />

        <UserDeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteConfirm}
          userToDelete={userToDelete}
        />

        <UserPasswordModal
          isOpen={isPasswordModalOpen}
          onClose={() => setIsPasswordModalOpen(false)}
          onSubmit={handlePasswordSubmit}
          targetUser={userToResetPassword}
        />
      </div>
    </div>
  );
};

export default UsersView;
