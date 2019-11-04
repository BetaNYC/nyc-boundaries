import '../css/style.css';

import {
	format_cd, 
	format_pp
} from './format';

let marker;
let map;
const api_key = API_KEY;
const layers = {
	'cd': {
		name: 'Community Districts',
		//remove parks
		sql: 'SELECT * FROM nycd WHERE (borocd BETWEEN 101 AND 112) or (borocd BETWEEN 201 AND 212) or (borocd BETWEEN 301 AND 318) or (borocd BETWEEN 401 AND 414) or (borocd BETWEEN 501 AND 503)',
		textColor: '#000000',
		lineColor: '#000000',
		textName: 'borocd',
		extraColumns: ['the_geom'],
		url_intersects: (latitude, longitude) => {
			return "https://betanyc.carto.com/api/v2/sql/?q=SELECT borocd FROM nycd WHERE ST_Intersects(ST_SetSRID(ST_MakePoint("+longitude+", "+latitude+"), 4326),nycd.the_geom) &api_key="+api_key;
		},
		icon: 'static/NYCCo_human_group_a_01.jpg',
		formatContent: row => {
			var boro_string = row.borocd.toString()[0];
			var cd_string =  row.borocd.toString().substring(1,3);
			return format_cd(boro_string, cd_string);
		}
	},
	'pp': {
		name: 'Police Precincts',
		sql: 'SELECT * FROM nypp',
		textColor: '#12eded',
		lineColor: '#12eded',
		textName: 'precinct',
		url_intersects: (latitude, longitude) => {
			return "https://betanyc.carto.com/api/v2/sql/?q=SELECT precinct FROM nypp WHERE ST_Intersects(ST_SetSRID(ST_MakePoint("+longitude+", "+latitude+"), 4326),nypp.the_geom) &api_key="+api_key;
		},
		icon: 'static/NYCCo_jobs_police_01.jpg',
		formatContent: row => {
			return format_pp(row.precinct)
		}
	},
	'sd': {
		name: 'Sanitation Districts',
		sql: 'SELECT cartodb_id, the_geom, the_geom_webmercator, districtco, district FROM dsny',
		textColor: '#12eda4',
		lineColor: '#12eda4',
		textName: 'district',
		url_intersects: (latitude, longitude) => {
			return "https://betanyc.carto.com/api/v2/sql/?q=SELECT district FROM dsny WHERE ST_Intersects(ST_SetSRID(ST_MakePoint("+longitude+", "+latitude+"), 4326),dsny.the_geom) &api_key="+api_key;
		},
		icon: 'static/NYCCo_sanitation_garbage_01.jpg',
		formatContent: row => {
			return `<span class = "lighter">${row.district}</span>`
		}

	},
	'fb': {
		name: 'Fire Battilion',
		sql: 'SELECT * FROM nyfb',
		textColor: '#12ed12',
		lineColor: '#12ed12',
		textName: 'fire_bn',
		url_intersects: (latitude, longitude) => {
			return "https://betanyc.carto.com/api/v2/sql/?q=SELECT fire_bn FROM nyfb WHERE ST_Intersects(ST_SetSRID(ST_MakePoint("+longitude+", "+latitude+"), 4326),nyfb.the_geom) &api_key="+api_key;
		},
		icon: 'static/NYCCo_jobs_firefighter_01.jpg',
		formatContent: row => {
			return `<span class = "lighter">${row.fire_bn}</span>`
		}
	},
	'sd': {
		name: 'School Districts',
		sql: 'SELECT * FROM nysd',
		textColor: '#eded12',
		lineColor: '#eded12',
		haloFill: '#000',
		haloRadius: .8,
		textName: 'schooldist',
		url_intersects: (latitude, longitude) => {
			return  "https://betanyc.carto.com/api/v2/sql/?q=SELECT schooldist FROM nysd WHERE ST_Intersects(ST_SetSRID(ST_MakePoint("+longitude+", "+latitude+"), 4326),nysd.the_geom) &api_key="+api_key;
		},
		icon: 'static/NYCCo_food_apple_01.jpg',
		formatContent: row => {
			return `<span class = "lighter">${row.schooldist}</span>`
		}
	},
	'hc': {
		name: 'Health Center Districts',
		sql: 'SELECT * FROM nyhc',
		textColor: '#edbd12',
		lineColor: '#edbd12',
		textName: 'hcent_dist',
		url_intersects: (latitude, longitude) => {
			return "https://betanyc.carto.com/api/v2/sql/?q=SELECT hcent_dist FROM nyhc WHERE ST_Intersects(ST_SetSRID(ST_MakePoint("+longitude+", "+latitude+"), 4326),nyhc.the_geom) &api_key="+api_key;
		},
		icon: 'static/NYCCo_jobs_doctor_01.jpg',
		formatContent: row => {
			return `<span class = "lighter">${row.hcent_dist}</span>`
		}
	},
	'cc': {
		name: 'City Council Districts',
		sql: 'SELECT * FROM nycc',
		textColor: '#ed7d12',
		lineColor: '#ed7d12',
		textName: 'coundist',
		url_intersects: (latitude, longitude) => {
			return "https://betanyc.carto.com/api/v2/sql/?q=SELECT coundist FROM nycc WHERE ST_Intersects(ST_SetSRID(ST_MakePoint("+longitude+", "+latitude+"), 4326),nycc.the_geom) &api_key="+api_key;
		},
		icon: 'static/NYCCo_government_cityhall_01.jpg',
		formatContent: row => {
			return `<span class = "lighter"><a target="_blank" href='https://council.nyc.gov/district-${row.coundist}'>${row.coundist}</a> </span>`;
		}
	},
	'nycongress': {
		name: 'Congressional Districts',
		sql: 'SELECT * FROM nycongress',
		textColor: '#ed1212',
		lineColor: '#ed1212',
		textName: 'cong_dist',
		url_intersects: (latitude, longitude) => {
			return "https://betanyc.carto.com/api/v2/sql/?q=SELECT cong_dist FROM nycongress WHERE ST_Intersects(ST_SetSRID(ST_MakePoint("+longitude+", "+latitude+"), 4326),nycongress.the_geom) &api_key="+api_key;
		},
		icon: 'static/NYCCo_domestic_a_01.jpg',
		formatContent: row => {
			return `<span class = "lighter"><a target="_blank" href='https://www.govtrack.us/congress/members/NY/${row.cong_dist}'>${row.cong_dist}</a> </span>`
		}
	},
	'sa': {
		name: 'State Assembly Districts',
		sql: 'SELECT * FROM nysa',
		textColor: '#ed1294',
		lineColor: '#ed1294',
		textName: 'assem_dist',
		url_intersects: (latitude, longitude) => {
			return "https://betanyc.carto.com/api/v2/sql/?q=SELECT assem_dist FROM nysa WHERE ST_Intersects(ST_SetSRID(ST_MakePoint("+longitude+", "+latitude+"), 4326),nysa.the_geom) &api_key="+api_key;
		},
		icon: 'static/NYCCo_governement_law_01.jpg',
		formatContent: row => {
			return `<span class = "lighter">${row.assem_dist}</span>`;
		}
	},
	'ss': {
		name: 'State Senate Districts',
		sql: `SELECT * FROM nyss`,
		textColor: '#9912ed',
		lineColor: '#9912ed',
		textName: 'st_sen_dis',
		url_intersects: (latitude, longitude) => {
			return "https://betanyc.carto.com/api/v2/sql/?q=SELECT st_sen_dis FROM nyss WHERE ST_Intersects(ST_SetSRID(ST_MakePoint("+longitude+", "+latitude+"), 4326),nyss.the_geom) &api_key="+api_key;
		},
		icon: 'static/NYCCo_government_justice_01.jpg',
		formatContent: row => {
			return `<span class = "lighter"><a target="_blank" href='https://www.nysenate.gov/district/${row.st_sen_dis}'>${row.st_sen_dis}</a></span>`
		}
	},
	'nta': {
		name: 'Neighborhood Tabulation Area',
		sql: 'SELECT * FROM nynta',
		textColor: '#1212ed',
		lineColor: '#1212ed',
		textName: 'ntaname',
		extraColumns: ['ntacode'],
		url_intersects: (latitude, longitude) => {
			return "https://betanyc.carto.com/api/v2/sql/?q=SELECT ntaname FROM nynta WHERE ST_Intersects(ST_SetSRID(ST_MakePoint("+longitude+", "+latitude+"), 4326),nynta.the_geom) &api_key="+api_key;
		},
		icon: 'static/NYCCo_explore_01.jpg',
		formatContent: row => {
			return `<span class = "lighter">${row.ntaname}</span>`
		}
	},
	'bid': {
		name: 'Business Improvement District',
		sql: 'SELECT * FROM bids',
		textColor: '#129ded',
		lineColor: '#129ded',
		textName: 'bid',
		url_intersects: (latitude, longitude) => {
			return "https://betanyc.carto.com/api/v2/sql/?q=SELECT bid FROM bids WHERE ST_Intersects(ST_SetSRID(ST_MakePoint("+longitude+", "+latitude+"), 4326),bids.the_geom) &api_key="+api_key;
		},
		icon: 'static/NYCCo_jobs_a_01.jpg',
		formatContent: row => {
			return `<span class = "lighter">${row.bid}</span>`
		}
	}
}

