"use client";
import React, { useState } from "react";
import { MdClose, MdWarning } from "react-icons/md";
import type { User } from "@/models";

interface UserDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<{ ok: boolean; error?: string }>;
  userToDelete?: User | null;
}

export const UserDeleteModal: React.FC<UserDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  userToDelete,
}) => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen || !userToDelete) return null;

  const handleConfirm = async () => {
    setErrorMsg(null);
    setLoading(true);

    try {
      const res = await onConfirm();
      if (res.ok) {
        onClose();
      } else {
        setErrorMsg(res.error || "Ocurrió un error al eliminar.");
      }
    } catch {
      setErrorMsg("Error de conexión al servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xl w-full max-w-md overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <MdWarning className="text-rose-500" size={20} />
            Eliminar Usuario
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center transition"
          >
            <MdClose size={18} />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-4">
          {errorMsg && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl p-3">
              {errorMsg}
            </div>
          )}

          <p className="text-sm text-slate-600">
            ¿Estás seguro de que deseas eliminar al usuario{" "}
            <span className="font-bold text-slate-800">{userToDelete.name}</span> (
            <span className="text-slate-500">{userToDelete.email}</span>)?
          </p>
          <p className="text-xs text-rose-600 bg-rose-50 border border-rose-100 rounded-xl p-3">
            Esta acción desactivará al usuario en el sistema.
          </p>

          <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={loading}
              className="px-5 py-2.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-sm transition disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Eliminando..." : "Eliminar Usuario"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
