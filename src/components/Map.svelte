<script lang="ts">
  import { onMount } from "svelte";
  import mapboxgl from "mapbox-gl";
  import "mapbox-gl/dist/mapbox-gl.css";
  import BoundariesList from "./BoundariesList.svelte";
  import {
    boroughBoundaries,
    cityCouncilDistrictBoundaries,
    communityDistrictBoundaries,
  } from "../assets/boundaries";
  import * as turf from "@turf/turf";
  import booleanIntersects from "@turf/boolean-intersects";
  import { findPolylabel } from "../helpers/helpers";
  import type { FeatureCollection } from "geojson";

  let boundariesIntersectingSelection = [];
  mapboxgl.accessToken =
    "pk.eyJ1IjoiemhpayIsImEiOiJjaW1pbGFpdHQwMGNidnBrZzU5MjF5MTJiIn0.N-EURex2qvfEiBsm-W9j7w";

  function queryFromLatLng(latitude, longitude, label = null) {
    const intersectsUrl = `https://betanyc.carto.com/api/v2/sql/?q=SELECT * FROM all_bounds WHERE ST_Intersects(ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326),the_geom) &api_key=2J6__p_IWwUmOHYMKuMYjw`;
    fetch(intersectsUrl)
      .then((res) => res.json())
      .then(({ rows }) => {
        boundariesIntersectingSelection = rows;
      });
  }

  onMount(() => {
    const map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/evadecker/cl4g2eoa9005n14pff1g7gncb",
      zoom: 10,
      minZoom: 9,
      maxZoom: 18,
      bounds: [
        [-74.27092628873937, 40.49174581468662], // Southwestern NYC bounds
        [-73.70513039814229, 40.89159119957167], // Northeastern NYC bounds
      ],
      maxBounds: [
        [-74.66184938203348, 40.25252938803669], // Southwestern NYC bounds + buffer
        [-73.36408936343365, 41.11995678583111], // Northeastern NYC bounds + buffer
      ],
    });

    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }));

    map.on("load", () => {
      const layers = map.getStyle().layers;

      // Find the index of the first symbol layer in the map style.
      let firstSymbolId: string;
      for (const layer of layers) {
        if (layer.type === "symbol") {
          firstSymbolId = layer.id;
          break;
        }
      }

      // Highlight NYC
      map.addLayer(
        {
          id: "isolation-layer",
          type: "fill",
          source: {
            type: "geojson",
            data: turf.mask(boroughBoundaries as any),
          },
          paint: {
            "fill-color": "rgba(0,0,0,0.15)",
            "fill-outline-color": "rgba(0,0,0,0.25)",
          },
        },
        firstSymbolId
      );

      // Handle coordinate click
      map.on("click", (e) => {
        const { lat, lng } = e.lngLat;
        queryFromLatLng(lat, lng);
      });

      // Community Districts
      let hoveredStateId = null;

      map.addSource("communityDistricts", {
        type: "geojson",
        data: communityDistrictBoundaries as FeatureCollection,
      });

      map.addLayer(
        {
          id: "community-districts-layer",
          type: "fill",
          source: "communityDistricts",
          paint: {
            "fill-color": [
              "case",
              ["boolean", ["feature-state", "hover"], false],
              "rgba(114, 173, 255, 0.15)",
              "rgba(114, 173, 255, 0)",
            ],
          },
        },
        firstSymbolId
      );

      map.addLayer(
        {
          id: "community-districts-stroke-layer",
          type: "line",
          source: "communityDistricts",
          paint: {
            "line-color": "rgba(0, 0, 0, 0.5)",
          },
        },
        firstSymbolId
      );

      // When the user moves their mouse over community-districts-layer, we'll update the
      // feature state for the feature under the mouse.
      map.on("mousemove", "community-districts-layer", (e) => {
        if (e.features.length > 0) {
          if (hoveredStateId !== null) {
            map.setFeatureState(
              { source: "communityDistricts", id: hoveredStateId },
              { hover: false }
            );
          }
          hoveredStateId = e.features[0].id;
          map.setFeatureState(
            { source: "communityDistricts", id: hoveredStateId },
            { hover: true }
          );
        }
      });

      // When the mouse leaves community-districts-layer, update the feature state of the
      // previously hovered feature.
      map.on("mouseleave", "community-districts-layer", () => {
        if (hoveredStateId !== null) {
          map.setFeatureState(
            { source: "communityDistricts", id: hoveredStateId },
            { hover: false }
          );
        }
        hoveredStateId = null;
      });

      map.on("click", "community-districts-layer", (e) => {
        map.fitBounds(turf.bbox(e.features[0]), {
          padding: 200,
          maxZoom: 16,
        });

        const intersectingDistricts =
          cityCouncilDistrictBoundaries.features.filter((feature) =>
            booleanIntersects(feature.geometry, e.features[0].geometry as any)
          );

        console.log(intersectingDistricts);
      });

      map.addSource("communityDistrictCenterpoints", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: (
            communityDistrictBoundaries as FeatureCollection
          ).features.map((feature) => {
            feature.geometry = {
              type: "Point",
              coordinates: findPolylabel(feature),
            };
            return feature;
          }),
        },
      });

      map.addLayer({
        id: "community-districts-label-layer",
        type: "symbol",
        source: "communityDistrictCenterpoints",
        paint: {
          "text-color": "rgba(0,0,0,1)",
          "text-halo-color": "rgba(255,255,255,0.5)",
          "text-halo-width": 1,
        },
        layout: {
          "text-field": ["get", "BoroCD"],
          "text-size": 11,
        },
      });

      // City Council Districts
      // map.addLayer(
      //   {
      //     id: "city-council-districts-layer",
      //     type: "line",
      //     source: {
      //       type: "geojson",
      //       data: cityCouncilDistrictBoundaries as FeatureCollection,
      //     },
      //     paint: {
      //       "line-color": "rgba(255, 0, 0, 1)",
      //     },
      //   },
      //   firstSymbolId
      // );

      // map.addSource("cityCouncilCenterpoints", {
      //   type: "geojson",
      //   data: {
      //     type: "FeatureCollection",
      //     features: (
      //       cityCouncilDistrictBoundaries as FeatureCollection
      //     ).features.map((feature) => {
      //       feature.geometry = {
      //         type: "Point",
      //         coordinates: findPolylabel(feature),
      //       };
      //       return feature;
      //     }),
      //   },
      // });

      // map.addLayer({
      //   id: "city-council-districts-label-layer",
      //   type: "symbol",
      //   source: "cityCouncilCenterpoints",
      //   paint: {
      //     "text-color": "rgba(255,0,0,1)",
      //     "text-halo-color": "rgba(255,255,255,0.5)",
      //     "text-halo-width": 1,
      //   },
      //   layout: {
      //     "text-field": ["get", "CounDist"],
      //     "text-size": 11,
      //   },
      // });
    });
  });
</script>

<div id="map" />
<BoundariesList boundaries={boundariesIntersectingSelection} />

<style>
  #map {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
  }
</style>
