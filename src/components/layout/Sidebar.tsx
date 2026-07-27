import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { logoutAction } from "@/controllers/auth.controller";
import { USER_COOKIE } from "@/lib/config";

const Sidebar = ({
  setIsSideBarOpen,
}: {
  setIsSideBarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const router = useRouter();
  const [views, setViews] = useState<{ name: string; path: string }[]>([]);

  useEffect(() => {
    let userRole = "";
    if (typeof window !== "undefined") {
      const match = document.cookie.match(
        new RegExp(`(^| )${USER_COOKIE}=([^;]+)`),
      );
      if (match) {
        try {
          const user = JSON.parse(decodeURIComponent(match[2]));
          userRole = user?.role || "";
        } catch (e) {
          // Ignore
        }
      }
    }

    const baseViews = [
      { name: "Mapa", path: "reportMap" },
      { name: "Lista", path: "reportList" },
      { name: "Usuarios", path: "users" },
    ];

    setViews(baseViews);
  }, []);

  return (
    <div className="absolute top-0 w-[25dvh] h-screen px-5 py-9 bg-mendoza-blue-mid z-9999 flex flex-col">
      <div className="flex gap-2 flex-col h-[90dvh]">
        {views.map((view) => (
          <Button
            key={view.name}
            onPress={() => {
              router.push(view.path);
              setIsSideBarOpen(false);
            }}
            className="w-full bg-mendoza-blue-primary text-white"
          >
            {view.name}
          </Button>
        ))}
      </div>
      <form action={logoutAction} className="w-full">
        <Button type="submit" className="w-full bg-red-500">
          Cerrar Sesión
        </Button>
      </form>
    </div>
  );
};

export default Sidebar;
