<script lang="ts">
  import { activeBoundary, selectedPolygon } from '../stores'
  import { onMount } from 'svelte'
  import mapboxgl from 'mapbox-gl'
  import 'mapbox-gl/dist/mapbox-gl.css'
  import { BoundaryId, layers } from '../assets/boundaries'
  import * as turf from '@turf/turf'
  import { findPolylabel } from '../helpers/helpers'

  let map: mapboxgl.Map
  let prevLayerId = null
  let hoveredStateId = null

  mapboxgl.accessToken =
    'pk.eyJ1IjoiemhpayIsImEiOiJjaW1pbGFpdHQwMGNidnBrZzU5MjF5MTJiIn0.N-EURex2qvfEiBsm-W9j7w'

  onMount(() => {
    map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/evadecker/cl4g2eoa9005n14pff1g7gncb',
      zoom: 10,
      minZoom: 9,
      maxZoom: 16,
      bounds: [
        [-74.27092628873937, 40.49174581468662], // Southwestern NYC bounds
        [-73.70513039814229, 40.89159119957167] // Northeastern NYC bounds
      ],
      maxBounds: [
        [-74.66184938203348, 40.25252938803669], // Southwestern NYC bounds + buffer
        [-73.36408936343365, 41.11995678583111] // Northeastern NYC bounds + buffer
      ]
    })

    map.addControl(
      new mapboxgl.NavigationControl({ showCompass: false }),
      'top-left'
    )
  })

  async function showBoundary(boundaryId: BoundaryId) {
    const currentLayer = layers[boundaryId]

    // Remove previous layer
    if (prevLayerId) {
      map
        .removeLayer(`${prevLayerId}-layer`)
        .removeLayer(`${prevLayerId}-stroke-layer`)
        .removeLayer(`${prevLayerId}-label-layer`)
    }

    // Load source if not already loaded
    if (!map.getSource(boundaryId)) {
      const url = `https://betanyc.carto.com/api/v2/sql/?q=${layers[boundaryId].sql}&api_key=2J6__p_IWwUmOHYMKuMYjw&format=geojson`
      const data = await fetch(url).then(res => res.json())

      map.addSource(boundaryId, { type: 'geojson', data })
      map.addSource(`${boundaryId}-centerpoints`, {
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
    }

    // Add Layers
    map.addLayer({
      id: `${boundaryId}-layer`,
      type: 'fill',
      source: boundaryId,
      paint: {
        'fill-color': currentLayer.lineColor,
        'fill-opacity': [
          'case',
          ['boolean', ['feature-state', 'hover'], false],
          0.2,
          0.05
        ]
      }
    })

    map.addLayer({
      id: `${boundaryId}-stroke-layer`,
      type: 'line',
      source: boundaryId,
      paint: {
        'line-color': currentLayer.lineColor,
        'line-width': 1.5
      }
    })

    map.addLayer({
      id: `${boundaryId}-label-layer`,
      type: 'symbol',
      source: `${boundaryId}-centerpoints`,
      paint: {
        'text-color': currentLayer.textColor,
        'text-halo-color': 'rgba(255,255,255,0.8)',
        'text-halo-width': 1
      },
      layout: {
        'text-field': ['get', 'namecol'],
        'text-size': ['interpolate', ['linear'], ['zoom'], 11, 12.5, 28, 40]
      }
    })

    const popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false
    })

    map.on('mousemove', `${boundaryId}-layer`, e => {
      map.getCanvas().style.cursor = 'pointer'

      if (e.features.length > 0) {
        if (hoveredStateId !== null) {
          map.setFeatureState(
            { source: boundaryId, id: hoveredStateId },
            { hover: false }
          )
        }
        hoveredStateId = e.features[0].properties.namecol
        map.setFeatureState(
          { source: boundaryId, id: hoveredStateId },
          { hover: true }
        )
      }

      popup
        .setLngLat(e.lngLat)
        .setHTML(
          `<span>${currentLayer.name} <strong>${e.features[0].properties.namecol}</strong></span>`
        )
        .setOffset(10)
        .addTo(map)
    })

    map.on('mouseleave', `${boundaryId}-layer`, () => {
      map.getCanvas().style.cursor = ''

      if (hoveredStateId !== null) {
        map.setFeatureState(
          { source: boundaryId, id: hoveredStateId },
          { hover: false }
        )
      }
      hoveredStateId = null

      popup.remove()
    })

    map.on('click', `${boundaryId}-layer`, e => {
      // Turf's bbox can return either Box2D (4-item array) or Box3D (6-item array)
      // fitBounds() only accepts a 4-item array, so we need to save the output before using it
      // See https://github.com/Turfjs/turf/issues/1807
      const [x1, y1, x2, y2] = turf.bbox(e.features[0])

      map.fitBounds([x1, y1, x2, y2], {
        padding: 200,
        maxZoom: 16
      })

      $selectedPolygon = e.features[0].properties.namecol
    })

    // Prepare for future boundary change
    prevLayerId = boundaryId
  }

  $: {
    map && showBoundary($activeBoundary)
  }
</script>

<div id="map" />

<style>
  #map {
    flex: 1;
  }
</style>
