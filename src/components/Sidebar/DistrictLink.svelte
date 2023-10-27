<script lang="ts">
  export let onMouseOver: () => void;
  export let onMouseOut: () => void;
  export let onClick: () => void;
  export let formatContent: Function;
  export let formatUrl: Function | undefined = undefined;
  export let nameCol: string;
  export let area: number;
  export let searea: number;
  export let icon: string;

  $: intersectingPercentage = ((searea / area) * 100).toFixed(1) + '%';
</script>

<div
  class="flex items-stretch hover:bg-gray-100 focus-within:bg-gray-100 focus:z-10"
  on:mouseover={onMouseOver}
  on:focus={onMouseOver}
  on:mouseleave={onMouseOut}
  on:blur={onMouseOut}
>
  <button
    on:click={onClick}
    class="flex-1 flex text-left py-1 px-4 focus:outline-none focus:ring focus:ring-blue-500 focus:z-10"
  >
    <div class="mr-2">{icon}</div>
    <div class="flex flex-row justify-between w-full">
      <div class="flex flex-row">
        {formatContent(nameCol)}
      </div>
      {#if area}
        <p class="text-gray-500 tabular-nums ml-2">
          {intersectingPercentage}
        </p>
      {/if}
    </div>
  </button>
  {#if formatUrl}
    <a
      href={formatUrl(nameCol)}
      class="flex items-center py-1 px-3 -ml-4 text-gray-400
              hover:text-gray-900 focus:outline-none focus:ring focus:ring-blue-500"
      target="_blank"
      title="Visit district {nameCol}'s webpage"
      rel="noreferrer"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"
        />
        <path
          d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"
        />
      </svg>
    </a>
  {/if}
</div>
