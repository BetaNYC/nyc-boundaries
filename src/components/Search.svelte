<script lang="ts">
  import AutoComplete from 'simple-svelte-autocomplete'
  import mapboxgl from 'mapbox-gl'
  import { format_address } from '../assets/boundaries/format'
  import {
    mapStore,
    selectedAddress,
    selectedBoundaryMap,
    selectedDistrict
  } from '../stores'

  let value
  let searchResults = []
  let marker

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

      if (marker) marker.remove()
      marker = new mapboxgl.Marker().setLngLat(e.coords).addTo($mapStore)
    }
  }
</script>

<div class="relative flex w-full">
  <AutoComplete
    delay="200"
    searchFunction={getResults}
    {onChange}
    bind:selectedItem={value}
    placeholder="Search by NYC address"
    className="relative flex-1"
    noInputStyles
    showLoadingIndicator
    inputClassName="l-0 t-0 r-0 flex-1 py-2 px-3 pl-10 flex-1 w-full bg-white shadow-md rounded focus:outline-none focus:ring focus:ring-blue-500"
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
<!-- {#if searchResults.length}
    <div
      class="absolute top-full left-0 right-0 shadow-md rounded mt-1 py-2 bg-white"
    >
      {#each searchResults as addr}
        <button
          on:click={() => onSetLocation(addr)}
          class="cursor-pointer text-left hover:bg-gray-100 px-3 py-1 pl-10 w-full focus:rounded-sm focus:outline-none focus:ring focus:ring-blue-500"
        >
          {addr.name}
        </button>
      {/each}
    </div>
  {/if} -->
