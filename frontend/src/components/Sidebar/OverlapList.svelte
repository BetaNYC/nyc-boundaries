<script lang="ts">
  import {
    mapStore,
    selectedBoundaryMap,
    selectedDistrict,
    selectedCoordinates
  } from '../../stores';
  import { layers } from '../../assets/boundaries';
  import DistrictLink from './DistrictLink.svelte';
  import DistrictCopyClipboard from './DistrictCopyClipboard.svelte';
  import type { Feature } from 'geojson';

  import Loader from '../Loader.svelte';

  export let districts: Feature[];
  export let isLoading: boolean;

  function showIntersectingDistrict(feature: Feature) {
    if (!$mapStore.getSource('intersecting-layer')) {
      $mapStore.addSource('intersecting-layer', {
        type: 'geojson',
        data: feature
      });

      $mapStore.addLayer({
        id: 'intersecting-layer',
        type: 'fill',
        source: 'intersecting-layer',
        paint: {
          'fill-color': '#dd2727',
          'fill-opacity': 0.2
        }
      });

      $mapStore.addLayer({
        id: 'intersecting-stroke-layer',
        type: 'line',
        source: 'intersecting-layer',
        paint: {
          'line-color': '#bc0000',
          'line-width': 2
        }
      });
    }
  }

  function hideIntersectingDistrict() {
    if ($mapStore.getSource('intersecting-layer')) {
      $mapStore
        .removeLayer('intersecting-layer')
        .removeLayer('intersecting-stroke-layer')
        .removeSource('intersecting-layer');
    }
  }
</script>

{#if isLoading || !districts}
  <div class="px-4">
    <Loader />
  </div>
{:else if districts.length === 0}
  <div class="px-4">
    Couldn't load any districts. {$selectedCoordinates &&
      'Make sure you select coordinates within NYC.'}
  </div>
{:else}
  <div class="flex items-ceter place-content-between">
    <h3 class="block text-lg mb-2 px-4 text-black-600 font-medium">Overlaps</h3>
    <DistrictCopyClipboard {layers} {districts} />
  </div>
  {#each Object.entries(layers).filter(([key, _]) => key !== $selectedBoundaryMap) as [key, value]}
    {#if districts.filter(district => district.properties?.id === key).length}
      <div class="mb-1 w-full">
        <div class="block text-sm text-gray-600 pt-1.5 px-4">
          {#if districts.filter(district => district.properties?.id === key).length <= 1}
            {value.name}
          {:else}
            {value.name_plural}
          {/if}
        </div>
        <div class="w-full">
          {#each districts.filter(district => district.properties?.id === key) as district}
            <DistrictLink
              onMouseOver={() => showIntersectingDistrict(district)}
              onMouseOut={() => hideIntersectingDistrict()}
              onClick={() => {
                $selectedBoundaryMap = district.properties?.id;
                $selectedDistrict = district.properties?.namecol;
                hideIntersectingDistrict();
              }}
              icon={layers[district.properties?.id].icon}
              nameCol={district.properties?.namecol}
              intersection_pct={district.properties?.intersection_pct}
              formatContent={layers[district.properties?.id].formatContent}
              formatUrl={layers[district.properties?.id].formatUrl}
            />
          {/each}
        </div>
      </div>
    {/if}
  {/each}
{/if}