//Map Zooms and Fits
function set_address() {
	//Use the City's Geoclient API to search for an address
	var select = document.getElementById("boro");
	var boro = select.options[select.selectedIndex].value;
	var adr = document.getElementById("address").value;

	//adds CORS header to proxy request getting around errors
	const proxyurl = "https://cors-anywhere.herokuapp.com/";

	//query the City's geoclient API
	var url = "https://api.cityofnewyork.us/geoclient/v1/search.json?input=" + " " + adr + " " + boro + "&app_id=dd37f663&app_key=c99663c5e8b11315279f8d28ef245dab";

	fetch(proxyurl + url, {mode: 'cors'})
	.then(function(response) {
		return response.json();
	})
	.then(address => {
		document.getElementById('no_results').style.display = 'none';
		const results = address.results;
		const response = results[0].response;
		const latitude = response.latitude;
		const longitude = response.longitude;
		//set map view to the resulting lat, lon and zoom to 18
		map.setView([latitude, longitude], 15);
		if(marker) {
			marker.remove();
		}
		marker = L.marker([latitude, longitude]).addTo(map);
	

		Promise.all(Object.entries(layers).map(([id, values])=> {
			return fetch(values.url_intersects(latitude, longitude)).then(res => {
				return res.json();
			}).then(intersects => {
				let layerContent = `<img class="city_icons" src="${values.icon}"/><h5 class= "">${values.name}</h5>`;
				layerContent += intersects.rows.map(row => values.formatContent(row)).join('<span class= "lighter">, </span>')
				document.getElementById(`${id}_info`).innerHTML = layerContent;
			})
		})).then(() => {
			
			//variables for the innerHTML content that will be filled into each div in the infobox
			document.getElementById('info').innerHTML = `<h3 class = "bold">${adr} ${boro} </h3><div class="separator"></div>`

			//set the info_box to display as block
			show_info_box();
		})

	})

.catch(function(error) {
	console.log(error);
	//if nothing gets returned, display no results
	document.getElementById('no_results').style.display = 'block';
});


}

