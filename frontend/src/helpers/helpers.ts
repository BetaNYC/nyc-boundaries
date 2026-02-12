import polylabel from '@mapbox/polylabel';
import type { Feature, Position } from 'geojson';
import * as turf from '@turf/turf';
import type mapboxgl from 'mapbox-gl';
import { contextMenuState } from '../stores';

export const defaultZoom: Partial<mapboxgl.MapboxOptions> = {
  zoom: 9.6,
  center: [-73.97647401326105, 40.70792852402042]
};

export function findPolylabel(feature: Feature) {
  let output: number[] = [];
  if (feature.geometry.type === 'Polygon') {
    output = polylabel(feature.geometry.coordinates);
  }

  if (feature.geometry.type === 'MultiPolygon') {
    let maxArea = 0,
      maxPolygon: Position[][] = [];
    for (let i = 0, l = feature.geometry.coordinates.length; i < l; i++) {
      const p = feature.geometry.coordinates[i];
      const area = turf.area({ type: 'Polygon', coordinates: p });
      if (area > maxArea) {
        maxPolygon = p;
        maxArea = area;
      }
    }
    output = polylabel(maxPolygon);
  }

  return output;
}

export function sortedDistricts(features: Feature[]) {
  return (
    features &&
    features
      .sort(
        (a, b) => a.properties?.namecol.localeCompare(b.properties?.namecol) // Sort alphabetical districts
      )
      .sort(
        (a, b) => a.properties?.namecol - b.properties?.namecol // Sort numerical districts
      )
  );
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
  });

  const mergedFeature = features.reduce((polygon, feature) => {
    if (polygon) {
      return turf.union(polygon, feature.toJSON().geometry);
    } else {
      return feature.toJSON().geometry;
    }
  }, null);

  if (mergedFeature) {
    return mergedFeature;
  } else {
    //fallback
    features = map.querySourceFeatures(sourceId);
    let district = features.find(i => i.properties?.namecol === districtId);
    return district;
  }
}

export function zoomToBound(map: mapboxgl.Map, bounds: turf.BBox) {
  // Turf's bbox can return either Box2D (4-item array) or Box3D (6-item array)
  // fitBounds() only accepts a 4-item array, so we need to save the output before using it
  // See https://github.com/Turfjs/turf/issues/1807

  const [x1, y1, x2, y2] = bounds;

  map.fitBounds([x1, y1, x2, y2], {
    padding: { top: 72, bottom: 24, left: 16, right: 16 },
    maxZoom: 13
  });
}

export function resetZoom(map: mapboxgl.Map) {
  map.flyTo(defaultZoom);
}

export function attachContextMenuToMarker(
  marker: mapboxgl.Marker,
  getCoordinates: () => { lng: number; lat: number }
): () => void {
  const element = marker.getElement();

  const handleContextMenu = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    const coords = getCoordinates();

    contextMenuState.set({
      isOpen: true,
      position: { x: event.clientX, y: event.clientY },
      coordinates: { lng: coords.lng, lat: coords.lat }
    });
  };

  element.addEventListener('contextmenu', handleContextMenu);

  return () => {
    element.removeEventListener('contextmenu', handleContextMenu);
  };
}
