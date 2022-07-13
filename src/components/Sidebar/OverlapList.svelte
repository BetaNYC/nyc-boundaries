<script lang="ts">
  import { mapStore, selectedBoundaryMap, selectedDistrict } from '../../stores'
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
          'fill-color': layers[geojson.properties.id].lineColor,
          'fill-opacity': 0.15
        }
      })

      $mapStore.addLayer({
        id: 'intersecting-stroke-layer',
        type: 'line',
        source: 'intersecting-layer',
        paint: {
          'line-color': layers[geojson.properties.id].lineColor,
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
  <Loader />
{:else}
  {#each Object.entries(layers).filter(([key, _]) => key !== $selectedBoundaryMap) as [key, value]}
    {#if districts.filter(district => district.properties.id === key).length}
      <div class="mb-2 flex">
        <div class="mr-1 text-2xl">
          {value.icon}
        </div>
        <div class="pl-2">
          <div class="block text-sm text-gray-600 pt-1.5">
            {#if districts.filter(district => district.properties.id === key).length <= 1}
              {value.name}
            {:else}
              {value.name_plural}
            {/if}
          </div>
          <div class="-ml-2">
            {#each districts.filter(district => district.properties.id === key) as district}
              <DistrictLink
                onMouseOver={() => showIntersectingDistrict(district)}
                onMouseOut={() => hideIntersectingDistrict()}
                onClick={() => {
                  $selectedBoundaryMap = district.properties.id
                  $selectedDistrict = district.properties.namecol
                  hideIntersectingDistrict()
                }}
                nameCol={district.properties.namecol}
                formatContent={layers[district.properties.id].formatContent}
                color={layers[district.properties.id].textColor}
              />
            {/each}
          </div>
        </div>
      </div>
    {/if}
  {/each}
{/if}