//Toggle Layers and Visibility
function toggle_layer(id){
	if (document.getElementById(id).checked) {
		layers[id].layer.show();
	}
	else {
		layers[id].layer.hide();
	}
  }

//Turn on the selected layer and turn off all other layers
function hide_all_unselected_districts(id) {
	var districts = ['cd','pp','ds','fb','sd','hc','cc','congress','sa','ss','nta','bid'];
	if(!document.getElementById(id).checked){
		var element = document.getElementById(id);
		element.checked = true;
		var event = new Event('change');
		element.dispatchEvent(event);
	}
	for (let i = 0; i<districts.length; i++){
		if (districts[i] == id){
			continue;
		}
		else {
			if(document.getElementById(districts[i]).checked){
				var element = document.getElementById(districts[i]);
				element.checked = false;
				var event = new Event('change');
				element.dispatchEvent(event);
			}
		}
	}
}

//Displays
function toggle_visibility(id) {
	//toggle the visibility of a selected element
	var e = document.getElementById(id);
	if(e.style.display == 'block')
		e.style.display = 'none';
	else
		e.style.display = 'block';
}

function show_info_box() {
	if (document.getElementById('info_box').style.display = 'none')
		document.getElementById('info_box').style.display = 'block';
}


function query_district() {
	var select = document.getElementById("admin_district");
	var admin_district_value = select.options[select.selectedIndex].value;
	admin_district = JSON.parse(admin_district_value);
	let content_districts ='';

		hide_all_unselected_districts(admin_district.html_id);

		var url_districts = "https://betanyc.carto.com/api/v2/sql/?q=SELECT "+ admin_district.district_id +" AS district_id FROM "+ admin_district.table +" ORDER BY "+admin_district.district_id+" ASC &api_key="+api_key;
		fetch(url_districts)
		.then(function(response) {
			return response.json();
		})
		.then(function(districts) {
			
			content_districts+=`<select id="district" >`;

			for(let i = 0; i<districts.rows.length; i++) {
				content_districts+=`<option value="${districts.rows[i].district_id}">${districts.rows[i].district_id}</option>`;
			}
			content_districts+=`</select>
			<div class="select_arrow"></div>
			</div>
			<input type="submit" value="Select" onclick="list_overlaps()">`;
			//fill the innerHTML of each section
			document.getElementById('selected_district').innerHTML = content_districts;
			});


}

