<script lang="ts">
  import { layers } from '../../assets/boundaries';
  import SidebarHeader from './SidebarHeader.svelte';
  import {
    selectedBoundaryMap,
    selectedDistrict,
    mapStore,
    mapSourcesReady,
    mapInteractionCompleteSignal
  } from '../../stores';
  import { get } from 'svelte/store';
  import { sortedDistricts, resetZoom, getDistrictFromSource } from '../../helpers/helpers';
  import { 
    intersections,
    getIntersectionsForDistrict,
    type IntersectionRow
  } from '../../intersections';
  import OverlapList from './OverlapList.svelte';
  import type { Feature } from 'geojson';
  import { debounce } from '../../helpers/debounce';
  import DistrictMetadata from './DistrictMetadata.svelte';

  let districtsIntersectingPolygon: Feature[] = [];
  let isLoading = false; // This component's internal loading state
  let loadingError: string | null = null; // Local error state, can be updated from intersections.getError()

  const debounceQueryInterDist = debounce(
    async (boundId: string | null, featureId: string | null) => {
      if (!boundId || !featureId) {
        districtsIntersectingPolygon = [];
        loadingError = null; // Clear previous errors
        return;
      }
      isLoading = true;
      loadingError = null; // Clear previous errors for new query
      districtsIntersectingPolygon = [];
      try {
        // Check global loading/error state from the intersection service
        // using the getter methods from the 'intersections' object.
        if (intersections.getIsLoading() || intersections.getError()) {
          loadingError = intersections.getError(); // Capture error if any
          if(loadingError) isLoading = false; // Stop local loading if there's a global error
          // If it's just loading globally, this component might still want to show its own loading indicator
          // or wait, depending on desired behavior.
          if(intersections.getIsLoading() && !loadingError) {
            // If global is loading and no error, this function might wait or return if it shouldn't proceed.
            // For now, if another process is loading intersection data, we might return to avoid concurrent ops.
            // Or, if this function *is* the one that triggers loading, this check needs refinement.
            // Given loadIntersectionData is called separately, we just check for existing error/loading state here.
          }
          if (loadingError) return; // If error, don't proceed
        }
        
        districtsIntersectingPolygon = await queryIntersectingDistricts(
          boundId,
          featureId
        );
      } catch (error) {
        console.error('Error in debounceQueryInterDist:', error);
        loadingError = error instanceof Error ? error.message : String(error);
      } finally {
        isLoading = false;
      }
    },
    250
  );

  async function queryIntersectingDistricts(
    boundId: string,
    featureId: string
  ): Promise<Feature[]> {
    // Ensure data is loaded before trying to get intersections
    // This function assumes loadIntersectionData has been called elsewhere (e.g., on app init)
    // and data is available via S3_INTERSECTION_TABLE used by getIntersectionsForDistrict.
    if (!intersections.isLoaded() && !intersections.getIsLoading()) {
      console.warn("Querying intersections but data not loaded and not currently loading.");
      // Optionally, trigger loadIntersectionData() here if not already loading
      // However, this might lead to multiple load attempts. Better to manage loading state centrally.
      // loadIntersectionData(); 
      // return []; // or throw error
    }

    const currentError = intersections.getError();
    if (currentError) {
      console.error("Cannot query intersecting districts due to existing error:", currentError);
      loadingError = currentError; // Propagate error to local state
      return [];
    }

    const intersectionRows: IntersectionRow[] = getIntersectionsForDistrict(boundId, featureId);
    const enrichedFeatures: Feature[] = [];

    if (!$mapStore) {
      console.error('Map store not available in queryIntersectingDistricts');
      return [];
    }

    for (const row of intersectionRows) {
      let otherDistrictType: string | undefined = undefined;
      let otherDistrictNameCol: string | undefined = undefined;
      let otherNameAlt: string | null | undefined = undefined;

      if (row.id_left === boundId && row.namecol_left === featureId) {
        otherDistrictType = row.id_right;
        otherDistrictNameCol = row.namecol_right;
        otherNameAlt = row.namealt_right;
      }

      if (otherDistrictType && otherDistrictNameCol) {
        const geometryFeature = getDistrictFromSource($mapStore, otherDistrictType, otherDistrictNameCol);

        if (geometryFeature && geometryFeature.geometry) {
          const properties = {
            id: otherDistrictType,
            namecol: otherDistrictNameCol,
            namealt: otherNameAlt,
            area: row.intersection_pct,
            searea: row.intersection_pct,
          };
          enrichedFeatures.push({
            type: 'Feature',
            geometry: geometryFeature.geometry,
            properties: properties
          });
        } else {
          console.warn(`[DistrictDetails] Failed to get geometry for intersecting district via getDistrictFromSource. Type: ${otherDistrictType}, NameCol: ${otherDistrictNameCol}. geometryFeature was:`, geometryFeature);
        }
      }
    }
    return sortedDistricts(enrichedFeatures);
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
    if ($mapStore) {
      resetZoom($mapStore);
    }
    selectedDistrict.set(null);
  }

  $: {
    const sourcesReady = get(mapSourcesReady);
    if ($selectedBoundaryMap && $selectedDistrict && sourcesReady && $mapInteractionCompleteSignal) {
      console.log(`[DistrictDetails] Ready to query: $selectedBoundaryMap=${$selectedBoundaryMap}, $selectedDistrict=${$selectedDistrict}, mapSourcesReady=${sourcesReady}, mapInteractionCompleteSignal=${$mapInteractionCompleteSignal}`);
      debounceQueryInterDist($selectedBoundaryMap, $selectedDistrict);
    } else if ((!$selectedBoundaryMap || !$selectedDistrict)) {
      console.log('[DistrictDetails] Selection cleared or incomplete, clearing districts.');
      districtsIntersectingPolygon = [];
      loadingError = null;
      isLoading = false;
    } else if (!sourcesReady || !$mapInteractionCompleteSignal) {
      console.log(`[DistrictDetails] Waiting for map sources to be ready (sourcesReady=${sourcesReady}) or interaction to complete (mapInteractionCompleteSignal=${$mapInteractionCompleteSignal}) before querying intersections.`);
      isLoading = true; 
    }
  }
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
  {#if loadingError}
    <p class="text-red-500 px-4">Error loading intersection data: {loadingError}</p>
  {/if}
  <OverlapList districts={districtsIntersectingPolygon} {isLoading} />
</div>
