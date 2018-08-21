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
	})
	.catch(function(error) {
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



function show_info_box() {
	if (document.getElementById('info_box').style.display = 'none')
		document.getElementById('info_box').style.display = 'block';
}



