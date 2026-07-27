"use client";
import React, { useState, useEffect } from "react";
import { MdClose, MdPerson, MdEmail, MdLock, MdBadge } from "react-icons/md";
import type { User } from "@/models";
import type { RoleOption } from "@/services/user.service";

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    email: string;
    password?: string;
    roleId: number;
  }) => Promise<{ ok: boolean; error?: string }>;
  userToEdit?: User | null;
  roles: RoleOption[];
}

export const UserFormModal: React.FC<UserFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  userToEdit,
  roles,
}) => {
  const isEditing = Boolean(userToEdit);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roleId, setRoleId] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (userToEdit) {
      setName(userToEdit.name);
      setEmail(userToEdit.email);
      setPassword("");
      setRoleId(userToEdit.roleId);
    } else {
      setName("");
      setEmail("");
      setPassword("");
      setRoleId(roles[0]?.id || 1);
    }
    setErrorMsg(null);
  }, [userToEdit, isOpen, roles]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const res = await onSubmit({
        name,
        email,
        password: isEditing ? undefined : password,
        roleId: Number(roleId),
      });

      if (res.ok) {
        onClose();
      } else {
        setErrorMsg(res.error || "Ocurrió un error al guardar.");
      }
    } catch {
      setErrorMsg("Error de conexión al servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-lg font-bold text-slate-800">
            {isEditing ? "Editar Usuario" : "Crear Nuevo Usuario"}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center transition"
          >
            <MdClose size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          {errorMsg && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl p-3">
              {errorMsg}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <MdPerson className="text-slate-400" size={16} />
              Nombre Completo
            </label>
            <input
              type="text"
              required
              placeholder="Ej. Juan Pérez"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:border-blue-800 focus:bg-white transition text-slate-800"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <MdEmail className="text-slate-400" size={16} />
              Correo Electrónico
            </label>
            <input
              type="email"
              required
              placeholder="usuario@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:border-blue-800 focus:bg-white transition text-slate-800"
            />
          </div>

          {!isEditing && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <MdLock className="text-slate-400" size={16} />
                Contraseña
              </label>
              <input
                type="password"
                required
                minLength={6}
                placeholder="Mínimo 8 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:border-blue-800 focus:bg-white transition text-slate-800"
              />
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <MdBadge className="text-slate-400" size={16} />
              Rol de Usuario
            </label>
            <select
              value={roleId}
              onChange={(e) => setRoleId(Number(e.target.value))}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:border-blue-800 focus:bg-white transition text-slate-800"
            >
              {roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name === "admin"
                    ? "Administrador"
                    : r.name === "muni"
                      ? "Municipal"
                      : "Ciudadano"}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-xl shadow-sm transition disabled:opacity-50 cursor-pointer"
            >
              {loading
                ? "Guardando..."
                : isEditing
                  ? "Guardar Cambios"
                  : "Crear Usuario"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
