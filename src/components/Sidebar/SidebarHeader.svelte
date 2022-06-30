<script lang="ts">
  import {} from '../../stores'

  export let title: string
  export let onBack
</script>

<header class="flex mb-4">
  {#if onBack}
    <button
      on:click={onBack}
      class="w-8 h-8 mr-2 -ml-1 text-lg flex justify-center items-center rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-800"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fill-rule="evenodd"
          d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
          clip-rule="evenodd"
        />
      </svg>
    </button>
  {/if}
  <h1 class="text-xl flex-1 mt-0.5">{title}</h1>
</header>
