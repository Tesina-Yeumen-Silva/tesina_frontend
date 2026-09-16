import React from "react";
import ReportListView from "@/views/reportList/reportList.view";
import {
  getAllReportsAction,
  getReportStatesAction,
  getReportCategoriesAction,
} from "@/controllers/report.controller";
import { getCurrentUser } from "@/lib/session";

export default async function ReportListPage() {
  const [reportsRes, statesRes, categoriesRes, user] = await Promise.all([
    getAllReportsAction(1, 10),
    getReportStatesAction(),
    getReportCategoriesAction(),
    getCurrentUser(),
  ]);

  return (
    <ReportListView
      initialReportsResult={reportsRes}
      initialStatesResult={statesRes}
      initialCategoriesResult={categoriesRes}
      currentUserRole={user?.role || ""}
    />
  );
}
