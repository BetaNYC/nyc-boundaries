<script lang="ts">
  import { activeBoundary, selectedPolygon } from './stores'
  import Map from './components/Map.svelte'
  import Sidebar from './components/Sidebar.svelte'
  import type { BoundaryId } from './assets/boundaries'

  function onLayerChange(id: BoundaryId) {
    activeBoundary.set(id)
    selectedPolygon.set(null)
  }
</script>

<main id="main" class="flex h-full absolute bottom-0 left-0 right-0">
  <Sidebar {onLayerChange} />
  <Map />
</main>

<style global lang="postcss">
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>
