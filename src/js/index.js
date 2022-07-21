import '../css/style.css'

import { format_cd, format_pp, format_default } from './format'

const addressSearch = document.getElementById('address')
const suggestions = document.getElementById('suggestions')

let marker
let map
const api_key = API_KEY
const layers = {
  cd: {
    name: 'Community Districts',
    //remove parks
    sql: `SELECT * FROM all_bounds WHERE id = 'cd' AND NOT namecol IN ('164','226','227','228','355','356','480','481','482')`,
    textColor: '#000000',
    lineColor: '#000000',
    icon: 'static/NYCCo_human_group_a_01.jpg',
    formatContent: (name, alt) => format_cd(name[0], name.substring(1, 3))
  },
  pp: {
    name: 'Police Precincts',
    sql: `SELECT * FROM all_bounds WHERE id = 'pp'`,
    textColor: '#12eded',
    lineColor: '#12eded',
    icon: 'static/NYCCo_jobs_police_01.jpg',
    formatContent: (name, alt) => format_pp(name)
  },
  dsny: {
    name: 'Sanitation Districts',
    sql: `SELECT * FROM all_bounds WHERE id = 'dsny'`,
    textColor: '#12eda4',
    lineColor: '#12eda4',
    icon: 'static/NYCCo_sanitation_garbage_01.jpg',
    formatContent: (name, alt) => format_default(name)
  },
  fb: {
    name: 'Fire Battilion',
    sql: `SELECT * FROM all_bounds WHERE id = 'fb'`,
    textColor: '#12ed12',
    lineColor: '#12ed12',
    icon: 'static/NYCCo_jobs_firefighter_01.jpg',
    formatContent: (name, alt) => format_default(name)
  },
  sd: {
    name: 'School Districts',
    sql: `SELECT * FROM all_bounds WHERE id = 'sd'`,
    textColor: '#eded12',
    lineColor: '#eded12',
    icon: 'static/NYCCo_food_apple_01.jpg',
    formatContent: (name, alt) => format_default(name)
  },
  hc: {
    name: 'Health Center Districts',
    sql: `SELECT * FROM all_bounds WHERE id = 'hc'`,
    textColor: '#edbd12',
    lineColor: '#edbd12',
    icon: 'static/NYCCo_jobs_doctor_01.jpg',
    formatContent: (name, alt) => format_default(name)
  },
  cc: {
    name: 'City Council Districts',
    sql: `SELECT * FROM all_bounds WHERE id = 'cc'`,
    textColor: '#ed7d12',
    lineColor: '#ed7d12',
    icon: 'static/NYCCo_government_cityhall_01.jpg',
    formatContent: (name, alt) =>
      format_default(name, `https://council.nyc.gov/district-${name}`)
  },
  nycongress: {
    name: 'Congressional Districts',
    sql: `SELECT * FROM all_bounds WHERE id = 'nycongress'`,
    textColor: '#ed1212',
    lineColor: '#ed1212',
    icon: 'static/NYCCo_domestic_a_01.jpg',
    formatContent: (name, alt) =>
      format_default(
        name,
        `https://www.govtrack.us/congress/members/NY/${name}`
      )
  },
  nycongress_old: {
    name: 'Congressional Districts (Pre-Redistricting)',
    sql: `SELECT * FROM all_bounds WHERE id = 'nycongress(old)'`,
    textColor: '#ed1280',
    lineColor: '#ed1280',
    icon: 'static/NYCCo_domestic_a_01.jpg',
    formatContent: (name, alt) =>
      format_default(
        name,
        `https://www.govtrack.us/congress/members/NY/${name}`
      )
  },
  sa: {
    name: 'State Assembly Districts',
    sql: `SELECT * FROM all_bounds WHERE id = 'sa'`,
    textColor: '#ed1294',
    lineColor: '#ed1294',
    icon: 'static/NYCCo_governement_law_01.jpg',
    formatContent: (name, alt) => format_default(name)
  },
  sa_old: {
    name: 'State Assembly Districts (Pre-Redist)',
    sql: `SELECT * FROM all_bounds WHERE id = 'sa(old)'`,
    textColor: '#d712ed',
    lineColor: '#d712ed',
    icon: 'static/NYCCo_governement_law_01.jpg',
    formatContent: (name, alt) => format_default(name)
  },
  ss: {
    name: 'State Senate Districts',
    sql: `SELECT * FROM all_bounds WHERE id = 'ss'`,
    textColor: '#9912ed',
    lineColor: '#9912ed',
    icon: 'static/NYCCo_government_justice_01.jpg',
    formatContent: (name, alt) =>
      format_default(name, `https://www.nysenate.gov/district/${name}`)
  },
  ss_old: {
    name: 'State Senate Districts (Pre-Redist)',
    sql: `SELECT * FROM all_bounds WHERE id = 'ss(old)'`,
    textColor: '#2c12ed',
    lineColor: '#2c12ed',
    icon: 'static/NYCCo_government_justice_01.jpg',
    formatContent: (name, alt) =>
      format_default(name, `https://www.nysenate.gov/district/${name}`)
  },
  nta: {
    name: 'Neighborhood Tabulation Area',
    sql: `SELECT * FROM all_bounds WHERE id = 'nta'`,
    textColor: '#1212ed',
    lineColor: '#1212ed',
    icon: 'static/NYCCo_explore_01.jpg',
    textSmall: true,
    formatContent: (name, alt) => format_default(name)
  },
  bid: {
    name: 'Business Improvement District',
    sql: `SELECT * FROM all_bounds WHERE id = 'bid'`,
    textColor: '#129ded',
    lineColor: '#129ded',
    icon: 'static/NYCCo_jobs_a_01.jpg',
    textSmall: true,
    formatContent: (name, alt) => format_default(name)
  },
  zipcode: {
    name: 'Zipcodes',
    sql: `SELECT * FROM all_bounds WHERE id = 'zipcode'`,
    textColor: '#666666',
    lineColor: '#666666',
    icon: 'static/NYCCo_zip_01.jpg',
    textSmall: true,
    formatContent: (name, alt) => format_default(name)
  }
}

