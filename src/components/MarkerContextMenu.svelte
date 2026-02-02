<script lang="ts">
  import { contextMenuState } from '../stores';
  import { onMount, onDestroy } from 'svelte';

  let copied = false;
  let copyTimeout: ReturnType<typeof setTimeout>;

  function formatCoordinates(lng: number, lat: number): string {
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  }

  async function copyToClipboard() {
    if (!$contextMenuState) return;

    const { lng, lat } = $contextMenuState.coordinates;
    const text = formatCoordinates(lng, lat);

    await navigator.clipboard.writeText(text);
    copied = true;

    clearTimeout(copyTimeout);
    copyTimeout = setTimeout(() => {
      copied = false;
      closeMenu();
    }, 1500);
  }

  function closeMenu() {
    contextMenuState.set(null);
    copied = false;
  }

  function handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.marker-context-menu')) {
      closeMenu();
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      closeMenu();
    }
  }

  onMount(() => {
    document.addEventListener('click', handleClickOutside);
    document.addEventListener('keydown', handleKeydown);
  });

  onDestroy(() => {
    document.removeEventListener('click', handleClickOutside);
    document.removeEventListener('keydown', handleKeydown);
    clearTimeout(copyTimeout);
  });
</script>

{#if $contextMenuState}
  <div
    class="marker-context-menu fixed z-50 bg-white rounded shadow-lg border border-gray-200 py-1"
    style="left: {$contextMenuState.position.x}px; top: {$contextMenuState.position.y}px;"
  >
    <button
      on:click={copyToClipboard}
      class="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
    >
      <div class="flex items-center justify-between">
        <span class="text-gray-700">
          {formatCoordinates($contextMenuState.coordinates.lng, $contextMenuState.coordinates.lat)}
        </span>
        {#if copied}
          <span class="text-green-600 text-xs ml-2">Copied!</span>
        {:else}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4 text-gray-400 ml-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
        {/if}
      </div>
    </button>
  </div>
{/if}
