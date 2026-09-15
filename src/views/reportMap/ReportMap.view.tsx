"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import type { ActionResult, MapMarker, ReportDetail } from "@/models";
import {
  getMapMarkersAction,
  getReportByIdAction,
  getReportCategoriesAction,
  getReportStatesAction,
} from "@/controllers/report.controller";
import type { MapBounds } from "@/components/reportMap/OsmMap";
import { ReportDetailModal } from "@/components/reportMap/ReportDetailModal";
import { USER_COOKIE } from "@/lib/config";
import type { ReportCategoryItem, ReportStateItem } from "@/models";

const Map = dynamic(() => import("@/components/reportMap/OsmMap"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-slate-100 flex flex-col items-center justify-center animate-pulse">
      <div className="text-slate-400 font-semibold text-sm">
        Cargando mapa de reportes...
      </div>
    </div>
  ),
});

interface ReportMapViewProps {
  initialMarkersResult?: ActionResult<MapMarker[]>;
}

const ReportMapView: React.FC<ReportMapViewProps> = ({
  initialMarkersResult,
}) => {
  const [markers, setMarkers] = useState<MapMarker[]>(() => {
    if (initialMarkersResult?.ok && Array.isArray(initialMarkersResult.data)) {
      return initialMarkersResult.data;
    }
    return [];
  });

  const [loadingMarkers, setLoadingMarkers] = useState(false);
  const [apiErrorMessage, setApiErrorMessage] = useState<string>("");
  const [currentUserRole, setCurrentUserRole] = useState<string>("");
  const currentBoundsRef = useRef<MapBounds | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<ReportDetail | null>(
    null,
  );
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [detailError, setDetailError] = useState("");

  const [categories, setCategories] = useState<ReportCategoryItem[]>([]);
  const [states, setStates] = useState<ReportStateItem[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [selectedStateId, setSelectedStateId] = useState<string>("");

  useEffect(() => {
    async function loadFilters() {
      const catsRes = await getReportCategoriesAction();
      if (catsRes.ok && catsRes.data) {
        setCategories(catsRes.data);
      }
      const statesRes = await getReportStatesAction();
      if (statesRes.ok && statesRes.data) {
        // Exclude some states if we only want Validado, Resuelto, En Progreso, but the user requested to filter markers by state. 
        // We'll provide all fetched valid states.
        setStates(statesRes.data);
      }
    }
    loadFilters();
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const match = document.cookie.match(
        new RegExp(`(^| )${USER_COOKIE}=([^;]+)`),
      );
      if (match) {
        try {
          const u = JSON.parse(decodeURIComponent(match[2]));
          setCurrentUserRole(u?.role || "");
        } catch (e) {}
      }
    }
  }, []);

  const fetchMarkersForBounds = useCallback(async (bounds: MapBounds, catId?: string, stId?: string) => {
    setLoadingMarkers(true);
    setApiErrorMessage("");

    const query: any = {
      minLat: bounds.minLat,
      maxLat: bounds.maxLat,
      minLng: bounds.minLng,
      maxLng: bounds.maxLng,
    };

    if (catId) query.categoryId = Number(catId);
    if (stId) query.stateId = Number(stId);

    const res = await getMapMarkersAction(query);
    setLoadingMarkers(false);

    if (res.ok && Array.isArray(res.data) && res.data.length > 0) {
      setMarkers(res.data);
    } else if (res.ok && Array.isArray(res.data)) {
      // Si la consulta por bounds retornó 0 marcadores en esa vista, intentamos cargar todos como fallback (con los mismos filtros)
      const fallbackQuery: any = {};
      if (catId) fallbackQuery.categoryId = Number(catId);
      if (stId) fallbackQuery.stateId = Number(stId);
      const fallbackRes = await getMapMarkersAction(fallbackQuery);
      if (fallbackRes.ok && Array.isArray(fallbackRes.data)) {
        setMarkers(fallbackRes.data);
      } else {
        setMarkers([]);
      }
    } else if (!res.ok) {
      setApiErrorMessage(res.error || "No se pudo conectar con el backend.");
    }
  }, []);

  const handleBoundsChange = useCallback(
    (bounds: MapBounds) => {
      currentBoundsRef.current = bounds;
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        fetchMarkersForBounds(bounds, selectedCategoryId, selectedStateId);
      }, 250);
    },
    [fetchMarkersForBounds, selectedCategoryId, selectedStateId],
  );

  // Refetch markers when filters change
  useEffect(() => {
    if (currentBoundsRef.current) {
      fetchMarkersForBounds(currentBoundsRef.current, selectedCategoryId, selectedStateId);
    }
  }, [selectedCategoryId, selectedStateId, fetchMarkersForBounds]);

  const handleSelectMarker = async (markerId: number) => {
    setIsModalOpen(true);
    setLoadingDetail(true);
    setDetailError("");
    setSelectedReport(null);

    const res = await getReportByIdAction(markerId);
    setLoadingDetail(false);

    if (res.ok) {
      setSelectedReport(res.data);
    } else {
      setDetailError(
        res.error || "No se pudieron obtener los datos del reporte.",
      );
    }
  };

  const handleReportUpdated = () => {
    if (currentBoundsRef.current) {
      fetchMarkersForBounds(currentBoundsRef.current);
    }
  };

  return (
    <div className="w-full h-[85dvh] relative overflow-hidden bg-slate-100">
      <div className="absolute top-4 left-16 z-20 flex flex-col md:flex-row gap-2">
        <select
          value={selectedCategoryId}
          onChange={(e) => setSelectedCategoryId(e.target.value)}
          className="px-3 py-2 rounded-xl bg-white/90 backdrop-blur-md text-slate-800 border border-slate-200/80 shadow-md text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">Todas las categorías</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        <select
          value={selectedStateId}
          onChange={(e) => setSelectedStateId(e.target.value)}
          className="px-3 py-2 rounded-xl bg-white/90 backdrop-blur-md text-slate-800 border border-slate-200/80 shadow-md text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">Todos los estados</option>
          {states.map((st) => (
            <option key={st.id} value={st.id}>
              {st.name}
            </option>
          ))}
        </select>
      </div>

      <div className="absolute top-4 right-4 z-20 pointer-events-none">
        <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/90 backdrop-blur-md text-slate-800 border border-slate-200/80 shadow-md text-xs font-bold transition">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              apiErrorMessage
                ? "bg-rose-500"
                : loadingMarkers
                  ? "bg-amber-500 animate-ping"
                  : "bg-emerald-500"
            }`}
          />
          <span>
            {apiErrorMessage
              ? "Error conectando al backend"
              : `${markers.length} ${markers.length === 1 ? "marcador visible" : "marcadores visibles"}`}
          </span>
        </div>
      </div>

      <Map
        markers={markers}
        onBoundsChange={handleBoundsChange}
        onSelectMarker={handleSelectMarker}
      />

      <ReportDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        report={selectedReport}
        loading={loadingDetail}
        error={detailError}
        currentUserRole={currentUserRole}
        onReportUpdated={handleReportUpdated}
      />
    </div>
  );
};

export default ReportMapView;
