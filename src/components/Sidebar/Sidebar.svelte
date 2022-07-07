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

<nav id="sidebar" class="w-80 overflow-auto shadow-lg z-50 text-gray-900">
  {#if $selectedBoundaryMap && $selectedDistrict}
    <DistrictDetails />
  {:else if $selectedBoundaryMap && !$selectedDistrict}
    <BoundaryDetails />
  {:else if $selectedAddress}
    <AddressDetails />
  {:else}
    <DefaultDetails />
  {/if}
</nav>
