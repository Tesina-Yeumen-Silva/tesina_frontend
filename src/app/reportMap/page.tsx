import React from "react";
import ReportMapView from "@/views/reportMap/ReportMap.view";
import { getMapMarkersAction } from "@/controllers/report.controller";

export default async function ReportMapPage() {
  const initialMarkersResult = await getMapMarkersAction();

  return <ReportMapView initialMarkersResult={initialMarkersResult} />;
}
