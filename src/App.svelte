<script lang="ts">
  import { activeBoundary, selectedPolygon } from './stores'
  import Map from './components/Map.svelte'
  import Sidebar from './components/Sidebar.svelte'
  import type { BoundaryId } from './assets/boundaries'
  import Controls from './components/Controls.svelte'

  function onLayerChange(id: BoundaryId) {
    selectedPolygon.set(null)
    activeBoundary.set(id)
  }
</script>

<main id="main" class="flex h-full absolute bottom-0 left-0 right-0">
  <Sidebar />
  <div class="relative flex flex-1">
    <Controls {onLayerChange} />
    <Map />
  </div>
</main>

<style global lang="postcss">
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>
