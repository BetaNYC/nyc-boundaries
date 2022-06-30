<script lang="ts">
  import { layers } from '../../assets/boundaries'
  import SidebarHeader from './SidebarHeader.svelte'
  import { selectedBoundaryMap, selectedDistrict, mapStore } from '../../stores'
  import type { GeoJSONSource } from 'mapbox-gl'

  export let onLayerChange: (boundaryId: any) => void

  let boundariesIntersectingPolygon

  function showIntersectingBoundary(geojson) {
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

  function hideIntersectingBoundary() {
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
    boundariesIntersectingPolygon = []
    const intersectsUrl = `https://betanyc.carto.com/api/v2/sql/?q= WITH al as (SELECT ST_MakeValid(the_geom) as the_geom, id, namecol, namealt FROM all_bounds), se as (SELECT the_geom FROM al WHERE id = '${boundId}' AND namecol = '${featureId}'), inter as (SELECT DISTINCT al.id, al.namecol, al.namealt, ST_Area(se.the_geom) as area, ST_Area(ST_Intersection(al.the_geom, se.the_geom)) as searea, al.the_geom FROM al, se WHERE ST_Intersects(al.the_geom, se.the_geom)) SELECT * FROM inter WHERE searea / area > .005 &api_key=2J6__p_IWwUmOHYMKuMYjw&format=geojson`
    fetch(intersectsUrl)
      .then(res => res.json())
      .then(({ features }) => (boundariesIntersectingPolygon = features))
  }

  $: queryIntersectingDistricts($selectedBoundaryMap, $selectedDistrict)
</script>

<SidebarHeader
  title={`${layers[$selectedBoundaryMap].name} 
        ${$selectedDistrict}`}
  onBack={() => onLayerChange($selectedBoundaryMap)}
/>
{#if boundariesIntersectingPolygon.length}
  <strong class="block mb-2">Overlaps</strong>
  {#each boundariesIntersectingPolygon as boundary}
    <div
      on:mouseover={() => showIntersectingBoundary(boundary)}
      on:focus={() => showIntersectingBoundary(boundary)}
      on:mouseout={() => hideIntersectingBoundary()}
      on:blur={() => hideIntersectingBoundary()}
      on:click={() => {
        $selectedDistrict = boundary.properties.namecol
        $selectedBoundaryMap = boundary.properties.id
        hideIntersectingBoundary()
      }}
      class="block bg-white hover:bg-amber-50 focus:bg-amber-50"
      style="color: {layers[boundary.properties.id].textColor}"
    >
      {layers[boundary.properties.id].name}
      {boundary.properties.namecol}
    </div>
  {/each}
{:else}
  loading intersections&hellip;
{/if}
