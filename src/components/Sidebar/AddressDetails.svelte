<script lang="ts">
  import SidebarHeader from './SidebarHeader.svelte'
  import { selectedAddress } from '../../stores'
  import { layers } from '../../assets/boundaries'

  export let onLayerChange: (boundaryId: any) => void

  let districts = []

  async function queryAllDistrictsForCoordinates(lng: number, lat: number) {
    const url = `https://betanyc.carto.com/api/v2/sql/?q=SELECT * FROM all_bounds WHERE ST_Intersects(ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326),the_geom)&api_key=2J6__p_IWwUmOHYMKuMYjw&format=geojson`
    await fetch(url)
      .then(res => res.json())
      .then(({ features }) => (districts = features))

    console.log(lng)
    console.log(lat)
  }

  $: $selectedAddress &&
    queryAllDistrictsForCoordinates(
      $selectedAddress.coords[0],
      $selectedAddress.coords[1]
    )
</script>

<SidebarHeader title={$selectedAddress.name} onBack={() => onLayerChange('')} />

{#each districts as district}
  <div>{layers[district.properties.id].name} {district.properties.namecol}</div>
{/each}
