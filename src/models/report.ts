export interface MapMarker {
  id: number;
  latitude: number;
  longitude: number;
  status: string;
  statusColor: string;
}

export interface ReportDetail {
  id: number;
  address: string;
  latitude: number;
  longitude: number;
  description: string;
  imageUrl: string;
  createdAt: string;
  category: string;
  updatedState?: string;
  status: string;
  statusColor: string;
  reporterName: string;
  adhesionsCount: number;
}

export interface ReportStateItem {
  id: number;
  name: string;
  color: string;
}

export interface ReportCategoryItem {
  id: number;
  name: string;
}

export interface ReportHistoryItem {
  id: number;
  reportId: number;
  stateId: number;
  observation: string;
  createdAt: string;
  state: {
    name: string;
    color: string;
  };
}

export interface ReportItem {
  id: number;
  address: string;
  latitude: number;
  longitude: number;
  description: string;
  imageUrl?: string;
  createdAt: string;
  category?: {
    id: number;
    name: string;
  };
  reportHistory?: Array<{
    createdAt: string;
    state?: {
      id: number;
      name: string;
      color: string;
    };
  }>;
}

export interface ReportsResponse {
  reports: ReportItem[];
  totalReports: number;
  page: number;
  limit: number;
}

export interface ChangeReportStateDTO {
  stateId: number;
  observation?: string;
}

export interface GetReportQuery {
  minLat?: number;
  maxLat?: number;
  minLng?: number;
  maxLng?: number;
  categoryId?: number;
  stateId?: number;
}