function queryFromLatLng(latitude, longitude, label = null) {
  //set map view to the resulting lat, lon
  map.setView([latitude, longitude])

  if (label === null) {
    label = `Clicked Point: ${latitude.toFixed(5)}, ${longitude.toFixed(5)}`
  }

  if (marker) marker.remove()
  marker = L.marker([latitude, longitude]).addTo(map)

  const intersectsUrl = `https://betanyc.carto.com/api/v2/sql/?q=SELECT * FROM all_bounds WHERE ST_Intersects(ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326),the_geom) &api_key=${api_key}`
  fetch(intersectsUrl)
    .then(res => res.json())
    .then(({ rows }) => generateInfoBoxFromQuery(rows, label))
}

function generateInfoBoxFromQuery(rows, label) {
  //create content for each layer
  const layersContent = Object.entries(layers)
    .map(([id, values]) => {
      let content = `<img class="city_icons" src="${values.icon}"/><h5 class= "">${values.name}</h5>`
      //filter and remove duplicates
      const layerRows = rows
        .filter(row => row.id === id)
        .reduce((unique, item) => {
          const uniqueNames = unique.map(row => row.namecol)
          return uniqueNames.includes(item.namecol) ? unique : [...unique, item]
        }, [])
      //for each row generate span
      content += layerRows
        .map(row => values.formatContent(row.namecol, row.namealt))
        .join('<span class= "lighter">, </span>')
      return `<div id="ds_info" class="clearfix">${content}</div>`
    })
    .join('')

  document.getElementById('info_box').innerHTML = `
    <a href="#" onclick="toggle_visibility('info_box');if(marker){marker.remove()};" class="close_button">Close Window</a>
    <div id="info"><h3 class = "bold">${label} </h3><div class="separator"></div></div>${layersContent}
  `
  show_info_box()
}

