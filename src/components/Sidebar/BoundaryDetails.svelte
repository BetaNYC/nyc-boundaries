<script lang="ts">
  import { BoundaryId, layers } from '../../assets/boundaries'
  import SidebarHeader from './SidebarHeader.svelte'
  import { selectedBoundaryMap } from '../../stores'

  export let onLayerChange: (boundaryId: any) => void

  let districts = []

  async function queryAllDistrictsForMap(boundaryId: BoundaryId) {
    const url = `https://betanyc.carto.com/api/v2/sql/?q=${layers[boundaryId].sql}&api_key=2J6__p_IWwUmOHYMKuMYjw&format=geojson`
    await fetch(url)
      .then(res => res.json())
      .then(({ features }) => (districts = features))
  }

  $: {
    $selectedBoundaryMap && queryAllDistrictsForMap($selectedBoundaryMap)
  }
</script>

<SidebarHeader
  title={layers[$selectedBoundaryMap].name_plural}
  onBack={() => onLayerChange('')}
/>
<div class="mb-4 text-gray-500">
  Click a district to see details and overlaps with other boundaries.
</div>
{#each districts as district}
  <div>{district.properties.namecol}</div>
{/each}
