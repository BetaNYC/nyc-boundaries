<script lang="ts">
  import {
    mapStore,
    selectedBoundaryMap,
    selectedDistrict,
    selectedCoordinates
  } from '../../stores'
  import { layers } from '../../assets/boundaries'
  import DistrictLink from './DistrictLink.svelte'
  import type { Feature } from 'geojson'
  import type { GeoJSONSource } from 'mapbox-gl'
  import Loader from '../Loader.svelte'

  export let districts: Feature[]
  export let isLoading: boolean

  function showIntersectingDistrict(geojson) {
    if (!$mapStore.getSource('intersecting-layer')) {
      $mapStore.addSource('intersecting-layer', {
        type: 'geojson',
        data: geojson
      })

      $mapStore.addLayer({
        id: 'intersecting-layer',
        type: 'fill',
        source: 'intersecting-layer',
        paint: {
          'fill-color': '#7c3aed',
          'fill-opacity': 0.2
        }
      })

      $mapStore.addLayer({
        id: 'intersecting-stroke-layer',
        type: 'line',
        source: 'intersecting-layer',
        paint: {
          'line-color': '#7c3aed',
          'line-width': 2.5
        }
      })
    }

    // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/14877
    ;($mapStore.getSource('intersecting-layer') as GeoJSONSource).setData(
      geojson
    )
  }

  function hideIntersectingDistrict() {
    if ($mapStore.getSource('intersecting-layer')) {
      $mapStore
        .removeLayer('intersecting-layer')
        .removeLayer('intersecting-stroke-layer')
        .removeSource('intersecting-layer')
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
  {#each Object.entries(layers).filter(([key, _]) => key !== $selectedBoundaryMap) as [key, value]}
    {#if districts.filter(district => district.properties.id === key).length}
      <div class="mb-1 w-full">
        <div class="block text-sm text-gray-600 pt-1.5 px-4">
          {#if districts.filter(district => district.properties.id === key).length <= 1}
            {value.name}
          {:else}
            {value.name_plural}
          {/if}
        </div>
        <div class="w-full">
          {#each districts.filter(district => district.properties.id === key) as district}
            <DistrictLink
              onMouseOver={() => showIntersectingDistrict(district)}
              onMouseOut={() => hideIntersectingDistrict()}
              onClick={() => {
                $selectedBoundaryMap = district.properties.id
                $selectedDistrict = district.properties.namecol
                hideIntersectingDistrict()
              }}
              icon={layers[district.properties.id].icon}
              nameCol={district.properties.namecol}
              formatContent={layers[district.properties.id].formatContent}
              formatUrl={layers[district.properties.id].formatUrl}
            />
          {/each}
        </div>
      </div>
    {/if}
  {/each}
{/if}
