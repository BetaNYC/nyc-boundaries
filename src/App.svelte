<script lang="ts">
  import {
    selectedAddress,
    selectedBoundaryMap,
    selectedDistrict
  } from './stores'
  import Map from './components/Map.svelte'
  import Sidebar from './components/Sidebar/Sidebar.svelte'
  import Controls from './components/Controls.svelte'

  const params = new URLSearchParams(window.location.search)

  $: {
    $selectedDistrict
      ? params.set('dist', $selectedDistrict)
      : params.delete('dist')

    $selectedBoundaryMap
      ? params.set('map', $selectedBoundaryMap)
      : params.delete('map')

    $selectedAddress && $selectedAddress.name
      ? params.set('addr', $selectedAddress.name)
      : params.delete('addr')

    window.history.replaceState({}, '', `${location.pathname}?${params}`)
  }
</script>

<main
  id="main"
  class="flex flex-col md:flex-row h-full absolute bottom-0 left-0 right-0"
>
  <Sidebar />
  <div class="relative flex-1 order-first md:order-last">
    <Controls />
    <Map />
  </div>
</main>
