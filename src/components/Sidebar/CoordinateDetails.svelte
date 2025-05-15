<script lang="ts">
  import SidebarHeader from './SidebarHeader.svelte';
  import {
    mapStore,
    addressMarker,
    coordinatesMarker,
    isSelectingCoordinates,
    selectedCoordinates
  } from '../../stores';
  import OverlapList from './OverlapList.svelte';
  import type { Feature } from 'geojson';
  import type { LngLat } from 'maplibre-gl';
  import * as maplibregl from 'maplibre-gl';
  import { resetZoom } from '../../helpers/helpers';
  import { layers } from '../../assets/boundaries'; // Import layers metadata
  import { sortedDistricts } from '../../helpers/helpers'; // For sorting results

  let districtsIntersectingAddress: Feature[] = [];
  let isLoading = false;

  async function queryAllDistrictsForCoordinates(lngLat: LngLat) {
    districtsIntersectingAddress = [];
    isLoading = true;

    if (!$mapStore) {
      isLoading = false;
      return;
    }

    const point = $mapStore.project([lngLat.lng, lngLat.lat]);
    const mapLibreLayerIds = Object.keys(layers).map(id => `${id}-layer`);

    try {
      const features = $mapStore.queryRenderedFeatures(point, {
        layers: mapLibreLayerIds
      });
      // Similar to AddressDetails, ensure properties are what OverlapList expects.
      // Features from queryRenderedFeatures should have `id` and `namecol` from vector tiles.
      districtsIntersectingAddress = sortedDistricts(features || []);
    } catch (error) {
      console.error('Error querying rendered features for coordinates:', error);
      districtsIntersectingAddress = [];
    } finally {
      isLoading = false;
    }
  }

  function getCoordinateTitle(lngLat: LngLat | null) {
    return lngLat ? `${lngLat.lng}, ${lngLat.lat}` : 'Click a point on the map';
  }

  function handleBack() {
    selectedCoordinates.set(null);
    isSelectingCoordinates.set(false);
    if ($coordinatesMarker) $coordinatesMarker.remove();
    resetZoom($mapStore);
  }

  $: if ($mapStore && $selectedCoordinates) {
    queryAllDistrictsForCoordinates($selectedCoordinates);
    $mapStore.flyTo({ center: $selectedCoordinates, zoom: 13 });

    if ($addressMarker) $addressMarker.remove();
    if ($coordinatesMarker) $coordinatesMarker.remove();
    $coordinatesMarker = new maplibregl.Marker({ color: '#2463eb' })
      .setLngLat($selectedCoordinates)
      .addTo($mapStore);
  }

  $: if ($mapStore) {
    if ($isSelectingCoordinates) {
      $mapStore.getCanvas().style.cursor = 'crosshair';

      $mapStore.once('click', (e: maplibregl.MapMouseEvent) => {
        selectedCoordinates.set(e.lngLat);
        isSelectingCoordinates.set(false);
      });
    } else {
      $mapStore.getCanvas().style.cursor = '';
    }
  }
</script>

<SidebarHeader
  title={getCoordinateTitle($selectedCoordinates)}
  onBack={handleBack}
/>
<div class="py-2">
  {#if $selectedCoordinates}
    <OverlapList districts={districtsIntersectingAddress} {isLoading} />
  {/if}
</div>
