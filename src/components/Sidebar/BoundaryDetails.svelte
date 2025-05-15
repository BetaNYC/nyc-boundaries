<script lang="ts">
  import { layers } from '../../assets/boundaries';
  import SidebarHeader from './SidebarHeader.svelte';
  import {
    selectedBoundaryMap,
    selectedDistrict,
    hoveredDistrictId,
    mapStore,
    mapSourcesReady,
    mapInteractionCompleteSignal
  } from '../../stores';
  import { clickOutside } from 'svelte-use-click-outside';
  import { resetZoom, sortedDistricts } from '../../helpers/helpers';
  import DistrictLink from './DistrictLink.svelte';
  import Loader from '../Loader.svelte';
  import type { Feature } from 'geojson';

  let value = '';
  let districts: Feature[] = [];
  let isLoading: boolean;
  let isDetailPaneOpen: boolean = false;

  function onDistrictMouseOver(districtId: string | undefined | null) {
    if ($mapStore && $hoveredDistrictId && $selectedBoundaryMap && typeof $hoveredDistrictId === 'string') {
      $mapStore.setFeatureState(
        { source: 'all-boundaries-source', sourceLayer: 'all_boundaries', id: $hoveredDistrictId },
        { hover: false }
      );
    }

    if (typeof districtId === 'string' && districtId.length > 0) {
      $hoveredDistrictId = districtId;
      if ($mapStore && $selectedBoundaryMap) {
        $mapStore.setFeatureState(
          { source: 'all-boundaries-source', sourceLayer: 'all_boundaries', id: $hoveredDistrictId },
          { hover: true }
        );
      }
    } else {
      $hoveredDistrictId = undefined;
    }
  }

  function onDistrictMouseOut(districtId: string | undefined | null) {
    if ($mapStore && typeof $hoveredDistrictId === 'string' && $hoveredDistrictId.length > 0 && $selectedBoundaryMap) {
      $mapStore.setFeatureState(
        { source: 'all-boundaries-source', sourceLayer: 'all_boundaries', id: $hoveredDistrictId },
        { hover: false }
      );
    }
    $hoveredDistrictId = undefined;
  }

  function handleBack() {
    selectedBoundaryMap.set(null);
    if ($mapStore) {
      resetZoom($mapStore);
    }
  }

  $: {
    console.log(
      `BoundaryDetails: Reactive block triggered. $selectedBoundaryMap: ${$selectedBoundaryMap}, $mapSourcesReady: ${$mapSourcesReady}, $mapInteractionCompleteSignal: ${$mapInteractionCompleteSignal}`
    );
    if ($selectedBoundaryMap && $mapStore && $mapSourcesReady && $mapInteractionCompleteSignal) {
      const queryFeaturesLocal = () => {
        if ($selectedBoundaryMap && $mapStore && $mapSourcesReady) {
          console.log(
            'BoundaryDetails: queryFeaturesLocal called. Current $selectedBoundaryMap:',
            $selectedBoundaryMap
          );
          const features = $mapStore.querySourceFeatures('all-boundaries-source', {
            sourceLayer: 'all_boundaries',
            filter: ['==', ['get', 'id'], $selectedBoundaryMap]
          });
          console.log(
            `BoundaryDetails: Raw features count from querySourceFeatures: ${features.length}`,
            features
          );

          // De-duplicate features based on properties.namecol
          const uniqueFeaturesByNamecol: Feature[] = [];
          const seenNamecols = new Set<string>();
          for (const feature of features) {
            if (feature.properties && typeof feature.properties.namecol === 'string') {
              if (!seenNamecols.has(feature.properties.namecol)) {
                uniqueFeaturesByNamecol.push(feature);
                seenNamecols.add(feature.properties.namecol);
              }
            } else {
              console.warn(
                'BoundaryDetails: Feature found with missing, null, or non-string namecol property. Including as is. Feature:',
                feature
              );
              uniqueFeaturesByNamecol.push(feature);
            }
          }
          console.log('BoundaryDetails: Features after de-duplication by namecol:', uniqueFeaturesByNamecol);
          districts = sortedDistricts(uniqueFeaturesByNamecol);
          console.log(
            'BoundaryDetails: Districts array after sortedDistricts:',
            JSON.parse(JSON.stringify(districts)) // Deep copy for logging
          );
        } else {
          console.warn('BoundaryDetails: queryFeaturesLocal unexpectedly called with null $selectedBoundaryMap (after potential async operation).');
          districts = []; // Clear districts if $selectedBoundaryMap became null
        }
        isLoading = false;
      };

      if ($mapStore.getSource('all-boundaries-source') && $mapStore.isSourceLoaded('all-boundaries-source')) {
        isLoading = true;
        queryFeaturesLocal();
      } else if ($mapStore.getSource('all-boundaries-source')) {
        console.log('BoundaryDetails: Source "all-boundaries-source" exists but not loaded, waiting for sourcedata event.');
        isLoading = true;
        districts = [];
        const sourceLoadedListener = (e: maplibregl.MapSourceDataEvent) => {
          if (e.sourceId === 'all-boundaries-source' && e.isSourceLoaded && e.dataType === 'source') {
            console.log('BoundaryDetails: "all-boundaries-source" sourcedata event: loaded.');
            if ($selectedBoundaryMap) { 
               queryFeaturesLocal();
            } else {
              console.log('BoundaryDetails: $selectedBoundaryMap became null before sourcedata event resolved. Not querying.');
              districts = [];
              isLoading = false;
            }
            $mapStore.off('sourcedata', sourceLoadedListener);
          }
        };
        $mapStore.on('sourcedata', sourceLoadedListener);
      } else {
        console.warn('BoundaryDetails: mapSourcesReady is true, but "all-boundaries-source" does not exist. This is unexpected.');
        isLoading = true;
        districts = [];
      }
    } else {
      districts = [];
      isLoading = false;
      if ($selectedBoundaryMap && $mapStore && !$mapSourcesReady) {
        console.log('BoundaryDetails: Waiting for map sources to be ready...');
        console.log(`BoundaryDetails: Current $mapInteractionCompleteSignal: ${$mapInteractionCompleteSignal}`);
        isLoading = true;
      }
    }
  }
