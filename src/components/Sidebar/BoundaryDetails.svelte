<script lang="ts">
  import { layers } from '../../assets/boundaries';
  import SidebarHeader from './SidebarHeader.svelte';
  import {
    selectedBoundaryMap,
    selectedDistrict,
    hoveredDistrictId,
    mapStore
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

  function onDistrictMouseOver(districtId: string) {
    if ($hoveredDistrictId && $selectedBoundaryMap) {
      $mapStore.setFeatureState(
        { source: $selectedBoundaryMap, id: $hoveredDistrictId },
        { hover: false }
      );
    }

    $hoveredDistrictId = districtId;

    if ($selectedBoundaryMap) {
      $mapStore.setFeatureState(
        { source: $selectedBoundaryMap, id: $hoveredDistrictId },
        { hover: true }
      );
    }
  }

  function onDistrictMouseOut(districtId: string) {
    if ($selectedBoundaryMap) {
      $mapStore.setFeatureState(
        { source: $selectedBoundaryMap, id: districtId },
        { hover: false }
      );
    }
    $hoveredDistrictId = undefined;
  }

  function handleBack() {
    selectedBoundaryMap.set(null);
    resetZoom($mapStore);
  }

  async function queryAllDistrictsForMap(boundaryId: string) {
    isLoading = true;
    const url = `https://betanyc.carto.com/api/v2/sql/?q=${layers[boundaryId].sql}&api_key=2J6__p_IWwUmOHYMKuMYjw&format=geojson`;
    await fetch(url)
      .then(res => res.json())
      .then(({ features }) => {
        isLoading = false;
        districts = sortedDistricts(features);
      });
  }

  $: {
    $selectedBoundaryMap && queryAllDistrictsForMap($selectedBoundaryMap);
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
              target="_blank">Learn more</a
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
    {#each districts.filter(district => district.properties?.namecol
        .toLowerCase()
        .includes(value)) as district}
      <DistrictLink
        onMouseOver={() => onDistrictMouseOver(district.properties?.namecol)}
        onMouseOut={() => onDistrictMouseOut(district.properties?.namecol)}
        onClick={() => ($selectedDistrict = district.properties?.namecol)}
        icon={layers[district.properties?.id].icon}
        nameCol={district.properties?.namecol}
        formatContent={layers[district.properties?.id].formatContent}
        formatUrl={layers[district.properties?.id].formatUrl}
      />
    {/each}
  {/if}
</div>
