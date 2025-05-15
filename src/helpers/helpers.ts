import type { Feature, Position } from 'geojson';
import * as turf from '@turf/turf';
import type { Map, MapOptions } from 'maplibre-gl';
import type { FilterSpecification } from 'maplibre-gl';

export const defaultZoom: Partial<MapOptions> = {
  zoom: 9.6,
  center: [-73.97647401326105, 40.70792852402042]
};

export function sortedDistricts(features: Feature[]): Feature[] {
  if (!features) {
    return [];
  }
  // Slice to sort a copy and avoid mutating the original array
  return features.slice().sort((a, b) => {
    const nameA = a.properties?.namecol;
    const nameB = b.properties?.namecol;

    // Consistently handle undefined or null names by treating them as empty strings for sorting,
    // or decide on a specific order (e.g., push to end).
    // Here, we'll treat them as less than actual strings if one is present.
    const nameAIsString = typeof nameA === 'string';
    const nameBIsString = typeof nameB === 'string';

    if (nameAIsString && nameBIsString) {
      // Attempt to parse as numbers for primarily numeric sort
      const numA = parseFloat(nameA as string);
      const numB = parseFloat(nameB as string);

      if (!isNaN(numA) && !isNaN(numB)) {
        if (numA !== numB) {
          return numA - numB; // Sort numerically
        }
        // If numbers are numerically equal (e.g., "01" and "1"), fall back to string localeCompare for the original forms
        return (nameA as string).localeCompare(nameB as string);
      }
      // If one or both are not parseable as numbers, sort alphabetically
      return (nameA as string).localeCompare(nameB as string);
    } else if (nameAIsString) {
      return -1; // nameA (string) comes before nameB (non-string/null/undefined)
    } else if (nameBIsString) {
      return 1;  // nameB (string) comes before nameA (non-string/null/undefined)
    } else {
      return 0; // Both are non-strings/null/undefined, keep original relative order
    }
  });
}

const PMTILES_SOURCE_LAYER = 'all_boundaries'; // Defined for use in getDistrictFromSource

export function getDistrictFromSource(
  map: Map,
  boundaryType: string, // This is the equivalent of the old sourceId like 'cd', 'pp'
  districtNameCol: string // This is the value of the 'namecol' property
) {
  if (!map.isSourceLoaded('all-boundaries-source')) {
    console.warn(`[getDistrictFromSource] Source 'all-boundaries-source' is not yet loaded. Cannot query for district geometry (Type: ${boundaryType}, NameCol: ${districtNameCol}).`);
    return null;
  }

  const queryOptions = {
    sourceLayer: PMTILES_SOURCE_LAYER,
    filter: [
      'all',
      ['==', 'id', boundaryType],       // Using simpler filter syntax
      ['==', 'namecol', districtNameCol] // Using simpler filter syntax
    ] as FilterSpecification
  };

  // Query the single vector source
  const features = map.querySourceFeatures('all-boundaries-source', queryOptions);

  if (!features.length) {
    console.warn(`No features found for ${boundaryType} - ${districtNameCol} in source 'all-boundaries-source'.`);
    return null;
  }

  // Merge geometries if multiple features are returned (e.g., multi-part polygons for a single district)
  const mergedGeometry = features.reduce((accumulator, feature) => {
    // feature.geometry should be GeoJSON geometry object
    if (feature.geometry) {
      return accumulator ? turf.union(accumulator, feature.geometry) : feature.geometry;
    }
    return accumulator;
  }, null);

  if (mergedGeometry) {
    // turf.bbox expects a GeoJSON geometry or feature. Let's return a feature.
    return { type: 'Feature', geometry: mergedGeometry, properties: {} };
  }

  return null; // Should not be reached if features.length > 0 and they have geometry
}

export function zoomToBound(map: Map, bounds: number[]) {
  // Turf's bbox can return either Box2D (4-item array) or Box3D (6-item array)
  // fitBounds() only accepts a 4-item array, so we need to save the output before using it
  // See https://github.com/Turfjs/turf/issues/1807

  const [x1, y1, x2, y2] = bounds;

  map.fitBounds([x1, y1, x2, y2], {
    padding: { top: 72, bottom: 24, left: 16, right: 16 },
    maxZoom: 13
  });
}

export function resetZoom(map: Map) {
  map.flyTo({
    zoom: defaultZoom.zoom,
    center: defaultZoom.center
  });
}
