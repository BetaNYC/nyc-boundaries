<script lang="ts">
  import SidebarHeader from './SidebarHeader.svelte'
  import { selectedAddress } from '../../stores'
  import OverlapList from './OverlapList.svelte'

  let districtsIntersectingAddress
  let isLoading = false

  async function queryAllDistrictsForCoordinates(lng: number, lat: number) {
    districtsIntersectingAddress = []
    isLoading = true
    const intersectsUrl = `https://betanyc.carto.com/api/v2/sql/?q=SELECT * FROM all_bounds WHERE ST_Intersects(ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326),the_geom)&api_key=2J6__p_IWwUmOHYMKuMYjw&format=geojson`
    await fetch(intersectsUrl)
      .then(res => res.json())
      .then(({ features }) => {
        isLoading = false
        districtsIntersectingAddress = features
      })
  }

  $: $selectedAddress &&
    queryAllDistrictsForCoordinates(
      $selectedAddress.coords[0],
      $selectedAddress.coords[1]
    )
</script>

<SidebarHeader
  title={$selectedAddress.name}
  onBack={() => selectedAddress.set(null)}
/>

<div class="p-4 pt-0">
  <OverlapList districts={districtsIntersectingAddress} {isLoading} />
</div>
