<script lang="ts">
  export let boundaries = [];
</script>

<ul id="current">
  {#each boundaries as boundary}
    <li>{boundary.id} {boundary.namecol}</li>
  {/each}
</ul>

<style>
  #current {
    position: fixed;
    top: 0;
    left: 0;
    background-color: white;
  }
</style>