function set_address() {
  //Use the PlanningLab's NYC GeoSearch
  fetch(
    `https://geosearch.planninglabs.nyc/v1/search?text=${addressSearch.value}`
  )
    .then(response => {
      return response.json()
    })
    .then(({ features }) => {
      if (features.length > 0) {
        const label = features[0].properties.label.replace(
          ', New York, NY, USA',
          ''
        )
        const [longitude, latitude] = features[0].geometry.coordinates
        document.getElementById('no_results').style.display = 'none'
        queryFromLatLng(latitude, longitude, label)
        //clear suggestions
        while (suggestions.firstChild) {
          suggestions.removeChild(suggestions.firstChild)
        }
      } else {
        document.getElementById('no_results').style.display = 'block'
      }
    })
    .catch(error => {
      console.log(error)
      //if nothing gets returned, display no results
      document.getElementById('no_results').style.display = 'block'
    })
}

function search_address() {
  const adr = addressSearch.value

  const url = `https://geosearch.planninglabs.nyc/v1/search?text=${adr}`
  fetch(url)
    .then(res => res.json())
    .then(({ features }) => {
      //todo - clean up event listeners

      //clear suggestions
      while (suggestions.firstChild) {
        suggestions.removeChild(suggestions.firstChild)
      }

      //create suggestion list items
      features.forEach(feature => {
        const label = feature.properties.label.replace(
          ', New York, NY, USA',
          ''
        )
        const [longitude, latitude] = feature.geometry.coordinates
        const li = document.createElement('li')
        const a = document.createElement('a')
        a.textContent = label
        a.addEventListener('click', () => {
          addressSearch.value = label

          //clear suggestions
          while (suggestions.firstChild) {
            suggestions.removeChild(suggestions.firstChild)
          }
          queryFromLatLng(latitude, longitude, label)
        })
        li.appendChild(a)
        suggestions.appendChild(li)
      })
    })
}

//Toggle Layers and Visibility
function toggle_layer(id) {
  if (document.getElementById(id).checked) {
    layers[id].layer.show()
  } else {
    layers[id].layer.hide()
  }
}

//Turn on the selected layer and turn off all other layers
function hide_all_unselected_districts(id) {
  var districts = Object.keys(layers)
  if (!document.getElementById(id).checked) {
    var element = document.getElementById(id)
    element.checked = true
    var event = new Event('change')
    element.dispatchEvent(event)
  }
  for (let i = 0; i < districts.length; i++) {
    if (districts[i] == id) {
      continue
    } else {
      if (document.getElementById(districts[i]).checked) {
        var element = document.getElementById(districts[i])
        element.checked = false
        var event = new Event('change')
        element.dispatchEvent(event)
      }
    }
  }
}

//Displays
function toggle_visibility(id) {
  //toggle the visibility of a selected element
  var e = document.getElementById(id)
  if (e.style.display == 'block') e.style.display = 'none'
  else e.style.display = 'block'
}

function show_info_box() {
  if ((document.getElementById('info_box').style.display = 'none'))
    document.getElementById('info_box').style.display = 'block'
}

function query_district(layer_id) {
  const queryDistricts = `https://betanyc.carto.com/api/v2/sql/?q=SELECT namecol FROM all_bounds WHERE id = '${layer_id}' &api_key=${api_key}`

  hide_all_unselected_districts(layer_id)

  fetch(queryDistricts)
    .then(res => res.json())
    .then(({ rows }) => {
      //get all rows, filter for unique items, sort numeric, then generate options for selected_district
      const options = rows
        .map(row => row.namecol)
        .reduce(
          (unique, item) =>
            unique.includes(item) ? unique : [...unique, item],
          []
        )
        .sort((a, b) =>
          a.localeCompare(b, 'en-US', {
            numeric: 'true'
          })
        )
        .map(name => `<option value="${name}">${name}</option>`)
        .join('')
      document.getElementById('selected_district').innerHTML = `
			<select id="district">${options}</select>
				<div class="select_arrow"></div>
			<input type="submit" value="Select" onclick="list_overlaps('${layer_id}')">
		`
    })
    .catch(err => console.log(err))
}

