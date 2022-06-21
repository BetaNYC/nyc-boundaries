import polylabel from "@mapbox/polylabel";
import type { Feature } from "geojson";
import * as turf from "@turf/turf";

export function findPolylabel(feature: Feature) {
  let output = [];
  if (feature.geometry.type === "Polygon") {
    output = polylabel(feature.geometry.coordinates);
  }

  if (feature.geometry.type === "MultiPolygon") {
    let maxArea = 0,
      maxPolygon = [];
    for (let i = 0, l = feature.geometry.coordinates.length; i < l; i++) {
      const p = feature.geometry.coordinates[i];
      const area = turf.area({ type: "Polygon", coordinates: p });
      if (area > maxArea) {
        maxPolygon = p;
        maxArea = area;
      }
    }
    output = polylabel(maxPolygon);
  }

  return output;
}
