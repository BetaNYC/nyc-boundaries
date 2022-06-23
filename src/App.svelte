<script lang="ts">
  import { activeBoundary } from './stores'
  import Map from './components/Map.svelte'
  import Sidebar from './components/Sidebar.svelte'
</script>

<main id="main" class="flex h-full absolute bottom-0 left-0 right-0">
  <Sidebar onLayerChange={id => activeBoundary.set(id)} />
  <Map />
</main>

<style global lang="postcss">
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>
