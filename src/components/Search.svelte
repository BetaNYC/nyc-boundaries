<script lang="ts">
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

  function onInput() {
    if (value.length > 1) {
      fetch(`https://geosearch.planninglabs.nyc/v1/search?text=${value}`)
        .then(response => response.json())
        .then(
          response =>
            (searchResults = response.features
              .map(feature => ({
                name: format_address(
                  feature.properties.pad_orig_stname,
                  feature.properties.borough,
                  feature.properties.postalcode,
                  feature.properties.housenumber
                ),
                coords: feature.geometry.coordinates
              }))
              .slice(0, 8))
        )
    } else {
      searchResults = []
      $selectedAddress = null
      if (marker) marker.remove()
    }
  }

  function onSearch() {
    searchResults = []
    $selectedBoundaryMap = ''
    $selectedDistrict = null

    fetch(`https://geosearch.planninglabs.nyc/v1/search?text=${value}`)
      .then(response => response.json())
      .then(response => {
        //use the first address
        if (response.features.length) {
          const coords = response.features[0].geometry.coordinates
          $mapStore.flyTo({ center: coords, zoom: 13 })

          if (marker) marker.remove()
          marker = new mapboxgl.Marker()
            .setLngLat(coords)
            .addTo($mapStore)
            .on('click', () => marker.remove())
        } else {
          //throw error
        }
      })
  }

  function onSetLocation(addr) {
    value = addr.name
    $selectedAddress = addr
    onSearch()
  }

  function onInputFocus(event) {
    ;(event.target as HTMLInputElement).select()
  }
</script>

<form on:submit|preventDefault={onSearch} class="relative flex flex-1 mr-2">
  <!-- svelte-ignore a11y-autofocus -->
  <input
    id="address"
    placeholder="Search by NYC address"
    type="search"
    name="address"
    bind:value
    autofocus
    autocomplete="off"
    on:focus={onInputFocus}
    on:input={onInput}
    class="block py-2 px-3 flex-1 shadow-md rounded focus:outline-none focus:ring focus:ring-blue-500"
  />
  {#if searchResults.length}
    <ul
      class="absolute top-full left-0 right-0 shadow-md rounded mt-1 p-2 bg-white"
    >
      {#each searchResults as addr}
        <li
          on:click={() => onSetLocation(addr)}
          class="cursor-pointer hover:bg-gray-100 px-1 rounded"
        >
          {addr.name}
        </li>
      {/each}
    </ul>
  {/if}
  <input type="submit" value="Search" class="hidden" />
</form>
