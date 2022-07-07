import type { LngLat } from 'mapbox-gl'
import type mapboxgl from 'mapbox-gl'
import { writable } from 'svelte/store'
import type { BoundaryId } from './assets/boundaries'

type Address = {
  name: string
  coords: LngLat
}

const params = new URLSearchParams(window.location.search)

export const selectedBoundaryMap = writable(params.get('map'))
export const selectedDistrict = writable(params.get('dist'))
export const hoveredDistrictId = writable(null)
export const selectedAddress = writable<Address>()
export const mapStore = writable<mapboxgl.Map>(null)
