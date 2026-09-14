import { api } from "@/lib/api";
import { toFailure } from "@/lib/validation";
import { ActionResult } from "@/models";

export interface DashboardMetrics {
  metrics: {
    totalReports: number;
    totalSolved: number;
    averageResolutionTimeHours: number;
    reportsByCategory: { name: string; count: number }[];
    reportsByState: { name: string; count: number }[];
  };
  exportData: any[];
}

export async function getDashboardMetricsAction(): Promise<ActionResult<DashboardMetrics>> {
  try {
    const response: any = await api.get("/reports/metrics");
    return { ok: true, data: response.data.data };
  } catch (error) {
    return toFailure(error);
  }
}
