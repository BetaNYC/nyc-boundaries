<script lang="ts">
  import {
    mapStore,
    selectedAddress,
    selectedBoundaryMap,
    selectedDistrict
  } from '../stores'
  import { BoundaryId, layers } from '../assets/boundaries'
  import type { GeoJSONSource } from 'mapbox-gl'

  let allDistrictsForMap = []
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

  async function queryAllDistrictsForMap(boundaryId: BoundaryId) {
    const url = `https://betanyc.carto.com/api/v2/sql/?q=${layers[boundaryId].sql}&api_key=2J6__p_IWwUmOHYMKuMYjw&format=geojson`
    const data = await fetch(url)
      .then(res => res.json())
      .then(({ features }) => (allDistrictsForMap = features))
  }

  $: {
    $selectedBoundaryMap && queryAllDistrictsForMap($selectedBoundaryMap)
    queryIntersectingDistricts($selectedBoundaryMap, $selectedDistrict)
  }
</script>

<nav id="sidebar" class="w-80 p-4 overflow-auto shadow-lg z-50">
  <h1 class="text-2xl mb-4">NYC Boundaries</h1>

  <div class="py-4">
    {#if $selectedBoundaryMap && $selectedDistrict}
      <h2 class="text-xl">
        {layers[$selectedBoundaryMap].name}
        {$selectedDistrict}
      </h2>
      {#if boundariesIntersectingPolygon.length}
        <strong class="block mb-2">Overlaps</strong>
        {#each boundariesIntersectingPolygon as boundary}
          <div
            on:mouseover={() => showIntersectingBoundary(boundary)}
            on:focus={() => showIntersectingBoundary(boundary)}
            on:mouseout={() => hideIntersectingBoundary()}
            on:blur={() => hideIntersectingBoundary()}
            on:click={() => {
              $selectedBoundaryMap = boundary.properties.id
              console.log(boundary.properties)
              $selectedDistrict = boundary.properties.namecol
              hideIntersectingBoundary()
            }}
            class="block bg-white hover:bg-amber-50 focus:bg-amber-50"
          >
            {layers[boundary.properties.id].name}
            {boundary.properties.namecol}
          </div>
        {/each}
      {:else}
        loading intersections&hellip;
      {/if}
    {:else if $selectedBoundaryMap && !$selectedDistrict}
      <h2 class="text-xl">
        {layers[$selectedBoundaryMap].name_plural}
      </h2>
      {#each allDistrictsForMap as district}
        <div>{district.properties.namecol}</div>
      {/each}
    {:else if $selectedAddress}
      <h2 class="text-xl">
        {$selectedAddress.name}
      </h2>
    {:else}
      Search by address or select a boundary to explore overlaps.
    {/if}
  </div>
</nav>
