export interface LatLng {
  lat: number;
  lng: number;
}

export interface RouteMapData {
  source: LatLng & { label: string };
  destination: LatLng & { label: string };
  coordinates: [number, number][];
}

const geocodeCache = new Map<string, LatLng>();

function buildCityQuery(city: string, state?: string): string {
  return [city.trim(), state?.trim(), 'India'].filter(Boolean).join(', ');
}

export async function geocodeCity(
  city: string,
  state?: string,
): Promise<LatLng> {
  const cacheKey = buildCityQuery(city, state);
  const cached = geocodeCache.get(cacheKey);
  if (cached) return cached;

  const url = new URL('https://nominatim.openstreetmap.org/search');
  url.searchParams.set('q', cacheKey);
  url.searchParams.set('format', 'json');
  url.searchParams.set('limit', '1');
  url.searchParams.set('countrycodes', 'in');

  const response = await fetch(url.toString(), {
    headers: { 'Accept-Language': 'en' },
  });

  if (!response.ok) {
    throw new Error(`Could not locate "${city}"`);
  }

  const results = (await response.json()) as Array<{ lat: string; lon: string }>;

  if (!results.length) {
    throw new Error(`Could not locate "${city}"`);
  }

  const coords: LatLng = {
    lat: Number(results[0].lat),
    lng: Number(results[0].lon),
  };

  geocodeCache.set(cacheKey, coords);
  return coords;
}

export async function fetchDrivingRoute(
  source: LatLng,
  destination: LatLng,
): Promise<[number, number][]> {
  const url =
    `https://router.project-osrm.org/route/v1/driving/` +
    `${source.lng},${source.lat};${destination.lng},${destination.lat}` +
    `?overview=full&geometries=geojson`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch route geometry');
  }

  const data = (await response.json()) as {
    routes?: Array<{ geometry: { coordinates: [number, number][] } }>;
  };

  const route = data.routes?.[0];
  if (!route) {
    throw new Error('No driving route found between these cities');
  }

  return route.geometry.coordinates.map(([lng, lat]) => [lat, lng]);
}

export async function loadRouteMapData(
  sourceCity: string,
  destinationCity: string,
  sourceState?: string,
  destinationState?: string,
): Promise<RouteMapData> {
  const [sourceCoords, destinationCoords] = await Promise.all([
    geocodeCity(sourceCity, sourceState),
    geocodeCity(destinationCity, destinationState),
  ]);

  const coordinates = await fetchDrivingRoute(sourceCoords, destinationCoords);

  return {
    source: {
      ...sourceCoords,
      label: sourceState ? `${sourceCity}, ${sourceState}` : sourceCity,
    },
    destination: {
      ...destinationCoords,
      label: destinationState
        ? `${destinationCity}, ${destinationState}`
        : destinationCity,
    },
    coordinates,
  };
}
