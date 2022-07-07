<script lang="ts">
  import {
    selectedAddress,
    selectedBoundaryMap,
    selectedDistrict
  } from '../../stores'
  import DefaultDetails from './DefaultDetails.svelte'
  import AddressDetails from './AddressDetails.svelte'
  import BoundaryDetails from './BoundaryDetails.svelte'
  import DistrictDetails from './DistrictDetails.svelte'
</script>

<nav
  id="sidebar"
  class="w-80 overflow-auto shadow-lg z-50 text-gray-900 flex flex-col"
>
  <div class="flex-1">
    {#if $selectedBoundaryMap && $selectedDistrict}
      <DistrictDetails />
    {:else if $selectedBoundaryMap && !$selectedDistrict}
      <BoundaryDetails />
    {:else if $selectedAddress}
      <AddressDetails />
    {:else}
      <DefaultDetails />
    {/if}
  </div>
  <footer class="p-4 pt-2 flex">
    <span class="flex-1">A <a href="https://beta.nyc">BetaNYC</a> Tool</span>
    <div>
      <a
        class="text-sm text-gray-500 underline hover:text-gray-700"
        href="https://github.com/BetaNYC/nyc-boundaries/blob/master/LICENSE"
        >License</a
      >
      <a
        class="text-sm text-gray-500 underline hover:text-gray-700"
        href="https://github.com/BetaNYC/nyc-boundaries">Github</a
      >
    </div>
  </footer>
</nav>
