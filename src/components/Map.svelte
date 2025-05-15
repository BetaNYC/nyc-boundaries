<script lang="ts">
  import {
    selectedBoundaryMap,
    selectedDistrict,
    mapStore,
    hoveredDistrictId,
    mapSourcesReady,
    mapInteractionCompleteSignal
  } from '../stores';
  import type { Feature } from 'geojson';
  import * as maplibregl from 'maplibre-gl';
  import type { Map } from 'maplibre-gl'; // Explicit import for Map type
  import 'maplibre-gl/dist/maplibre-gl.css';
  import { layers } from '../assets/boundaries';
  import * as turf from '@turf/turf';
  import {
    defaultZoom,
    getDistrictFromSource,
    zoomToBound
  } from '../helpers/helpers';
  import { PMTiles, Protocol } from 'pmtiles';

  // Type definition to help with MapLibre events
  type MapLayerMouseEvent = maplibregl.MapMouseEvent & {
    features?: maplibregl.MapGeoJSONFeature[] | undefined;
  };

  let map: maplibregl.Map;
  let isSourceLoaded = false;
  let prevLayerId: string | null = null;
  let prevDistrictId: string | null = null;

  // A flag to ensure we only set mapSourcesReady once from the initial source load
  let initialSourceLoadEnsured = false;

  const PMTILES_URL = 'https://vector-tile-test-app.s3.us-east-1.amazonaws.com/all_boundaries.pmtiles';
  const PMTILES_SOURCE_LAYER = 'all_boundaries';

  function initMap(container: HTMLElement) {
    map = new maplibregl.Map({
      container,
      style: '/maplibre-style.json', // Direct reference to our custom style
      minZoom: 9,
      maxZoom: 16,
      maxBounds: [
        [-74.66184938203348, 40.25252938803669], // Southwestern NYC bounds + buffer
        [-72.97034397052578, 41.282818272331866] // Northeastern NYC bounds + buffer
      ] as maplibregl.LngLatBoundsLike,
      ...defaultZoom
    });

    maplibregl.addProtocol('pmtiles', new Protocol().tile);

    map.addControl(
      new maplibregl.NavigationControl({ showCompass: false }),
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
    // $mapStore.resize(); // resize will be called in the reactive block once map is confirmed

    return {
      destroy: () => {
        map.remove();
        // $mapStore = map; // This was an error, should be $mapStore = null or handled by component lifecycle
      }
    };
  }

  function clearMap() {
    if ($mapStore && prevLayerId) {
      // Remove previous layers
      if ($mapStore.getLayer(`${prevLayerId}-layer`)) {
        $mapStore.removeLayer(`${prevLayerId}-layer`);
      }
      if ($mapStore.getLayer(`${prevLayerId}-stroke-layer`)) {
        $mapStore.removeLayer(`${prevLayerId}-stroke-layer`);
      }
      if ($mapStore.getLayer(`${prevLayerId}-label-layer`)) {
        $mapStore.removeLayer(`${prevLayerId}-label-layer`);
      }
    }
  }

  async function showMap(boundaryId: string) {
    console.log('[Map.svelte] showMap called with:', boundaryId);
    
    if (!$mapStore) { // Guard $mapStore usage early
      console.error('[Map.svelte] $mapStore is not available in showMap. Aborting.');
      return;
    }

    clearMap(); // clearMap already checks for $mapStore
    
    const sourceId = 'all-boundaries-source';

    if (!$mapStore.getSource(sourceId)) {
      console.log(`[Map.svelte] Source "${sourceId}" does not exist. Adding it.`);
      $mapStore.addSource(sourceId, {
        type: 'vector',
        url: 'pmtiles://' + PMTILES_URL,
        promoteId: 'namecol',
      });

      const sourceReadyCallback = (e: maplibregl.MapSourceDataEvent) => {
        if (!$mapStore) return; // Ensure $mapStore is still valid in callback
        if (e.sourceId === sourceId && e.isSourceLoaded && e.dataType === 'source') {
          if (!initialSourceLoadEnsured) {
            console.log(`[Map.svelte] Source "${sourceId}" is now loaded (event). Setting mapSourcesReady = true.`);
            mapSourcesReady.set(true);
            initialSourceLoadEnsured = true;
          }
          $mapStore.off('sourcedata', sourceReadyCallback);
        }
      };
      $mapStore.on('sourcedata', sourceReadyCallback);

    } else {
      console.log(`[Map.svelte] Source "${sourceId}" already exists.`);
      if ($mapStore.isSourceLoaded(sourceId) && !initialSourceLoadEnsured) {
          console.log(`[Map.svelte] Source "${sourceId}" exists and is loaded. Ensuring mapSourcesReady = true.`);
          mapSourcesReady.set(true);
          initialSourceLoadEnsured = true;
      } else if (!initialSourceLoadEnsured) {
        const fallbackSourceCallback = (e: maplibregl.MapSourceDataEvent) => {
          if (!$mapStore) return;
          if (e.sourceId === sourceId && e.isSourceLoaded && e.dataType === 'source') {
            if (!initialSourceLoadEnsured) {
              console.log(`[Map.svelte] Source "${sourceId}" is now loaded (fallback event). Setting mapSourcesReady = true.`);
              mapSourcesReady.set(true);
              initialSourceLoadEnsured = true;
            }
            $mapStore.off('sourcedata', fallbackSourceCallback);
          }
        };
        $mapStore.on('sourcedata', fallbackSourceCallback);
      }
    }
    // Layers depend on $mapStore being available, already checked.
    $mapStore.addLayer({
      id: `${boundaryId}-layer`,
      type: 'fill',
      source: 'all-boundaries-source',
      'source-layer': PMTILES_SOURCE_LAYER,
      filter: ['==', ['get', 'id'], boundaryId],
      paint: {
        'fill-color': '#2463eb',
        'fill-opacity': [
          'case',
          ['boolean', ['feature-state', 'selected'], false],
          0.2,
          0.05
        ]
      }
    });

    $mapStore.addLayer({
      id: `${boundaryId}-stroke-layer`,
      type: 'line',
      source: 'all-boundaries-source',
      'source-layer': PMTILES_SOURCE_LAYER,
      filter: ['==', ['get', 'id'], boundaryId],
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
    });

    $mapStore.addLayer({
      id: `${boundaryId}-label-layer`,
      type: 'symbol',
      source: 'all-boundaries-source', 
      'source-layer': PMTILES_SOURCE_LAYER,
      filter: ['==', ['get', 'id'], boundaryId],
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

    const popup = new maplibregl.Popup({
      closeButton: false,
      closeOnClick: false
    });

    $mapStore.on('mousemove', `${boundaryId}-layer`, (e: MapLayerMouseEvent) => {
      if (!$mapStore) return;
      $mapStore.getCanvas().style.cursor = 'pointer';

      if (e.features && e.features.length > 0) {
        const currentFeatureId = e.features[0].properties?.namecol;
        if ($hoveredDistrictId && typeof $hoveredDistrictId === 'string') { // Ensure it's a string
          $mapStore.setFeatureState(
            { source: 'all-boundaries-source', sourceLayer: PMTILES_SOURCE_LAYER, id: $hoveredDistrictId },
            { hover: false }
          );
        }
        if (currentFeatureId && typeof currentFeatureId === 'string') { // Ensure it's a string
          $hoveredDistrictId = currentFeatureId;
          $mapStore.setFeatureState(
            { source: 'all-boundaries-source', sourceLayer: PMTILES_SOURCE_LAYER, id: $hoveredDistrictId }, 
            { hover: true }
          );
        }
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
            e.features && e.features[0].properties?.namecol
          )}</div></div></div>`
        )
        .setOffset(8)
        .addTo(map);
    });

    $mapStore.on('mouseleave', `${boundaryId}-layer`, () => {
      if (!$mapStore) return;
      $mapStore.getCanvas().style.cursor = '';

      if ($hoveredDistrictId && typeof $hoveredDistrictId === 'string') { // Ensure it's a string
        $mapStore.setFeatureState(
          { source: 'all-boundaries-source', sourceLayer: PMTILES_SOURCE_LAYER, id: $hoveredDistrictId },
          { hover: false }
        );
      }

      hoveredDistrictId.set(undefined);

      popup.remove();
    });

    $mapStore.on('click', `${boundaryId}-layer`, (e: MapLayerMouseEvent) => {
      if (!$mapStore) return;
      if (e.features && e.features.length > 0) {
        const featureNameCol = e.features[0].properties?.namecol;
        if (featureNameCol && typeof featureNameCol === 'string') { // Ensure it's a string
          zoomToBound($mapStore, turf.bbox(e.features[0]));
          onDistrictChange(featureNameCol, true);
        } else {
           onDistrictChange(null, true); // Or handle error
        }
      }
    });

    // Prepare for future boundary change
    prevLayerId = boundaryId;
    
    // Return a promise that resolves when the map is idle after these changes
    return new Promise((resolve) => {
      if (!$mapStore) {
        resolve(undefined); // Or reject, though $mapStore is checked earlier
        return;
      }
      $mapStore.once('idle', () => {
        console.log(`[Map.svelte] Map idle after showMap for ${boundaryId}`);
        resolve(undefined);
      });
      // It might be necessary to trigger a repaint if just adding layers doesn't
      // guarantee an 'idle' event if the map was already idle.
      // However, layer changes usually make the map non-idle briefly.
    });
  }

  function onDistrictChange(
    districtId: string | null,
    interactionFromClick: boolean = false
  ) {
    if (!$mapStore) return;
    // Remove existing clicked states
    if (prevDistrictId && $selectedBoundaryMap && typeof prevDistrictId === 'string') {
      $mapStore.setFeatureState(
        { source: 'all-boundaries-source', sourceLayer: PMTILES_SOURCE_LAYER, id: prevDistrictId },
        { selected: false }
      );
    }

    $selectedDistrict = districtId;

    if ($selectedBoundaryMap && $selectedDistrict && typeof $selectedDistrict === 'string') {
      // The zoomToBound for interactionFromClick is handled directly in the map click event handler
      // If the district was selected from outside the map (e.g. sidebar), and it wasn't a click interaction,
      // then we might want to zoom to it here.
      if (!interactionFromClick) {
        const feature = getDistrictFromSource(
          $mapStore,
          $selectedBoundaryMap,
          $selectedDistrict
        );
        if (feature) {
          // We need to ensure the source is loaded before calling getDistrictFromSource here too,
          // or that getDistrictFromSource can handle it (it currently returns null).
          // For now, this zoom will only work if source is already loaded.
          zoomToBound($mapStore, turf.bbox(feature));
        }
      }

      $mapStore.setFeatureState(
        { source: 'all-boundaries-source', sourceLayer: PMTILES_SOURCE_LAYER, id: $selectedDistrict },
        { selected: true }
      );
    }

    prevDistrictId = $selectedDistrict;

    // Signal completion after district change logic
    if (interactionFromClick && $mapStore) {
      // If the change came from a map click, a zoom animation might be in progress.
      // Wait for the map to become idle before signaling completion.
      $mapStore.once('idle', () => {
        console.log('[Map.svelte] Map idle after click-triggered district change. Setting interactionCompleteSignal.');
        mapInteractionCompleteSignal.set(Date.now());
      });
    } else {
      // If not from a direct map click (e.g., sidebar selection, initial load), signal immediately.
      // (If a zoom was triggered above for !interactionFromClick, it would also need an idle wait,
      // but let's address the primary click issue first.)
      // For a non-click interaction that zooms, the mapInteractionCompleteSignal might also need to wait for idle.
      // For now, focusing on the user's reported problem for map clicks.
      if (!interactionFromClick && $selectedBoundaryMap && $selectedDistrict) {
         // If it's a programmatic change that might zoom (like selection from sidebar)
         // we should also wait for idle for consistency.
         if ($mapStore) {
            $mapStore.once('idle', () => {
                console.log('[Map.svelte] Map idle after programmatic district change with potential zoom. Setting interactionCompleteSignal.');
                mapInteractionCompleteSignal.set(Date.now());
            });
         } else {
            mapInteractionCompleteSignal.set(Date.now()); // Fallback if mapStore is somehow null
         }
      } else {
        // For other cases (e.g. clearing selection, no zoom involved) signal immediately.
        mapInteractionCompleteSignal.set(Date.now());
      }
    }
  }

  $: if ($mapStore) {
    $mapStore.resize(); // Resize map once $mapStore is confirmed
    console.log('[Map.svelte] Selected Boundary Map store changed to:', $selectedBoundaryMap);
    if ($selectedBoundaryMap) {
      showMap($selectedBoundaryMap).then(() => {
        // After showMap's promise (which now waits for 'idle') resolves, signal completion.
        mapInteractionCompleteSignal.set(Date.now());
      });
    } else {
      clearMap();
      // resetZoom($mapStore); // This was an issue, resetZoom is in BoundaryDetails, and map might not be centered on default
      // Signal completion even when clearing the map
      // For consistency, ensure map is idle before signaling here too.
      if ($mapStore) {
        $mapStore.once('idle', () => {
          console.log('[Map.svelte] Map idle after clearMap sequence.');
          mapInteractionCompleteSignal.set(Date.now());
        });
        // If clearMap doesn't make the map non-idle, we might need to trigger signal differently or sooner
        // For now, let's assume clearMap() followed by operations or just time will lead to an idle state or the next interaction.
        // If $selectedBoundaryMap becomes null, and map was already idle, this might not fire until next interaction.
        // A simpler approach for the else block:
        // mapInteractionCompleteSignal.set(Date.now());
        // However, let's try to be consistent with waiting for idle if possible.
      } else {
        // If mapStore is not set, signal immediately
        mapInteractionCompleteSignal.set(Date.now());
      }
    }
  }
</script>

<div id="map" class="flex-1 h-full" use:initMap />
