<script lang="ts">
  import { layers } from '../../assets/boundaries'
  import SidebarHeader from './SidebarHeader.svelte'
  import { selectedBoundaryMap, selectedDistrict } from '../../stores'
  import { sortedDistricts } from '../../helpers/helpers'
  import OverlapList from './OverlapList.svelte'
  import type { Feature } from 'geojson'

  let districtsIntersectingPolygon: Feature[]
  let isLoading = false

  function queryIntersectingDistricts(boundId, featureId) {
    //reset
    //todo: Debounce function.
    districtsIntersectingPolygon = []
    isLoading = true
    const intersectsUrl = `https://betanyc.carto.com/api/v2/sql/?q= WITH al as (SELECT ST_MakeValid(the_geom) as the_geom, id, namecol, namealt FROM all_bounds), se as (SELECT the_geom FROM al WHERE id = '${boundId}' AND namecol = '${featureId}'), inter as (SELECT DISTINCT al.id, al.namecol, al.namealt, ST_Area(se.the_geom) as area, ST_Area(ST_Intersection(al.the_geom, se.the_geom)) as searea, al.the_geom FROM al, se WHERE ST_Intersects(al.the_geom, se.the_geom)) SELECT * FROM inter WHERE searea / area > .005 &api_key=2J6__p_IWwUmOHYMKuMYjw&format=geojson`
    fetch(intersectsUrl)
      .then(res => res.json())
      .then(({ features }) => {
        isLoading = false
        districtsIntersectingPolygon = sortedDistricts(features)
      })
  }

  const title =
    $selectedBoundaryMap === ('nta' || 'bid')
      ? `${$selectedDistrict}`
      : `${layers[$selectedBoundaryMap].name} ${$selectedDistrict}`

  $: queryIntersectingDistricts($selectedBoundaryMap, $selectedDistrict)
</script>

<SidebarHeader
  {title}
  icon={layers[$selectedBoundaryMap].icon}
  onBack={() => selectedDistrict.set(null)}
/>

<!-- TODO: Add district metadata (council member, link to website, etc.) -->
<div class="p-4 pt-0">
  <h4 class="block mb-2 text-gray-600 font-medium">Overlaps</h4>
  <OverlapList districts={districtsIntersectingPolygon} {isLoading} />
</div>
