import React from "react";
import {
  MdLightbulb,
  MdWater,
  MdWaterDrop,
  MdPark,
  MdConstruction,
  MdDelete,
  MdTraffic,
  MdDirectionsWalk,
  MdForest,
  MdCategory,
} from "react-icons/md";

export const getCategoryIcon = (categoryName: string, size = 15) => {
  if (!categoryName) {
    return <MdCategory size={size} className="text-blue-900 shrink-0" />;
  }

  const norm = categoryName
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

  if (norm.includes("acequia") || norm.includes("drenaje")) {
    return <MdWater size={size} className="text-cyan-600 shrink-0" />;
  }
  if (norm.includes("alumbrado") || norm.includes("luz")) {
    return <MdLightbulb size={size} className="text-amber-500 shrink-0" />;
  }
  if (norm.includes("arbol") || norm.includes("arbolado")) {
    return <MdForest size={size} className="text-emerald-600 shrink-0" />;
  }
  if (
    norm.includes("bache") ||
    norm.includes("paviment") ||
    norm.includes("calzada")
  ) {
    return <MdConstruction size={size} className="text-amber-700 shrink-0" />;
  }
  if (
    norm.includes("limpieza") ||
    norm.includes("residuo") ||
    norm.includes("basura")
  ) {
    return <MdDelete size={size} className="text-teal-600 shrink-0" />;
  }
  if (
    norm.includes("plaza") ||
    norm.includes("parque") ||
    norm.includes("verde")
  ) {
    return <MdPark size={size} className="text-green-600 shrink-0" />;
  }
  if (
    norm.includes("semaforo") ||
    norm.includes("senales") ||
    norm.includes("senalisacion") ||
    norm.includes("transito")
  ) {
    return <MdTraffic size={size} className="text-rose-600 shrink-0" />;
  }
  if (norm.includes("vereda") || norm.includes("accesib")) {
    return <MdDirectionsWalk size={size} className="text-indigo-600 shrink-0" />;
  }
  if (norm.includes("agua") || norm.includes("cloaca")) {
    return <MdWaterDrop size={size} className="text-blue-600 shrink-0" />;
  }

  return <MdCategory size={size} className="text-blue-900 shrink-0" />;
};
