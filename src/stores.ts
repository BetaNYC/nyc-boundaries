import { writable } from 'svelte/store'
import type { BoundaryId } from './assets/boundaries'

export const activeLayer = writable<BoundaryId>('cd')
export const selectedPolygon = writable(null)
