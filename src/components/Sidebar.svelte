<script lang="ts">
  import { activeBoundary, selectedPolygon } from '../stores'
  import { layers } from '../assets/boundaries'
  export let onLayerChange: (boundaryId: any) => void

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

  $: queryFromPolygon($activeBoundary, $selectedPolygon)
</script>

<nav id="sidebar" class="w-80 p-4 overflow-auto drop-shadow-lg z-50">
  <h1 class="text-2xl mb-4">NYC Boundaries</h1>

  {#each Object.entries(layers) as [key, value]}
    <button
      class={`block py-0.5 ${
        $activeBoundary === key && 'text-blue-500 font-semibold'
      }`}
      on:click={() => onLayerChange(key)}
    >
      {value.name_plural}
    </button>
  {/each}

  {#if boundariesIntersectingPolygon.length}
    <h2 class="text-xl my-2">
      <strong
        >{layers[$activeBoundary].name}
        {$selectedPolygon}</strong
      ><br />
      overlaps {boundariesIntersectingPolygon.length} districts
    </h2>
    {#each boundariesIntersectingPolygon as boundary}
      <div>
        {layers[boundary.id].name}
        {boundary.namecol}
      </div>
    {/each}
  {/if}
</nav>
