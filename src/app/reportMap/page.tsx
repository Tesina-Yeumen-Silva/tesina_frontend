import React from "react";
import ReportMapView from "@/views/reportMap/ReportMap.view";
import { getMapMarkersAction } from "@/controllers/report.controller";
import { getCurrentUser } from "@/lib/session";

export default async function ReportMapPage() {
  const [initialMarkersResult, user] = await Promise.all([
    getMapMarkersAction(),
    getCurrentUser()
  ]);

  return <ReportMapView initialMarkersResult={initialMarkersResult} currentUserRole={user?.role || ""} />;
}
