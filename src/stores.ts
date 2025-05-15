import type { LngLat } from 'maplibre-gl';
import type { Map, Marker } from 'maplibre-gl';
import { writable } from 'svelte/store';

export type Address = {
  name: string;
  coords: [number, number];
};

const params = new URLSearchParams(window.location.search);

function getLngLatObjectFromUrl(
  lng: string | null,
  lat: string | null
): LngLat | null {
  if (!lng || !lat) {
    return null;
  }
  return { lng: parseFloat(lng), lat: parseFloat(lat) } as LngLat;
}

export const selectedBoundaryMap = writable<string | null>(params.get('map'));
export const selectedDistrict = writable<string | null>(params.get('dist'));
export const hoveredDistrictId = writable<string | undefined | null>(undefined);
export const selectedAddress = writable<Address | null>(null);
export const addressMarker = writable<Marker>();
export const selectedCoordinates = writable<any>(null);
export const coordinatesMarker = writable<Marker>();
export const isSelectingCoordinates = writable<boolean>(false);
export const mapStore = writable<Map | null>(null);

// New store to track if essential map sources are ready
export const mapSourcesReady = writable(false);

export const isLoading = writable(true); // Default to true initially

// New store to signal completion of map interactions related to boundary changes
export const mapInteractionCompleteSignal = writable<number>(Date.now());
