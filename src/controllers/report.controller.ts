"use server";

import { reportService } from "@/services/report.service";
import type {
  MapMarker,
  ReportDetail,
  ReportStateItem,
  ReportCategoryItem,
  ReportHistoryItem,
  ReportsResponse,
  ChangeReportStateDTO,
  GetReportQuery,
  ActionResult,
} from "@/models";
import { toFailure } from "@/lib/validation";

export async function getMapMarkersAction(
  query?: GetReportQuery
): Promise<ActionResult<MapMarker[]>> {
  try {
    const markers = await reportService.getMapMarkers(query);
    return { ok: true, data: markers };
  } catch (error) {
    return toFailure(error);
  }
}

export async function getAllReportsAction(
  page = 1,
  limit = 100
): Promise<ActionResult<ReportsResponse>> {
  try {
    const res = await reportService.getAllReports(page, limit);
    return { ok: true, data: res };
  } catch (error) {
    return toFailure(error);
  }
}

export async function getReportByIdAction(
  id: number
): Promise<ActionResult<ReportDetail>> {
  try {
    const report = await reportService.getReportById(id);
    return { ok: true, data: report };
  } catch (error) {
    return toFailure(error);
  }
}

export async function getReportHistoryAction(
  reportId: number
): Promise<ActionResult<ReportHistoryItem[]>> {
  try {
    const history = await reportService.getReportHistory(reportId);
    return { ok: true, data: history };
  } catch (error) {
    return toFailure(error);
  }
}

export async function getReportStatesAction(): Promise<ActionResult<ReportStateItem[]>> {
  try {
    const states = await reportService.getReportStates();
    return { ok: true, data: states };
  } catch (error) {
    return toFailure(error);
  }
}

export async function getReportCategoriesAction(): Promise<ActionResult<ReportCategoryItem[]>> {
  try {
    const categories = await reportService.getReportCategories();
    return { ok: true, data: categories };
  } catch (error) {
    return toFailure(error);
  }
}

export async function changeReportStateAction(
  reportId: number,
  data: ChangeReportStateDTO
): Promise<ActionResult<{ message: string }>> {
  try {
    const res = await reportService.changeReportState(reportId, data);
    return { ok: true, data: res };
  } catch (error) {
    return toFailure(error);
  }
}
