<script lang="ts">
  import SidebarHeader from './SidebarHeader.svelte';
  import {
    mapStore,
    addressMarker,
    coordinatesMarker,
    isSelectingCoordinates,
    selectedCoordinates,
    showSupabaseConnectionErrorPopup
  } from '../../stores';
  import OverlapList from './OverlapList.svelte';
  import type { Feature } from 'geojson';
  import type { LngLat } from 'mapbox-gl';
  import mapboxgl from 'mapbox-gl';
  import { resetZoom } from '../../helpers/helpers';

  let districtsIntersectingAddress: Feature[];
  let isLoading = false;

  async function queryAllDistrictsForCoordinates(lngLat: LngLat) {
    districtsIntersectingAddress = [];
    isLoading = true;
    const intersectsUrl = `https://bm-api.beta.nyc/pt_int_new?p_lng=${lngLat.lng}&p_lat=${lngLat.lat}`;
    const options = {
      headers: {
        'Accept': 'application/geo+json'
      }
    };
    await fetch(intersectsUrl, options)
      .then(res => res.json())
      .then(({ features }) => {
        isLoading = false;
        districtsIntersectingAddress = features;
      })
      .catch(error => {
        isLoading = false;
        console.error('Error fetching coordinate details:', error);
        if (error instanceof TypeError && (error.message.toLowerCase().includes('failed to fetch') || error.message.toLowerCase().includes('networkerror'))) {
          showSupabaseConnectionErrorPopup.set(true);
        }
        districtsIntersectingAddress = [];
      });
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
    $coordinatesMarker = new mapboxgl.Marker({ color: '#2463eb' })
      .setLngLat($selectedCoordinates)
      .addTo($mapStore);
  }

  $: if ($mapStore) {
    if ($isSelectingCoordinates) {
      $mapStore.getCanvas().style.cursor = 'crosshair';

      $mapStore.once('click', (e: mapboxgl.MapMouseEvent) => {
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
