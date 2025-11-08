import { useEffect, useState, useCallback } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const marcadorIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [32, 32],
});

function MapEvents({ onSelect }) {
  useMapEvents({
    click(e) {
      onSelect({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

export default function MapaEntrega({ direccion, onLocationSelect }) {
  const [coord, setCoord] = useState({
    lat: -37.32167,
    lng: -59.13317,
  });

  // ✅ CORREGIDO: URL correcta
  const buscarDireccion = useCallback(async () => {
    if (!direccion || direccion.length < 3) return;

    try {
      // ⬇️ CAMBIO AQUÍ: usa la misma base que en api.js
      const API_URL =
        process.env.REACT_APP_API_URL || "http://localhost:5000/api";
      const url = `${API_URL}/geo/buscar?q=${encodeURIComponent(direccion)}`;

      console.log("🔍 Buscando en:", url); // ⬅️ Debug

      const res = await fetch(url);

      // ✅ Validar respuesta antes de parsear
      if (!res.ok) {
        console.error("❌ Error HTTP:", res.status);
        return;
      }

      const data = await res.json();

      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        const nueva = { lat: parseFloat(lat), lng: parseFloat(lon) };
        setCoord(nueva);
        onLocationSelect(nueva);
      }
    } catch (err) {
      console.error("❌ Error al buscar dirección:", err);
    }
  }, [direccion, onLocationSelect]);

  useEffect(() => {
    buscarDireccion();
  }, [buscarDireccion]);

  const handleMapClick = (pos) => {
    setCoord(pos);
    onLocationSelect(pos);
  };

  return (
    <div className="w-full mt-2">
      <MapContainer
        center={[coord.lat, coord.lng]}
        zoom={15}
        className="w-full h-64 rounded-lg border border-[#d4cec6]"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={[coord.lat, coord.lng]} icon={marcadorIcon} />
        <MapEvents onSelect={handleMapClick} />
      </MapContainer>
    </div>
  );
}
