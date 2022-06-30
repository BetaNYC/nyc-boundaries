<script lang="ts">
  import { layers } from '../../assets/boundaries'
  import SidebarHeader from './SidebarHeader.svelte'

  export let onLayerChange: (boundaryId: any) => void
</script>

<SidebarHeader title="NYC Boundaries" onBack={null} />
Search by address or select a boundary to explore overlaps.
{#each Object.entries(layers) as [key, value]}
  <button
    on:click={() => onLayerChange(key)}
    class={`block py-1 px-2`}
    style="color: {value.textColor}"
  >
    {value.name_plural}
  </button>
{/each}
