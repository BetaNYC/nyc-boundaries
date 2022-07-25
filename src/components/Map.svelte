<script lang="ts">
  import {
    selectedBoundaryMap,
    selectedDistrict,
    mapStore,
    hoveredDistrictId
  } from '../stores'
  import mapboxgl from 'mapbox-gl'
  import 'mapbox-gl/dist/mapbox-gl.css'
  import { layers } from '../assets/boundaries'
  import * as turf from '@turf/turf'
  import {
    findPolylabel,
    getDistrictFromSource,
    zoomToBound
  } from '../helpers/helpers'

  let map: mapboxgl.Map
  let isSourceLoaded = false
  let prevLayerId = null
  let prevDistrictId = null

  const defaultZoom: Partial<mapboxgl.MapboxOptions> = {
    zoom: 9.6,
    center: [-73.97647401326105, 40.70792852402042]
  }

  mapboxgl.accessToken =
    'pk.eyJ1IjoiemhpayIsImEiOiJjaW1pbGFpdHQwMGNidnBrZzU5MjF5MTJiIn0.N-EURex2qvfEiBsm-W9j7w'

  function initMap(container) {
    map = new mapboxgl.Map({
      container,
      style: 'mapbox://styles/evadecker/cl4g2eoa9005n14pff1g7gncb',
      minZoom: 9,
      maxZoom: 16,
      maxBounds: [
        [-74.66184938203348, 40.25252938803669], // Southwestern NYC bounds + buffer
        [-72.97034397052578, 41.282818272331866] // Northeastern NYC bounds + buffer
      ],
      ...defaultZoom
    })

    map.addControl(
      new mapboxgl.NavigationControl({ showCompass: false }),
      'bottom-right'
    )

    // Override default browser zoom hotkeys
    window.addEventListener(
      'keydown',
      e => {
        if (e.metaKey && (e.key === '=' || e.key === '-')) {
          e.preventDefault()
          e.key === '=' && map.zoomIn()
          e.key === '-' && map.zoomOut()
        }
      },
      true
    )

    map.on('click', () => onDistrictChange(null))

    $mapStore = map
    $mapStore.resize()

    return {
      destroy: () => {
        map.remove()
        map = null
        $mapStore = map
      }
    }
  }

  async function showMap(boundaryId: string) {
    if (prevLayerId) {
      // Remove previous layers
      $mapStore.getLayer(`${prevLayerId}-layer`) &&
        $mapStore.removeLayer(`${prevLayerId}-layer`)

      $mapStore.getLayer(`${prevLayerId}-stroke-layer`) &&
        $mapStore.removeLayer(`${prevLayerId}-stroke-layer`)

      $mapStore.getLayer(`${prevLayerId}-label-layer`) &&
        $mapStore.removeLayer(`${prevLayerId}-label-layer`)
    }

    // Load source if not already loaded
    if (!$mapStore.getSource(boundaryId)) {
      const url = `https://betanyc.carto.com/api/v2/sql/?q=${layers[boundaryId].sql}&api_key=2J6__p_IWwUmOHYMKuMYjw&format=geojson`
      const data = await fetch(url).then(res => res.json())

      $mapStore.addSource(boundaryId, {
        type: 'geojson',
        promoteId: 'namecol',
        data
      })

      $mapStore.addSource(`${boundaryId}-centerpoints`, {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: data.features.map(feature => {
            feature.geometry = {
              type: 'Point',
              coordinates: findPolylabel(feature)
            }
            return feature
          })
        }
      })

      $mapStore.on('sourcedata', source => {
        if (source.sourceId === boundaryId && source.isSourceLoaded) {
          const features = map.querySourceFeatures(boundaryId)
          isSourceLoaded = !!features.length
        }
      })
    }

    $mapStore
      .addLayer({
        id: `${boundaryId}-layer`,
        type: 'fill',
        source: boundaryId,
        paint: {
          'fill-color': layers[boundaryId].lineColor,
          'fill-opacity': [
            'case',
            ['boolean', ['feature-state', 'selected'], false],
            0.15,
            0.05
          ]
        }
      })
      .addLayer({
        id: `${boundaryId}-stroke-layer`,
        type: 'line',
        source: boundaryId,
        paint: {
          'line-color': layers[boundaryId].lineColor,
          'line-width': [
            'case',
            [
              'any',
              ['boolean', ['feature-state', 'hover'], false],
              ['boolean', ['feature-state', 'selected'], false]
            ],
            2.5,
            1
          ]
        }
      })
      .addLayer({
        id: `${boundaryId}-label-layer`,
        type: 'symbol',
        source: `${boundaryId}-centerpoints`,
        paint: {
          'text-color': layers[boundaryId].textColor,
          'text-halo-color': 'rgba(255,255,255,0.8)',
          'text-halo-width': 1
        },
        layout: {
          'text-field': ['get', 'namecol'],
          'text-size': ['interpolate', ['linear'], ['zoom'], 11, 12.5, 32, 60]
        }
      })

    const popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false
    })

    $mapStore.on('mousemove', `${boundaryId}-layer`, e => {
      $mapStore.getCanvas().style.cursor = 'pointer'

      if (e.features.length > 0) {
        if ($hoveredDistrictId !== null) {
          $mapStore.setFeatureState(
            { source: boundaryId, id: $hoveredDistrictId },
            { hover: false }
          )
        }
        $hoveredDistrictId = e.features[0].properties.namecol
        $mapStore.setFeatureState(
          { source: boundaryId, id: $hoveredDistrictId },
          { hover: true }
        )
      }

      popup
        .setLngLat(e.lngLat)
        .setHTML(
          `<div class="flex items-center -mb-1"><div class="text-2xl mr-2">${
            layers[boundaryId].icon
          }</div><div class="pr-1"><div class="text-xs text-gray-600">${
            layers[boundaryId].name
          }</div><div class="text-sm font-semibold">${layers[
            boundaryId
          ].formatContent(e.features[0].properties.namecol)}</div></div></div>`
        )
        .setOffset(8)
        .addTo(map)
    })

    $mapStore.on('mouseleave', `${boundaryId}-layer`, () => {
      $mapStore.getCanvas().style.cursor = ''

      if ($hoveredDistrictId !== null) {
        $mapStore.setFeatureState(
          { source: boundaryId, id: $hoveredDistrictId },
          { hover: false }
        )
      }

      $hoveredDistrictId = null

      popup.remove()
    })

    $mapStore.on('click', `${boundaryId}-layer`, e => {
      zoomToBound($mapStore, turf.bbox(e.features[0]))
      onDistrictChange(e.features[0].properties.namecol, true)
    })

    // Prepare for future boundary change
    prevLayerId = boundaryId
  }

  function onDistrictChange(
    districtId: string | null,
    interactionFromClick: boolean = false
  ) {
    // Remove existing clicked states
    if (prevDistrictId) {
      $mapStore?.setFeatureState(
        { source: $selectedBoundaryMap, id: prevDistrictId },
        { selected: false }
      )
    }

    if (districtId === null) {
      resetZoom()
    }

    $selectedDistrict = districtId

    // Fetch bbox from districtId, fly to bbox.
    // If there interaction came from a click, it will fly in before the function.
    if ($mapStore && $selectedBoundaryMap && $selectedDistrict) {
      if (!interactionFromClick) {
        const feature = getDistrictFromSource(
          $mapStore,
          $selectedBoundaryMap,
          $selectedDistrict
        )
        if (feature) {
          zoomToBound($mapStore, turf.bbox(feature))
        }
      }

      $mapStore.setFeatureState(
        { source: $selectedBoundaryMap, id: $selectedDistrict },
        { selected: true }
      )
    }

    prevDistrictId = $selectedDistrict
  }

  function resetZoom() {
    $mapStore?.flyTo(defaultZoom)
  }

  $: $mapStore && showMap($selectedBoundaryMap)
  $: isSourceLoaded && onDistrictChange($selectedDistrict)
</script>

<div id="map" class="flex-1 h-full" use:initMap />
