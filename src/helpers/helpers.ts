import polylabel from '@mapbox/polylabel'
import type { Feature } from 'geojson'
import * as turf from '@turf/turf'
import type mapboxgl from 'mapbox-gl'

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

export function sortedDistricts(features: Feature[]) {
  return (
    features &&
    features
      .sort(
        (a, b) => a.properties.namecol.localeCompare(b.properties.namecol) // Sort alphabetical districts
      )
      .sort(
        (a, b) => a.properties.namecol - b.properties.namecol // Sort numerical districts
      )
  )
}

export function getDistrictFromSource(
  map: mapboxgl.Map,
  sourceId: string,
  districtId: string
) {
  // Find features with districtId and merge (union) them into one. This fixes zoom issues later down.
  // https://stackoverflow.com/questions/46511688/wrong-geometry-with-mapbox-queryrenderedfeatures
  let features = map.querySourceFeatures(sourceId, {
    filter: ['==', 'namecol', districtId]
  })

  const mergedFeature = features.reduce((polygon, feature) => {
    if (polygon) {
      return turf.union(polygon, feature.toJSON().geometry)
    } else {
      return feature.toJSON().geometry
    }
  }, null)

  if (mergedFeature) {
    return mergedFeature
  } else {
    //fallback
    features = map.querySourceFeatures(sourceId)
    let district = features.find(i => i.properties.namecol === districtId)
    return district
  }
}

export function zoomToBound(map, bounds) {
  // Turf's bbox can return either Box2D (4-item array) or Box3D (6-item array)
  // fitBounds() only accepts a 4-item array, so we need to save the output before using it
  // See https://github.com/Turfjs/turf/issues/1807

  const [x1, y1, x2, y2] = bounds

  map.fitBounds([x1, y1, x2, y2], {
    padding: { top: 72, bottom: 24, left: 16, right: 16 },
    maxZoom: 13
  })
}
