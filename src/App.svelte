<script lang="ts">
  import {
    selectedAddress,
    selectedBoundaryMap,
    selectedDistrict
  } from './stores'
  import Map from './components/Map.svelte'
  import Sidebar from './components/Sidebar.svelte'
  import type { BoundaryId } from './assets/boundaries'
  import Controls from './components/Controls.svelte'

  function onLayerChange(id: BoundaryId) {
    $selectedDistrict = null
    $selectedBoundaryMap = id
    $selectedAddress = null
  }
</script>

<main id="main" class="flex h-full absolute bottom-0 left-0 right-0">
  <div class="relative flex-1 order-last">
    <Controls {onLayerChange} />
    <Map />
  </div>
  <Sidebar />
</main>

<style global lang="postcss">
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>
