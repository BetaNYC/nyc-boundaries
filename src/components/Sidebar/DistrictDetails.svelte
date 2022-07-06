<script lang="ts">
  import { layers } from '../../assets/boundaries'
  import SidebarHeader from './SidebarHeader.svelte'
  import { selectedBoundaryMap, selectedDistrict, mapStore } from '../../stores'
  import type { GeoJSONSource } from 'mapbox-gl'

  export let onLayerChange: (boundaryId: any) => void

  let districtsIntersectingPolygon

  function showIntersectingDistrict(geojson) {
    if (!$mapStore.getSource('intersecting-layer')) {
      $mapStore.addSource('intersecting-layer', {
        type: 'geojson',
        data: geojson
      })

      $mapStore.addLayer({
        id: 'intersecting-layer',
        type: 'fill',
        source: 'intersecting-layer',
        paint: {
          'fill-color': layers[geojson.properties.id].lineColor,
          'fill-opacity': 0.15
        }
      })

      $mapStore.addLayer({
        id: 'intersecting-stroke-layer',
        type: 'line',
        source: 'intersecting-layer',
        paint: {
          'line-color': layers[geojson.properties.id].lineColor,
          'line-width': 2.5
        }
      })
    }

    // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/14877
    ;($mapStore.getSource('intersecting-layer') as GeoJSONSource).setData(
      geojson
    )
  }

  function hideIntersectingDistrict() {
    if ($mapStore.getSource('intersecting-layer')) {
      $mapStore
        .removeLayer('intersecting-layer')
        .removeLayer('intersecting-stroke-layer')
        .removeSource('intersecting-layer')
    }
  }

  function queryIntersectingDistricts(boundId, featureId) {
    //reset
    //todo: loading wheel/ feedback when query is clicked. Also a debounce function.
    districtsIntersectingPolygon = []
    const intersectsUrl = `https://betanyc.carto.com/api/v2/sql/?q= WITH al as (SELECT ST_MakeValid(the_geom) as the_geom, id, namecol, namealt FROM all_bounds), se as (SELECT the_geom FROM al WHERE id = '${boundId}' AND namecol = '${featureId}'), inter as (SELECT DISTINCT al.id, al.namecol, al.namealt, ST_Area(se.the_geom) as area, ST_Area(ST_Intersection(al.the_geom, se.the_geom)) as searea, al.the_geom FROM al, se WHERE ST_Intersects(al.the_geom, se.the_geom)) SELECT * FROM inter WHERE searea / area > .005 &api_key=2J6__p_IWwUmOHYMKuMYjw&format=geojson`
    fetch(intersectsUrl)
      .then(res => res.json())
      .then(({ features }) => (districtsIntersectingPolygon = features))
  }

  $: queryIntersectingDistricts($selectedBoundaryMap, $selectedDistrict)
</script>

<SidebarHeader
  title={`${layers[$selectedBoundaryMap].name} 
        ${$selectedDistrict}`}
  icon={layers[$selectedBoundaryMap].icon}
  onBack={() => onLayerChange($selectedBoundaryMap)}
/>

<!-- TODO: Add district metadata (council member, link to website, etc.) -->

{#if districtsIntersectingPolygon.length}
  <strong class="block mb-2">Overlaps</strong>
  {#each districtsIntersectingPolygon as district}
    <button
      on:mouseover={() => showIntersectingDistrict(district)}
      on:focus={() => showIntersectingDistrict(district)}
      on:mouseout={() => hideIntersectingDistrict()}
      on:blur={() => hideIntersectingDistrict()}
      on:click={() => {
        $selectedBoundaryMap = district.properties.id
        $selectedDistrict = district.properties.namecol
        hideIntersectingDistrict()
      }}
      class="block bg-white hover:bg-amber-50 focus:bg-amber-50 text-left"
      style="color: {layers[district.properties.id].textColor}"
    >
      {layers[district.properties.id].name}
      {district.properties.namecol}
    </button>
  {/each}
{:else}
  Loading overlaps&hellip;
{/if}
