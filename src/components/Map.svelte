<script lang="ts">
  import {
    selectedBoundaryMap,
    selectedDistrict,
    mapStore,
    hoveredDistrictId,
    showSupabaseConnectionErrorPopup
  } from '../stores';
  import type { Feature } from 'geojson';
  import mapboxgl from 'mapbox-gl';
  import 'mapbox-gl/dist/mapbox-gl.css';
  import { layers } from '../assets/boundaries';
  import * as turf from '@turf/turf';
  import {
    defaultZoom,
    findPolylabel,
    getDistrictFromSource,
    zoomToBound
  } from '../helpers/helpers';

  let map: mapboxgl.Map;
  let isSourceLoaded = false;
  let prevLayerId: string | null = null;
  let prevDistrictId: string | null = null;

  mapboxgl.accessToken =
    'pk.eyJ1IjoiemhpayIsImEiOiJjaW1pbGFpdHQwMGNidnBrZzU5MjF5MTJiIn0.N-EURex2qvfEiBsm-W9j7w';

  function initMap(container: any) {
    map = new mapboxgl.Map({
      container,
      style: 'mapbox://styles/evadecker/cl4g2eoa9005n14pff1g7gncb',
      minZoom: 9,
      maxZoom: 16,
      maxBounds: [
        [-74.66184938203348, 40.25252938803669], // Southwestern NYC bounds + buffer
        [-72.97034397052578, 41.282818272331866] // Northeastern NYC bounds + buffer
      ],
      ...defaultZoom
    });

    map.addControl(
      new mapboxgl.NavigationControl({ showCompass: false }),
      'bottom-right'
    );

    // Override default browser zoom hotkeys
    window.addEventListener(
      'keydown',
      e => {
        if (e.metaKey && (e.key === '=' || e.key === '-')) {
          e.preventDefault();
          e.key === '=' && map.zoomIn();
          e.key === '-' && map.zoomOut();
        }
      },
      true
    );

    map.on('click', () => onDistrictChange(null));

    $mapStore = map;
    $mapStore.resize();

    return {
      destroy: () => {
        map.remove();
        $mapStore = map;
      }
    };
  }

  function clearMap() {
    if ($mapStore && prevLayerId) {
      // Remove previous layers
      $mapStore.getLayer(`${prevLayerId}-layer`) &&
        $mapStore.removeLayer(`${prevLayerId}-layer`);

      $mapStore.getLayer(`${prevLayerId}-stroke-layer`) &&
        $mapStore.removeLayer(`${prevLayerId}-stroke-layer`);

      $mapStore.getLayer(`${prevLayerId}-label-layer`) &&
        $mapStore.removeLayer(`${prevLayerId}-label-layer`);
    }
  }

  async function showMap(boundaryId: string) {
    clearMap();

    // Load source if not already loaded
    if ($mapStore && !$mapStore.getSource(boundaryId)) {
      const url = layers[boundaryId].apiUrl;
      const options = {
        headers: {
          'Accept': 'application/geo+json'
        }
      };
      let data = null;
      try {
        const response = await fetch(url, options);
        if (!response.ok) {
          // Handle HTTP errors like 4xx, 5xx
          console.error('HTTP error fetching map data:', response.status, response.statusText);
          // You could set a specific error message here if needed, or rely on the generic one
          showSupabaseConnectionErrorPopup.set(true); 
          // Potentially return or throw to stop further processing
        } else {
          data = await response.json();
        }
      } catch (error) {
        console.error('Network error fetching map data:', error);
        if (error instanceof TypeError && (error.message.toLowerCase().includes('failed to fetch') || error.message.toLowerCase().includes('networkerror'))) {
          showSupabaseConnectionErrorPopup.set(true);
        }
        // data remains null, or you could explicitly set it to indicate failure
      }

      if (!data) {
        console.error('Failed to load map data for', boundaryId);
        // Potentially show a user-facing error on the map itself or a notification
        return; // Exit if data couldn't be fetched/parsed
      }

      $mapStore
        .addSource(boundaryId, {
          type: 'geojson',
          promoteId: 'namecol',
          data
        })
        .addSource(`${boundaryId}-centerpoints`, {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: data.features.map((feature: Feature) => {
              feature.geometry = {
                type: 'Point',
                coordinates: findPolylabel(feature)
              };
              return feature;
            })
          }
        });

      $mapStore.on('sourcedata', (source: mapboxgl.MapSourceDataEvent) => {
        if (source.sourceId === boundaryId && source.isSourceLoaded) {
          const features = map?.querySourceFeatures(boundaryId);
          isSourceLoaded = !!features?.length;
        }
      });
    }

    if ($mapStore) {
      $mapStore
        .addLayer({
          id: `${boundaryId}-layer`,
          type: 'fill',
          source: boundaryId,
          paint: {
            'fill-color': '#2463eb',
            'fill-opacity': [
              'case',
              ['boolean', ['feature-state', 'selected'], false],
              0.2,
              0.05
            ]
          }
        })
        .addLayer({
          id: `${boundaryId}-stroke-layer`,
          type: 'line',
          source: boundaryId,
          paint: {
            'line-color': '#2463eb',
            'line-width': [
              'case',
              [
                'any',
                ['boolean', ['feature-state', 'hover'], false],
                ['boolean', ['feature-state', 'selected'], false]
              ],
              2,
              1
            ]
          }
        })
        .addLayer({
          id: `${boundaryId}-label-layer`,
          type: 'symbol',
          source: `${boundaryId}-centerpoints`,
          paint: {
            'text-color': '#2463eb',
            'text-halo-color': 'rgba(255,255,255,0.9)',
            'text-halo-width': 2
          },
          layout: {
            'text-field': ['get', 'namecol'],
            'text-size': ['interpolate', ['linear'], ['zoom'], 11, 12.5, 32, 60]
          }
        });

      const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
      });

      $mapStore.on('mousemove', `${boundaryId}-layer`, (e: mapboxgl.MapMouseEvent & { features?: mapboxgl.MapboxGeoJSONFeature[] }) => {
        $mapStore.getCanvas().style.cursor = 'pointer';

        if (e.features) {
          if (e.features.length > 0) {
            if ($hoveredDistrictId !== null) {
              $mapStore?.setFeatureState(
                { source: boundaryId, id: $hoveredDistrictId },
                { hover: false }
              );
            }
            $hoveredDistrictId = e.features[0].properties?.namecol;
            $mapStore.setFeatureState(
              { source: boundaryId, id: $hoveredDistrictId },
              { hover: true }
            );
          }

          popup
            .setLngLat(e.lngLat)
            .setHTML(
              `<div class="flex items-center -mb-1"><div class="text-2xl mr-2">${
                layers[boundaryId].icon
              }</div><div class="pr-1"><div class="text-xs text-gray-500">${
                layers[boundaryId].name
              }</div><div class="text-sm font-semibold">${layers[
                boundaryId
              ].formatContent(
                e.features[0].properties?.namecol
              )}</div></div></div>`
            )
            .setOffset(8)
            .addTo(map);
        }
      });

      $mapStore.on('mouseleave', `${boundaryId}-layer`, () => {
        $mapStore.getCanvas().style.cursor = '';

        if ($hoveredDistrictId !== null) {
          $mapStore.setFeatureState(
            { source: boundaryId, id: $hoveredDistrictId },
            { hover: false }
          );
        }

        hoveredDistrictId.set(undefined);

        popup.remove();
      });

      $mapStore.on('click', `${boundaryId}-layer`, (e: mapboxgl.MapMouseEvent & { features?: mapboxgl.MapboxGeoJSONFeature[] }) => {
        if (e.features) {
          zoomToBound($mapStore, turf.bbox(e.features[0]));
          onDistrictChange(e.features[0].properties?.namecol, true);
        }
      });
    }

    // Prepare for future boundary change
    prevLayerId = boundaryId;
  }

  function onDistrictChange(
    districtId: string | null,
    interactionFromClick: boolean = false
  ) {
    // Remove existing clicked states
    if (prevDistrictId && $selectedBoundaryMap) {
      $mapStore?.setFeatureState(
        { source: $selectedBoundaryMap, id: prevDistrictId },
        { selected: false }
      );
    }

    $selectedDistrict = districtId;

    // Fetch bbox from districtId, fly to bbox.
    // If there interaction came from a click, it will fly in before the function.
    if ($mapStore && $selectedBoundaryMap && $selectedDistrict) {
      if (!interactionFromClick) {
        const feature = getDistrictFromSource(
          $mapStore,
          $selectedBoundaryMap,
          $selectedDistrict
        );
        if (feature) {
          zoomToBound($mapStore, turf.bbox(feature));
        }
      }

      $mapStore.setFeatureState(
        { source: $selectedBoundaryMap, id: $selectedDistrict },
        { selected: true }
      );
    }

    prevDistrictId = $selectedDistrict;
  }

  $: if ($mapStore) {
    $selectedBoundaryMap ? showMap($selectedBoundaryMap) : clearMap();
  }
  $: isSourceLoaded && onDistrictChange($selectedDistrict);
</script>

<div id="map" class="flex-1 h-full" use:initMap />
