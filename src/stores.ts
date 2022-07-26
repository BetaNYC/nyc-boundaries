import type { LngLat } from 'mapbox-gl'
import type mapboxgl from 'mapbox-gl'
import { writable } from 'svelte/store'

type Address = {
  name: string
  coords: LngLat
}

const params = new URLSearchParams(window.location.search)

export const selectedBoundaryMap = writable<string | null>(params.get('map'))
export const selectedDistrict = writable<string | null>(params.get('dist'))
export const hoveredDistrictId = writable<string | null>(null)
export const selectedAddress = writable<Address>()
export const addressMarker = writable<mapboxgl.Marker>()
export const selectedCoordinates = writable<LngLat | null>(null)
export const coordinatesMarker = writable<mapboxgl.Marker>()
export const isSelectingCoordinates = writable<boolean>(false)
export const mapStore = writable<mapboxgl.Map>()