function list_overlaps(){

	var select_table = document.getElementById("admin_district");
	var admin_district_value = select_table.options[select_table.selectedIndex].value;
	admin_district = JSON.parse(admin_district_value);

	var select_district_id = document.getElementById("district");
	var district_id = select_district_id.options[select_district_id.selectedIndex].value;

	content = `<h3>`+admin_district.title+`: `+district_id+` </h3><div class="separator"></div>`;
	document.getElementById('info').innerHTML = content;

	content.cd = `<img class="city_icons" src="static/NYCCo_human_group_a_01.jpg"/><h5 class = "">Community District </h5>`;
	var url_cd_intersects = "https://betanyc.carto.com/api/v2/sql/?q=WITH m AS (SELECT the_geom FROM "+ admin_district.table +" WHERE " + admin_district.district_id + " = '"+district_id+"') SELECT borocd FROM nycd, m WHERE ST_Intersects(nycd.the_geom, m.the_geom) AND (st_area(st_intersection(nycd.the_geom, m.the_geom))/st_area(nycd.the_geom)) > .00025 ORDER BY borocd &api_key="+api_key;

	fetch(url_cd_intersects)
	.then(function(response) {
		return response.json();
	})
	.then(function(cd_intersects) {
		for(let i = 0; i<cd_intersects.rows.length; i++) {

			var boro_string = cd_intersects.rows[i].borocd.toString()[0];
			var cd_string = cd_intersects.rows[i].borocd.toString().substring(1,3);
			if (boro_string == "1"){
				boro = "Manhattan";
			}

			else if (boro_string == "2"){
				boro = "Bronx";
			}

			else if (boro_string == "3"){
				boro = "Brooklyn";
			}

			else if (boro_string == "4"){
				boro = "Queens";
			}

			else if (boro_string == "5"){
				boro = "Staten Island";
			}

			content.cd += `<span class = "lighter">${boro} - ${cd_string}</span>`;
			if(i != cd_intersects.rows.length - 1){
				content.cd += `<span class = "lighter">, </span>`;
			}
		}

	//set the info_box to display as block
	show_info_box();

	//fill the innerHTML of each section
	document.getElementById('cd_info').innerHTML = content.cd;
	});

	content.pp = `<img class="city_icons" src="static/NYCCo_jobs_police_01.jpg"/><h5 class = "">Precincts </h5>`;
	var url_pp_intersects = "https://betanyc.carto.com/api/v2/sql/?q=WITH m AS (SELECT the_geom FROM "+ admin_district.table +" WHERE " + admin_district.district_id + " = '"+district_id+"') SELECT precinct FROM nypp, m WHERE ST_Intersects(nypp.the_geom, m.the_geom) AND (st_area(st_intersection(nypp.the_geom, m.the_geom))/st_area(nypp.the_geom)) > .00025 ORDER BY precinct &api_key="+api_key;

	fetch(url_pp_intersects)
	.then(function(response) {
		return response.json();
	})
	.then(function(pp_intersects) {
		for(let i = 0; i<pp_intersects.rows.length; i++) {

			if (pp_intersects.rows[i].precinct == 11 || pp_intersects.rows[i].precinct == 12 || pp_intersects.rows[i].precinct == 13) {
				content.pp += `<span class = "lighter"><a target="_blank" href='https://www1.nyc.gov/site/nypd/bureaus/patrol/precincts/midtown-south-precinct.page'>${pp_intersects.rows[i].precinct}</a> </span>`;
			}

			else if (pp_intersects.rows[i].precinct == 14) {
				content.pp += `<span class = "lighter"><a target="_blank" href='https://www1.nyc.gov/site/nypd/bureaus/patrol/precincts/${pp_intersects.rows[i].precinct}th-precinct.page'>${pp_intersects.rows[i].precinct}</a> </span>`;
			}

			else if (pp_intersects.rows[i].precinct == 18) {
				content.pp += `<span class = "lighter"><a target="_blank" href='https://www1.nyc.gov/site/nypd/bureaus/patrol/precincts/midtown-north-precinct.page'>${pp_intersects.rows[i].precinct}</a> </span>`;
			}

			else if (pp_intersects.rows[i].precinct == 22) {
				content.pp += `<span class = "lighter"><a target="_blank" href='https://www1.nyc.gov/site/nypd/bureaus/patrol/precincts/central-park-precinct.page'>${pp_intersects.rows[i].precinct}</a> </span>`;
			}

			else if ((pp_intersects.rows[i].precinct % 10) == 1) {
				content.pp += `<span class = "lighter"><a target="_blank" href='https://www1.nyc.gov/site/nypd/bureaus/patrol/precincts/${pp_intersects.rows[i].precinct}st-precinct.page'>${pp_intersects.rows[i].precinct}</a> </span>`;
			}

			else if ((pp_intersects.rows[i].precinct % 10) == 2) {
				content.pp += `<span class = "lighter"><a target="_blank" href='https://www1.nyc.gov/site/nypd/bureaus/patrol/precincts/${pp_intersects.rows[i].precinct}nd-precinct.page'>${pp_intersects.rows[i].precinct}</a> </span>`;
			}

			else if ((pp_intersects.rows[i].precinct % 10) == 3) {
				content.pp += `<span class = "lighter"><a target="_blank" href='https://www1.nyc.gov/site/nypd/bureaus/patrol/precincts/${pp_intersects.rows[i].precinct}rd-precinct.page'>${pp_intersects.rows[i].precinct}</a> </span>`;
			}

			else {
				content.pp += `<span class = "lighter"><a target="_blank" href='https://www1.nyc.gov/site/nypd/bureaus/patrol/precincts/${pp_intersects.rows[i].precinct}th-precinct.page'>${pp_intersects.rows[i].precinct}</a> </span>`;
			}
			if(i != pp_intersects.rows.length - 1){
				content.pp += `<span class = "lighter">, </span>`;
			}
		}


	//set the info_box to display as block
	show_info_box();

	//fill the innerHTML of each section
	document.getElementById('pp_info').innerHTML = content.pp;
	});

	content.ds = `<img class="city_icons" src="static/NYCCo_sanitation_garbage_01.jpg"/><h5 class = "">Sanitation Districts </h5>`;
	var url_ds_intersects = "https://betanyc.carto.com/api/v2/sql/?q=WITH m AS (SELECT the_geom FROM "+ admin_district.table +" WHERE " + admin_district.district_id + " = '"+district_id+"') SELECT district FROM dsny, m WHERE ST_Intersects(dsny.the_geom, m.the_geom) AND (st_area(st_intersection(dsny.the_geom, m.the_geom))/st_area(dsny.the_geom)) > .00025 ORDER BY district &api_key="+api_key;

	fetch(url_ds_intersects)
	.then(function(response) {
		return response.json();
	})
	.then(function(ds_intersects) {
		for(let i = 0; i<ds_intersects.rows.length; i++) {
			content.ds += `<span class = "lighter">${ds_intersects.rows[i].district}</span>`;
			if(i != ds_intersects.rows.length - 1){
				content.ds += `<span class = "lighter">, </span>`;
			}
		}

	//set the info_box to display as block
	show_info_box();

	//fill the innerHTML of each section
	document.getElementById('ds_info').innerHTML = content.ds;
	});

	content.fb = `<img class="city_icons" src="static/NYCCo_jobs_firefighter_01.jpg"/><h5 class = "">Fire Battilions </h5>`;
	var url_fb_intersects = "https://betanyc.carto.com/api/v2/sql/?q=WITH m AS (SELECT the_geom FROM "+ admin_district.table +" WHERE " + admin_district.district_id + " = '"+district_id+"') SELECT fire_bn FROM nyfb, m WHERE ST_Intersects(nyfb.the_geom, m.the_geom) AND (st_area(st_intersection(nyfb.the_geom, m.the_geom))/st_area(nyfb.the_geom)) > .00025 ORDER BY fire_bn &api_key="+api_key;

	fetch(url_fb_intersects)
	.then(function(response) {
		return response.json();
	})
	.then(function(fb_intersects) {
		for(let i = 0; i<fb_intersects.rows.length; i++) {
			content.fb += `<span class = "lighter">${fb_intersects.rows[i].fire_bn}</span>`;
			if(i != fb_intersects.rows.length - 1){
				content.fb += `<span class = "lighter">, </span>`;
			}
		}

	//set the info_box to display as block
	show_info_box();

	//fill the innerHTML of each section
	document.getElementById('fb_info').innerHTML = content.fb;
	});

	content.sd = `<img class="city_icons" src="static/NYCCo_food_apple_01.jpg"/><h5 class = "">School Districts </h5>`;
	var url_sd_intersects = "https://betanyc.carto.com/api/v2/sql/?q=WITH m AS (SELECT the_geom FROM "+ admin_district.table +" WHERE " + admin_district.district_id + " = '"+district_id+"') SELECT schooldist FROM nysd, m WHERE ST_Intersects(nysd.the_geom, m.the_geom) AND (st_area(st_intersection(nysd.the_geom, m.the_geom))/st_area(nysd.the_geom)) > .00025 ORDER BY schooldist &api_key="+api_key;

	fetch(url_sd_intersects)
	.then(function(response) {
		return response.json();
	})
	.then(function(sd_intersects) {
		for(let i = 0; i<sd_intersects.rows.length; i++) {
			content.sd += `<span class = "lighter">${sd_intersects.rows[i].schooldist}</span>`;
			if(i != sd_intersects.rows.length - 1){
				content.sd += `<span class = "lighter">, </span>`;
			}
		}

	//set the info_box to display as block
	show_info_box();

	//fill the innerHTML of each section
	document.getElementById('sd_info').innerHTML = content.sd;
	});

	content.hc = `<img class="city_icons" src="static/NYCCo_jobs_doctor_01.jpg"/><h5 class = "">Health Center Districts </h5>`;
	var url_hc_intersects = "https://betanyc.carto.com/api/v2/sql/?q=WITH m AS (SELECT the_geom FROM "+ admin_district.table +" WHERE " + admin_district.district_id + " = '"+district_id+"') SELECT hcent_dist FROM nyhc, m WHERE ST_Intersects(nyhc.the_geom, m.the_geom) AND (st_area(st_intersection(nyhc.the_geom, m.the_geom))/st_area(nyhc.the_geom)) > .00025 ORDER BY hcent_dist &api_key="+api_key;

	fetch(url_hc_intersects)
	.then(function(response) {
		return response.json();
	})
	.then(function(hc_intersects) {
		for(let i = 0; i<hc_intersects.rows.length; i++) {
			content.hc += `<span class = "lighter">${hc_intersects.rows[i].hcent_dist}</span>`;
			if(i != hc_intersects.rows.length - 1){
				content.hc += `<span class = "lighter">, </span>`;
			}
		}

	//set the info_box to display as block
	show_info_box();

	//fill the innerHTML of each section
	document.getElementById('hc_info').innerHTML = content.hc;
	});


	content.cc = `<img class="city_icons" src="static/NYCCo_government_cityhall_01.jpg"/><h5 class = "">City Council Districts </h5>`;
	var url_cc_intersects = "https://betanyc.carto.com/api/v2/sql/?q=WITH m AS (SELECT the_geom FROM "+ admin_district.table +" WHERE " + admin_district.district_id + " = '"+district_id+"') SELECT coundist FROM nycc, m WHERE ST_Intersects(nycc.the_geom, m.the_geom) AND (st_area(st_intersection(nycc.the_geom, m.the_geom))/st_area(nycc.the_geom)) > .00025 ORDER BY coundist &api_key="+api_key;

	fetch(url_cc_intersects)
	.then(function(response) {
		return response.json();
	})
	.then(function(cc_intersects) {
		for(let i = 0; i<cc_intersects.rows.length; i++) {
			content.cc += `<span class = "lighter"><a target="_blank" href='https://council.nyc.gov/district-${cc_intersects.rows[i].coundist}'>${cc_intersects.rows[i].coundist}</a> </span>`;
			if(i != cc_intersects.rows.length - 1){
				content.cc += `<span class = "lighter">, </span>`;
			}
		}

	//set the info_box to display as block
	show_info_box();

	//fill the innerHTML of each section
	document.getElementById('cc_info').innerHTML = content.cc;
	});

	content.congress = `<img class="city_icons" src="static/NYCCo_domestic_a_01.jpg"/><h5 class = "">Congressional Districts </h5>`;
	var url_congress_intersects = "https://betanyc.carto.com/api/v2/sql/?q=WITH m AS (SELECT the_geom FROM "+ admin_district.table +" WHERE " + admin_district.district_id + " = '"+district_id+"') SELECT cong_dist FROM nycongress, m WHERE ST_Intersects(nycongress.the_geom, m.the_geom) AND (st_area(st_intersection(nycongress.the_geom, m.the_geom))/st_area(nycongress.the_geom)) > .00025 ORDER BY cong_dist &api_key="+api_key;

	fetch(url_congress_intersects)
	.then(function(response) {
		return response.json();
	})
	.then(function(congress_intersects) {
		for(let i = 0; i<congress_intersects.rows.length; i++) {
			content.congress += `<span class = "lighter"><a target="_blank" href='https://www.govtrack.us/congress/members/NY/${congress_intersects.rows[i].cong_dist}'>${congress_intersects.rows[i].cong_dist}</a> </span>`;
			if(i != congress_intersects.rows.length - 1){
				content.congress += `<span class = "lighter">, </span>`;
			}
		}

	//set the info_box to display as block
	show_info_box();

	//fill the innerHTML of each section
	document.getElementById('congress_info').innerHTML = content.congress;
	});

	content.sa = `<img class="city_icons" src="static/NYCCo_governement_law_01.jpg"/><h5 class = "">State Assembly Districts </h5>`;
	var url_sa_intersects = "https://betanyc.carto.com/api/v2/sql/?q=WITH m AS (SELECT the_geom FROM "+ admin_district.table +" WHERE " + admin_district.district_id + " = '"+district_id+"') SELECT assem_dist FROM nysa, m WHERE ST_Intersects(nysa.the_geom, m.the_geom) AND (st_area(st_intersection(nysa.the_geom, m.the_geom))/st_area(nysa.the_geom)) > .00025 ORDER BY assem_dist &api_key="+api_key;

	fetch(url_sa_intersects)
	.then(function(response) {
		return response.json();
	})
	.then(function(sa_intersects) {
		for(let i = 0; i<sa_intersects.rows.length; i++) {
			content.sa += `<span class = "lighter">${sa_intersects.rows[i].assem_dist}</span>`;
			if(i != sa_intersects.rows.length - 1){
				content.sa += `<span class = "lighter">, </span>`;
			}
		}

	//set the info_box to display as block
	show_info_box();

	//fill the innerHTML of each section
	document.getElementById('sa_info').innerHTML = content.sa;
	});

	content.ss = `<img class="city_icons" src="static/NYCCo_government_justice_01.jpg"/><h5 class = "">State Senate Districts </h5>`;
	var url_ss_intersects = "https://betanyc.carto.com/api/v2/sql/?q=WITH m AS (SELECT the_geom FROM "+ admin_district.table +" WHERE " + admin_district.district_id + " = '"+district_id+"') SELECT st_sen_dis FROM nyss, m WHERE ST_Intersects(nyss.the_geom, m.the_geom) AND (st_area(st_intersection(nyss.the_geom, m.the_geom))/st_area(nyss.the_geom)) > .00025 ORDER BY st_sen_dis &api_key="+api_key;

	fetch(url_ss_intersects)
	.then(function(response) {
		return response.json();
	})
	.then(function(ss_intersects) {
		for(let i = 0; i<ss_intersects.rows.length; i++) {
			content.ss += `<span class = "lighter"><a target="_blank" href='https://www.nysenate.gov/district/${ss_intersects.rows[i].st_sen_dis}'>${ss_intersects.rows[i].st_sen_dis}</a></span>`;
			if(i != ss_intersects.rows.length - 1){
				content.ss += `<span class = "lighter">, </span>`;
			}
		}

	//set the info_box to display as block
	show_info_box();

	//fill the innerHTML of each section
	document.getElementById('ss_info').innerHTML = content.ss;
	});

	content.nta = `<img class="city_icons" src="static/NYCCo_explore_01.jpg"/><h5 class = "">Neighbhorhood Tabulation Areas </h5>`;
	var url_nta_intersects = "https://betanyc.carto.com/api/v2/sql/?q=WITH m AS (SELECT the_geom FROM "+ admin_district.table +" WHERE " + admin_district.district_id + " = '"+district_id+"') SELECT ntaname FROM nynta, m WHERE ST_Intersects(nynta.the_geom, m.the_geom) AND (st_area(st_intersection(nynta.the_geom, m.the_geom))/st_area(nynta.the_geom)) > .00025 ORDER BY ntaname &api_key="+api_key;

	fetch(url_nta_intersects)
	.then(function(response) {
		return response.json();
	})
	.then(function(nta_intersects) {
		for(let i = 0; i<nta_intersects.rows.length; i++) {
			content.nta += `<span class = "lighter">${nta_intersects.rows[i].ntaname}</span>`;
			if(i != nta_intersects.rows.length - 1){
				content.nta += `<span class = "lighter">, </span>`;
			}
		}

	//set the info_box to display as block
	show_info_box();

	//fill the innerHTML of each section
	document.getElementById('nta_info').innerHTML = content.nta;
	});

	content.bid = `<img class="city_icons" src="static/NYCCo_jobs_a_01.jpg"/><h5 class = "">Business Improvement District </h5>`;
	var url_bid_intersects = "https://betanyc.carto.com/api/v2/sql/?q=WITH m AS (SELECT the_geom FROM "+ admin_district.table +" WHERE " + admin_district.district_id + " = '"+district_id+"') SELECT bid FROM bids, m WHERE ST_Intersects(bids.the_geom, m.the_geom) AND (st_area(st_intersection(bids.the_geom, m.the_geom))/st_area(bids.the_geom)) > .00025 ORDER BY bid &api_key="+api_key;

	fetch(url_bid_intersects)
	.then(function(response) {
		return response.json();
	})
	.then(function(bid_intersects) {
		for(let i = 0; i<bid_intersects.rows.length; i++) {
			content.bid += `<span class = "lighter">${bid_intersects.rows[i].bid}</span>`;
			if(i != bid_intersects.rows.length - 1){
				content.bid += `<span class = "lighter">, </span>`;
			}
		}

	//set the info_box to display as block
	show_info_box();

	//fill the innerHTML of each section
	document.getElementById('bid_info').innerHTML = content.bid;
	});

}

