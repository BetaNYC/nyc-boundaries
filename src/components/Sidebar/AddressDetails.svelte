<script lang="ts">
  import SidebarHeader from './SidebarHeader.svelte'
  import { addressMarker, selectedAddress, mapStore } from '../../stores'
  import OverlapList from './OverlapList.svelte'
  import type { Feature } from 'geojson'
  import { resetZoom } from '../../helpers/helpers'

  let districtsIntersectingAddress: Feature[]
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

  function handleBack() {
    selectedAddress.set(null)
    $addressMarker.remove()
    resetZoom($mapStore)
  }

  $: $selectedAddress &&
    queryAllDistrictsForCoordinates(
      $selectedAddress.coords[0],
      $selectedAddress.coords[1]
    )
</script>

<SidebarHeader title={$selectedAddress.name} onBack={handleBack} />
<OverlapList districts={districtsIntersectingAddress} {isLoading} />
