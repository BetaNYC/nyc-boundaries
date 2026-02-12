<script lang="ts">
  import { writable } from 'svelte/store';
  import { showSupabaseConnectionErrorPopup } from '../stores';

  function closePopup() {
    showSupabaseConnectionErrorPopup.set(false);
  }
</script>

{#if $showSupabaseConnectionErrorPopup}
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    aria-modal="true"
    role="dialog"
  >
    <div
      class="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4"
      role="document"
    >
      <h2 class="text-xl font-semibold mb-4 text-gray-800">
        Network Connection Issue
      </h2>
      <p class="mb-4 text-gray-600">
        It appears your network might be blocking access to our database
        provider (Supabase). This can prevent some application features from
        working correctly.
      </p>
      <p class="mb-1 text-gray-600">
        Please contact your system administrator and request them to whitelist
        connections to the following domains:
      </p>
      <ul class="list-disc list-inside mb-4 pl-4 text-gray-600">
        <li><code class="bg-gray-200 px-1 rounded">*.supabase.co</code></li>
        <li><code class="bg-gray-200 px-1 rounded">*.supabase.io</code></li>
      </ul>
      <p class="mb-6 text-sm text-gray-500">
        Please help us address this issue by following out
        <a href="https://airtable.com/app0cDN8q0HC1HqPV/pagiDPpQRwe1xTRjr/form" class="text-blue-500 hover:underline">this form.</a>
      </p>
      <p class="mb-6 text-sm text-gray-500">
        If the issue persists after whitelisting, please contact lab@beta.nyc.
      </p>
      <div class="flex justify-end">
        <button
          on:click={closePopup}
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Close
        </button>
      </div>
    </div>
  </div>
{/if} 