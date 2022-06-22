<script lang="ts">
  export let intersections = []
</script>

<ul id="boundaryIntersections">
  {#each intersections as intersection}
    <li>{intersection}</li>
  {/each}
</ul>

<style>
  #boundaryIntersections {
    position: fixed;
    top: 0;
    left: 0;
    background-color: white;
  }
</style>
