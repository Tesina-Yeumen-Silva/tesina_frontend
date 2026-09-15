"use server";
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
    reportsByDate: { date: string; count: number }[];
  };
  exportData: any[];
}

export interface MetricsFilter {
  fromDate?: string;
  toDate?: string;
  categoryId?: string | number;
  stateId?: string | number;
  isAnonymous?: boolean | string;
}

export async function getDashboardMetricsAction(filters?: MetricsFilter): Promise<ActionResult<DashboardMetrics>> {
  try {
    const query = new URLSearchParams();
    if (filters?.fromDate) query.append("fromDate", filters.fromDate);
    if (filters?.toDate) query.append("toDate", filters.toDate);
    if (filters?.categoryId) query.append("categoryId", filters.categoryId.toString());
    if (filters?.stateId) query.append("stateId", filters.stateId.toString());
    if (filters?.isAnonymous !== undefined && filters?.isAnonymous !== "") query.append("isAnonymous", filters.isAnonymous.toString());
    
    const queryString = query.toString();
    const url = `/reports/metrics${queryString ? `?${queryString}` : ''}`;

    const response = await api.get<DashboardMetrics>(url);
    return { ok: true, data: response };
  } catch (error) {
    return toFailure(error);
  }
}
