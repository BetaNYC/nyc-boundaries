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
		results = address.results;
		response = results[0].response;
		latitude = response.latitude;
		longitude = response.longitude;
		//set map view to the resulting lat, lon and zoom to 18
		map.setView([latitude, longitude], 15);
		//variables for the innerHTML content that will be filled into each div in the infobox
		let content = '';
		let cd_content = '';
		let pp_content = '';
		let ds_content = '';
		let fb_content = '';
		let sd_content = '';
		let hc_content = '';
		let cc_content = '';
		let congress_content = '';
		let sa_content = '';
		let ss_content = '';
		let nta_content = '';

		content += `<h3 class = "bold">${adr} ${boro} </h3>
		<div class="separator"></div>`;

		document.getElementById('info').innerHTML = content;

		cd_content = `<span class = "lighter">Community District: </span>`;
		var url_cd_intersects = "https://betanyc.carto.com/api/v2/sql/?q=SELECT borocd FROM nycd WHERE ST_Intersects(ST_SetSRID(ST_MakePoint("+longitude+", "+latitude+"), 4326),nycd.the_geom) &api_key="+api_key;


		fetch(url_cd_intersects)
		.then(function(response) {
			return response.json();
		})
		.then(function(cd_intersects) {
			for(i=0; i<cd_intersects.rows.length; i++) {

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

				cd_content += `<span class = "lighter">${boro} - ${cd_string}</span>`;
				if(i != cd_intersects.rows.length - 1){
					cd_content += `<span class = "lighter">, </span>`;
				}
			}

		//set the info_box to display as block
		show_info_box();

		cd_content += `<div class="separator"></div>`;

		//fill the innerHTML of each section
		document.getElementById('cd_info').innerHTML = cd_content;
		});

		pp_content = `<span class = "lighter">Precinct: </span>`;
		var url_pp_intersects = "https://betanyc.carto.com/api/v2/sql/?q=SELECT precinct FROM nypp WHERE ST_Intersects(ST_SetSRID(ST_MakePoint("+longitude+", "+latitude+"), 4326),nypp.the_geom) &api_key="+api_key;

		fetch(url_pp_intersects)
		.then(function(response) {
			return response.json();
		})
		.then(function(pp_intersects) {
			console.log(pp_intersects.rows);
			for(i=0; i<pp_intersects.rows.length; i++) {

				if (pp_intersects.rows[i].precinct == 11 || pp_intersects.rows[i].precinct == 12 || pp_intersects.rows[i].precinct == 13) {
					pp_content += `<span class = "lighter"><a href='https://www1.nyc.gov/site/nypd/bureaus/patrol/precincts/midtown-south-precinct.page'>${pp_intersects.rows[i].precinct}</a> </span>`;
				}

				else if (pp_intersects.rows[i].precinct == 14) {
					pp_content += `<span class = "lighter"><a href='https://www1.nyc.gov/site/nypd/bureaus/patrol/precincts/${pp_intersects.rows[i].precinct}th-precinct.page'>${pp_intersects.rows[i].precinct}</a> </span>`;
				}

				else if (pp_intersects.rows[i].precinct == 18) {
					pp_content += `<span class = "lighter"><a href='https://www1.nyc.gov/site/nypd/bureaus/patrol/precincts/midtown-north-precinct.page'>${pp_intersects.rows[i].precinct}</a> </span>`;
				}

				else if (pp_intersects.rows[i].precinct == 22) {
					pp_content += `<span class = "lighter"><a href='https://www1.nyc.gov/site/nypd/bureaus/patrol/precincts/central-park-precinct.page'>${pp_intersects.rows[i].precinct}</a> </span>`;
				}

				else if ((pp_intersects.rows[i].precinct % 10) == 1) {
					pp_content += `<span class = "lighter"><a href='https://www1.nyc.gov/site/nypd/bureaus/patrol/precincts/${pp_intersects.rows[i].precinct}st-precinct.page'>${pp_intersects.rows[i].precinct}</a> </span>`;
				}

				else if ((pp_intersects.rows[i].precinct % 10) == 2) {
					pp_content += `<span class = "lighter"><a href='https://www1.nyc.gov/site/nypd/bureaus/patrol/precincts/${pp_intersects.rows[i].precinct}nd-precinct.page'>${pp_intersects.rows[i].precinct}</a> </span>`;
				}

				else if ((pp_intersects.rows[i].precinct % 10) == 3) {
					pp_content += `<span class = "lighter"><a href='https://www1.nyc.gov/site/nypd/bureaus/patrol/precincts/${pp_intersects.rows[i].precinct}rd-precinct.page'>${pp_intersects.rows[i].precinct}</a> </span>`;
				}

				else {
					pp_content += `<span class = "lighter"><a href='https://www1.nyc.gov/site/nypd/bureaus/patrol/precincts/${pp_intersects.rows[i].precinct}th-precinct.page'>${pp_intersects.rows[i].precinct}</a> </span>`;
				}
				if(i != pp_intersects.rows.length - 1){
					pp_content += `<span class = "lighter">, </span>`;
				}
			}


		//set the info_box to display as block
		show_info_box();

		pp_content += `<div class="separator"></div>`;

		//fill the innerHTML of each section
		document.getElementById('pp_info').innerHTML = pp_content;
		});


		ds_content = `<span class = "lighter">Sanitation District: </span>`;
		var url_ds_intersects = "https://betanyc.carto.com/api/v2/sql/?q=SELECT district FROM dsny WHERE ST_Intersects(ST_SetSRID(ST_MakePoint("+longitude+", "+latitude+"), 4326),dsny.the_geom) &api_key="+api_key;

		fetch(url_ds_intersects)
		.then(function(response) {
			return response.json();
		})
		.then(function(ds_intersects) {
			for(i=0; i<ds_intersects.rows.length; i++) {
				ds_content += `<span class = "lighter">${ds_intersects.rows[i].district}</span>`;
				if(i != ds_intersects.rows.length - 1){
					ds_content += `<span class = "lighter">, </span>`;
				}
			}

		//set the info_box to display as block
		show_info_box();

		ds_content += `<div class="separator"></div>`;

		//fill the innerHTML of each section
		document.getElementById('ds_info').innerHTML = ds_content;
		});


		fb_content = `<span class = "lighter">Fire Battilion: </span>`;
		var url_fb_intersects = "https://betanyc.carto.com/api/v2/sql/?q=SELECT fire_bn FROM nyfb WHERE ST_Intersects(ST_SetSRID(ST_MakePoint("+longitude+", "+latitude+"), 4326),nyfb.the_geom) &api_key="+api_key;


		fetch(url_fb_intersects)
		.then(function(response) {
			return response.json();
		})
		.then(function(fb_intersects) {
			for(i=0; i<fb_intersects.rows.length; i++) {
				fb_content += `<span class = "lighter">${fb_intersects.rows[i].fire_bn}</span>`;
				if(i != fb_intersects.rows.length - 1){
					fb_content += `<span class = "lighter">, </span>`;
				}
			}

		//set the info_box to display as block
		show_info_box();

		fb_content += `<div class="separator"></div>`;

		//fill the innerHTML of each section
		document.getElementById('fb_info').innerHTML = fb_content;
		});

		sd_content = `<span class = "lighter">School District: </span>`;
		var url_sd_intersects = "https://betanyc.carto.com/api/v2/sql/?q=SELECT schooldist FROM nysd WHERE ST_Intersects(ST_SetSRID(ST_MakePoint("+longitude+", "+latitude+"), 4326),nysd.the_geom) &api_key="+api_key;


		fetch(url_sd_intersects)
		.then(function(response) {
			return response.json();
		})
		.then(function(sd_intersects) {
			for(i=0; i<sd_intersects.rows.length; i++) {
				sd_content += `<span class = "lighter">${sd_intersects.rows[i].schooldist}</span>`;
				if(i != sd_intersects.rows.length - 1){
					sd_content += `<span class = "lighter">, </span>`;
				}
			}

		//set the info_box to display as block
		show_info_box();

		sd_content += `<div class="separator"></div>`;

		//fill the innerHTML of each section
		document.getElementById('sd_info').innerHTML = sd_content;
		});

		hc_content = `<span class = "lighter">Health Center District: </span>`;
		var url_hc_intersects = "https://betanyc.carto.com/api/v2/sql/?q=SELECT hcent_dist FROM nyhc WHERE ST_Intersects(ST_SetSRID(ST_MakePoint("+longitude+", "+latitude+"), 4326),nyhc.the_geom) &api_key="+api_key;


		fetch(url_hc_intersects)
		.then(function(response) {
			return response.json();
		})
		.then(function(hc_intersects) {
			for(i=0; i<hc_intersects.rows.length; i++) {
				hc_content += `<span class = "lighter">${hc_intersects.rows[i].hcent_dist}</span>`;
				if(i != hc_intersects.rows.length - 1){
					hc_content += `<span class = "lighter">, </span>`;
				}
			}

		//set the info_box to display as block
		show_info_box();

		hc_content += `<div class="separator"></div>`;

		//fill the innerHTML of each section
		document.getElementById('hc_info').innerHTML = hc_content;
		});


		cc_content = `<span class = "lighter">City Council District: </span>`;
		var url_cc_intersects = "https://betanyc.carto.com/api/v2/sql/?q=SELECT coundist FROM nycc WHERE ST_Intersects(ST_SetSRID(ST_MakePoint("+longitude+", "+latitude+"), 4326),nycc.the_geom) &api_key="+api_key;


		fetch(url_cc_intersects)
		.then(function(response) {
			return response.json();
		})
		.then(function(cc_intersects) {
			for(i=0; i<cc_intersects.rows.length; i++) {
				cc_content += `<span class = "lighter"><a href='https://council.nyc.gov/district-${cc_intersects.rows[i].coundist}'>${cc_intersects.rows[i].coundist}</a> </span>`;
				if(i != cc_intersects.rows.length - 1){
					cc_content += `<span class = "lighter">, </span>`;
				}
			}

		//set the info_box to display as block
		show_info_box();

		cc_content += `<div class="separator"></div>`;

		//fill the innerHTML of each section
		document.getElementById('cc_info').innerHTML = cc_content;
		});

		congress_content = `<span class = "lighter">Congressional District: </span>`;
		var url_congress_intersects = "https://betanyc.carto.com/api/v2/sql/?q=SELECT cong_dist FROM nycongress WHERE ST_Intersects(ST_SetSRID(ST_MakePoint("+longitude+", "+latitude+"), 4326),nycongress.the_geom) &api_key="+api_key;


		fetch(url_congress_intersects)
		.then(function(response) {
			return response.json();
		})
		.then(function(congress_intersects) {
			for(i=0; i<congress_intersects.rows.length; i++) {
				congress_content += `<span class = "lighter"><a href='https://www.govtrack.us/congress/members/NY/${congress_intersects.rows[i].cong_dist}'>${congress_intersects.rows[i].cong_dist}</a> </span>`;
				if(i != congress_intersects.rows.length - 1){
					congress_content += `<span class = "lighter">, </span>`;
				}
			}

		//set the info_box to display as block
		show_info_box();

		congress_content += `<div class="separator"></div>`;

		//fill the innerHTML of each section
		document.getElementById('congress_info').innerHTML = congress_content;
		});

		sa_content = `<span class = "lighter">State Assembly District: </span>`;
		var url_sa_intersects = "https://betanyc.carto.com/api/v2/sql/?q=SELECT assem_dist FROM nysa WHERE ST_Intersects(ST_SetSRID(ST_MakePoint("+longitude+", "+latitude+"), 4326),nysa.the_geom) &api_key="+api_key;


		fetch(url_sa_intersects)
		.then(function(response) {
			return response.json();
		})
		.then(function(sa_intersects) {
			for(i=0; i<sa_intersects.rows.length; i++) {
				sa_content += `<span class = "lighter">${sa_intersects.rows[i].assem_dist}</span>`;
				if(i != sa_intersects.rows.length - 1){
					sa_content += `<span class = "lighter">, </span>`;
				}
			}

		//set the info_box to display as block
		show_info_box();

		sa_content += `<div class="separator"></div>`;

		//fill the innerHTML of each section
		document.getElementById('sa_info').innerHTML = sa_content;
		});

		ss_content = `<span class = "lighter">State Senate District: </span>`;
		var url_ss_intersects = "https://betanyc.carto.com/api/v2/sql/?q=SELECT st_sen_dis FROM nyss WHERE ST_Intersects(ST_SetSRID(ST_MakePoint("+longitude+", "+latitude+"), 4326),nyss.the_geom) &api_key="+api_key;


		fetch(url_ss_intersects)
		.then(function(response) {
			return response.json();
		})
		.then(function(ss_intersects) {
			for(i=0; i<ss_intersects.rows.length; i++) {
				ss_content += `<span class = "lighter"><a href='https://www.nysenate.gov/district/${ss_intersects.rows[i].st_sen_dis}'>${ss_intersects.rows[i].st_sen_dis}</a></span>`;
				if(i != ss_intersects.rows.length - 1){
					ss_content += `<span class = "lighter">, </span>`;
				}
			}

		//set the info_box to display as block
		show_info_box();

		ss_content += `<div class="separator"></div>`;

		//fill the innerHTML of each section
		document.getElementById('ss_info').innerHTML = ss_content;
		});

		nta_content = `<span class = "lighter">Neighbhorhood Tabluation Area: </span>`;
		var url_nta_intersects = "https://betanyc.carto.com/api/v2/sql/?q=SELECT ntaname FROM nynta WHERE ST_Intersects(ST_SetSRID(ST_MakePoint("+longitude+", "+latitude+"), 4326),nynta.the_geom) &api_key="+api_key;


		fetch(url_nta_intersects)
		.then(function(response) {
			return response.json();
		})
		.then(function(nta_intersects) {
			for(i=0; i<nta_intersects.rows.length; i++) {
				nta_content += `<span class = "lighter">${nta_intersects.rows[i].ntaname}</span>`;
				if(i != nta_intersects.rows.length - 1){
					nta_content += `<span class = "lighter">, </span>`;
				}
			}

		//set the info_box to display as block
		show_info_box();

		nta_content += `<div class="separator"></div>`;

		//fill the innerHTML of each section
		document.getElementById('nta_info').innerHTML = nta_content;
		});

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
		layer_cd.show();
	}
	else {
		layer_cd.hide();
	}
}
function show_pp() {
	if (document.getElementById('pp').checked) {
		layer_pp.show();
	}
	else {
		layer_pp.hide();
	}
}
function show_ds() {
	if (document.getElementById('ds').checked) {
		layer_ds.show();
	}
	else {
		layer_ds.hide();
	}
}
function show_fb() {
	if (document.getElementById('fb').checked) {
		layer_fb.show();
	}
	else {
		layer_fb.hide();
	}
}
function show_sd() {
	if (document.getElementById('sd').checked) {
		layer_sd.show();
	}
	else {
		layer_sd.hide();
	}
}
function show_hc() {
	if (document.getElementById('hc').checked) {
		layer_hc.show();
	}
	else {
		layer_hc.hide();
	}
}
function show_cc() {
	if (document.getElementById('cc').checked) {
		layer_cc.show();
	}
	else {
		layer_cc.hide();
	}
}function show_congress() {
	if (document.getElementById('congress').checked) {
		layer_congress.show();
	}
	else {
		layer_congress.hide();
	}
}
function show_sa() {
	if (document.getElementById('sa').checked) {
		layer_sa.show();
	}
	else {
		layer_sa.hide();
	}
}
function show_ss() {
	if (document.getElementById('ss').checked) {
		layer_ss.show();
	}
	else {
		layer_ss.hide();
	}
}
function show_nta() {
	if (document.getElementById('nta').checked) {
		layer_nta.show();
	}
	else {
		layer_nta.hide();
	}
}

