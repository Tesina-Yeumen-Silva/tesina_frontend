"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Home = () => {
  const router = useRouter();

  useEffect(() => {
    router.push("/login");
  }, [router]);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24"></main>
  );
};

export default Home;
