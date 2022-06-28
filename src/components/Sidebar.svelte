<script lang="ts">
  import {
    mapStore,
    selectedAddress,
    selectedBoundaryMap,
    selectedDistrict
  } from '../stores'
  import { layers } from '../assets/boundaries'
  import type { GeoJSONSource, LngLat } from 'mapbox-gl'
  import { findPolylabel } from '../helpers/helpers'

  let boundariesIntersectingPolygon
  let boundariesIntersectingPoint

  let intersectingBoundaryColor = 'rgb(255, 218, 0)' // BetaNYC Blue

  function queryFromLatLng(lnglat: LngLat) {
    boundariesIntersectingPoint = []
    const intersectsUrl = `https://betanyc.carto.com/api/v2/sql/?q=SELECT * FROM all_bounds WHERE ST_Intersects(ST_SetSRID(ST_MakePoint(${lnglat.lng}, ${lnglat.lat}), 4326),the_geom) &api_key=2J6__p_IWwUmOHYMKuMYjw`
    fetch(intersectsUrl)
      .then(res => res.json())
      .then(({ rows }) => (boundariesIntersectingPoint = rows))
  }

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
          'fill-color': intersectingBoundaryColor,
          'fill-opacity': 0.3
        }
      })

      $mapStore.addLayer({
        id: 'intersecting-stroke-layer',
        type: 'line',
        source: 'intersecting-layer',
        paint: {
          'line-color': intersectingBoundaryColor,
          'line-width': 2.5
        }
      })
    }

    // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/14877
    ;($mapStore.getSource('intersecting-layer') as GeoJSONSource).setData(
      geojson
    )
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

<nav id="sidebar" class="w-80 p-4 overflow-auto shadow-lg z-50">
  <h1 class="text-2xl mb-4">NYC Boundaries</h1>

  <div class="py-4">
    {#if $selectedBoundaryMap && !$selectedDistrict}
      <h2 class="text-xl">
        {layers[$selectedBoundaryMap].name_plural}
      </h2>
    {:else if $selectedDistrict}
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
            class="block bg-white hover:bg-amber-50 focus:bg-amber-50"
          >
            {layers[boundary.properties.id].name}
            {boundary.properties.namecol}
          </div>
        {/each}
      {:else}
        loading intersections&hellip;
      {/if}
    {:else if $selectedAddress}
      <h2 class="text-xl">
        {$selectedAddress.name}
        {boundariesIntersectingPoint}
      </h2>
    {:else}
      Search by address or select a boundary to explore overlaps.
    {/if}
  </div>
</nav>
