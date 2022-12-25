<script lang="ts">
  import { selectedBoundaryMap } from '../../stores';
  import { layers } from '../../assets/boundaries';
  import SidebarHeader from './SidebarHeader.svelte';
</script>

<SidebarHeader title="NYC Boundaries" />
<div class="py-4">
  <div class="mb-4 px-4 text-gray-500">
    Search by address or pick a boundary. 
  </div>
  <div class="mb-4 px-4 text-gray-400 leading-4 italic"><strong>Note:</strong> Boundaries reflect post-redistricting. Some links will not redirect properly, until the new year.</div>
  {#each Object.entries(layers) as [key, value]}
    <button
      on:click={() => selectedBoundaryMap.set(key)}
      class="block py-1 px-4 w-full text-left hover:bg-gray-100"
    >
      <span class="mr-1">
        {value.icon}
      </span>
      {value.name_plural}
    </button>
  {/each}
</div>
