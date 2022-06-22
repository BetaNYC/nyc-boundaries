import { writable } from 'svelte/store'
import type { BoundaryId } from './assets/boundaries'

export const activeBoundary = writable<BoundaryId>('cd')
export const selectedPolygon = writable(null)
