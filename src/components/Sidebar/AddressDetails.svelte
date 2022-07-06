<script lang="ts">
  import SidebarHeader from './SidebarHeader.svelte'
  import { selectedAddress, mapStore } from '../../stores'
  import { layers } from '../../assets/boundaries'
  import type { GeoJSONSource } from 'mapbox-gl'

  export let onLayerChange: (boundaryId: any) => void

  let districtsIntersectingAddress

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

  async function queryAllDistrictsForCoordinates(lng: number, lat: number) {
    districtsIntersectingAddress = []
    const intersectsUrl = `https://betanyc.carto.com/api/v2/sql/?q=SELECT * FROM all_bounds WHERE ST_Intersects(ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326),the_geom)&api_key=2J6__p_IWwUmOHYMKuMYjw&format=geojson`
    await fetch(intersectsUrl)
      .then(res => res.json())
      .then(({ features }) => (districtsIntersectingAddress = features))
  }

  $: $selectedAddress &&
    queryAllDistrictsForCoordinates(
      $selectedAddress.coords[0],
      $selectedAddress.coords[1]
    )
</script>

<SidebarHeader title={$selectedAddress.name} onBack={() => onLayerChange('')} />

<div class="p-4 pt-0">
  {#each districtsIntersectingAddress as district}
    <div
      on:mouseover={() => showIntersectingDistrict(district)}
      on:focus={() => showIntersectingDistrict(district)}
      on:mouseout={() => hideIntersectingDistrict()}
      on:blur={() => hideIntersectingDistrict()}
    >
      {layers[district.properties.id].name}
      {district.properties.namecol}
    </div>
  {/each}
</div>