//Turn on the selected layer and turn off all other layers
function hide_all_unselected_districts(id) {
	var districts = ['cd','pp','ds','fb','sd','hc','cc','congress','sa','ss','nta'];
	if(!document.getElementById(id).checked){
		var element = document.getElementById(id);
		element.checked = true;
		var event = new Event('change');
		element.dispatchEvent(event);
	}
	for (i=0; i<districts.length; i++){
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

			for(i=0; i<districts.rows.length; i++) {
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

	cd_content = `<span class = "lighter">Community District: </span>`;
	var url_cd_intersects = "https://betanyc.carto.com/api/v2/sql/?q=WITH m AS (SELECT the_geom FROM "+ admin_district.table +" WHERE " + admin_district.district_id + " = '"+district_id+"') SELECT borocd FROM nycd, m WHERE ST_Intersects(nycd.the_geom, m.the_geom) AND (st_area(st_intersection(nycd.the_geom, m.the_geom))/st_area(nycd.the_geom)) > .005 &api_key="+api_key;

	fetch(url_cd_intersects)
	.then(function(response) {
		return response.json();
	})
	.then(function(cd_intersects) {
		for(i=0; i<cd_intersects.rows.length; i++) {

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

			cd_content += `<span class = "lighter">${boro} - ${cd_string}</span>`;
			if(i != cd_intersects.rows.length - 1){
				cd_content += `<span class = "lighter">, </span>`;
			}
		}

	//set the info_box to display as block
	show_info_box();

	cd_content += `<div class="separator"></div>`;

	//fill the innerHTML of each section
	document.getElementById('cd_info').innerHTML = cd_content;
	});

	pp_content = `<span class = "lighter">Precincts: </span>`;
	var url_pp_intersects = "https://betanyc.carto.com/api/v2/sql/?q=WITH m AS (SELECT the_geom FROM "+ admin_district.table +" WHERE " + admin_district.district_id + " = '"+district_id+"') SELECT precinct FROM nypp, m WHERE ST_Intersects(nypp.the_geom, m.the_geom) AND (st_area(st_intersection(nypp.the_geom, m.the_geom))/st_area(nypp.the_geom)) > .005 &api_key="+api_key;

	fetch(url_pp_intersects)
	.then(function(response) {
		return response.json();
	})
	.then(function(pp_intersects) {
		for(i=0; i<pp_intersects.rows.length; i++) {

			if (pp_intersects.rows[i].precinct == 11 || pp_intersects.rows[i].precinct == 12 || pp_intersects.rows[i].precinct == 13) {
				pp_content += `<span class = "lighter"><a href='https://www1.nyc.gov/site/nypd/bureaus/patrol/precincts/midtown-south-precinct.page'>${pp_intersects.rows[i].precinct}</a> </span>`;
			}

			else if (pp_intersects.rows[i].precinct == 14) {
				pp_content += `<span class = "lighter"><a href='https://www1.nyc.gov/site/nypd/bureaus/patrol/precincts/${pp_intersects.rows[i].precinct}th-precinct.page'>${pp_intersects.rows[i].precinct}</a> </span>`;
			}

			else if (pp_intersects.rows[i].precinct == 18) {
				pp_content += `<span class = "lighter"><a href='https://www1.nyc.gov/site/nypd/bureaus/patrol/precincts/midtown-north-precinct.page'>${pp_intersects.rows[i].precinct}</a> </span>`;
			}

			else if (pp_intersects.rows[i].precinct == 22) {
				pp_content += `<span class = "lighter"><a href='https://www1.nyc.gov/site/nypd/bureaus/patrol/precincts/central-park-precinct.page'>${pp_intersects.rows[i].precinct}</a> </span>`;
			}

			else if ((pp_intersects.rows[i].precinct % 10) == 1) {
				pp_content += `<span class = "lighter"><a href='https://www1.nyc.gov/site/nypd/bureaus/patrol/precincts/${pp_intersects.rows[i].precinct}st-precinct.page'>${pp_intersects.rows[i].precinct}</a> </span>`;
			}

			else if ((pp_intersects.rows[i].precinct % 10) == 2) {
				pp_content += `<span class = "lighter"><a href='https://www1.nyc.gov/site/nypd/bureaus/patrol/precincts/${pp_intersects.rows[i].precinct}nd-precinct.page'>${pp_intersects.rows[i].precinct}</a> </span>`;
			}

			else if ((pp_intersects.rows[i].precinct % 10) == 3) {
				pp_content += `<span class = "lighter"><a href='https://www1.nyc.gov/site/nypd/bureaus/patrol/precincts/${pp_intersects.rows[i].precinct}rd-precinct.page'>${pp_intersects.rows[i].precinct}</a> </span>`;
			}

			else {
				pp_content += `<span class = "lighter"><a href='https://www1.nyc.gov/site/nypd/bureaus/patrol/precincts/${pp_intersects.rows[i].precinct}th-precinct.page'>${pp_intersects.rows[i].precinct}</a> </span>`;
			}
			if(i != pp_intersects.rows.length - 1){
				pp_content += `<span class = "lighter">, </span>`;
			}
		}


	//set the info_box to display as block
	show_info_box();

	pp_content += `<div class="separator"></div>`;

	//fill the innerHTML of each section
	document.getElementById('pp_info').innerHTML = pp_content;
	});

	ds_content = `<span class = "lighter">Sanitation Districts: </span>`;
	var url_ds_intersects = "https://betanyc.carto.com/api/v2/sql/?q=WITH m AS (SELECT the_geom FROM "+ admin_district.table +" WHERE " + admin_district.district_id + " = '"+district_id+"') SELECT district FROM dsny, m WHERE ST_Intersects(dsny.the_geom, m.the_geom) AND (st_area(st_intersection(dsny.the_geom, m.the_geom))/st_area(dsny.the_geom)) > .005 &api_key="+api_key;

	fetch(url_ds_intersects)
	.then(function(response) {
		return response.json();
	})
	.then(function(ds_intersects) {
		for(i=0; i<ds_intersects.rows.length; i++) {
			ds_content += `<span class = "lighter">${ds_intersects.rows[i].district}</span>`;
			if(i != ds_intersects.rows.length - 1){
				ds_content += `<span class = "lighter">, </span>`;
			}
		}

	//set the info_box to display as block
	show_info_box();

	ds_content += `<div class="separator"></div>`;

	//fill the innerHTML of each section
	document.getElementById('ds_info').innerHTML = ds_content;
	});

	fb_content = `<span class = "lighter">Fire Battilions: </span>`;
	var url_fb_intersects = "https://betanyc.carto.com/api/v2/sql/?q=WITH m AS (SELECT the_geom FROM "+ admin_district.table +" WHERE " + admin_district.district_id + " = '"+district_id+"') SELECT fire_bn FROM nyfb, m WHERE ST_Intersects(nyfb.the_geom, m.the_geom) AND (st_area(st_intersection(nyfb.the_geom, m.the_geom))/st_area(nyfb.the_geom)) > .005 &api_key="+api_key;

	fetch(url_fb_intersects)
	.then(function(response) {
		return response.json();
	})
	.then(function(fb_intersects) {
		for(i=0; i<fb_intersects.rows.length; i++) {
			fb_content += `<span class = "lighter">${fb_intersects.rows[i].fire_bn}</span>`;
			if(i != fb_intersects.rows.length - 1){
				fb_content += `<span class = "lighter">, </span>`;
			}
		}

	//set the info_box to display as block
	show_info_box();

	fb_content += `<div class="separator"></div>`;

	//fill the innerHTML of each section
	document.getElementById('fb_info').innerHTML = fb_content;
	});

	sd_content = `<span class = "lighter">School Districts: </span>`;
	var url_sd_intersects = "https://betanyc.carto.com/api/v2/sql/?q=WITH m AS (SELECT the_geom FROM "+ admin_district.table +" WHERE " + admin_district.district_id + " = '"+district_id+"') SELECT schooldist FROM nysd, m WHERE ST_Intersects(nysd.the_geom, m.the_geom) AND (st_area(st_intersection(nysd.the_geom, m.the_geom))/st_area(nysd.the_geom)) > .005 &api_key="+api_key;

	fetch(url_sd_intersects)
	.then(function(response) {
		return response.json();
	})
	.then(function(sd_intersects) {
		for(i=0; i<sd_intersects.rows.length; i++) {
			sd_content += `<span class = "lighter">${sd_intersects.rows[i].schooldist}</span>`;
			if(i != sd_intersects.rows.length - 1){
				sd_content += `<span class = "lighter">, </span>`;
			}
		}

	//set the info_box to display as block
	show_info_box();

	sd_content += `<div class="separator"></div>`;

	//fill the innerHTML of each section
	document.getElementById('sd_info').innerHTML = sd_content;
	});

	hc_content = `<span class = "lighter">Health Center Districts: </span>`;
	var url_hc_intersects = "https://betanyc.carto.com/api/v2/sql/?q=WITH m AS (SELECT the_geom FROM "+ admin_district.table +" WHERE " + admin_district.district_id + " = '"+district_id+"') SELECT hcent_dist FROM nyhc, m WHERE ST_Intersects(nyhc.the_geom, m.the_geom) AND (st_area(st_intersection(nyhc.the_geom, m.the_geom))/st_area(nyhc.the_geom)) > .005 &api_key="+api_key;

	fetch(url_hc_intersects)
	.then(function(response) {
		return response.json();
	})
	.then(function(hc_intersects) {
		for(i=0; i<hc_intersects.rows.length; i++) {
			hc_content += `<span class = "lighter">${hc_intersects.rows[i].hcent_dist}</span>`;
			if(i != hc_intersects.rows.length - 1){
				hc_content += `<span class = "lighter">, </span>`;
			}
		}

	//set the info_box to display as block
	show_info_box();

	hc_content += `<div class="separator"></div>`;

	//fill the innerHTML of each section
	document.getElementById('hc_info').innerHTML = hc_content;
	});


	cc_content = `<span class = "lighter">City Council Districts: </span>`;
	var url_cc_intersects = "https://betanyc.carto.com/api/v2/sql/?q=WITH m AS (SELECT the_geom FROM "+ admin_district.table +" WHERE " + admin_district.district_id + " = '"+district_id+"') SELECT coundist FROM nycc, m WHERE ST_Intersects(nycc.the_geom, m.the_geom) AND (st_area(st_intersection(nycc.the_geom, m.the_geom))/st_area(nycc.the_geom)) > .005 &api_key="+api_key;

	fetch(url_cc_intersects)
	.then(function(response) {
		return response.json();
	})
	.then(function(cc_intersects) {
		for(i=0; i<cc_intersects.rows.length; i++) {
			cc_content += `<span class = "lighter"><a href='https://council.nyc.gov/district-${cc_intersects.rows[i].coundist}'>${cc_intersects.rows[i].coundist}</a> </span>`;
			if(i != cc_intersects.rows.length - 1){
				cc_content += `<span class = "lighter">, </span>`;
			}
		}

	//set the info_box to display as block
	show_info_box();

	cc_content += `<div class="separator"></div>`;

	//fill the innerHTML of each section
	document.getElementById('cc_info').innerHTML = cc_content;
	});

	congress_content = `<span class = "lighter">Congressional Districts: </span>`;
	var url_congress_intersects = "https://betanyc.carto.com/api/v2/sql/?q=WITH m AS (SELECT the_geom FROM "+ admin_district.table +" WHERE " + admin_district.district_id + " = '"+district_id+"') SELECT cong_dist FROM nycongress, m WHERE ST_Intersects(nycongress.the_geom, m.the_geom) AND (st_area(st_intersection(nycongress.the_geom, m.the_geom))/st_area(nycongress.the_geom)) > .005 &api_key="+api_key;

	fetch(url_congress_intersects)
	.then(function(response) {
		return response.json();
	})
	.then(function(congress_intersects) {
		for(i=0; i<congress_intersects.rows.length; i++) {
			congress_content += `<span class = "lighter"><a href='https://www.govtrack.us/congress/members/NY/${congress_intersects.rows[i].cong_dist}'>${congress_intersects.rows[i].cong_dist}</a> </span>`;
			if(i != congress_intersects.rows.length - 1){
				congress_content += `<span class = "lighter">, </span>`;
			}
		}

	//set the info_box to display as block
	show_info_box();

	congress_content += `<div class="separator"></div>`;

	//fill the innerHTML of each section
	document.getElementById('congress_info').innerHTML = congress_content;
	});

	sa_content = `<span class = "lighter">State Assembly Districts: </span>`;
	var url_sa_intersects = "https://betanyc.carto.com/api/v2/sql/?q=WITH m AS (SELECT the_geom FROM "+ admin_district.table +" WHERE " + admin_district.district_id + " = '"+district_id+"') SELECT assem_dist FROM nysa, m WHERE ST_Intersects(nysa.the_geom, m.the_geom) AND (st_area(st_intersection(nysa.the_geom, m.the_geom))/st_area(nysa.the_geom)) > .005 &api_key="+api_key;

	fetch(url_sa_intersects)
	.then(function(response) {
		return response.json();
	})
	.then(function(sa_intersects) {
		for(i=0; i<sa_intersects.rows.length; i++) {
			sa_content += `<span class = "lighter">${sa_intersects.rows[i].assem_dist}</span>`;
			if(i != sa_intersects.rows.length - 1){
				sa_content += `<span class = "lighter">, </span>`;
			}
		}

	//set the info_box to display as block
	show_info_box();

	sa_content += `<div class="separator"></div>`;

	//fill the innerHTML of each section
	document.getElementById('sa_info').innerHTML = sa_content;
	});

	ss_content = `<span class = "lighter">State Senate Districts: </span>`;
	var url_ss_intersects = "https://betanyc.carto.com/api/v2/sql/?q=WITH m AS (SELECT the_geom FROM "+ admin_district.table +" WHERE " + admin_district.district_id + " = '"+district_id+"') SELECT st_sen_dis FROM nyss, m WHERE ST_Intersects(nyss.the_geom, m.the_geom) AND (st_area(st_intersection(nyss.the_geom, m.the_geom))/st_area(nyss.the_geom)) > .005 &api_key="+api_key;

	fetch(url_ss_intersects)
	.then(function(response) {
		return response.json();
	})
	.then(function(ss_intersects) {
		for(i=0; i<ss_intersects.rows.length; i++) {
			ss_content += `<span class = "lighter"><a href='https://www.nysenate.gov/district/${ss_intersects.rows[i].st_sen_dis}'>${ss_intersects.rows[i].st_sen_dis}</a></span>`;
			if(i != ss_intersects.rows.length - 1){
				ss_content += `<span class = "lighter">, </span>`;
			}
		}

	//set the info_box to display as block
	show_info_box();

	ss_content += `<div class="separator"></div>`;

	//fill the innerHTML of each section
	document.getElementById('ss_info').innerHTML = ss_content;
	});

	nta_content = `<span class = "lighter">Neighbhorhood Tabluation Areas: </span>`;
	var url_nta_intersects = "https://betanyc.carto.com/api/v2/sql/?q=WITH m AS (SELECT the_geom FROM "+ admin_district.table +" WHERE " + admin_district.district_id + " = '"+district_id+"') SELECT ntaname FROM nynta, m WHERE ST_Intersects(nynta.the_geom, m.the_geom) AND (st_area(st_intersection(nynta.the_geom, m.the_geom))/st_area(nynta.the_geom)) > .005 &api_key="+api_key;

	fetch(url_nta_intersects)
	.then(function(response) {
		return response.json();
	})
	.then(function(nta_intersects) {
		for(i=0; i<nta_intersects.rows.length; i++) {
			nta_content += `<span class = "lighter">${nta_intersects.rows[i].ntaname}</span>`;
			if(i != nta_intersects.rows.length - 1){
				nta_content += `<span class = "lighter">, </span>`;
			}
		}

	//set the info_box to display as block
	show_info_box();

	nta_content += `<div class="separator"></div>`;

	//fill the innerHTML of each section
	document.getElementById('nta_info').innerHTML = nta_content;
	});

}
