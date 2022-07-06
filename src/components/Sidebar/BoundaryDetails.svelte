<script lang="ts">
  import { BoundaryId, layers } from '../../assets/boundaries'
  import SidebarHeader from './SidebarHeader.svelte'
  import {
    selectedBoundaryMap,
    selectedDistrict,
    hoveredDistrictId,
    mapStore
  } from '../../stores'

  export let onLayerChange: (boundaryId: any) => void

  let districts = []

  function onDistrictMouseOver(districtId: string) {
    // Remove existing hover state if any exists
    if ($hoveredDistrictId !== null) {
      $mapStore.setFeatureState(
        { source: $selectedBoundaryMap, id: $hoveredDistrictId },
        { hover: false }
      )
    }

    // Set new ID
    $hoveredDistrictId = districtId

    // Set new hover state
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

  async function queryAllDistrictsForMap(boundaryId: BoundaryId) {
    const url = `https://betanyc.carto.com/api/v2/sql/?q=${layers[boundaryId].sql}&api_key=2J6__p_IWwUmOHYMKuMYjw&format=geojson`
    await fetch(url)
      .then(res => res.json())
      .then(
        ({ features }) =>
          (districts = features
            .sort(
              (a, b) => a.properties.namecol.localeCompare(b.properties.namecol) // Sort alphabetical districts
            )
            .sort((a, b) => a.properties.namecol - b.properties.namecol)) // Sort numerical districts
      )
  }

  $: {
    $selectedBoundaryMap && queryAllDistrictsForMap($selectedBoundaryMap)
  }
</script>

<SidebarHeader
  icon={layers[$selectedBoundaryMap].icon}
  title={layers[$selectedBoundaryMap].name_plural}
  onBack={() => onLayerChange('')}
/>

<div class="grid gap-2 grid-cols-4">
  {#each districts as district}
    <button
      class={`rounded text-left bg-slate-100 tabular-nums`}
      class:col-span-4={district.properties.namecol.length >= 6}
      on:mouseover={() => onDistrictMouseOver(district.properties.namecol)}
      on:focus={() => onDistrictMouseOver(district.properties.namecol)}
      on:mouseout={() => onDistrictMouseOut(district.properties.namecol)}
      on:blur={() => onDistrictMouseOut(district.properties.namecol)}
      on:click={() => ($selectedDistrict = district.properties.namecol)}
    >
      {district.properties.namecol}
    </button>
  {/each}
</div>
