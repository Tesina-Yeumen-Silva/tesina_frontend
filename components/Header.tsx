"use client";

import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { IoMdMenu } from "react-icons/io";
import { MdHome } from "react-icons/md";
import Sidebar from "./Sidebar";
import { Button } from "@heroui/react";

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isSideBarOpen, setIsSideBarOpen] = useState<boolean>(false);

  useEffect(() => {
    setIsSideBarOpen(false);
  }, [pathname]);

  if (pathname === "/login") return null;

  return (
    <>
      {isSideBarOpen && (
        <div>
          <Sidebar setIsSideBarOpen={setIsSideBarOpen} />
          <Button
            className="absolute bg-black opacity-30 w-screen h-screen z-10"
            onPress={() => setIsSideBarOpen(false)}
            aria-label="Cerrar menú lateral"
          />
        </div>
      )}

      <div className="h-[15dvh] top-0 w-screen bg-mendoza-blue-primary flex items-center pl-10 pr-5 text-slate-100 justify-between z-10">
        <Button
          onPress={() => setIsSideBarOpen(true)}
          isIconOnly
          className="bg-transparent text-white w-15"
        >
          <IoMdMenu className="size-8" />
        </Button>

        <Button
          className="bg-transparent h-1/2"
          onPress={() => router.push("/")}
        >
          <MdHome className="size-8" />
        </Button>
      </div>
    </>
  );
};

export default Header;
