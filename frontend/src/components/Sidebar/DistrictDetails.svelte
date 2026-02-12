<script lang="ts">
  import { layers } from '../../assets/boundaries';
  import SidebarHeader from './SidebarHeader.svelte';
  import {
    selectedBoundaryMap,
    selectedDistrict,
    mapStore,
    showSupabaseConnectionErrorPopup
  } from '../../stores';
  import { sortedDistricts, resetZoom } from '../../helpers/helpers';
  import OverlapList from './OverlapList.svelte';
  import type { Feature } from 'geojson';
  import { debounce } from '../../helpers/debounce';
  import DistrictMetadata from './DistrictMetadata.svelte';

  let districtsIntersectingPolygon: Feature[];
  let isLoading = false;

  const debounceQueryInterDist = debounce(
    async (boundId: string, featureId: string) => {
      isLoading = true;
      districtsIntersectingPolygon = [];
      districtsIntersectingPolygon = await queryIntersectingDistricts(
        boundId,
        featureId
      );
      isLoading = false;
    },
    250
  );

  async function queryIntersectingDistricts(
    boundId: string,
    featureId: string
  ) {
    const intersectsUrl = `https://bm-api.beta.nyc/district_int_new?boundid=${boundId}&featureid=${featureId}`;
    const options = {
      headers: {
        'Accept': 'application/geo+json'
      }
    };
    return await fetch(intersectsUrl, options)
      .then(res => res.json())
      .then(({ features }) => {
        return sortedDistricts(features);
      })
      .catch(error => {
        console.error('Error fetching intersecting districts:', error);
        if (error instanceof TypeError && (error.message.toLowerCase().includes('failed to fetch') || error.message.toLowerCase().includes('networkerror'))) {
          showSupabaseConnectionErrorPopup.set(true);
        }
        return [];
      });
  }

  function getDistrictTitle(
    boundaryId: string | null,
    districtId: string | null
  ) {
    if (boundaryId && districtId) {
      if (boundaryId === 'nta') {
        return districtId;
      } else if (boundaryId === 'bid') {
        return `${layers[boundaryId].formatContent(districtId)} BID`;
      } else {
        return `${layers[boundaryId].name} ${layers[boundaryId].formatContent(
          districtId
        )}`;
      }
    }

    return 'Unknown District';
  }

  function handleBack() {
    resetZoom($mapStore);
    selectedDistrict.set(null);
  }

  $: debounceQueryInterDist($selectedBoundaryMap, $selectedDistrict);
</script>

<SidebarHeader
  title={getDistrictTitle($selectedBoundaryMap, $selectedDistrict)}
  onBack={handleBack}
/>
<div class="py-4">
  {#if $selectedBoundaryMap}
    <DistrictMetadata
      formatUrl={layers[$selectedBoundaryMap].formatUrl}
      districtId={$selectedDistrict}
    />
  {/if}
  <OverlapList districts={districtsIntersectingPolygon} {isLoading} />
</div>
