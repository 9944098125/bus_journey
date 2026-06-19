import React, { useEffect } from 'react';
import {
  CircleMarker,
  MapContainer,
  Polyline,
  TileLayer,
  Tooltip,
  useMap,
} from 'react-leaflet';
import { latLngBounds, type LatLngExpression } from 'leaflet';

import 'leaflet/dist/leaflet.css';

import { RouteMapData } from './route-map-utils';

interface RouteMapViewProps {
  mapData: RouteMapData;
}

function FitRouteBounds({ positions }: { positions: LatLngExpression[] }) {
  const map = useMap();

  useEffect(() => {
    if (positions.length > 0) {
      map.fitBounds(latLngBounds(positions), { padding: [48, 48] });
    }
  }, [map, positions]);

  return null;
}

export default function RouteMapView({ mapData }: RouteMapViewProps) {
  const { source, destination, coordinates } = mapData;
  const boundsPositions: LatLngExpression[] = [
    [source.lat, source.lng],
    [destination.lat, destination.lng],
    ...coordinates,
  ];
  const center: LatLngExpression = [
    (source.lat + destination.lat) / 2,
    (source.lng + destination.lng) / 2,
  ];

  return (
    <MapContainer
      center={center}
      zoom={6}
      scrollWheelZoom
      className="h-full min-h-0 w-full flex-1 rounded-xl"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitRouteBounds positions={boundsPositions} />
      <Polyline
        positions={coordinates}
        pathOptions={{ color: '#0077b6', weight: 5, opacity: 0.9 }}
      />
      <CircleMarker
        center={[source.lat, source.lng]}
        radius={10}
        pathOptions={{ color: '#047857', fillColor: '#10b981', fillOpacity: 1 }}
      >
        <Tooltip permanent direction="top" offset={[0, -8]}>
          {source.label}
        </Tooltip>
      </CircleMarker>
      <CircleMarker
        center={[destination.lat, destination.lng]}
        radius={10}
        pathOptions={{ color: '#b91c1c', fillColor: '#ef4444', fillOpacity: 1 }}
      >
        <Tooltip permanent direction="top" offset={[0, -8]}>
          {destination.label}
        </Tooltip>
      </CircleMarker>
    </MapContainer>
  );
}
