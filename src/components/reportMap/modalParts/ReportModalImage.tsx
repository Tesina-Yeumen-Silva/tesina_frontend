"use client";

import React from "react";
import { MdPhotoCamera, MdRefresh } from "react-icons/md";

interface ReportModalImageProps {
  imageUrl?: string;
  showImage: boolean;
  imageLoading: boolean;
  onLoadImage: () => void;
  onImageLoaded: () => void;
  reportId: number;
}

export const ReportModalImage: React.FC<ReportModalImageProps> = ({
  imageUrl,
  showImage,
  imageLoading,
  onLoadImage,
  onImageLoaded,
  reportId,
}) => {
  return (
    <div className="mt-1 w-full">
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
        Evidencia fotográfica
      </span>

      {!showImage ? (
        <button
          type="button"
          onClick={onLoadImage}
          className="w-full py-3 px-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 border-dashed rounded-2xl flex items-center justify-center gap-2 text-xs font-bold text-slate-700 hover:text-blue-900 transition cursor-pointer group"
        >
          <MdPhotoCamera
            size={18}
            className="text-slate-400 group-hover:text-blue-900 transition"
          />
          <span>Cargar imagen del reporte</span>
        </button>
      ) : (
        <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 max-h-64 flex items-center justify-center">
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-100 text-slate-400 text-xs font-semibold gap-2">
              <MdRefresh size={18} className="animate-spin text-blue-900" />
              Cargando fotografía...
            </div>
          )}
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={`Evidencia reporte #${reportId}`}
              onLoad={onImageLoaded}
              onError={onImageLoaded}
              className="w-full h-auto max-h-64 object-contain"
            />
          ) : (
            <div className="py-8 text-center text-xs text-slate-400">
              No hay fotografía adjunta para este reporte.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
