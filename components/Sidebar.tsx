import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Sidebar = ({
  setIsSideBarOpen,
}: {
  setIsSideBarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const router = useRouter();
  const [views, setViews] = useState<{ name: string; path: string }[]>([]);

  useEffect(() => {
    setViews([{ name: "Home", path: "home" }]);
  }, []);

  return (
    <div className="absolute top-0 w-[25dvh] h-screen px-5 py-9 bg-mendoza-blue-mid z-20 flex flex-col">
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
      <Button className="w-full bg-gray-300">Cerrar Sesión</Button>
    </div>
  );
};

export default Sidebar;