function list_overlaps(layer_id) {
  if (marker) marker.remove()
  const select_district_id = document.getElementById('district')
  const district_id =
    select_district_id.options[select_district_id.selectedIndex].value
  const query = `
                WITH  al as (SELECT ST_MakeValid(the_geom) as the_geom, id, namecol, namealt FROM all_bounds),
                      se as (SELECT the_geom FROM al WHERE id = '${layer_id}' AND namecol = '${district_id}'),
                      inter as 
                        (SELECT DISTINCT al.id, al.namecol, al.namealt, 
                          ST_Area(se.the_geom) as area, ST_Area(ST_Intersection(al.the_geom, se.the_geom)) as searea
                          FROM al, se 
                          WHERE ST_Intersects(al.the_geom, se.the_geom))
                SELECT * FROM inter WHERE searea / area > .005
                `
  const intersectsUrl = `https://betanyc.carto.com/api/v2/sql/?q=${query}&api_key=${api_key}`

  fetch(intersectsUrl)
    .then(res => res.json())
    .then(({ rows }) => {
      //create content for each bound
      const boundsContent = Object.entries(layers)
        .map(([id, values]) => {
          let content = `<img class="city_icons" src="${values.icon}"/><h5 class= "">${values.name}</h5>`
          const boundRows = rows
            .filter(row => row.id === id)
            .reduce((unique, item) => {
              //
              const uniqueNames = unique.map(row => row.namecol)
              return uniqueNames.includes(item.namecol)
                ? unique
                : [...unique, item]
            }, [])
            .filter(row => !row.namecol.includes('park-cemetery-etc'))
          function addWarning(content, percent){
            if(percent < 0.05){
                return `<abbr title="Overlaps only ${(percent * 100).toFixed(1)}% of the district">${content}*</abbr>`
            }else{
              return content
            }
          }


          content += boundRows
            .map(row => addWarning(values.formatContent(row.namecol, row.namealt), +row.searea / +row.area))
            .join('<span class= "lighter">, </span>')
          return `<div id="ds_info" class="clearfix">${content}</div>`
        })
        .join('')

      document.getElementById('info_box').innerHTML = `
        <a href="#" onclick="toggle_visibility('info_box');if(marker){marker.remove()};" class="close_button">Close Window</a>
        <div id="info"><h3 class = "bold">${layers[layer_id].name} - ${district_id} </h3>
        <span class='lighter'>*Less than 5% overlap.</span>
        <div class="separator"></div></div>${boundsContent}`
      show_info_box()
    })
}

function reset_map() {
  map.setView([40.70458, -73.9256], 11)
  if (marker) marker.remove()
}

