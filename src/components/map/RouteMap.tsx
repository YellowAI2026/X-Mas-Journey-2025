import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Route } from '../../types';

// Fix for default marker icons in Leaflet with Vite
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

interface RouteMapProps {
  route: Route;
  selectedPointId?: string;
  onPointSelect?: (pointId: string) => void;
}

export function RouteMap({ route, selectedPointId, onPointSelect }: RouteMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Initialize map centered on Munich
    const map = L.map(mapContainerRef.current).setView([48.1351, 11.582], 13);
    mapRef.current = map;

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || !route) return;

    const map = mapRef.current;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Add markers for each point
    const bounds = L.latLngBounds([]);
    const points = route.points;

    points.forEach((point, index) => {
      const isSelected = point.id === selectedPointId;

      // Create custom icon with numbering
      const customIcon = L.divIcon({
        className: 'custom-marker',
        html: `
          <div class="relative">
            <div class="absolute -top-10 left-1/2 -translate-x-1/2 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg border-2 ${
              isSelected ? 'border-christmas-red scale-125' : 'border-christmas-green'
            } transition-all">
              <span class="font-bold text-sm ${
                isSelected ? 'text-christmas-red' : 'text-christmas-green'
              }">${index + 1}</span>
            </div>
          </div>
        `,
        iconSize: [32, 40],
        iconAnchor: [16, 40],
      });

      const marker = L.marker([point.lat, point.lng], { icon: customIcon })
        .addTo(map)
        .bindPopup(`
          <div class="text-sm">
            <h4 class="font-bold text-christmas-green mb-1">${point.name}</h4>
            <p class="text-xs text-gray-600 mb-2">${point.address}</p>
            <p class="text-xs">${point.description}</p>
            <div class="mt-2 text-xs">
              <strong>Dauer:</strong> ${point.duration} Min<br/>
              <strong>Kosten:</strong> ${point.estimatedCost || 0}€
            </div>
          </div>
        `);

      if (onPointSelect) {
        marker.on('click', () => onPointSelect(point.id));
      }

      markersRef.current.push(marker);
      bounds.extend([point.lat, point.lng]);
    });

    // Draw route polyline
    if (points.length > 1) {
      const routeCoordinates: L.LatLngExpression[] = points.map((p) => [
        p.lat,
        p.lng,
      ]);
      L.polyline(routeCoordinates, {
        color: '#C41E3A',
        weight: 4,
        opacity: 0.7,
        dashArray: '10, 10',
      }).addTo(map);
    }

    // Fit map to show all markers
    if (points.length > 0) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [route, selectedPointId, onPointSelect]);

  return (
    <div className="w-full h-full min-h-[400px] md:min-h-[600px] rounded-2xl overflow-hidden shadow-xl">
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
}
