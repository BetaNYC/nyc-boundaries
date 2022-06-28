<script lang="ts">
  import mapboxgl from 'mapbox-gl'

  import { mapStore } from '../stores'
  let value = ''
  let searchAddrs = []
  let marker

  function _set() {
    //clear searchAddrs
    searchAddrs = []

    fetch(`https://geosearch.planninglabs.nyc/v1/search?text=${value}`)
      .then(response => response.json())
      .then(response => {
        //use the first address
        if (response.features.length) {
          const coords = response.features[0].geometry.coordinates.reverse()
          $mapStore.flyTo(coords)

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

  function _setLocation(addr) {
    const { name, coords } = addr
    value = name
    //clear searchAddrs
    searchAddrs = []

    $mapStore.flyTo(coords)
    if (marker) marker.remove()
    marker = new mapboxgl.Marker()
      .setLngLat(coords)
      .addTo($mapStore)
      .on('click', () => marker.remove())
  }

  function _search() {
    if (value.length > 1) {
      fetch(`https://geosearch.planninglabs.nyc/v1/search?text=${value}`)
        .then(response => response.json())
        .then(
          response =>
            (searchAddrs = response.features
              .map(feature => ({
                name: feature.properties.label.replace(
                  ', New York, NY, USA',
                  ''
                ),
                coords: feature.geometry.coordinates.reverse()
              }))
              .slice(0, 5))
        )
    } else {
      searchAddrs = []
    }
  }
</script>

<form on:submit|preventDefault={_set} class="relative flex flex-1 mr-2">
  <input
    id="address"
    placeholder="Search by NYC address"
    type="search"
    name="address"
    bind:value
    autocomplete="off"
    on:keyup={_search}
    class="block py-2 px-3 flex-1 shadow-md rounded focus:outline-none focus:ring focus:ring-blue-500"
  />
  {#if searchAddrs.length}
    <ul
      class="absolute top-full left-0 right-0 shadow-md rounded mt-1 p-2 bg-white"
    >
      {#each searchAddrs as addr}
        <li
          on:click={() => _setLocation(addr)}
          class="cursor-pointer hover:bg-gray-100 px-1 rounded"
        >
          {addr.name}
        </li>
      {/each}
    </ul>
  {/if}
  <input type="submit" value="Search" class="hidden" />
</form>
