<script lang="ts">
  import SidebarHeader from './SidebarHeader.svelte';
  import {
    addressMarker,
    selectedAddress,
    mapStore
  } from '../../stores';
  import OverlapList from './OverlapList.svelte';
  import type { Feature } from 'geojson';
  import { resetZoom } from '../../helpers/helpers';
  import { layers } from '../../assets/boundaries'; // Import layers metadata
  import { sortedDistricts } from '../../helpers/helpers'; // For sorting results

  let districtsIntersectingAddress: Feature[] = [];
  let isLoading = false;

  async function queryAllDistrictsForCoordinates(lng: number, lat: number) {
    districtsIntersectingAddress = [];
    isLoading = true;

    if (!$mapStore) {
      isLoading = false;
      return;
    }

    // Convert lng/lat to screen point for queryRenderedFeatures
    const point = $mapStore.project([lng, lat]);

    // Generate the list of MapLibre layer IDs we might be interested in
    // These are the fill layers, e.g., "cd-layer", "pp-layer"
    const mapLibreLayerIds = Object.keys(layers).map(id => `${id}-layer`);

    try {
      const features = $mapStore.queryRenderedFeatures(point, {
        layers: mapLibreLayerIds
      });
      
      // queryRenderedFeatures can return duplicates if a point is near a boundary shared by features
      // or if layers overlap. We should deduplicate based on a unique feature identifier if possible.
      // For now, let's assume properties.id (boundary type) and properties.namecol (district identifier) make it unique enough
      // for display purposes, or that OverlapList handles further grouping.
      // The old RPC might have done some deduplication or specific selection.
      // We also need to ensure the feature properties match what OverlapList expects.
      // The features from queryRenderedFeatures will have properties from the vector tiles (id, namecol, namealt).
      // OverlapList uses district.properties.id and district.properties.namecol.
      
      // The old Supabase RPC returned features directly.
      // The features from queryRenderedFeatures should be similar but source from vector tiles.
      // We need to ensure they have `id` and `namecol` in their properties, which they should from the pmtiles.
      districtsIntersectingAddress = sortedDistricts(features || []); 
    } catch (error) {
      console.error('Error querying rendered features:', error);
      districtsIntersectingAddress = [];
    } finally {
      isLoading = false;
    }
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
