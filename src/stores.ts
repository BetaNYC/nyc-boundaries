import type mapboxgl from 'mapbox-gl'
import { writable } from 'svelte/store'
import type { BoundaryId } from './assets/boundaries'

export const selectedBoundaryMap = writable<BoundaryId | ''>('')
export const selectedDistrict = writable(null)
export const selectedAddress = writable<string>('')
export const mapStore = writable<mapboxgl.Map>(null)
