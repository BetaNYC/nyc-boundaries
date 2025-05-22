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
    const intersectsUrl = `https://bm-api.beta.nyc/pt_int?p_lng=${lng}&p_lat=${lat}`;
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
