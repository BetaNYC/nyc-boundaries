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
  import type { LngLat } from 'mapbox-gl';
  import mapboxgl from 'mapbox-gl';
  import { resetZoom } from '../../helpers/helpers';

  let districtsIntersectingAddress: Feature[];
  let isLoading = false;

  async function queryAllDistrictsForCoordinates(lngLat: LngLat) {
    districtsIntersectingAddress = [];
    isLoading = true;
    //const intersectsUrl = `https://betanyc.carto.com/api/v2/sql/?q=SELECT * FROM all_bounds WHERE ST_Intersects(ST_SetSRID(ST_MakePoint(${lngLat.lng}, ${lngLat.lat}), 4326),the_geom)&api_key=2J6__p_IWwUmOHYMKuMYjw&format=geojson`;
    const intersectsUrl = `https://yhatmsxmjxmpgnnzdrzy.supabase.co/rest/v1/rpc/address_details?apikey=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InloYXRtc3htanhtcGdubnpkcnp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM2OTA4OTQsImV4cCI6MjA1OTI2Njg5NH0.03AZcgwuHf2fAzIuCq8-O8UcSGVGfmvNdMYT6FH08b0&p_lng=${lngLat.lng}&p_lat=${lngLat.lat}`;
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

      $mapStore.once('click', e => {
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
