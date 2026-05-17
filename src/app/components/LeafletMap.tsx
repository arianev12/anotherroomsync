import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
// Import marker icons so Vite copies them and returns correct URLs
import markerIconUrl from "leaflet/dist/images/marker-icon.png";
import markerIcon2xUrl from "leaflet/dist/images/marker-icon-2x.png";
import markerShadowUrl from "leaflet/dist/images/marker-shadow.png";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2xUrl as unknown as string,
  iconUrl: markerIconUrl as unknown as string,
  shadowUrl: markerShadowUrl as unknown as string,
});

function FitBounds({ bounds }: { bounds: [number, number][] | null }) {
  const map = useMap();
  useEffect(() => {
    if (bounds && bounds.length > 0) {
      try { map.fitBounds(bounds as any, { padding: [40, 40] }); } catch (e) { }
    }
  }, [bounds, map]);
  return null;
}

export default function LeafletMap({
  dorms,
  userLocation,
}: {
  dorms: any[];
  userLocation: { lat: number; lng: number };
}) {
  const [center, setCenter] = useState<[number, number]>([userLocation.lat, userLocation.lng]);
  const [bounds, setBounds] = useState<[number, number][] | null>(null);

  // Geocode Nasugbu, Batangas and set center
  useEffect(() => {
    const q = encodeURIComponent("Nasugbu, Batangas, Philippines");
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${q}`)
      .then(r => r.json())
      .then((res) => {
        if (Array.isArray(res) && res.length > 0) {
          const lat = parseFloat(res[0].lat);
          const lon = parseFloat(res[0].lon);
          setCenter([lat, lon]);
          const b = res[0].boundingbox;
          if (b && b.length === 4) {
            setBounds([[parseFloat(b[0]), parseFloat(b[2])], [parseFloat(b[1]), parseFloat(b[3])]]);
          }
        }
      })
      .catch(() => {
        // fallback to provided userLocation
        setCenter([userLocation.lat, userLocation.lng]);
      });
  }, [userLocation.lat, userLocation.lng]);

  return (
    <MapContainer center={center} zoom={12} style={{ height: "100%", minHeight: 220, width: "100%" }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={center}>
        <Popup>Nasugbu, Batangas</Popup>
      </Marker>
      {dorms.map(d => (
        <Marker key={d.id} position={[d.latitude, d.longitude]}>
          <Popup>
            <div className="text-sm font-semibold">{d.name}</div>
            <div className="text-xs">{d.address}</div>
          </Popup>
        </Marker>
      ))}
      <FitBounds bounds={bounds} />
    </MapContainer>
  );
}