function reset_map() {
	map.setView([40.73, -74], 11);
	if(marker) {
		marker.remove();
	}
}

function init() {
	//set map view
	map = L.map('map').setView([40.73, -74], 11);
	map.scrollWheelZoom.disable();
  
	//set basemap
	L.tileLayer(
	  'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}{r}.png',
	  {
		maxZoom: 18
	  }
	).addTo(map);
  
	//connect to Carto
	const client = new carto.Client({
	  apiKey: api_key,
	  username: 'betanyc'
	});

	Object.entries(layers).forEach(([id, values]) => {
		values.source = new carto.source.SQL(values.sql);
		

		// Outline the geometries for each dataset. 
		// Colors based on DCP Planning Labs standard colors
		// https://medium.com/nycplanninglabs/experimenting-with-planning-color-standards-15b591d2a90c
		const halo = values.haloFill ? `
				text-halo-fill: ${values.haloFill};
				text-halo-radius: ${values.haloRadius};
			` : ''

		values.style = new carto.style.CartoCSS(`
			#layer {
			polygon-fill: ${values.textColor};
			polygon-opacity: 0;
			text-name: [${values.textName}];
			text-face-name: 'Open Sans Regular';
			text-fill: ${values.textColor};
			text-size: 14;
			${halo}
			}
			#layer::outline {
			line-width: 2.5;
			line-color: ${values.lineColor};
			line-opacity: 1;
			}
			#layer[zoom <= 10]{
				text-size: 10;
			}
			#layer::outline [zoom <= 10]{
				marker-width: 1.5;
			}
		`);

		const extraColumns = 'extraColumns' in values ? values.extraColumns : [] 
		const featureClickColumns = [values.textName, ...extraColumns];

		values.layer = new carto.layer.Layer(values.source, values.style, featureClickColumns);
		
		//add layer to map
		client.addLayer(values.layer)

		//setup switch functions
		document.getElementById('switches').innerHTML += `
			<li>
				<label class="switch">
					<input id="${id}" type="checkbox" name="style" onchange="toggle_layer('${id}')" ${id === 'cd' ? "checked" : ""}>
					<span class="slider"></span>
				</label>
				<h5>${values.name}</h5> <hr class="colored_line" style="border-top-color:${values.lineColor}">
			</li>
		`
		//hide all layers but cd
		if(id !== 'cd') values.layer.hide();
	})

	client.getLeafletLayer().addTo(map);
  
	const popup = L.popup({ closeButton: false });
  }


  export {
	set_address,
	toggle_layer,
	toggle_visibility,
	show_info_box,
	query_district,
	list_overlaps,
	reset_map,
	init,
	map,
	marker,
	layers
  };