import L from "leaflet";
import "leaflet/dist/leaflet.css";
import React from "react";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import { MAP_CONFIG } from "../data/novaData";

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function LocationEvents({ onChange }) {
  useMapEvents({
    click(e) {
      onChange(e.latlng);
    },
  });
  return null;
}

export default function PaymentMap({ value, onChange }) {
  const [pos, setPos] = React.useState(value || MAP_CONFIG.defaultCenter);

  React.useEffect(() => {
    if (value) {
      setPos(value);
    }
  }, [value]);

  const handleChange = (latlng) => {
    setPos(latlng);
    onChange(latlng);
  };

  return (
    <div className="space-y-2">
      <div className="text-sm font-medium">Delivery location</div>
      <div className="h-64 rounded-xl overflow-hidden border border-black/10">
        <MapContainer center={pos} zoom={MAP_CONFIG.defaultZoom} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker
            draggable
            icon={markerIcon}
            position={pos}
            eventHandlers={{
              dragend: (e) => {
                const latlng = e.target.getLatLng();
                handleChange(latlng);
              },
            }}
          />
          <LocationEvents onChange={handleChange} />
        </MapContainer>
      </div>
      <div className="text-xs text-black/60">Tap the map or drag the pin to set your exact drop-off point.</div>
    </div>
  );
}
