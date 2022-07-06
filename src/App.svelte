<script lang="ts">
  import {
    selectedAddress,
    selectedBoundaryMap,
    selectedDistrict
  } from './stores'
  import Map from './components/Map.svelte'
  import Sidebar from './components/Sidebar/Sidebar.svelte'
  import Controls from './components/Controls.svelte'
  import { onLayerChange } from './helpers/helpers'

  const params = new URLSearchParams(window.location.search)

  $: {
    $selectedDistrict === null
      ? params.delete('district')
      : params.set('district', $selectedDistrict)

    $selectedBoundaryMap === ''
      ? params.delete('boundary')
      : params.set('boundary', $selectedBoundaryMap)

    // $selectedAddress === undefined
    //   ? params.delete('address')
    //   : $selectedAddress.name && params.set('address', $selectedAddress.name)

    params !== undefined
      ? window.history.replaceState({}, '', `${location.pathname}?${params}`)
      : window.history.replaceState({}, '', location.pathname)
  }
</script>

<main id="main" class="flex h-full absolute bottom-0 left-0 right-0">
  <div class="relative flex-1 order-last">
    <Controls />
    <Map />
  </div>
  <Sidebar {onLayerChange} />
</main>
