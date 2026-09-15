import React from "react";
import ReportListView from "@/views/reportList/reportList.view";
import {
  getAllReportsAction,
  getReportStatesAction,
  getReportCategoriesAction,
} from "@/controllers/report.controller";

export default async function ReportListPage() {
  const [reportsRes, statesRes, categoriesRes] = await Promise.all([
    getAllReportsAction(1, 100),
    getReportStatesAction(),
    getReportCategoriesAction(),
  ]);

  return (
    <ReportListView
      initialReportsResult={reportsRes}
      initialStatesResult={statesRes}
      initialCategoriesResult={categoriesRes}
    />
  );
}
