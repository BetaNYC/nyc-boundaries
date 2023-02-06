<script lang="ts">
  import { roundUp } from '../../assets/boundaries/format';
  export let layers: {};
  export let districts: any[];

  function updateClipboard() {
    if (districts.length === 0) return;

    const rows = Object.entries(layers).reduce((rows, layer) => {
      const [layerId, layerMeta]: [string, any] = layer;
      //filter for features with the layerId, then pull out the name and searea
      const features = districts
        .filter(district => district.properties?.id === layerId)
        .map(({ properties: { searea, area, namecol } }) => [
          layerMeta.name,
          namecol,
          searea / area
        ]);

      return [...rows, ...features];
    }, [] as any);

    navigator.clipboard.writeText(
      rows.map((lines: []) => lines.join('\t')).join('\n')
    );
  }
</script>

<button
  class="mb-2 mx-2 px-2 hover:bg-gray-200 
hover:text-blue-300 focus:outline-none focus:ring focus:ring-blue-500"
  on:click={updateClipboard}
  title="Copy overlaps to clipboard"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    class="h-4 w-4 inline-block"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#000"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path
      d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"
    />
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
  </svg>
</button>
