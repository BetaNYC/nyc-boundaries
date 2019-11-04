import '../css/style.css';

let marker;
let map;
const api_key = API_KEY;
const layers = {};
const content = {}

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
	.then(function(address) {
		document.getElementById('no_results').style.display = 'none';
		const results = address.results;
		const response = results[0].response;
		const latitude = response.latitude;
		const longitude = response.longitude;
		//set map view to the resulting lat, lon and zoom to 18
		map.setView([latitude, longitude], 15);
		//variables for the innerHTML content that will be filled into each div in the infobox
		content.main = '';
		content.cd = '';
		content.pp = '';
		content.ds = '';
		content.fb = '';
		content.sd = '';
		content.hc = '';
		content.cc = '';
		content.congress = '';
		content.sa = '';
		content.ss = '';
		content.nta = '';
		content.bid = '';

		content.main += `<h3 class = "bold">${adr} ${boro} </h3>
		<div class="separator"></div>`;

		document.getElementById('info').innerHTML = content.main;

		content.cd = `<img class="city_icons" src="static/NYCCo_human_group_a_01.jpg"/><h5 class = "">Community District </h5>`;
		var url_cd_intersects = "https://betanyc.carto.com/api/v2/sql/?q=SELECT borocd FROM nycd WHERE ST_Intersects(ST_SetSRID(ST_MakePoint("+longitude+", "+latitude+"), 4326),nycd.the_geom) &api_key="+api_key;


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

		content.pp = `<img class="city_icons" src="static/NYCCo_jobs_police_01.jpg"/><h5 class = "">Precinct </h5>`;
		var url_pp_intersects = "https://betanyc.carto.com/api/v2/sql/?q=SELECT precinct FROM nypp WHERE ST_Intersects(ST_SetSRID(ST_MakePoint("+longitude+", "+latitude+"), 4326),nypp.the_geom) &api_key="+api_key;

		fetch(url_pp_intersects)
		.then(function(response) {
			return response.json();
		})
		.then(function(pp_intersects) {
			console.log(pp_intersects.rows);
			for(let i = 0; i<pp_intersects.rows.length; i++) {

				if (pp_intersects.rows[i].precinct == 11 || pp_intersects.rows[i].precinct == 12 || pp_intersects.rows[i].precinct == 13) {
					content.pp += `<span class = "lighter"><a href='https://www1.nyc.gov/site/nypd/bureaus/patrol/precincts/midtown-south-precinct.page'>${pp_intersects.rows[i].precinct}</a> </span>`;
				}

				else if (pp_intersects.rows[i].precinct == 14) {
					content.pp += `<span class = "lighter"><a href='https://www1.nyc.gov/site/nypd/bureaus/patrol/precincts/${pp_intersects.rows[i].precinct}th-precinct.page'>${pp_intersects.rows[i].precinct}</a> </span>`;
				}

				else if (pp_intersects.rows[i].precinct == 18) {
					content.pp += `<span class = "lighter"><a href='https://www1.nyc.gov/site/nypd/bureaus/patrol/precincts/midtown-north-precinct.page'>${pp_intersects.rows[i].precinct}</a> </span>`;
				}

				else if (pp_intersects.rows[i].precinct == 22) {
					content.pp += `<span class = "lighter"><a href='https://www1.nyc.gov/site/nypd/bureaus/patrol/precincts/central-park-precinct.page'>${pp_intersects.rows[i].precinct}</a> </span>`;
				}

				else if ((pp_intersects.rows[i].precinct % 10) == 1) {
					content.pp += `<span class = "lighter"><a href='https://www1.nyc.gov/site/nypd/bureaus/patrol/precincts/${pp_intersects.rows[i].precinct}st-precinct.page'>${pp_intersects.rows[i].precinct}</a> </span>`;
				}

				else if ((pp_intersects.rows[i].precinct % 10) == 2) {
					content.pp += `<span class = "lighter"><a href='https://www1.nyc.gov/site/nypd/bureaus/patrol/precincts/${pp_intersects.rows[i].precinct}nd-precinct.page'>${pp_intersects.rows[i].precinct}</a> </span>`;
				}

				else if ((pp_intersects.rows[i].precinct % 10) == 3) {
					content.pp += `<span class = "lighter"><a href='https://www1.nyc.gov/site/nypd/bureaus/patrol/precincts/${pp_intersects.rows[i].precinct}rd-precinct.page'>${pp_intersects.rows[i].precinct}</a> </span>`;
				}

				else {
					content.pp += `<span class = "lighter"><a href='https://www1.nyc.gov/site/nypd/bureaus/patrol/precincts/${pp_intersects.rows[i].precinct}th-precinct.page'>${pp_intersects.rows[i].precinct}</a> </span>`;
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


		content.ds = `<img class="city_icons" src="static/NYCCo_sanitation_garbage_01.jpg"/><h5 class = "">Sanitation District </h5>`;
		var url_ds_intersects = "https://betanyc.carto.com/api/v2/sql/?q=SELECT district FROM dsny WHERE ST_Intersects(ST_SetSRID(ST_MakePoint("+longitude+", "+latitude+"), 4326),dsny.the_geom) &api_key="+api_key;

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


		content.fb = `<img class="city_icons" src="static/NYCCo_jobs_firefighter_01.jpg"/><h5 class = "">Fire Battilion </h5>`;
		var url_fb_intersects = "https://betanyc.carto.com/api/v2/sql/?q=SELECT fire_bn FROM nyfb WHERE ST_Intersects(ST_SetSRID(ST_MakePoint("+longitude+", "+latitude+"), 4326),nyfb.the_geom) &api_key="+api_key;


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

		content.sd= `<img class="city_icons" src="static/NYCCo_food_apple_01.jpg"/><h5 class = "">School District </h5>`;
		var url_sd_intersects = "https://betanyc.carto.com/api/v2/sql/?q=SELECT schooldist FROM nysd WHERE ST_Intersects(ST_SetSRID(ST_MakePoint("+longitude+", "+latitude+"), 4326),nysd.the_geom) &api_key="+api_key;


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

		content.hc = `<img class="city_icons" src="static/NYCCo_jobs_doctor_01.jpg"/><h5 class = "">Health Center District </h5>`;
		var url_hc_intersects = "https://betanyc.carto.com/api/v2/sql/?q=SELECT hcent_dist FROM nyhc WHERE ST_Intersects(ST_SetSRID(ST_MakePoint("+longitude+", "+latitude+"), 4326),nyhc.the_geom) &api_key="+api_key;


		fetch(url_hc_intersects)
		.then(function(response) {
			return response.json();
		})
		.then(function(hc_intersects) {
			for(let i = 0; i<hc_intersects.rows.length; i++) {
				content.hct += `<span class = "lighter">${hc_intersects.rows[i].hcent_dist}</span>`;
				if(i != hc_intersects.rows.length - 1){
					content.hc += `<span class = "lighter">, </span>`;
				}
			}

		//set the info_box to display as block
		show_info_box();

		//fill the innerHTML of each section
		document.getElementById('hc_info').innerHTML = content.hc;
		});


		content.cc = `<img class="city_icons" src="static/NYCCo_government_cityhall_01.jpg"/><h5 class = "">City Council District </h5>`;
		var url_cc_intersects = "https://betanyc.carto.com/api/v2/sql/?q=SELECT coundist FROM nycc WHERE ST_Intersects(ST_SetSRID(ST_MakePoint("+longitude+", "+latitude+"), 4326),nycc.the_geom) &api_key="+api_key;


		fetch(url_cc_intersects)
		.then(function(response) {
			return response.json();
		})
		.then(function(cc_intersects) {
			for(let i = 0; i<cc_intersects.rows.length; i++) {
				content.cc += `<span class = "lighter"><a href='https://council.nyc.gov/district-${cc_intersects.rows[i].coundist}'>${cc_intersects.rows[i].coundist}</a> </span>`;
				if(i != cc_intersects.rows.length - 1){
					content.cc += `<span class = "lighter">, </span>`;
				}
			}

		//set the info_box to display as block
		show_info_box();

		//fill the innerHTML of each section
		document.getElementById('cc_info').innerHTML = content.cc;
		});

		content.congress = `<img class="city_icons" src="static/NYCCo_domestic_a_01.jpg"/><h5 class = "">Congressional District </h5>`;
		var url_congress_intersects = "https://betanyc.carto.com/api/v2/sql/?q=SELECT cong_dist FROM nycongress WHERE ST_Intersects(ST_SetSRID(ST_MakePoint("+longitude+", "+latitude+"), 4326),nycongress.the_geom) &api_key="+api_key;


		fetch(url_congress_intersects)
		.then(function(response) {
			return response.json();
		})
		.then(function(congress_intersects) {
			for(let i = 0; i<congress_intersects.rows.length; i++) {
				content.congress += `<span class = "lighter"><a href='https://www.govtrack.us/congress/members/NY/${congress_intersects.rows[i].cong_dist}'>${congress_intersects.rows[i].cong_dist}</a> </span>`;
				if(i != congress_intersects.rows.length - 1){
					content.congress += `<span class = "lighter">, </span>`;
				}
			}

		//set the info_box to display as block
		show_info_box();

		//fill the innerHTML of each section
		document.getElementById('congress_info').innerHTML = content.congress;
		});

		content.sa = `<img class="city_icons" src="static/NYCCo_governement_law_01.jpg"/><h5 class = "">State Assembly District </h5>`;
		var url_sa_intersects = "https://betanyc.carto.com/api/v2/sql/?q=SELECT assem_dist FROM nysa WHERE ST_Intersects(ST_SetSRID(ST_MakePoint("+longitude+", "+latitude+"), 4326),nysa.the_geom) &api_key="+api_key;


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

		content.ss = `<img class="city_icons" src="static/NYCCo_government_justice_01.jpg"/><h5 class = "">State Senate District </h5>`;
		var url_ss_intersects = "https://betanyc.carto.com/api/v2/sql/?q=SELECT st_sen_dis FROM nyss WHERE ST_Intersects(ST_SetSRID(ST_MakePoint("+longitude+", "+latitude+"), 4326),nyss.the_geom) &api_key="+api_key;


		fetch(url_ss_intersects)
		.then(function(response) {
			return response.json();
		})
		.then(function(ss_intersects) {
			for(let i = 0; i<ss_intersects.rows.length; i++) {
				content.ss += `<span class = "lighter"><a href='https://www.nysenate.gov/district/${ss_intersects.rows[i].st_sen_dis}'>${ss_intersects.rows[i].st_sen_dis}</a></span>`;
				if(i != ss_intersects.rows.length - 1){
					content.ss += `<span class = "lighter">, </span>`;
				}
			}

		//set the info_box to display as block
		show_info_box();

		//fill the innerHTML of each section
		document.getElementById('ss_info').innerHTML = content.ss;
		});

		content.nta = `<img class="city_icons" src="static/NYCCo_explore_01.jpg"/><h5 class = "">Neighbhorhood Tabulation Area </h5>`;
		var url_nta_intersects = "https://betanyc.carto.com/api/v2/sql/?q=SELECT ntaname FROM nynta WHERE ST_Intersects(ST_SetSRID(ST_MakePoint("+longitude+", "+latitude+"), 4326),nynta.the_geom) &api_key="+api_key;


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
		document.getElementById('nta_info').innerHTML =content.nta;
		});

	content.bid = `<img class="city_icons" src="static/NYCCo_jobs_a_01.jpg"/><h5 class = "">Business Improvement District </h5>`;
	var url_bid_intersects = "https://betanyc.carto.com/api/v2/sql/?q=SELECT bid FROM bids WHERE ST_Intersects(ST_SetSRID(ST_MakePoint("+longitude+", "+latitude+"), 4326),bids.the_geom) &api_key="+api_key;


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
	
	if(marker) {
		marker.remove();
	}
	marker = L.marker([latitude, longitude]).addTo(map);

	})
.catch(function(error) {
	console.log(error);
	//if nothing gets returned, display no results
	document.getElementById('no_results').style.display = 'block';
});


}

//Toggle Layers and Visibility
function show_cd() {
	if (document.getElementById('cd').checked) {
		layers.cd.show();
	}
	else {
		layers.cd.hide();
	}
}
function show_pp() {
	if (document.getElementById('pp').checked) {
		layers.pp.show();
	}
	else {
		layers.pp.hide();
	}
}
function show_ds() {
	if (document.getElementById('ds').checked) {
		layers.ds.show();
	}
	else {
		layers.ds.hide();
	}
}
function show_fb() {
	if (document.getElementById('fb').checked) {
		layers.fb.show();
	}
	else {
		layers.fb.hide();
	}
}
function show_sd() {
	if (document.getElementById('sd').checked) {
		layers.sd.show();
	}
	else {
		layers.sd.hide();
	}
}
function show_hc() {
	if (document.getElementById('hc').checked) {
		layers.hc.show();
	}
	else {
		layers.hc.hide();
	}
}
function show_cc() {
	if (document.getElementById('cc').checked) {
		layers.cc.show();
	}
	else {
		layers.cc.hide();
	}
}
function show_congress() {
	if (document.getElementById('congress').checked) {
		layers.congress.show();
	}
	else {
		layers.congress.hide();
	}
}
function show_sa() {
	if (document.getElementById('sa').checked) {
		layers.sa.show();
	}
	else {
		layers.sa.hide();
	}
}
function show_ss() {
	if (document.getElementById('ss').checked) {
		layers.ss.show();
	}
	else {
		layers.ss.hide();
	}
}
function show_nta() {
	if (document.getElementById('nta').checked) {
		layers.nta.show();
	}
	else {
		layers.nta.hide();
	}
}
function show_bid() {
	if (document.getElementById('bid').checked) {
		layers.bid.show();
	}
	else {
		layers.bid.hide();
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

	content.main = `<h3>`+admin_district.title+`: `+district_id+` </h3><div class="separator"></div>`;
	document.getElementById('info').innerHTML = content.main;

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
				content.pp += `<span class = "lighter"><a href='https://www1.nyc.gov/site/nypd/bureaus/patrol/precincts/midtown-south-precinct.page'>${pp_intersects.rows[i].precinct}</a> </span>`;
			}

			else if (pp_intersects.rows[i].precinct == 14) {
				content.pp += `<span class = "lighter"><a href='https://www1.nyc.gov/site/nypd/bureaus/patrol/precincts/${pp_intersects.rows[i].precinct}th-precinct.page'>${pp_intersects.rows[i].precinct}</a> </span>`;
			}

			else if (pp_intersects.rows[i].precinct == 18) {
				content.pp += `<span class = "lighter"><a href='https://www1.nyc.gov/site/nypd/bureaus/patrol/precincts/midtown-north-precinct.page'>${pp_intersects.rows[i].precinct}</a> </span>`;
			}

			else if (pp_intersects.rows[i].precinct == 22) {
				content.pp += `<span class = "lighter"><a href='https://www1.nyc.gov/site/nypd/bureaus/patrol/precincts/central-park-precinct.page'>${pp_intersects.rows[i].precinct}</a> </span>`;
			}

			else if ((pp_intersects.rows[i].precinct % 10) == 1) {
				content.pp += `<span class = "lighter"><a href='https://www1.nyc.gov/site/nypd/bureaus/patrol/precincts/${pp_intersects.rows[i].precinct}st-precinct.page'>${pp_intersects.rows[i].precinct}</a> </span>`;
			}

			else if ((pp_intersects.rows[i].precinct % 10) == 2) {
				content.pp += `<span class = "lighter"><a href='https://www1.nyc.gov/site/nypd/bureaus/patrol/precincts/${pp_intersects.rows[i].precinct}nd-precinct.page'>${pp_intersects.rows[i].precinct}</a> </span>`;
			}

			else if ((pp_intersects.rows[i].precinct % 10) == 3) {
				content.pp += `<span class = "lighter"><a href='https://www1.nyc.gov/site/nypd/bureaus/patrol/precincts/${pp_intersects.rows[i].precinct}rd-precinct.page'>${pp_intersects.rows[i].precinct}</a> </span>`;
			}

			else {
				content.pp += `<span class = "lighter"><a href='https://www1.nyc.gov/site/nypd/bureaus/patrol/precincts/${pp_intersects.rows[i].precinct}th-precinct.page'>${pp_intersects.rows[i].precinct}</a> </span>`;
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
			content.cc += `<span class = "lighter"><a href='https://council.nyc.gov/district-${cc_intersects.rows[i].coundist}'>${cc_intersects.rows[i].coundist}</a> </span>`;
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
			content.congress += `<span class = "lighter"><a href='https://www.govtrack.us/congress/members/NY/${congress_intersects.rows[i].cong_dist}'>${congress_intersects.rows[i].cong_dist}</a> </span>`;
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
			content.ss += `<span class = "lighter"><a href='https://www.nysenate.gov/district/${ss_intersects.rows[i].st_sen_dis}'>${ss_intersects.rows[i].st_sen_dis}</a></span>`;
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
  
	//query CD data source from Carto; remove parks:
	const source_cd = new carto.source.SQL(
	  `SELECT * FROM nycd WHERE (borocd BETWEEN 101 AND 112) or (borocd BETWEEN 201 AND 212) or (borocd BETWEEN 301 AND 318) or (borocd BETWEEN 401 AND 414) or (borocd BETWEEN 501 AND 503)`
	);
  
	//query police precinct data source from Carto:
	const source_pp = new carto.source.SQL(`SELECT * FROM nypp`);
  
	//query DSNY data source from Carto:
	const source_ds = new carto.source.SQL(
	  `SELECT cartodb_id, the_geom, the_geom_webmercator, districtco, district FROM dsny`
	);
  
	//query fire battilion data source from Carto:
	const source_fb = new carto.source.SQL(`SELECT * FROM nyfb`);
  
	//query school district data source from Carto:
	const source_sd = new carto.source.SQL(`SELECT * FROM nysd`);
  
	//query health center data source from Carto:
	const source_hc = new carto.source.SQL(`SELECT * FROM nyhc`);
  
	//query city council data source from Carto:
	const source_cc = new carto.source.SQL(`SELECT * FROM nycc`);
  
	//query congressional district data source from Carto:
	const source_congress = new carto.source.SQL(`SELECT * FROM nycongress`);
  
	//query state assembly data source from Carto:
	const source_sa = new carto.source.SQL(`SELECT * FROM nysa`);
  
	//query state senate data source from Carto:
	const source_ss = new carto.source.SQL(`SELECT * FROM nyss`);
  
	//query neighbhorhood tabulation area data source from Carto:
	const source_nta = new carto.source.SQL(`SELECT * FROM nynta`);
  
	//query neighbhorhood tabulation area data source from Carto:
	const source_bid = new carto.source.SQL(`SELECT * FROM bids`);
  
	//Outline the geometries for each dataset. Colors based on DCP Planning Labs standard colors: https://medium.com/nycplanninglabs/experimenting-with-planning-color-standards-15b591d2a90c
	const style_cd = new carto.style.CartoCSS(`
			  #layer {
				polygon-fill: #826dba;
				polygon-opacity: 0;
				text-name: [borocd];
				text-face-name: 'Open Sans Regular';
				text-size: 14;
			  }
			  #layer::outline {
				line-width: 1.5;
				line-color: #000000;
				line-opacity: 1;
			  }
			  #layer[zoom <= 10]{
				  text-size: 10;
			  }
			  #layer::outline [zoom <= 10]{
				  marker-width: .5;
			  }
		  `);
  
	const style_pp = new carto.style.CartoCSS(`
			   #layer {
				polygon-fill: #12eded;
				polygon-opacity: 0;
				text-name: [precinct];
				text-face-name: 'Open Sans Regular';
				text-fill: #12eded;
				text-size: 14;
			  }
			  #layer::outline {
				line-width: 2.5;
				line-color: #12eded;
				line-opacity: 1;
			  }
			  #layer[zoom <= 10]{
				  text-size: 10;
			  }
			  #layer::outline [zoom <= 10]{
				  marker-width: 1.5;
			  }
		  `);
  
	const style_ds = new carto.style.CartoCSS(`
			   #layer {
				polygon-fill: #12eda4;
				polygon-opacity: 0;
				text-name: [district];
				text-face-name: 'Open Sans Regular';
				text-fill: #12eda4;
				text-size: 14;
			  }
			  #layer::outline {
				line-width: 2.5;
				line-color: #12eda4;
				line-opacity: 1;
			  }
			  #layer[zoom <= 10]{
				  text-size: 10;
			  }
			  #layer::outline [zoom <= 10]{
				  marker-width: 1.5;
			  }
		  `);
  
	const style_fb = new carto.style.CartoCSS(`
			   #layer {
				polygon-fill: #12ed12;
				polygon-opacity: 0;
				text-name: [fire_bn];
				text-face-name: 'Open Sans Regular';
				text-fill: #12ed12;
				text-size: 14;
			  }
			  #layer::outline {
				line-width: 2.5;
				line-color: #12ed12;
				line-opacity: 1;
			  }
			  #layer[zoom <= 10]{
				  text-size: 10;
			  }
			  #layer::outline [zoom <= 10]{
				  marker-width: 1.5;
			  }
		  `);
  
	const style_sd = new carto.style.CartoCSS(`
			   #layer {
				polygon-fill: #eded12;
				polygon-opacity: 0;
				text-name: [schooldist];
				text-face-name: 'Open Sans Regular';
				text-fill: #eded12;
				text-size: 14;
				text-halo-fill: #aaa;
				text-halo-radius: .4;
			  }
			  #layer::outline {
				line-width: 2.5;
				line-color: #eded12;
				line-opacity: 1;
			  }
			  #layer[zoom <= 10]{
				  text-size: 10;
			  }
			  #layer::outline [zoom <= 10]{
				  marker-width: 1.5;
			  }
		  `);
  
	const style_hc = new carto.style.CartoCSS(`
			   #layer {
				polygon-fill: #edbd12;
				polygon-opacity: 0;
				text-name: [hcent_dist];
				text-face-name: 'Open Sans Regular';
				text-fill: #edbd12;
				text-size: 14;
			  }
			  #layer::outline {
				line-width: 2.5;
				line-color: #edbd12;
				line-opacity: 1;
			  }
			  #layer[zoom <= 10]{
				  text-size: 10;
			  }
			  #layer::outline [zoom <= 10]{
				  marker-width: 1.5;
			  }
		  `);
  
	const style_cc = new carto.style.CartoCSS(`
			   #layer {
				polygon-fill: #ed7d12;
				polygon-opacity: 0;
				text-name: [coundist];
				text-face-name: 'Open Sans Regular';
				text-fill: #ed7d12;
				text-size: 14;
			  }
			  #layer::outline {
				line-width: 2.5;
				line-color: #ed7d12;
				line-opacity: 1;
			  }
			  #layer[zoom <= 10]{
				  text-size: 10;
			  }
			  #layer::outline [zoom <= 10]{
				  marker-width: 1.5;
			  }
		  `);
  
	const style_congress = new carto.style.CartoCSS(`
			   #layer {
				polygon-fill: #ed1212;
				polygon-opacity: 0;
				text-name: [cong_dist];
				text-face-name: 'Open Sans Regular';
				text-fill: #ed1212;
				text-size: 14;
			  }
			  #layer::outline {
				line-width: 2.5;
				line-color: #ed1212;
				line-opacity: 1;
			  }
			  #layer[zoom <= 10]{
				  text-size: 10;
			  }
			  #layer::outline [zoom <= 10]{
				  marker-width: 1.5;
			  }
		  `);
  
	const style_sa = new carto.style.CartoCSS(`
			   #layer {
				polygon-fill: #ed1294;
				polygon-opacity: 0;
				text-name: [assem_dist];
				text-face-name: 'Open Sans Regular';
				text-fill: #ed1294;
				text-size: 14;
			  }
			  #layer::outline {
				line-width: 2.5;
				line-color: #ed1294;
				line-opacity: 1;
			  }
			  #layer[zoom <= 10]{
				  text-size: 10;
			  }
			  #layer::outline [zoom <= 10]{
				  marker-width: 1.5;
			  }
		  `);
  
	const style_ss = new carto.style.CartoCSS(`
			  #layer {
				polygon-fill: #9912ed;
				polygon-opacity: 0;
				text-name: [st_sen_dis];
				text-face-name: 'Open Sans Regular';
				text-fill: #9912ed;
				text-size: 14;
			  }
			  #layer::outline {
				line-width: 2.5;
				line-color: #9912ed;
				line-opacity: 1;
			  }
			  #layer[zoom <= 10]{
				  text-size: 10;
			  }
			  #layer::outline [zoom <= 10]{
				  marker-width: 1.5;
			  }
		  `);
  
	const style_nta = new carto.style.CartoCSS(`
			  #layer {
				polygon-fill: #1212ed;
				polygon-opacity: 0;
				text-name: [ntaname];
				text-face-name: 'Open Sans Regular';
				text-fill: #1212ed;
				text-size: 12;
			  }
			  #layer::outline {
				line-width: 2.5;
				line-color: #1212ed;
				line-opacity: 1;
			  }
	  #layer[zoom <= 14]{
				  text-size: 10;
			  }
	  #layer[zoom <= 12]{
				  text-size: 6;
			  }
			  #layer::outline [zoom <= 10]{
				  marker-width: 1.5;
			  }
		  `);
  
	const style_bid = new carto.style.CartoCSS(`
		#layer {
			polygon-fill: #129ded;
			polygon-opacity: 0;
			text-name: [bid];
			text-face-name: 'Open Sans Regular';
			text-fill: #129ded;
			text-size: 12;
		}
		#layer::outline {
		  line-width: 2.5;
			line-color: #129ded;
			line-opacity: 1;
		}
	  #layer[zoom <= 14]{
			text-size: 10;
		}
	  #layer[zoom <= 12]{
			text-size: 6;
		}
		#layer::outline [zoom <= 10]{
			marker-width: 1.5;
		}
		  `);
  
	layers.cd = new carto.layer.Layer(source_cd, style_cd, {
	  featureClickColumns: ['borocd', 'the_geom']
	});
	layers.pp = new carto.layer.Layer(source_pp, style_pp, {
	  featureClickColumns: ['precinct']
	});
	layers.ds = new carto.layer.Layer(source_ds, style_ds, {
	  featureClickColumns: ['district']
	});
	layers.fb = new carto.layer.Layer(source_fb, style_fb, {
	  featureClickColumns: ['fire_bn']
	});
	layers.sd = new carto.layer.Layer(source_sd, style_sd, {
	  featureClickColumns: ['schooldist']
	});
	layers.hc = new carto.layer.Layer(source_hc, style_hc, {
	  featureClickColumns: ['hcent_dist']
	});
	layers.cc = new carto.layer.Layer(source_cc, style_cc, {
	  featureClickColumns: ['coundist']
	});
	layers.congress = new carto.layer.Layer(
	  source_congress,
	  style_congress,
	  {
		featureClickColumns: ['cong_dist']
	  }
	);
	layers.sa = new carto.layer.Layer(source_sa, style_sa, {
	  featureClickColumns: ['assem_dist']
	});
	layers.ss = new carto.layer.Layer(source_ss, style_ss, {
	  featureClickColumns: ['st_sen_dis']
	});
	layers.nta = new carto.layer.Layer(source_nta, style_nta, {
	  featureClickColumns: ['ntacode', 'ntaname']
	});
	layers.bid = new carto.layer.Layer(source_bid, style_bid, {
	  featureClickColumns: ['bid']
	});
  
	//add layer to map
	client.addLayer(layers.nta);
	client.addLayer(layers.ss);
	client.addLayer(layers.sa);
	client.addLayer(layers.congress);
	client.addLayer(layers.cc);
	client.addLayer(layers.hc);
	client.addLayer(layers.sd);
	client.addLayer(layers.fb);
	client.addLayer(layers.ds);
	client.addLayer(layers.pp);
	client.addLayer(layers.cd);
	client.addLayer(layers.bid);
  
	layers.pp.hide();
	layers.ds.hide();
	layers.fb.hide();
	layers.sd.hide();
	layers.hc.hide();
	layers.cc.hide();
	layers.congress.hide();
	layers.sa.hide();
	layers.ss.hide();
	layers.nta.hide();
	layers.bid.hide();
  
	client.getLeafletLayer().addTo(map);
  
	const popup = L.popup({ closeButton: false });
  }

  export {
	set_address,
	show_cd,
	show_cc,
	show_pp,
	show_ds,
	show_fb,
	show_sd,
	show_hc,
	show_congress,
	show_sa,
	show_ss,
	show_nta,
	show_bid,
	toggle_visibility,
	show_info_box,
	query_district,
	list_overlaps,
	reset_map,
	init,
	map,
	marker,
	layers,
	content
  };