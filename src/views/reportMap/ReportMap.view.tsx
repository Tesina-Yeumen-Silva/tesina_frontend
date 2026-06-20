"use client";
import React from "react";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("@/components/reportMap/OsmMap"), {
  ssr: false,
  loading: () => (
    <div className="h-100 w-full bg-gray-100 flex items-center justify-center animate-pulse rounded-lg">
      Cargando mapa...
    </div>
  ),
});

const ReportMapView = () => {
  return <Map />;
};

export default ReportMapView;
