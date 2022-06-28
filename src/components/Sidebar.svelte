<script lang="ts">
  import {
    selectedAddress,
    selectedBoundaryMap,
    selectedDistrict
  } from '../stores'
  import { layers } from '../assets/boundaries'

  let boundariesIntersectingPolygon = []

  function queryFromPolygon(boundId, featureId) {
    //reset
    //todo: loading wheel/ feedback when query is clicked. Also a debounce function.
    boundariesIntersectingPolygon = []
    const intersectsUrl = `https://betanyc.carto.com/api/v2/sql/?q= WITH al as (SELECT ST_MakeValid(the_geom) as the_geom, id, namecol, namealt FROM all_bounds), se as (SELECT the_geom FROM al WHERE id = '${boundId}' AND namecol = '${featureId}'), inter as (SELECT DISTINCT al.id, al.namecol, al.namealt, ST_Area(se.the_geom) as area, ST_Area(ST_Intersection(al.the_geom, se.the_geom)) as searea FROM al, se WHERE ST_Intersects(al.the_geom, se.the_geom)) SELECT * FROM inter WHERE searea / area > .005 &api_key=2J6__p_IWwUmOHYMKuMYjw`
    fetch(intersectsUrl)
      .then(res => res.json())
      .then(({ rows }) => (boundariesIntersectingPolygon = rows))
  }

  $: queryFromPolygon($selectedBoundaryMap, $selectedDistrict)
</script>

<nav id="sidebar" class="w-80 p-4 overflow-auto">
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
        <strong class="block mb-2"
          >overlaps {boundariesIntersectingPolygon.length} boundaries</strong
        >
        {#each boundariesIntersectingPolygon as boundary}
          <div>
            {layers[boundary.id].name}
            {boundary.namecol}
          </div>
        {/each}
      {:else}
        loading intersections&hellip;
      {/if}
    {:else if $selectedAddress}
      <h2 class="text-xl">
        {$selectedAddress}
      </h2>
    {:else}
      Instructions
    {/if}
  </div>
</nav>
