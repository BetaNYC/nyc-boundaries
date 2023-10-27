<script lang="ts">
  export let layers: {};
  export let districts: any[];
  export let buttonText: string = 'Copy to clipboard';

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

    buttonText = 'Copied!';
  }
</script>

<button
  class="mb-2 mx-2 px-2 py-0.5 text-gray-500 rounded hover:bg-gray-200
hover:text-gray-900 focus:outline-none focus:ring focus:ring-blue-500"
  on:click={updateClipboard}
  title="Copy overlaps to clipboard"
>
  {buttonText}
</button>
