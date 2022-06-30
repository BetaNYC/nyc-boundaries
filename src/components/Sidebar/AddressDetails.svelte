<script lang="ts">
  import SidebarHeader from './SidebarHeader.svelte'
  import { selectedAddress } from '../../stores'

  export let onLayerChange: (boundaryId: any) => void
</script>

<SidebarHeader title={$selectedAddress.name} onBack={() => onLayerChange('')} />
