<script lang="ts">
  import { onMount } from 'svelte'
  import mapboxgl from 'mapbox-gl'
  import 'mapbox-gl/dist/mapbox-gl.css'
  import { BoundaryId, layers } from '../assets/boundaries'
  import * as turf from '@turf/turf'
  import booleanIntersects from '@turf/boolean-intersects'
  import { findPolylabel } from '../helpers/helpers'

  export let activeLayer: BoundaryId

  let boundariesIntersectingSelection = []
  let boundariesIntersectingPolygon = []
  let map: mapboxgl.Map

  mapboxgl.accessToken =
    'pk.eyJ1IjoiemhpayIsImEiOiJjaW1pbGFpdHQwMGNidnBrZzU5MjF5MTJiIn0.N-EURex2qvfEiBsm-W9j7w'

  // function queryFromLatLng(latitude, longitude, label = null) {
  //   const intersectsUrl = `https://betanyc.carto.com/api/v2/sql/?q=SELECT * FROM all_bounds WHERE ST_Intersects(ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326),the_geom) &api_key=2J6__p_IWwUmOHYMKuMYjw`
  //   fetch(intersectsUrl)
  //     .then(res => res.json())
  //     .then(({ rows }) => {
  //       boundariesIntersectingSelection = rows
  //     })
  // }

  function queryFromPolygon(boundId, featureId) {
    const intersectsUrl = `https://betanyc.carto.com/api/v2/sql/?q= WITH al as (SELECT ST_MakeValid(the_geom) as the_geom, id, namecol, namealt FROM all_bounds), se as (SELECT the_geom FROM al WHERE id = ${boundId} AND namecol = ${featureId}), inter as (SELECT DISTINCT al.id, al.namecol, al.namealt, ST_Area(se.the_geom) as area, ST_Area(ST_Intersection(al.the_geom, se.the_geom)) as searea FROM al, se WHERE ST_Intersects(al.the_geom, se.the_geom)) SELECT * FROM inter WHERE searea / area > .005 &api_key=2J6__p_IWwUmOHYMKuMYjw`
    fetch(intersectsUrl)
      .then(res => res.json())
      .then(({ rows }) => {
        boundariesIntersectingPolygon = rows
      })
  }

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

  let hoveredStateId = null
  let prevLayerId = null

  async function loadLayer(boundaryId: BoundaryId) {
    const currentLayer = layers[boundaryId]

    if (prevLayerId) {
      map.removeLayer(`${prevLayerId}-layer`)
      map.removeLayer(`${prevLayerId}-stroke-layer`)
      map.removeLayer(`${prevLayerId}-label-layer`)
    }

    if (!map.getSource(boundaryId)) {
      const url = `https://betanyc.carto.com/api/v2/sql/?q= SELECT * from all_bounds WHERE id = '${boundaryId}' &api_key=2J6__p_IWwUmOHYMKuMYjw&format=geojson`
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
        .setText(`${currentLayer.name} ${e.features[0].properties.namecol}`)
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

      // const intersectingDistricts =
      //   cityCouncilDistrictBoundaries.features.filter(feature =>
      //     booleanIntersects(feature.geometry, e.features[0].geometry as any)
      //   )

      // console.log(intersectingDistricts)
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

    prevLayerId = boundaryId
  }

  $: {
    map && loadLayer(activeLayer)
  }
</script>

<div id="map" />

<style>
  #map {
    flex: 1;
  }
</style>
