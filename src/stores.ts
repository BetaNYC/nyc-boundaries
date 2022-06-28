import type mapboxgl from 'mapbox-gl'
import { writable } from 'svelte/store'
import type { BoundaryId } from './assets/boundaries'

export const activeBoundary = writable<BoundaryId>('cd')
export const selectedPolygon = writable(null)
export const addressQuery = writable<string>(null)
export const mapStore = writable<mapboxgl.Map>(null)
