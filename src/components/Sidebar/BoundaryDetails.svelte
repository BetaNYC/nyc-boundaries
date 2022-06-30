<script lang="ts">
  import { BoundaryId, layers } from '../../assets/boundaries'
  import SidebarHeader from './SidebarHeader.svelte'
  import { selectedBoundaryMap } from '../../stores'

  export let onLayerChange: (boundaryId: any) => void

  let allDistrictsForMap = []

  async function queryAllDistrictsForMap(boundaryId: BoundaryId) {
    const url = `https://betanyc.carto.com/api/v2/sql/?q=${layers[boundaryId].sql}&api_key=2J6__p_IWwUmOHYMKuMYjw&format=geojson`
    const data = await fetch(url)
      .then(res => res.json())
      .then(({ features }) => (allDistrictsForMap = features))
  }

  $: {
    $selectedBoundaryMap && queryAllDistrictsForMap($selectedBoundaryMap)
  }
</script>

<SidebarHeader
  title={layers[$selectedBoundaryMap].name_plural}
  onBack={() => onLayerChange('')}
/>
{#each allDistrictsForMap as district}
  <div>{district.properties.namecol}</div>
{/each}
