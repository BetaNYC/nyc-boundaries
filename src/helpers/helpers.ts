import polylabel from '@mapbox/polylabel'
import type { Feature } from 'geojson'
import * as turf from '@turf/turf'
import mapboxgl from 'mapbox-gl'

export function findPolylabel(feature: Feature) {
  let output = []
  if (feature.geometry.type === 'Polygon') {
    output = polylabel(feature.geometry.coordinates)
  }

  if (feature.geometry.type === 'MultiPolygon') {
    let maxArea = 0,
      maxPolygon = []
    for (let i = 0, l = feature.geometry.coordinates.length; i < l; i++) {
      const p = feature.geometry.coordinates[i]
      const area = turf.area({ type: 'Polygon', coordinates: p })
      if (area > maxArea) {
        maxPolygon = p
        maxArea = area
      }
    }
    output = polylabel(maxPolygon)
  }

  return output
}

export function sortedDistricts(features: any) {
  return (
    features &&
    features
      .sort(
        (a, b) => a.properties.namecol.localeCompare(b.properties.namecol) // Sort alphabetical districts
      )
      .sort((a, b) => a.properties.namecol - b.properties.namecol)
  ) // Sort numerical districts
}

export function getDistrictromSource(map: mapboxgl.Map, sourceId: string, districtId: string) {
  const features = map.querySourceFeatures(sourceId)
  //find feature with districtId
  const district = features.find(i => i.properties.namecol === districtId)
  return district?.toJSON()
}

export function zoomToBound(map, bounds) {
  // Turf's bbox can return either Box2D (4-item array) or Box3D (6-item array)
  // fitBounds() only accepts a 4-item array, so we need to save the output before using it
  // See https://github.com/Turfjs/turf/issues/1807

  const [x1, y1, x2, y2] = bounds;

  map.fitBounds([x1, y1, x2, y2], {
    padding: { top: 10, bottom: 25, left: 15, right: 5 },
    maxZoom: 16,
    linear: true,
    duration: 0,
  })
}