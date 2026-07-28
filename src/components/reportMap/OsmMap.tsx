"use client";
import React, { useMemo, useEffect } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import type { MapMarker } from "@/models";

export interface MapBounds {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}

interface OsmMapProps {
  markers: MapMarker[];
  onBoundsChange?: (bounds: MapBounds) => void;
  onSelectMarker?: (markerId: number) => void;
}

const DEFAULT_CENTER: [number, number] = [-32.9265, -68.8438];

const createColoredIcon = (color: string) => {
  const hexColor = color.startsWith("#") ? color : `#${color}`;
  return L.divIcon({
    className: "custom-map-pin",
    html: `
      <div style="width: 30px; height: 30px; filter: drop-shadow(0px 2px 4px rgba(0,0,0,0.3));">
        <svg width="30" height="30" viewBox="0 0 24 24" fill="${hexColor}" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
          <circle cx="12" cy="10" r="3" fill="#ffffff"></circle>
        </svg>
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
  });
};

const MapEventsHandler: React.FC<{
  onBoundsChange?: (bounds: MapBounds) => void;
}> = ({ onBoundsChange }) => {
  const map = useMapEvents({
    moveend: () => {
      if (!onBoundsChange) return;
      const b = map.getBounds();
      onBoundsChange({
        minLat: b.getSouth(),
        maxLat: b.getNorth(),
        minLng: b.getWest(),
        maxLng: b.getEast(),
      });
    },
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 150);

    const handleResize = () => {
      map.invalidateSize();
    };

    window.addEventListener("resize", handleResize);

    if (onBoundsChange) {
      const b = map.getBounds();
      onBoundsChange({
        minLat: b.getSouth(),
        maxLat: b.getNorth(),
        minLng: b.getWest(),
        maxLng: b.getEast(),
      });
    }

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleResize);
    };
  }, [map, onBoundsChange]);

  return null;
};

const OsmMap: React.FC<OsmMapProps> = ({
  markers,
  onBoundsChange,
  onSelectMarker,
}) => {
  const center: [number, number] = useMemo(() => {
    if (markers.length > 0 && markers[0].latitude && markers[0].longitude) {
      return [markers[0].latitude, markers[0].longitude];
    }
    return DEFAULT_CENTER;
  }, [markers]);

  return (
    <div className="h-full w-full overflow-hidden z-0 relative">
      <MapContainer
        center={center}
        zoom={13}
        maxZoom={18}
        maxBounds={[
          [-35.5, -70.5],
          [-31.5, -67.0],
        ]}
        maxBoundsViscosity={1.0}
        scrollWheelZoom={true}
        preferCanvas={true}
        className="h-full w-full"
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={18}
          detectRetina={true}
          keepBuffer={2}
        />

        <MapEventsHandler onBoundsChange={onBoundsChange} />

        {markers.map((marker) => {
          if (!marker.latitude || !marker.longitude) return null;
          const icon = createColoredIcon(marker.statusColor || "#3b82f6");

          return (
            <Marker
              key={marker.id}
              position={[marker.latitude, marker.longitude]}
              icon={icon}
              eventHandlers={{
                click: () => {
                  if (onSelectMarker) {
                    onSelectMarker(marker.id);
                  }
                },
              }}
            />
          );
        })}
      </MapContainer>
    </div>
  );
};

export default OsmMap;
