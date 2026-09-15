import { api } from "@/lib/api";
import type {
  MapMarker,
  ReportDetail,
  ReportStateItem,
  ReportCategoryItem,
  ReportHistoryItem,
  ReportsResponse,
  ChangeReportStateDTO,
  GetReportQuery,
} from "@/models";

export const reportService = {
  getMapMarkers: (query?: GetReportQuery) => {
    const params = new URLSearchParams();
    if (query?.minLat) params.append("minLat", String(query.minLat));
    if (query?.maxLat) params.append("maxLat", String(query.maxLat));
    if (query?.minLng) params.append("minLng", String(query.minLng));
    if (query?.maxLng) params.append("maxLng", String(query.maxLng));
    if (query?.categoryId) params.append("categoryId", String(query.categoryId));
    if (query?.stateId) params.append("stateId", String(query.stateId));

    const queryString = params.toString();
    const path = `/reports/markers${queryString ? `?${queryString}` : ""}`;

    return api.get<MapMarker[]>(path);
  },

  getAllReports: (page = 1, limit = 100) => {
    return api.get<ReportsResponse>(`/reports?page=${page}&limit=${limit}`);
  },

  getReportById: (id: number) => {
    return api.get<ReportDetail>(`/reports/${id}`);
  },

  getReportHistory: (reportId: number) => {
    return api.get<ReportHistoryItem[]>(`/reports/${reportId}/history`);
  },

  getReportStates: () => {
    return api.get<ReportStateItem[]>("/report-states");
  },

  getReportCategories: () => {
    return api.get<ReportCategoryItem[]>("/report-categories");
  },

  changeReportState: (reportId: number, data: ChangeReportStateDTO) => {
    return api.put<{ message: string }>(`/reports/${reportId}/state`, data);
  },
};
