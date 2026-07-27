import React, { useMemo } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: markerIcon.src,
  iconRetinaUrl: markerIcon2x.src,
  shadowUrl: markerShadow.src,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const POSITION: [number, number] = [-32.9265, -68.8438];
const OsmMap = () => {
  return (
    <div className="h-[85dvh] w-full overflow-hidden z-0">
      <MapContainer
        center={POSITION}
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
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={18}
          detectRetina={true}
          keepBuffer={2}
        />
      </MapContainer>
    </div>
  );
};

export default OsmMap;
