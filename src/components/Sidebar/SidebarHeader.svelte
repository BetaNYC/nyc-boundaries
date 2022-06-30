<script lang="ts">
  import {} from '../../stores'

  export let title: string
  export let onBack
</script>

<header class="flex mb-4">
  {#if onBack}
    <button
      on:click={onBack}
      class="w-8 h-8 mr-2 -ml-1 text-lg rounded-full hover:bg-gray-100"
      >&larr;</button
    >
  {/if}
  <h1 class="text-xl flex-1 mt-0.5">{title}</h1>
</header>
