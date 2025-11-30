import React, { useState, useEffect, useCallback } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";

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

  // ✅ Detecta la URL del backend automáticamente
  const API_URL = process.env.REACT_APP_API_URL || "https://eldanes.online/api";

  const buscarDireccion = useCallback(async () => {
    if (!direccion || direccion.length < 3) return;

    try {
      const url = `${API_URL}/geo/buscar?q=${encodeURIComponent(direccion)}`;
      console.log("🔍 Buscando en:", url);

      const res = await fetch(url);
      if (!res.ok) return;

      const text = await res.text();

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        console.error("⚠️ El servidor devolvió HTML, no JSON:", text.slice(0, 100));
        return;
      }

      if (data && Array.isArray(data) && data.length > 0) {
        const { lat, lon } = data[0];
        const nueva = { lat: parseFloat(lat), lng: parseFloat(lon) };
        setCoord(nueva);
        onLocationSelect(nueva);
      } else {
        console.error("❌ Datos inválidos:", data);
      }
    } catch (err) {
      console.error("❌ Error al buscar dirección:", err);
    }
  }, [direccion, API_URL, onLocationSelect]);

  useEffect(() => {
    buscarDireccion();
  }, [buscarDireccion]);

  const handleMapClick = (pos) => {
    setCoord(pos);
    onLocationSelect(pos);
  };

 return (
   <div className="w-full mt-2 relative z-10">
     <MapContainer
       center={[coord.lat, coord.lng]}
       zoom={15}
       className="w-full h-64 rounded-lg border border-[#d4cec6] z-0"
       style={{ zIndex: 0 }}
     >
       <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
       <Marker position={[coord.lat, coord.lng]} icon={marcadorIcon} />
       <MapEvents onSelect={handleMapClick} />
     </MapContainer>
   </div>
 );

}

