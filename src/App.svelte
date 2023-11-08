<script lang="ts">
  import {
    selectedAddress,
    selectedBoundaryMap,
    selectedCoordinates,
    selectedDistrict
  } from './stores';
  import Map from './components/Map.svelte';
  import Sidebar from './components/Sidebar/Sidebar.svelte';
  import Controls from './components/Controls.svelte';
  import { onMount } from 'svelte';
  import { layers } from './assets/boundaries/index'

  const params = new URLSearchParams(window.location.search);

  let redirected = false
  let redirect_url = ''

  onMount(async()=> {
    //redirect if needed
    if(params.get('redirect')){
      redirected = true
      const boundaryId = params.get('map') ?? 'ss'
      const district = params.get('dist') ?? '0'
      // @ts-ignore
      const url = await layers[boundaryId].redirectUrl(district)
      redirect_url = url
      window.location.href = url
    }
  })

  $: {
    $selectedDistrict
      ? params.set('dist', $selectedDistrict)
      : params.delete('dist');

    $selectedBoundaryMap
      ? params.set('map', $selectedBoundaryMap)
      : params.delete('map');

    $selectedAddress && $selectedAddress.name
      ? params.set('addr', $selectedAddress.name)
      : params.delete('addr');

    if ($selectedCoordinates) {
      params.set('lng', $selectedCoordinates.lng.toString());
      params.set('lat', $selectedCoordinates.lat.toString());
    } else {
      params.delete('lng');
      params.delete('lat');
    }

    window.history.replaceState({}, '', `${location.pathname}?${params}`);
  }
</script>

{#if redirected}
<div class="grid h-screen place-items-center">
  <h2 class="text-2xl">You are being redirected...</h2>
  {#if redirect_url}
    <p>If you are stuck, try the following: <a class="underline text-blue-600" href="{redirect_url}">{redirect_url}</a></p>
  {/if}
</div>
{:else}
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
{/if}