<script lang="ts">
  import { onMount } from 'svelte'
  import mapboxgl from 'mapbox-gl'
  import 'mapbox-gl/dist/mapbox-gl.css'
  import BoundariesList from './BoundariesList.svelte'
  import type { Boundary } from '../assets/boundaries'
  import { boundariesData } from '../assets/boundaries'
  import * as turf from '@turf/turf'
  import booleanIntersects from '@turf/boolean-intersects'
  import { findPolylabel } from '../helpers/helpers'

  let boundariesIntersectingSelection = []
  mapboxgl.accessToken =
    'pk.eyJ1IjoiemhpayIsImEiOiJjaW1pbGFpdHQwMGNidnBrZzU5MjF5MTJiIn0.N-EURex2qvfEiBsm-W9j7w'

  export let activeLayer: Boundary

  function queryFromLatLng(latitude, longitude, label = null) {
    const intersectsUrl = `https://betanyc.carto.com/api/v2/sql/?q=SELECT * FROM all_bounds WHERE ST_Intersects(ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326),the_geom) &api_key=2J6__p_IWwUmOHYMKuMYjw`
    fetch(intersectsUrl)
      .then(res => res.json())
      .then(({ rows }) => {
        boundariesIntersectingSelection = rows
      })
  }

  onMount(() => {
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/evadecker/cl4g2eoa9005n14pff1g7gncb',
      zoom: 10,
      minZoom: 9,
      maxZoom: 18,
      bounds: [
        [-74.27092628873937, 40.49174581468662], // Southwestern NYC bounds
        [-73.70513039814229, 40.89159119957167] // Northeastern NYC bounds
      ],
      maxBounds: [
        [-74.66184938203348, 40.25252938803669], // Southwestern NYC bounds + buffer
        [-73.36408936343365, 41.11995678583111] // Northeastern NYC bounds + buffer
      ]
    })

    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }))

    function loadLayer(boundaryId: Boundary) {
      const { geojson, label } = boundariesData.find(
        obj => obj.id === boundaryId
      )

      const layers = map.getStyle().layers
      let hoveredStateId = null

      // Find the index of the first symbol layer in the map style
      let firstSymbolId: string
      for (const layer of layers) {
        if (layer.type === 'symbol') {
          firstSymbolId = layer.id
          break
        }
      }

      map.addSource(boundaryId, { type: 'geojson', data: geojson })

      map.addLayer(
        {
          id: `${boundaryId}-layer`,
          type: 'fill',
          source: boundaryId,
          paint: {
            'fill-color': [
              'case',
              ['boolean', ['feature-state', 'hover'], false],
              'rgba(9, 85, 182, 0.1)',
              'rgba(9, 85, 182, 0.05)'
            ]
          }
        },
        firstSymbolId
      )

      map.addLayer(
        {
          id: `${boundaryId}-stroke-layer`,
          type: 'line',
          source: boundaryId,
          paint: {
            'line-color': 'rgba(9, 85, 182, 0.8)',
            'line-width': 1.5
          }
        },
        firstSymbolId
      )

      map.on('mousemove', `${boundaryId}-layer`, e => {
        map.getCanvas().style.cursor = 'pointer'

        if (e.features.length > 0) {
          if (hoveredStateId !== null) {
            map.setFeatureState(
              { source: boundaryId, id: hoveredStateId },
              { hover: false }
            )
          }
          hoveredStateId = e.features[0].id
          map.setFeatureState(
            { source: boundaryId, id: hoveredStateId },
            { hover: true }
          )
        }
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

        // const intersectingDistricts =
        //   cityCouncilDistrictBoundaries.features.filter(feature =>
        //     booleanIntersects(feature.geometry, e.features[0].geometry as any)
        //   )

        // console.log(intersectingDistricts)
      })

      map.addSource(`${boundaryId}-centerpoints`, {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: geojson.features.map(feature => {
            feature.geometry = {
              type: 'Point',
              coordinates: findPolylabel(feature)
            }
            return feature
          })
        }
      })

      map.addLayer({
        id: `${boundaryId}-label-layer`,
        type: 'symbol',
        source: `${boundaryId}-centerpoints`,
        paint: {
          'text-color': 'rgba(9, 85, 182, 1)',
          'text-halo-color': 'rgba(255,255,255,0.8)',
          'text-halo-width': 1
        },
        layout: {
          'text-field': ['get', label],
          'text-size': 11.5
        }
      })
    }

    map.on('load', () => {
      // Handle coordinate click
      map.on('click', e => {
        const { lat, lng } = e.lngLat
        queryFromLatLng(lat, lng)
      })

      loadLayer(activeLayer)
    })
  })
</script>

<div id="map" />
<BoundariesList boundaries={boundariesIntersectingSelection} />

<style>
  #map {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
  }
</style>
