<script lang="ts">
  import { layers } from '../../assets/boundaries'
  import SidebarHeader from './SidebarHeader.svelte'
  import {
    selectedBoundaryMap,
    selectedDistrict,
    hoveredDistrictId,
    mapStore
  } from '../../stores'
  import { resetZoom, sortedDistricts } from '../../helpers/helpers'
  import DistrictLink from './DistrictLink.svelte'
  import Loader from '../Loader.svelte'

  let value = ''
  let districts = []
  let isLoading

  function onDistrictMouseOver(districtId: string) {
    if ($hoveredDistrictId !== null) {
      $mapStore.setFeatureState(
        { source: $selectedBoundaryMap, id: $hoveredDistrictId },
        { hover: false }
      )
    }

    $hoveredDistrictId = districtId

    $mapStore.setFeatureState(
      { source: $selectedBoundaryMap, id: $hoveredDistrictId },
      { hover: true }
    )
  }

  function onDistrictMouseOut(districtId: string) {
    $mapStore.setFeatureState(
      { source: $selectedBoundaryMap, id: districtId },
      { hover: false }
    )
    $hoveredDistrictId = null
  }

  function handleBack() {
    selectedBoundaryMap.set(null)
    resetZoom($mapStore)
  }

  async function queryAllDistrictsForMap(boundaryId: string) {
    isLoading = true
    const url = `https://betanyc.carto.com/api/v2/sql/?q=${layers[boundaryId].sql}&api_key=2J6__p_IWwUmOHYMKuMYjw&format=geojson`
    await fetch(url)
      .then(res => res.json())
      .then(({ features }) => {
        isLoading = false
        districts = sortedDistricts(features)
      })
  }

  $: {
    $selectedBoundaryMap && queryAllDistrictsForMap($selectedBoundaryMap)
  }
</script>

<SidebarHeader
  title={layers[$selectedBoundaryMap].name_plural}
  onBack={handleBack}
>
  <div class="relative mt-3">
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
</SidebarHeader>
{#if isLoading}
  <div class="p-4 pt-2">
    <Loader />
  </div>
{:else}
  {#each districts.filter(district => district.properties.namecol
      .toLowerCase()
      .includes(value)) as district}
    <DistrictLink
      onMouseOver={() => onDistrictMouseOver(district.properties.namecol)}
      onMouseOut={() => onDistrictMouseOut(district.properties.namecol)}
      onClick={() => ($selectedDistrict = district.properties.namecol)}
      icon={layers[district.properties.id].icon}
      nameCol={district.properties.namecol}
      formatContent={layers[district.properties.id].formatContent}
      formatUrl={layers[district.properties.id].formatUrl}
    />
  {/each}
{/if}
