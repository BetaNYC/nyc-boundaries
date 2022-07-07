<script lang="ts">
  import { selectedBoundaryMap } from '../../stores'
  import { layers } from '../../assets/boundaries'
  import SidebarHeader from './SidebarHeader.svelte'
</script>

<SidebarHeader title="NYC Boundaries" onBack={null} />
<div class="p-4 pt-0">
  <div class="mb-4 text-gray-500">Search by address or pick a boundary.</div>
  <div class="-mx-2 text-lg">
    {#each Object.entries(layers) as [key, value]}
      <button
        on:click={() => selectedBoundaryMap.set(key)}
        class="block py-1 px-2 rounded w-full text-left hover:bg-gray-100"
        style={`color: ${layers[key].textColor}`}
      >
        <span class="mr-1">
          {value.icon}
        </span>
        {value.name_plural}
      </button>
    {/each}
  </div>
</div>
