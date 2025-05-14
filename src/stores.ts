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
export const hoveredDistrictId = writable<string | number | undefined>();
export const selectedAddress = writable<Address | null>();
export const addressMarker = writable<Marker>();
export const selectedCoordinates = writable<LngLat | null>(
  getLngLatObjectFromUrl(params.get('lng'), params.get('lat'))
);
export const coordinatesMarker = writable<Marker>();
export const isSelectingCoordinates = writable<boolean>(false);
export const mapStore = writable<Map>();
export const showSupabaseConnectionErrorPopup = writable<boolean>(false);
