<script lang="ts">
  import { BoundaryId, layers } from '../assets/boundaries'

  export let activeLayer: BoundaryId
  export let onLayerChange: (boundaryId: any) => void
</script>

<nav id="sidebar">
  <h1>NYC Boundaries</h1>

  {#each Object.entries(layers) as [key, value]}
    <div>
      <button
        class={activeLayer === key ? 'active' : ''}
        on:click={() => onLayerChange(key)}
      >
        {value.name_plural}
      </button>
    </div>
  {/each}
</nav>

<style>
  #sidebar {
    width: 320px;
    padding: 8px;
    background-color: white;
    box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
    z-index: 10;
  }

  .active {
    color: blue;
  }
</style>
