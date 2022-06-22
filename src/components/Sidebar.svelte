<script lang="ts">
  import type { IBoundary, BoundaryId } from 'src/assets/boundaries'

  export let boundaries: IBoundary[]
</script>

<nav id="sidebar">
  <h1>NYC Boundaries</h1>

  {#each boundaries as boundary}
    <div>{`${boundary.name}s`}</div>
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
</style>
