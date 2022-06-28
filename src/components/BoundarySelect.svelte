<script lang="ts">
  import { activeBoundary, selectedPolygon } from '../stores'
  import { layers } from '../assets/boundaries'
  export let onLayerChange: (boundaryId: any) => void
</script>

<select
  bind:value={$activeBoundary}
  on:change={() => onLayerChange($activeBoundary)}
  class="block p-2 shadow-md rounded focus:outline-none focus:ring focus:ring-blue-500"
>
  <option value="" disabled>Explore boundaries</option>
  {#each Object.entries(layers) as [key, value]}
    <option value={key}>
      {value.name_plural}
    </option>
  {/each}
</select>
