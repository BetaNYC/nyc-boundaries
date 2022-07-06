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

  export let onLayerChange: (boundaryId: any) => void
</script>

<nav id="sidebar" class="w-80 overflow-auto shadow-lg z-50 text-gray-900">
  {#if $selectedBoundaryMap && $selectedDistrict}
    <DistrictDetails {onLayerChange} />
  {:else if $selectedBoundaryMap && !$selectedDistrict}
    <BoundaryDetails {onLayerChange} />
  {:else if $selectedAddress}
    <AddressDetails {onLayerChange} />
  {:else}
    <DefaultDetails {onLayerChange} />
  {/if}
</nav>
