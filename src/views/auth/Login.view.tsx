"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useActionState } from "react";
import { Button, FieldError, Input, Label, TextField } from "@heroui/react";
import {
  MdLocationPin,
  MdEmail,
  MdLock,
  MdArrowForward,
  MdVisibilityOff,
  MdVisibility,
} from "react-icons/md";
import LoadIcon from "../../components/ui/LoadIcon";
import { loginAction } from "@/controllers/auth.controller";

const LoginView = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [state, action, isPending] = useActionState(loginAction, null);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-300">
      <div className="w-full max-w-md rounded-2xl overflow-hidden border border-gray-200">
        <div className="bg-mendoza-blue-primary px-8 py-8">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-lg bg-mendoza-blue-secondary flex items-center justify-center">
              <MdLocationPin size={18} className="text-mendoza-blue-bg" />
            </div>
            <span className="text-mendoza-blue-light text-base font-medium">
              Mendoza Reporta
            </span>
          </div>
          <h1 className="text-white text-2xl font-semibold mb-1">Bienvenido</h1>
          <p className="text-mendoza-blue-soft text-sm">
            Ingresá tus datos para continuar
          </p>
        </div>

        <div className="bg-white px-8 py-8">
          <form action={action} className="flex flex-col gap-5">
            <TextField
              isRequired
              name="email"
              type="email"
              className="w-full"
              validate={(v) =>
                /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(v)
                  ? null
                  : "Ingresá un email válido"
              }
            >
              <Label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Correo electrónico
              </Label>
              <div className="relative mt-1.5">
                <MdEmail
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10"
                />
                <Input
                  placeholder="tu@email.com"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-mendoza-blue-mid"
                />
              </div>
              <FieldError className="text-xs text-red-500 mt-1" />
            </TextField>

            <TextField
              isRequired
              name="password"
              type={showPassword ? "text" : "password"}
              minLength={8}
              className="w-full"
              validate={(v) =>
                v.length >= 8
                  ? null
                  : "La contraseña debe tener mínimo 8 caracteres"
              }
            >
              <Label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contraseña
              </Label>
              <div className="relative mt-1.5">
                <MdLock
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10"
                />
                <Input
                  placeholder="Mínimo 8 caracteres"
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-mendoza-blue-mid"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                  aria-label={
                    showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                  }
                >
                  {showPassword ? (
                    <MdVisibilityOff size={18} />
                  ) : (
                    <MdVisibility size={18} />
                  )}
                </button>
              </div>
              <FieldError className="text-xs text-red-500 mt-1" />
            </TextField>

            <div className="text-right -mt-3">
              <a
                href="#"
                className="text-xs text-mendoza-blue-mid hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            {state?.ok === false && (
              <p className="text-xs text-red-500 text-center -mt-2">
                {state.error}
              </p>
            )}

            <Button
              type="submit"
              isPending={isPending}
              className="w-full bg-mendoza-blue-primary text-white font-medium rounded-xl py-3"
            >
              {({ isPending }) => (
                <>
                  {isPending ? (
                    <LoadIcon />
                  ) : (
                    <MdArrowForward size={16} className="mr-2" />
                  )}
                  {isPending ? "Ingresando..." : "Iniciar sesión"}
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
