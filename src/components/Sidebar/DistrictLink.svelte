<script lang="ts">
  export let onMouseOver: () => void
  export let onMouseOut: () => void
  export let onClick: () => void
  export let color: string
  export let text: string
</script>

<button
  on:mouseover={onMouseOver}
  on:focus={onMouseOver}
  on:mouseout={onMouseOut}
  on:blur={onMouseOut}
  on:click={onClick}
  class="relative inline-block tabular-nums bg-white text-left py-0.5 px-2 rounded hover:bg-gray-100 focus:bg-gray-100 focus:outline-none focus:ring focus:ring-blue-500 focus:z-10"
  style="color: {color}"
>
  {text}
</button>
