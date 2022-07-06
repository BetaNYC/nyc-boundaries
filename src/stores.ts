import type { LngLat } from 'mapbox-gl'
import type mapboxgl from 'mapbox-gl'
import { writable } from 'svelte/store'
import type { BoundaryId } from './assets/boundaries'

type Address = {
  name: string
  coords: LngLat
}

export const selectedBoundaryMap = writable<BoundaryId | ''>('')
export const selectedDistrict = writable(null)
export const hoveredDistrictId = writable(null)
export const selectedAddress = writable<Address>()
export const mapStore = writable<mapboxgl.Map>(null)
