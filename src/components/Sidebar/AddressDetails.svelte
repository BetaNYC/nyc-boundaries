<script lang="ts">
  import SidebarHeader from './SidebarHeader.svelte';
  import {
    addressMarker,
    selectedAddress,
    mapStore,
    showSupabaseConnectionErrorPopup
  } from '../../stores';
  import OverlapList from './OverlapList.svelte';
  import type { Feature } from 'geojson';
  import { resetZoom } from '../../helpers/helpers';

  let districtsIntersectingAddress: Feature[];
  let isLoading = false;

  async function queryAllDistrictsForCoordinates(lng: number, lat: number) {
    districtsIntersectingAddress = [];
    isLoading = true;
    //const intersectsUrl = `https://betanyc.carto.com/api/v2/sql/?q=SELECT * FROM all_bounds WHERE ST_Intersects(ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326),the_geom)&api_key=2J6__p_IWwUmOHYMKuMYjw&format=geojson`;
    //const intersectsUrl = `https://yhatmsxmjxmpgnnzdrzy.supabase.co/rest/v1/rpc/address_details?apikey=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InloYXRtc3htanhtcGdubnpkcnp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM2OTA4OTQsImV4cCI6MjA1OTI2Njg5NH0.03AZcgwuHf2fAzIuCq8-O8UcSGVGfmvNdMYT6FH08b0&p_lng=${lng}&p_lat=${lat}`;
    const intersectsUrl = `https://ycdpugzzikjzmnatwzsq.supabase.co/rest/v1/rpc/address_details?apikey=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InljZHB1Z3p6aWtqem1uYXR3enNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1MjQ1ODcsImV4cCI6MjA2MTEwMDU4N30.Yp8yESCWzz5ccqaP1crVwRJS50jDYCcK_2Qk2aEoZVg&p_lng=${lng}&p_lat=${lat}`;
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
        console.error('Error fetching address details:', error);
        // Check for TypeError and specific network error messages
        if (error instanceof TypeError && (error.message.toLowerCase().includes('failed to fetch') || error.message.toLowerCase().includes('networkerror'))) {
          showSupabaseConnectionErrorPopup.set(true);
        }
        // Optionally, set districtsIntersectingAddress to an empty array or handle UI state
        districtsIntersectingAddress = [];
      });
  }

  function handleBack() {
    selectedAddress.set(null);
    $addressMarker.remove();
    resetZoom($mapStore);
  }

  $: $selectedAddress &&
    queryAllDistrictsForCoordinates(
      $selectedAddress.coords[0],
      $selectedAddress.coords[1]
    );
</script>

<SidebarHeader
  title={$selectedAddress ? $selectedAddress.name : 'Loading&hellip;'}
  onBack={handleBack}
/>
<div class="py-2">
  <OverlapList districts={districtsIntersectingAddress} {isLoading} />
</div>
