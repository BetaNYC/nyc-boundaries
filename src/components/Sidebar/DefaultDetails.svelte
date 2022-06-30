<script lang="ts">
  import { layers } from '../../assets/boundaries'
  import SidebarHeader from './SidebarHeader.svelte'

  export let onLayerChange: (boundaryId: any) => void
</script>

<SidebarHeader title="NYC Boundaries" onBack={null} />
<div class="mb-4 text-gray-500">Search by address or pick a boundary.</div>
<div class="-mx-2">
  {#each Object.entries(layers) as [key, value]}
    <button
      on:click={() => onLayerChange(key)}
      class="block py-1 px-2 rounded w-full text-left hover:bg-gray-100 "
      style="color: {value.textColor}"
    >
      {value.name_plural}
    </button>
  {/each}
</div>