function init() {
  if (!api_key || api_key === 'undefined') {
    console.log('WARNING: NO API KEY, please include one in the .env file')
  }

  //set map view
  map = L.map('map').setView([40.70458, -73.9256], 11)
  // map.scrollWheelZoom.disable();
  map.doubleClickZoom.disable()

  //set basemap
  L.tileLayer(
    'https://api.mapbox.com/styles/v1/zhik/cke336l6w1g4n1dqv1tlv1pw3/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiemhpayIsImEiOiJjaW1pbGFpdHQwMGNidnBrZzU5MjF5MTJiIn0.N-EURex2qvfEiBsm-W9j7w',
    {
      maxZoom: 18
    }
  ).addTo(map)

  //connect to Carto
  const client = new carto.Client({
    apiKey: api_key,
    username: 'betanyc'
  })

  Object.entries(layers).forEach(([id, values], item_number) => {
    values.source = new carto.source.SQL(values.sql)
    // Outline the geometries for each dataset.
    // Colors based on DCP Planning Labs standard colors
    // https://medium.com/nycplanninglabs/experimenting-with-planning-color-standards-15b591d2a90c

    const textScale = values.textSmall
      ? `
      #layer[zoom > 12]{
        text-size: 11;
      }
      #layer[zoom <= 12]{
        text-size: 8;
      }`
      : `#layer[zoom > 11]{
        text-size: 16;
        text-character-spacing: 2;
      }
      #layer[zoom <= 11]{
        text-size: 10;
        text-character-spacing: 1;
      }`

    values.style = new carto.style.CartoCSS(`
			#layer {
      polygon-fill: #fff;
			polygon-opacity: 0;
      text-name: [namecol];
      text-face-name: 'Lato Bold Italic';
      text-fill: #fff;
      text-halo-radius: 2.5;
      text-halo-fill: darken(${values.textColor},20);
      text-allow-overlap: false;
      text-placements: "N,E,S,W";
      text-dy: -1;
      text-dx: -1;
      text-placement-type: simple;
      text-label-position-tolerance: 20;
			}
			#layer::outline {
      line-width: 2;
			line-color: ${values.lineColor};
      line-opacity: 1;
      line-rasterizer: full;
      line-comp-op: dst-over;
      line-dasharray: 20, 10;
      line-dash-offset: ${item_number * 3};
			}
			#layer::outline [zoom <= 12]{
				marker-width: 1;
      }
      ${textScale}
		`)

    const extraColumns = 'extraColumns' in values ? values.extraColumns : []
    const featureClickColumns = [values.textName, ...extraColumns]

    values.layer = new carto.layer.Layer(
      values.source,
      values.style,
      featureClickColumns
    )

    //add layer to map
    client.addLayer(values.layer)

    //setup switch functions
    document.getElementById('switches').innerHTML += `
			<li>
				<label class="switch">
					<input id="${id}" type="checkbox" name="style" onchange="toggle_layer('${id}')" ${
      id === 'cd' ? 'checked' : ''
    }>
					<span class="slider"></span>
				</label>
				<h5>${values.name}</h5> <hr class="colored_line" style="border-top-color:${
      values.lineColor
    }">
			</li>
		`
    //hide all layers but cd
    if (id !== 'cd') values.layer.hide()
  })

  client.getLeafletLayer().addTo(map)

  L.popup({
    closeButton: false
  })

  //init Query Overlapping Districts selectors
  const overlapSelect = document.getElementById('admin_district')
  Object.entries(layers).forEach(([id, values]) => {
    const option = document.createElement('option')
    option.textContent = values.name
    option.value = id
    overlapSelect.appendChild(option)
  })
  overlapSelect.addEventListener('change', e => query_district(e.target.value))

  //map click search
  const mapClickedInput = document.getElementById('map_clicked')
  let isMapClickedEnabled = localStorage.getItem("map-clicked") && localStorage.getItem("map-clicked") === 'false' ? false : true
  let mapClickEvent = toggleMapClicked(null, isMapClickedEnabled)

  mapClickedInput.addEventListener('click', ()=>{
    isMapClickedEnabled = !isMapClickedEnabled
    mapClickEvent = toggleMapClicked(mapClickEvent, isMapClickedEnabled)
  })

  function toggleMapClicked(mapClickEvent, enabled){
    if(enabled){
      //set input to checked and enable event
      mapClickedInput.checked = true
      localStorage.setItem('map-clicked','true')
      
      const event = e => {
        const { lat, lng } = e.latlng
        queryFromLatLng(lat, lng)
      }
    
      map.on('click', event)

      return event
    }else{

      mapClickedInput.checked = false
      localStorage.setItem('map-clicked','false')
      if(mapClickEvent) map.off('click', mapClickEvent)

      return null
    }
  }  

  //prompt user for location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords
      queryFromLatLng(latitude, longitude)
    })
  }
}

export {
  set_address,
  search_address,
  toggle_layer,
  toggle_visibility,
  show_info_box,
  list_overlaps,
  reset_map,
  init,
  map,
  marker,
  layers
}
