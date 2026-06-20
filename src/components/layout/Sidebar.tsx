import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { logoutAction } from "@/controllers/auth.controller";

const Sidebar = ({
  setIsSideBarOpen,
}: {
  setIsSideBarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const router = useRouter();
  const [views, setViews] = useState<{ name: string; path: string }[]>([]);

  useEffect(() => {
    setViews([
      { name: "Mapa", path: "reportMap" },
      { name: "Lista", path: "reportList" },
    ]);
  }, []);

  return (
    <div className="absolute top-0 w-[25dvh] h-screen px-5 py-9 bg-mendoza-blue-mid z-[9999] flex flex-col">
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
