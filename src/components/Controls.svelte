<script lang="ts">
  import Search from './Search.svelte'
  export let onLayerChange: (boundaryId: any) => void
</script>

<nav class="absolute z-50 l flex left-3 right-3 top-3">
  <Search />
</nav>