</script>

<SidebarHeader
  title={$selectedBoundaryMap
    ? layers[$selectedBoundaryMap].name_plural
    : 'Loading&hellip;'}
  onBack={handleBack}
>
  <div class="flex mt-2">
    <div class="relative flex-1">
      <input
        id="filter"
        placeholder="Filter"
        type="search"
        name="filter"
        bind:value
        autocomplete="off"
        class="block w-full py-1 px-3 pl-10 bg-gray-100 rounded focus:outline-none focus:ring focus:ring-blue-500"
      />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5 absolute left-1.5 top-1.5"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fill-rule="evenodd"
          d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
          clip-rule="evenodd"
        />
      </svg>
    </div>
    {#if $selectedBoundaryMap}
      <div class="relative" use:clickOutside={() => (isDetailPaneOpen = false)}>
        <button
          on:click={() => (isDetailPaneOpen = !isDetailPaneOpen)}
          class={`w-8 h-8 ml-2 text-lg flex justify-center items-center rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-800 focus:outline-none focus:ring focus:ring-blue-500 ${
            isDetailPaneOpen && 'bg-gray-100 text-gray-800'
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
        <div
          class={`absolute top-full mt-2 right-0 w-72 bg-white rounded shadow-md p-2 py-4 mb-4 px-4 text-gray-800 text-sm ${
            isDetailPaneOpen ? 'visible' : 'hidden'
          }`}
        >
          {layers[$selectedBoundaryMap].description}
          {#if layers[$selectedBoundaryMap].description_url}
            <a
              href={layers[$selectedBoundaryMap].description_url}
              class="underline"
              target="_blank"
              rel="noreferrer"
              >Learn more</a
            >
          {/if}
        </div>
      </div>
    {/if}
  </div>
</SidebarHeader>
<div class="py-2">
  {#if isLoading}
    <div class="px-4">
      <Loader />
    </div>
  {:else}
    {#each districts as districtFeature}
      {#if districtFeature.properties && typeof districtFeature.properties.id === 'string' && typeof districtFeature.properties.namecol === 'string' && districtFeature.properties.namecol.toLowerCase().includes(value.toLowerCase())}
        {@const districtIdString = districtFeature.properties.id}
        {@const districtNameString = districtFeature.properties.namecol}
        <DistrictLink
          onMouseOver={() => onDistrictMouseOver(districtNameString)}
          onMouseOut={() => onDistrictMouseOut(districtNameString)}
          onClick={() => {
            // districtIdString is the boundary type like 'cd'
            // districtNameString is the specific district name like 'Manhattan 1'
            $selectedBoundaryMap = districtIdString; 
            $selectedDistrict = districtNameString;
          }}
          icon={layers[districtIdString].icon}
          nameCol={districtNameString}
          area={districtFeature.properties.area}
          searea={districtFeature.properties.searea}
          formatContent={layers[districtIdString].formatContent}
          formatUrl={layers[districtIdString].formatUrl}
        />
      {/if}
    {/each}
  {/if}
</div>
