<script lang="ts">
  import AutoComplete from 'simple-svelte-autocomplete'
  import mapboxgl from 'mapbox-gl'
  import { format_address } from '../assets/boundaries/format'
  import {
    mapStore,
    addressMarker,
    coordinatesMarker,
    selectedAddress,
    selectedBoundaryMap,
    selectedDistrict,
    selectedCoordinates,
    isSelectingCoordinates
  } from '../stores'
  let value
  let searchResults = []

  async function getResults(keyword: string) {
    const url = `https://geosearch.planninglabs.nyc/v1/search?text=${keyword}`

    await fetch(url)
      .then(response => response.json())
      .then(
        response =>
          (searchResults = response.features.map(feature => ({
            name: format_address(
              feature.properties.pad_orig_stname,
              feature.properties.borough,
              feature.properties.postalcode,
              feature.properties.housenumber
            ),
            coords: feature.geometry.coordinates
          })))
      )

    return searchResults
  }

  function onChange(e) {
    if (e) {
      $selectedAddress = e
      $selectedBoundaryMap = null
      $selectedDistrict = null

      $mapStore.flyTo({ center: e.coords, zoom: 13 })

      if ($addressMarker) $addressMarker.remove()
      if ($coordinatesMarker) $coordinatesMarker.remove()
      $addressMarker = new mapboxgl.Marker()
        .setLngLat(e.coords)
        .addTo($mapStore)
    }
  }

  function onCoordinateButtonClick() {
    selectedCoordinates.set(null)
    selectedAddress.set(null)
    selectedDistrict.set(null)
    selectedBoundaryMap.set(null)
    isSelectingCoordinates.set(!$isSelectingCoordinates)
  }
</script>

<div class="relative flex w-full">
  <div class="relative flex flex-1">
    <AutoComplete
      delay="200"
      searchFunction={getResults}
      {onChange}
      bind:selectedItem={value}
      placeholder="Search by NYC address"
      className="relative flex-1"
      noInputStyles
      showLoadingIndicator
      inputClassName="l-0 t-0 r-0 py-2 px-3 pl-10 flex-1 w-full bg-white shadow-md rounded focus:outline-none focus:ring focus:ring-blue-500"
      dropdownClassName="border-none shadow-md rounded mt-1 py-2 bg-white t-100"
      labelFieldName="name"
      hideArrow
    />
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-5 w-5 absolute left-2.5 top-2.5"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fill-rule="evenodd"
        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
        clip-rule="evenodd"
      />
    </svg>
  </div>
  <button
    on:click={onCoordinateButtonClick}
    class={`group w-10 h-10 flex items-center justify-center ${
      $isSelectingCoordinates
        ? 'bg-blue-600 text-white hover:bg-blue-700'
        : 'bg-white text-gray-600 hover:text-blue-600'
    } shadow-md rounded ml-2  hover:text-focus:outline-none focus:ring focus:ring-blue-500`}
  >
    <div
      class="invisible group-hover:visible absolute top-full right-0 mt-2 bg-black text-gray-100 rounded shadow-md px-2 py-0.5"
    >
      Pick coordinates
    </div>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-5 w-5"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fill-rule="evenodd"
        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
        clip-rule="evenodd"
      />
    </svg>
  </button>
</div>
