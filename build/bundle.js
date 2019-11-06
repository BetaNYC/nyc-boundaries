(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.window = global.window || {}));
}(this, (function (exports) { 'use strict';

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

      return arr2;
    }
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
  }

  function _iterableToArrayLimit(arr, i) {
    if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) {
      return;
    }

    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
  }

  function styleInject(css, ref) {
    if ( ref === void 0 ) ref = {};
    var insertAt = ref.insertAt;

    if (!css || typeof document === 'undefined') { return; }

    var head = document.head || document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    style.type = 'text/css';

    if (insertAt === 'top') {
      if (head.firstChild) {
        head.insertBefore(style, head.firstChild);
      } else {
        head.appendChild(style);
      }
    } else {
      head.appendChild(style);
    }

    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
  }

  var css = "/* Body, Headers, and Text*/\n* {\n\tmargin:0;\n\tpadding:0;\n}\n\nhtml {\n\tbox-sizing:border-box;\n\theight:100%;\n}\n\nbody {\n\tbackground:#f2f6f9;\n\theight:100%;\n\tfont-family:\"lato\";\n\tfont-weight:normal;\n\toverflow: hidden;\n\t-webkit-touch-callout: none;\n    -webkit-user-select: none;\n    -moz-user-select: none;\n    -ms-user-select: none;\n    user-select: none;\n}\n\nh1, h2, h3 {\n\tfont-family:\"Playfair Display\" !important;\n\tfont-weight:1000 !important;\n\tfont-size:25px !important;\n\tpadding-bottom: 5px;\n\tmargin: 0px 0px !important;\n\ttext-align: center;\n}\n\nh1 {\n\tcolor:black !important;\n}\n\nh4 {\n\ttext-align:center;\n}\n\nh5, h6 {\n\ttext-align:justify;\n}\n\nh4, h5, h6 {\n\tfont-family:\"lato\" !important;\n\tfont-weight:normal !important;\n\tpadding-bottom: 5px;\n\tmargin: 0px 0px !important;\n}\n\nlabel {\n\tfont-family:\"lato\" !important;\n}\n\np {\n\tfont-family:\"lato\" !important;\n}\nspan {\n\tfont-size:12px;\n\tfont-family:\"lato\" !important;\n}\n\n/*Text Styles*/\n.bold {\n\tfont-weight:bold !important;\n}\n\n.lighter {\n\tcolor:#444444;\n}\n\n/*Toolboxes and Infoboxes*/\n.separator {\n\tmin-height: 1px;\n\tbackground-color: rgba(46, 60, 67, 0.08);\n\tmargin: 16px 0;\n}\n\n.toolbox_left {\n\tposition: absolute;\n\ttop: 0px;\n\tleft: 0px;\n\tbottom:0px;\n\twidth: 30%;\n\t/*min-width:200px;\n\tmax-width: 30%;*/\n\theight:100%;\n\tz-index: 2;\n\toverflow-y:hidden;\n}\n\n@media all and (min-width: 1000px) {\n    .toolbox_left {\n\t\twidth:350px\n\t}\n}\n\n@media all and (max-width: 1000px) {\n    .toolbox_left {\n\t\twidth:300px\n\t}\n}\n\n@media all and (max-width: 800px) {\n    .toolbox_left {\n\t\twidth:200px\n\t}\n}\n\n#about {\n\tmargin-top:20px;\n}\n\n.logo {\n\twidth:50px;\n\tmargin:auto;\n\tdisplay:block;\n}\n\n.logo_caption {\n\tfont-size:10px;\n\ttext-align:center;\n\tmargin-top:5px;\n}\n\n.box {\n\theight:100%;\n\toverflow-y:auto;\n\tposition:relative;\n\toverflow-x:hidden;\n\tbackground-color:#fff;\n}\n\n.toolbox {\n\tposition:relative;\n\toverflow-y:hidden;\n\n}\n\n#info_box {\n\toverflow-y:auto;\n\tposition:relative;\n\toverflow-x:hidden;\n\theight:600px;\n}\n\n#info_box {\n\tdisplay:none;\n}\n\n.close_button,.reset_map{\n\tfont-size:11px;\n\tfloat:right;\n}\n\n\n#footer {\n\ttext-align:center !important;\n}\n\n.footer_text {\n\tfont-size:11px;\n}\n\n/*Icons and Legends*/\nhr {\n\tmargin-bottom: 10px;\n\tmargin-top: 10px;\n}\n\n.colored_line {\n\tborder:none;\n\tborder-top:3px solid #000;\n\tcolor:#fff;\n\tbackground-color:#fff;\n\theight:1px;\n\twidth:15%;\n\tmargin-left: 10px;\n}\n\n.legend_text {\n\tfont-size:11px;\n}\n\n.switch {\n  position: relative;\n  display: inline-block;\n  width: 22px;\n  height: 14px;\n  margin-right: 5px;\n}\n\n.switch input {display:none;}\n\n.slider {\n  position: absolute;\n  cursor: pointer;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background-color: #ccc;\n  transition: .4s;\n}\n\n.slider:before {\n  position: absolute;\n  content: \"\";\n  height: 8px;\n  width: 8px;\n  left: 3px;\n  bottom: 3px;\n  background-color: white;\n  transition: .4s;\n}\n\ninput:checked + .slider {\n  background-color: #6a6a6a;\n}\n\ninput:focus + .slider {\n  box-shadow: 0 0 1px #6a6a6a;\n}\n\ninput:checked + .slider:before {\n  -webkit-transform: translateX(8px);\n  transform: translateX(8px);\n}\n\n/*Map*/\n#container {\n\tdisplay:flex;\n\twidth:100%;\n\theight:100%;\n}\n\n#map {\n\tflex:1;\n}\n\n@media all and (min-width: 1000px) {\n    .leaflet-left{\n        left: 335px;\n    }\n}\n\n@media all and (max-width: 1000px) {\n    .leaflet-left{\n        left: 285px;\n    }\n}\n\n@media all and (max-width: 800px) {\n    .leaflet-left{\n        left: 185px;\n \t}\n}\n\n.leaflet-control-zoom-out {\n\tbackground-color:#fff !important;\n}\n\n.leaflet-control-zoom-in {\n\tbackground-color:#fff !important;\n}\n\n.leaflet-bar {\n\tborder:1px solid rgba(46, 60, 67, 0.08) !important;\n}\n\n/*Search*/\n#no_results {\n\tdisplay:none;\n}\n\n.search_label {\n\tfont-size:14px !important;\n}\n\ninput[type=submit] {\n  background-color: #6a6a6a;\n  border: none;\n  color: white;\n  padding: 5px 10px;\n  text-decoration: none;\n  cursor: pointer;\n\tfont-family:\"lato\" !important;\n\tmargin-top:5px;\n}\n.search_bar {\n\twidth:100%;\n  padding: 5px 15px;\n  box-sizing: border-box;\n}\n\n.select_custom {\n\tposition: relative;\n\tdisplay: inline-block;\n\twidth: 100%;\n\tmargin-top:5px;\n\tmargin-bottom: 5px;\n}\n\n.select_custom select {\n\tdisplay: inline-block;\n\twidth: 100%;\n\tpadding: 10px 15px;\n\tcursor: pointer;\n\tcolor: #7b7b7b;\n\tborder: 0;\n\tborder-radius: 0;\n\toutline: 0;\n\tbackground: #e6e6e6;\n\tappearance: none;\n\t-webkit-appearance: none;\n\t-moz-appearance: none;\n}\n\n.select_custom select::-ms-expand {\n\tdisplay: none;\n}\n\n.select_custom select:hover,\n.select_custom select:focus {\n\tcolor: #000;\n\tbackground: #ccc;\n}\n\n.select_custom select:disabled {\n\tpointer-events: none;\n\topacity: .5;\n}\n\n.select_arrow {\n\tposition: absolute;\n\ttop: 12px;\n\tright: 15px;\n\twidth: 0;\n\theight: 0;\n\tpointer-events: none;\n\tborder-width: 8px 5px 0 5px;\n\tborder-style: solid;\n\tborder-color: #7b7b7b transparent transparent transparent;\n}\n.select_custom select:hover ~ .select_arrow,\n.select_custom select:focus ~ .select_arrow {\n\tborder-top-color: #000;\n}\n\n.select_custom select:disabled ~ .select_arrow {\n\tborder-top-color: #ccc;\n}\n\n.city_icons {\n\twidth:50px;\n\tfloat: left;\n\tmargin-right:10px;\n}\n/*Clears and Margins*/\n.clearfix {\n\toverflow: auto;\n\twidth:100%;\n}\n";
  styleInject(css);

  function format_cd(boro, cd) {
    var text;

    switch (boro) {
      case '1':
        text = "Manhattan - ".concat(cd);
        break;

      case '2':
        text = "Bronx - ".concat(cd);
        break;

      case '3':
        text = "Brooklyn - ".concat(cd);
        break;

      case '4':
        text = "Queens - ".concat(cd);
        break;

      case '5':
        text = "Staten Island - ".concat(cd);
        break;

      default:
        text = "".concat(boro, " - ").concat(cd);
    }

    return "<span class = \"lighter\">".concat(text, "</span>");
  }
  function format_pp(precinct) {
    if (precinct == 11 || precinct == 12 || precinct == 13) {
      return "<span class = \"lighter\"><a target=\"_blank\" href='https://www1.nyc.gov/site/nypd/bureaus/patrol/precincts/midtown-south-precinct.page'>".concat(precinct, "</a> </span>");
    } else if (precinct == 14) {
      return "<span class = \"lighter\"><a target=\"_blank\" href='https://www1.nyc.gov/site/nypd/bureaus/patrol/precincts/".concat(precinct, "th-precinct.page'>").concat(precinct, "</a> </span>");
    } else if (precinct == 18) {
      return "<span class = \"lighter\"><a target=\"_blank\" href='https://www1.nyc.gov/site/nypd/bureaus/patrol/precincts/midtown-north-precinct.page'>".concat(precinct, "</a> </span>");
    } else if (precinct == 22) {
      return "<span class = \"lighter\"><a target=\"_blank\" href='https://www1.nyc.gov/site/nypd/bureaus/patrol/precincts/central-park-precinct.page'>".concat(precinct, "</a> </span>");
    } else if (precinct % 10 == 1) {
      return "<span class = \"lighter\"><a target=\"_blank\" href='https://www1.nyc.gov/site/nypd/bureaus/patrol/precincts/".concat(precinct, "st-precinct.page'>").concat(precinct, "</a> </span>");
    } else if (precinct % 10 == 2) {
      return "<span class = \"lighter\"><a target=\"_blank\" href='https://www1.nyc.gov/site/nypd/bureaus/patrol/precincts/".concat(precinct, "nd-precinct.page'>").concat(precinct, "</a> </span>");
    } else if (precinct % 10 == 3) {
      return "<span class = \"lighter\"><a target=\"_blank\" href='https://www1.nyc.gov/site/nypd/bureaus/patrol/precincts/".concat(precinct, "rd-precinct.page'>").concat(precinct, "</a> </span>");
    } else {
      return "<span class = \"lighter\"><a target=\"_blank\" href='https://www1.nyc.gov/site/nypd/bureaus/patrol/precincts/".concat(precinct, "th-precinct.page'>").concat(precinct, "</a> </span>");
    }
  }
  function format_default(name) {
    var url = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    if (url) {
      return "<span class = \"lighter\"><a target=\"_blank\" href='".concat(url, "'>").concat(name, "</a> </span>");
    }

    return "<span class = \"lighter\">".concat(name, "</span>");
  }

  var _layers;

  var proxyurl = 'https://cors-anywhere.herokuapp.com/';


  var api_key = 'SsgRzH9qQSNu92IOf76_9Q';
  var layers = (_layers = {
    cd: {
      name: 'Community Districts',
      //remove parks
      sql: "SELECT * FROM all_bounds WHERE id = 'cd' AND NOT namecol IN ('164','226','227','228','355','356','480','481','482')",
      textColor: '#000000',
      lineColor: '#000000',
      icon: 'static/NYCCo_human_group_a_01.jpg',
      formatContent: function formatContent(name, alt) {
        return format_cd(name[0], name.substring(1, 3));
      }
    },
    pp: {
      name: 'Police Precincts',
      sql: "SELECT * FROM all_bounds WHERE id = 'pp'",
      textColor: '#12eded',
      lineColor: '#12eded',
      icon: 'static/NYCCo_jobs_police_01.jpg',
      formatContent: function formatContent(name, alt) {
        return format_pp(name);
      }
    },
    sd: {
      name: 'Sanitation Districts',
      sql: "SELECT * FROM all_bounds WHERE id = 'sd'",
      textColor: '#12eda4',
      lineColor: '#12eda4',
      icon: 'static/NYCCo_sanitation_garbage_01.jpg',
      formatContent: function formatContent(name, alt) {
        return format_default(name);
      }
    },
    fb: {
      name: 'Fire Battilion',
      sql: "SELECT * FROM all_bounds WHERE id = 'fb'",
      textColor: '#12ed12',
      lineColor: '#12ed12',
      icon: 'static/NYCCo_jobs_firefighter_01.jpg',
      formatContent: function formatContent(name, alt) {
        return format_default(name);
      }
    }
  }, _defineProperty(_layers, "sd", {
    name: 'School Districts',
    sql: "SELECT * FROM all_bounds WHERE id = 'sd'",
    textColor: '#eded12',
    lineColor: '#eded12',
    haloFill: '#000',
    haloRadius: 0.8,
    icon: 'static/NYCCo_food_apple_01.jpg',
    formatContent: function formatContent(name, alt) {
      return format_default(name);
    }
  }), _defineProperty(_layers, "hc", {
    name: 'Health Center Districts',
    sql: "SELECT * FROM all_bounds WHERE id = 'hc'",
    textColor: '#edbd12',
    lineColor: '#edbd12',
    icon: 'static/NYCCo_jobs_doctor_01.jpg',
    formatContent: function formatContent(name, alt) {
      return format_default(name);
    }
  }), _defineProperty(_layers, "cc", {
    name: 'City Council Districts',
    sql: "SELECT * FROM all_bounds WHERE id = 'cc'",
    textColor: '#ed7d12',
    lineColor: '#ed7d12',
    icon: 'static/NYCCo_government_cityhall_01.jpg',
    formatContent: function formatContent(name, alt) {
      return format_default(name, "https://council.nyc.gov/district-".concat(name));
    }
  }), _defineProperty(_layers, "nycongress", {
    name: 'Congressional Districts',
    sql: "SELECT * FROM all_bounds WHERE id = 'nycongress'",
    textColor: '#ed1212',
    lineColor: '#ed1212',
    icon: 'static/NYCCo_domestic_a_01.jpg',
    formatContent: function formatContent(name, alt) {
      return format_default(name, "https://www.govtrack.us/congress/members/NY/".concat(name));
    }
  }), _defineProperty(_layers, "sa", {
    name: 'State Assembly Districts',
    sql: "SELECT * FROM all_bounds WHERE id = 'sa'",
    textColor: '#ed1294',
    lineColor: '#ed1294',
    icon: 'static/NYCCo_governement_law_01.jpg',
    formatContent: function formatContent(name, alt) {
      return format_default(name);
    }
  }), _defineProperty(_layers, "ss", {
    name: 'State Senate Districts',
    sql: "SELECT * FROM all_bounds WHERE id = 'ss'",
    textColor: '#9912ed',
    lineColor: '#9912ed',
    icon: 'static/NYCCo_government_justice_01.jpg',
    formatContent: function formatContent(name, alt) {
      return format_default(name, "https://www.nysenate.gov/district/".concat(name));
    }
  }), _defineProperty(_layers, "nta", {
    name: 'Neighborhood Tabulation Area',
    sql: "SELECT * FROM all_bounds WHERE id = 'nta'",
    textColor: '#1212ed',
    lineColor: '#1212ed',
    icon: 'static/NYCCo_explore_01.jpg',
    formatContent: function formatContent(name, alt) {
      return format_default(name);
    }
  }), _defineProperty(_layers, "bid", {
    name: 'Business Improvement District',
    sql: "SELECT * FROM all_bounds WHERE id = 'bid'",
    textColor: '#129ded',
    lineColor: '#129ded',
    icon: 'static/NYCCo_jobs_a_01.jpg',
    formatContent: function formatContent(name, alt) {
      return format_default(name);
    }
  }), _layers);

  function generateInfoBoxFromQuery(rows, label) {
    //create content for each layer
    var layersContent = Object.entries(layers).map(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
          id = _ref2[0],
          values = _ref2[1];

      var content = "<img class=\"city_icons\" src=\"".concat(values.icon, "\"/><h5 class= \"\">").concat(values.name, "</h5>");
      var layerRows = rows.filter(function (row) {
        return row.id === id;
      }); //for each row generate span

      content += layerRows.map(function (row) {
        return values.formatContent(row.namecol, row.namealt);
      }).join('<span class= "lighter">, </span>');
      return "<div id=\"ds_info\" class=\"clearfix\">".concat(content, "</div>");
    }).join('');
    document.getElementById('info_box').innerHTML = "<div id=\"info\"><h3 class = \"bold\">".concat(label, " </h3><div class=\"separator\"></div></div>").concat(layersContent);
    show_info_box();
  }

  function set_address() {
    //Use the City's Geoclient API to search for an address
    var select = document.getElementById('boro');
    var boro = select.options[select.selectedIndex].value;
    var adr = document.getElementById('address').value; //query the City's geoclient API

    var url = "https://api.cityofnewyork.us/geoclient/v1/search.json?input=".concat(adr, " ").concat(boro, "&app_id=dd37f663&app_key=c99663c5e8b11315279f8d28ef245dab");
    fetch(proxyurl + url, {
      mode: 'cors'
    }).then(function (response) {
      return response.json();
    }).then(function (address) {
      document.getElementById('no_results').style.display = 'none';
      var response = address.results[0].response;
      var latitude = response.latitude,
          longitude = response.longitude; //set map view to the resulting lat, lon and zoom to 18

      exports.map.setView([latitude, longitude], 15);

      if (exports.marker) {
        exports.marker.remove();
      }

      exports.marker = L.marker([latitude, longitude]).addTo(exports.map);
      var intersectsUrl = "https://betanyc.carto.com/api/v2/sql/?q=SELECT * FROM all_bounds WHERE ST_Intersects(ST_SetSRID(ST_MakePoint(".concat(longitude, ", ").concat(latitude, "), 4326),the_geom) &api_key=").concat(api_key);
      fetch(intersectsUrl).then(function (res) {
        return res.json();
      }).then(function (_ref3) {
        var rows = _ref3.rows;
        return generateInfoBoxFromQuery(rows, "".concat(adr, " ").concat(boro));
      });
    }).catch(function (error) {
      console.log(error); //if nothing gets returned, display no results

      document.getElementById('no_results').style.display = 'block';
    });
  } //Toggle Layers and Visibility


  function toggle_layer(id) {
    if (document.getElementById(id).checked) {
      layers[id].layer.show();
    } else {
      layers[id].layer.hide();
    }
  } //Turn on the selected layer and turn off all other layers


  function hide_all_unselected_districts(id) {
    var districts = Object.keys(layers);

    if (!document.getElementById(id).checked) {
      var element = document.getElementById(id);
      element.checked = true;
      var event = new Event('change');
      element.dispatchEvent(event);
    }

    for (var i = 0; i < districts.length; i++) {
      if (districts[i] == id) {
        continue;
      } else {
        if (document.getElementById(districts[i]).checked) {
          var element = document.getElementById(districts[i]);
          element.checked = false;
          var event = new Event('change');
          element.dispatchEvent(event);
        }
      }
    }
  } //Displays


  function toggle_visibility(id) {
    //toggle the visibility of a selected element
    var e = document.getElementById(id);
    if (e.style.display == 'block') e.style.display = 'none';else e.style.display = 'block';
  }

  function show_info_box() {
    if (document.getElementById('info_box').style.display = 'none') document.getElementById('info_box').style.display = 'block';
  }

  function query_district(layer_id) {
    var queryDistricts = "https://betanyc.carto.com/api/v2/sql/?q=SELECT namecol FROM all_bounds WHERE id = '".concat(layer_id, "' &api_key=").concat(api_key);
    hide_all_unselected_districts(layer_id);
    fetch(queryDistricts).then(function (res) {
      return res.json();
    }).then(function (_ref4) {
      var rows = _ref4.rows;
      var options = rows.map(function (row) {
        return row.namecol;
      }).sort(function (a, b) {
        return a.localeCompare(b, 'en-US', {
          numeric: 'true'
        });
      }).map(function (name) {
        return "<option value=\"".concat(name, "\">").concat(name, "</option>");
      }).join('');
      document.getElementById('selected_district').innerHTML = "\n\t\t\t<select id=\"district\">".concat(options, "</select>\n\t\t\t\t<div class=\"select_arrow\"></div>\n\t\t\t<input type=\"submit\" value=\"Select\" onclick=\"list_overlaps('").concat(layer_id, "')\">\n\t\t");
    }).catch(function (err) {
      return console.log(err);
    });
  }

  function list_overlaps(layer_id) {
    var select_district_id = document.getElementById('district');
    var district_id = select_district_id.options[select_district_id.selectedIndex].value;
    var query = "SELECT DISTINCT id, namecol, namealt FROM all_bounds, (SELECT the_geom FROM all_bounds WHERE id = '".concat(layer_id, "' AND namecol = '").concat(district_id, "') as m WHERE ST_Intersects(all_bounds.the_geom, m.the_geom) AND (st_area(st_intersection(all_bounds.the_geom, m.the_geom))/st_area(all_bounds.the_geom)) > .00025");
    var intersectsUrl = "https://betanyc.carto.com/api/v2/sql/?q=".concat(query, "&api_key=").concat(api_key);
    fetch(intersectsUrl).then(function (res) {
      return res.json();
    }).then(function (_ref5) {
      var rows = _ref5.rows;
      //create content for each bound
      var boundsContent = Object.entries(layers).map(function (_ref6) {
        var _ref7 = _slicedToArray(_ref6, 2),
            id = _ref7[0],
            values = _ref7[1];

        var content = "<img class=\"city_icons\" src=\"".concat(values.icon, "\"/><h5 class= \"\">").concat(values.name, "</h5>");
        var boundRows = rows.filter(function (row) {
          return row.id === id;
        }).filter(function (row) {
          return !row.namecol.includes('park-cemetery-etc');
        });
        content += boundRows.map(function (row) {
          return values.formatContent(row.namecol, row.namealt);
        }).join('<span class= "lighter">, </span>');
        return "<div id=\"ds_info\" class=\"clearfix\">".concat(content, "</div>");
      }).join('');
      document.getElementById('info_box').innerHTML = "<div id=\"info\"><h3 class = \"bold\">".concat(layers[layer_id].name, " - ").concat(district_id, " </h3><div class=\"separator\"></div></div>").concat(boundsContent);
      show_info_box();
    });
  }

  function reset_map() {
    exports.map.setView([40.73, -74], 11);

    if (exports.marker) {
      exports.marker.remove();
    }
  }

  function init() {
    //set map view
    exports.map = L.map('map').setView([40.73, -74], 11);
    exports.map.scrollWheelZoom.disable(); //set basemap

    L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}{r}.png', {
      maxZoom: 18
    }).addTo(exports.map); //connect to Carto

    var client = new carto.Client({
      apiKey: api_key,
      username: 'betanyc'
    });
    Object.entries(layers).forEach(function (_ref8) {
      var _ref9 = _slicedToArray(_ref8, 2),
          id = _ref9[0],
          values = _ref9[1];

      values.source = new carto.source.SQL(values.sql); // Outline the geometries for each dataset.
      // Colors based on DCP Planning Labs standard colors
      // https://medium.com/nycplanninglabs/experimenting-with-planning-color-standards-15b591d2a90c

      var halo = values.haloFill ? "\n\t\t\t\ttext-halo-fill: ".concat(values.haloFill, ";\n\t\t\t\ttext-halo-radius: ").concat(values.haloRadius, ";\n\t\t\t") : '';
      values.style = new carto.style.CartoCSS("\n\t\t\t#layer {\n\t\t\tpolygon-fill: ".concat(values.textColor, ";\n\t\t\tpolygon-opacity: 0;\n\t\t\ttext-name: [namecol];\n\t\t\ttext-face-name: 'Open Sans Regular';\n\t\t\ttext-fill: ").concat(values.textColor, ";\n\t\t\ttext-size: 14;\n\t\t\t").concat(halo, "\n\t\t\t}\n\t\t\t#layer::outline {\n\t\t\tline-width: 2.5;\n\t\t\tline-color: ").concat(values.lineColor, ";\n\t\t\tline-opacity: 1;\n\t\t\t}\n\t\t\t#layer[zoom <= 10]{\n\t\t\t\ttext-size: 10;\n\t\t\t}\n\t\t\t#layer::outline [zoom <= 10]{\n\t\t\t\tmarker-width: 1.5;\n\t\t\t}\n\t\t"));
      var extraColumns = 'extraColumns' in values ? values.extraColumns : [];
      var featureClickColumns = [values.textName].concat(_toConsumableArray(extraColumns));
      values.layer = new carto.layer.Layer(values.source, values.style, featureClickColumns); //add layer to map

      client.addLayer(values.layer); //setup switch functions

      document.getElementById('switches').innerHTML += "\n\t\t\t<li>\n\t\t\t\t<label class=\"switch\">\n\t\t\t\t\t<input id=\"".concat(id, "\" type=\"checkbox\" name=\"style\" onchange=\"toggle_layer('").concat(id, "')\" ").concat(id === 'cd' ? 'checked' : '', ">\n\t\t\t\t\t<span class=\"slider\"></span>\n\t\t\t\t</label>\n\t\t\t\t<h5>").concat(values.name, "</h5> <hr class=\"colored_line\" style=\"border-top-color:").concat(values.lineColor, "\">\n\t\t\t</li>\n\t\t"); //hide all layers but cd

      if (id !== 'cd') values.layer.hide();
    });
    client.getLeafletLayer().addTo(exports.map);
    var popup = L.popup({
      closeButton: false
    }); //init Query Overlapping Districts selectors

    var overlapSelect = document.getElementById('admin_district');
    Object.entries(layers).forEach(function (_ref10) {
      var _ref11 = _slicedToArray(_ref10, 2),
          id = _ref11[0],
          values = _ref11[1];

      var option = document.createElement('option');
      option.textContent = values.name;
      option.value = id;
      overlapSelect.appendChild(option);
    });
    overlapSelect.addEventListener('change', function (e) {
      return query_district(e.target.value);
    }); //map click

    exports.map.on('click', function (e) {
      var _e$latlng = e.latlng,
          latitude = _e$latlng.lat,
          longitude = _e$latlng.lng;

      if (exports.marker) {
        exports.marker.remove();
      }

      exports.marker = L.marker([latitude, longitude]).addTo(exports.map);
      var intersectsUrl = "https://betanyc.carto.com/api/v2/sql/?q=SELECT * FROM all_bounds WHERE ST_Intersects(ST_SetSRID(ST_MakePoint(".concat(longitude, ", ").concat(latitude, "), 4326),the_geom) &api_key=").concat(api_key);
      fetch(intersectsUrl).then(function (res) {
        return res.json();
      }).then(function (_ref12) {
        var rows = _ref12.rows;
        return generateInfoBoxFromQuery(rows, 'Clicked point');
      });
    });
  }

  exports.init = init;
  exports.layers = layers;
  exports.list_overlaps = list_overlaps;
  exports.reset_map = reset_map;
  exports.set_address = set_address;
  exports.show_info_box = show_info_box;
  exports.toggle_layer = toggle_layer;
  exports.toggle_visibility = toggle_visibility;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlcyI6WyIuLi9ub2RlX21vZHVsZXMvc3R5bGUtaW5qZWN0L2Rpc3Qvc3R5bGUtaW5qZWN0LmVzLmpzIiwiLi4vc3JjL2pzL2Zvcm1hdC5qcyIsIi4uL3NyYy9qcy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJmdW5jdGlvbiBzdHlsZUluamVjdChjc3MsIHJlZikge1xuICBpZiAoIHJlZiA9PT0gdm9pZCAwICkgcmVmID0ge307XG4gIHZhciBpbnNlcnRBdCA9IHJlZi5pbnNlcnRBdDtcblxuICBpZiAoIWNzcyB8fCB0eXBlb2YgZG9jdW1lbnQgPT09ICd1bmRlZmluZWQnKSB7IHJldHVybjsgfVxuXG4gIHZhciBoZWFkID0gZG9jdW1lbnQuaGVhZCB8fCBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdO1xuICB2YXIgc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICBzdHlsZS50eXBlID0gJ3RleHQvY3NzJztcblxuICBpZiAoaW5zZXJ0QXQgPT09ICd0b3AnKSB7XG4gICAgaWYgKGhlYWQuZmlyc3RDaGlsZCkge1xuICAgICAgaGVhZC5pbnNlcnRCZWZvcmUoc3R5bGUsIGhlYWQuZmlyc3RDaGlsZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGhlYWQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBoZWFkLmFwcGVuZENoaWxkKHN0eWxlKTtcbiAgfVxuXG4gIGlmIChzdHlsZS5zdHlsZVNoZWV0KSB7XG4gICAgc3R5bGUuc3R5bGVTaGVldC5jc3NUZXh0ID0gY3NzO1xuICB9IGVsc2Uge1xuICAgIHN0eWxlLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzcykpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IHN0eWxlSW5qZWN0O1xuIiwiZXhwb3J0IGZ1bmN0aW9uIGZvcm1hdF9jZChib3JvLCBjZCkge1xuICBsZXQgdGV4dDtcbiAgc3dpdGNoIChib3JvKSB7XG4gICAgY2FzZSAnMSc6XG4gICAgICB0ZXh0ID0gYE1hbmhhdHRhbiAtICR7Y2R9YDtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJzInOlxuICAgICAgdGV4dCA9IGBCcm9ueCAtICR7Y2R9YDtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJzMnOlxuICAgICAgdGV4dCA9IGBCcm9va2x5biAtICR7Y2R9YDtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJzQnOlxuICAgICAgdGV4dCA9IGBRdWVlbnMgLSAke2NkfWA7XG4gICAgICBicmVhaztcbiAgICBjYXNlICc1JzpcbiAgICAgIHRleHQgPSBgU3RhdGVuIElzbGFuZCAtICR7Y2R9YDtcbiAgICAgIGJyZWFrO1xuICAgIGRlZmF1bHQ6XG4gICAgICB0ZXh0ID0gYCR7Ym9yb30gLSAke2NkfWA7XG4gIH1cbiAgcmV0dXJuIGA8c3BhbiBjbGFzcyA9IFwibGlnaHRlclwiPiR7dGV4dH08L3NwYW4+YDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZvcm1hdF9wcChwcmVjaW5jdCkge1xuICBpZiAocHJlY2luY3QgPT0gMTEgfHwgcHJlY2luY3QgPT0gMTIgfHwgcHJlY2luY3QgPT0gMTMpIHtcbiAgICByZXR1cm4gYDxzcGFuIGNsYXNzID0gXCJsaWdodGVyXCI+PGEgdGFyZ2V0PVwiX2JsYW5rXCIgaHJlZj0naHR0cHM6Ly93d3cxLm55Yy5nb3Yvc2l0ZS9ueXBkL2J1cmVhdXMvcGF0cm9sL3ByZWNpbmN0cy9taWR0b3duLXNvdXRoLXByZWNpbmN0LnBhZ2UnPiR7cHJlY2luY3R9PC9hPiA8L3NwYW4+YDtcbiAgfSBlbHNlIGlmIChwcmVjaW5jdCA9PSAxNCkge1xuICAgIHJldHVybiBgPHNwYW4gY2xhc3MgPSBcImxpZ2h0ZXJcIj48YSB0YXJnZXQ9XCJfYmxhbmtcIiBocmVmPSdodHRwczovL3d3dzEubnljLmdvdi9zaXRlL255cGQvYnVyZWF1cy9wYXRyb2wvcHJlY2luY3RzLyR7cHJlY2luY3R9dGgtcHJlY2luY3QucGFnZSc+JHtwcmVjaW5jdH08L2E+IDwvc3Bhbj5gO1xuICB9IGVsc2UgaWYgKHByZWNpbmN0ID09IDE4KSB7XG4gICAgcmV0dXJuIGA8c3BhbiBjbGFzcyA9IFwibGlnaHRlclwiPjxhIHRhcmdldD1cIl9ibGFua1wiIGhyZWY9J2h0dHBzOi8vd3d3MS5ueWMuZ292L3NpdGUvbnlwZC9idXJlYXVzL3BhdHJvbC9wcmVjaW5jdHMvbWlkdG93bi1ub3J0aC1wcmVjaW5jdC5wYWdlJz4ke3ByZWNpbmN0fTwvYT4gPC9zcGFuPmA7XG4gIH0gZWxzZSBpZiAocHJlY2luY3QgPT0gMjIpIHtcbiAgICByZXR1cm4gYDxzcGFuIGNsYXNzID0gXCJsaWdodGVyXCI+PGEgdGFyZ2V0PVwiX2JsYW5rXCIgaHJlZj0naHR0cHM6Ly93d3cxLm55Yy5nb3Yvc2l0ZS9ueXBkL2J1cmVhdXMvcGF0cm9sL3ByZWNpbmN0cy9jZW50cmFsLXBhcmstcHJlY2luY3QucGFnZSc+JHtwcmVjaW5jdH08L2E+IDwvc3Bhbj5gO1xuICB9IGVsc2UgaWYgKHByZWNpbmN0ICUgMTAgPT0gMSkge1xuICAgIHJldHVybiBgPHNwYW4gY2xhc3MgPSBcImxpZ2h0ZXJcIj48YSB0YXJnZXQ9XCJfYmxhbmtcIiBocmVmPSdodHRwczovL3d3dzEubnljLmdvdi9zaXRlL255cGQvYnVyZWF1cy9wYXRyb2wvcHJlY2luY3RzLyR7cHJlY2luY3R9c3QtcHJlY2luY3QucGFnZSc+JHtwcmVjaW5jdH08L2E+IDwvc3Bhbj5gO1xuICB9IGVsc2UgaWYgKHByZWNpbmN0ICUgMTAgPT0gMikge1xuICAgIHJldHVybiBgPHNwYW4gY2xhc3MgPSBcImxpZ2h0ZXJcIj48YSB0YXJnZXQ9XCJfYmxhbmtcIiBocmVmPSdodHRwczovL3d3dzEubnljLmdvdi9zaXRlL255cGQvYnVyZWF1cy9wYXRyb2wvcHJlY2luY3RzLyR7cHJlY2luY3R9bmQtcHJlY2luY3QucGFnZSc+JHtwcmVjaW5jdH08L2E+IDwvc3Bhbj5gO1xuICB9IGVsc2UgaWYgKHByZWNpbmN0ICUgMTAgPT0gMykge1xuICAgIHJldHVybiBgPHNwYW4gY2xhc3MgPSBcImxpZ2h0ZXJcIj48YSB0YXJnZXQ9XCJfYmxhbmtcIiBocmVmPSdodHRwczovL3d3dzEubnljLmdvdi9zaXRlL255cGQvYnVyZWF1cy9wYXRyb2wvcHJlY2luY3RzLyR7cHJlY2luY3R9cmQtcHJlY2luY3QucGFnZSc+JHtwcmVjaW5jdH08L2E+IDwvc3Bhbj5gO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBgPHNwYW4gY2xhc3MgPSBcImxpZ2h0ZXJcIj48YSB0YXJnZXQ9XCJfYmxhbmtcIiBocmVmPSdodHRwczovL3d3dzEubnljLmdvdi9zaXRlL255cGQvYnVyZWF1cy9wYXRyb2wvcHJlY2luY3RzLyR7cHJlY2luY3R9dGgtcHJlY2luY3QucGFnZSc+JHtwcmVjaW5jdH08L2E+IDwvc3Bhbj5gO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmb3JtYXRfZGVmYXVsdChuYW1lLCB1cmwgPSBudWxsKSB7XG4gIGlmICh1cmwpIHtcbiAgICByZXR1cm4gYDxzcGFuIGNsYXNzID0gXCJsaWdodGVyXCI+PGEgdGFyZ2V0PVwiX2JsYW5rXCIgaHJlZj0nJHt1cmx9Jz4ke25hbWV9PC9hPiA8L3NwYW4+YDtcbiAgfVxuICByZXR1cm4gYDxzcGFuIGNsYXNzID0gXCJsaWdodGVyXCI+JHtuYW1lfTwvc3Bhbj5gO1xufVxuIiwiaW1wb3J0ICcuLi9jc3Mvc3R5bGUuY3NzJztcblxuaW1wb3J0IHsgZm9ybWF0X2NkLCBmb3JtYXRfcHAsIGZvcm1hdF9kZWZhdWx0IH0gZnJvbSAnLi9mb3JtYXQnO1xuXG4vL2FkZHMgQ09SUyBoZWFkZXIgdG8gcHJveHkgcmVxdWVzdCBnZXR0aW5nIGFyb3VuZCBlcnJvcnNcbmNvbnN0IHByb3h5dXJsID0gJ2h0dHBzOi8vY29ycy1hbnl3aGVyZS5oZXJva3VhcHAuY29tLyc7XG5sZXQgbWFya2VyO1xubGV0IG1hcDtcbmNvbnN0IGFwaV9rZXkgPSBBUElfS0VZO1xuY29uc3QgbGF5ZXJzID0ge1xuICBjZDoge1xuICAgIG5hbWU6ICdDb21tdW5pdHkgRGlzdHJpY3RzJyxcbiAgICAvL3JlbW92ZSBwYXJrc1xuICAgIHNxbDogYFNFTEVDVCAqIEZST00gYWxsX2JvdW5kcyBXSEVSRSBpZCA9ICdjZCcgQU5EIE5PVCBuYW1lY29sIElOICgnMTY0JywnMjI2JywnMjI3JywnMjI4JywnMzU1JywnMzU2JywnNDgwJywnNDgxJywnNDgyJylgLFxuICAgIHRleHRDb2xvcjogJyMwMDAwMDAnLFxuICAgIGxpbmVDb2xvcjogJyMwMDAwMDAnLFxuICAgIGljb246ICdzdGF0aWMvTllDQ29faHVtYW5fZ3JvdXBfYV8wMS5qcGcnLFxuICAgIGZvcm1hdENvbnRlbnQ6IChuYW1lLCBhbHQpID0+IGZvcm1hdF9jZChuYW1lWzBdLCBuYW1lLnN1YnN0cmluZygxLCAzKSlcbiAgfSxcbiAgcHA6IHtcbiAgICBuYW1lOiAnUG9saWNlIFByZWNpbmN0cycsXG4gICAgc3FsOiBgU0VMRUNUICogRlJPTSBhbGxfYm91bmRzIFdIRVJFIGlkID0gJ3BwJ2AsXG4gICAgdGV4dENvbG9yOiAnIzEyZWRlZCcsXG4gICAgbGluZUNvbG9yOiAnIzEyZWRlZCcsXG4gICAgaWNvbjogJ3N0YXRpYy9OWUNDb19qb2JzX3BvbGljZV8wMS5qcGcnLFxuICAgIGZvcm1hdENvbnRlbnQ6IChuYW1lLCBhbHQpID0+IGZvcm1hdF9wcChuYW1lKVxuICB9LFxuICBzZDoge1xuICAgIG5hbWU6ICdTYW5pdGF0aW9uIERpc3RyaWN0cycsXG4gICAgc3FsOiBgU0VMRUNUICogRlJPTSBhbGxfYm91bmRzIFdIRVJFIGlkID0gJ3NkJ2AsXG4gICAgdGV4dENvbG9yOiAnIzEyZWRhNCcsXG4gICAgbGluZUNvbG9yOiAnIzEyZWRhNCcsXG4gICAgaWNvbjogJ3N0YXRpYy9OWUNDb19zYW5pdGF0aW9uX2dhcmJhZ2VfMDEuanBnJyxcbiAgICBmb3JtYXRDb250ZW50OiAobmFtZSwgYWx0KSA9PiBmb3JtYXRfZGVmYXVsdChuYW1lKVxuICB9LFxuICBmYjoge1xuICAgIG5hbWU6ICdGaXJlIEJhdHRpbGlvbicsXG4gICAgc3FsOiBgU0VMRUNUICogRlJPTSBhbGxfYm91bmRzIFdIRVJFIGlkID0gJ2ZiJ2AsXG4gICAgdGV4dENvbG9yOiAnIzEyZWQxMicsXG4gICAgbGluZUNvbG9yOiAnIzEyZWQxMicsXG4gICAgaWNvbjogJ3N0YXRpYy9OWUNDb19qb2JzX2ZpcmVmaWdodGVyXzAxLmpwZycsXG4gICAgZm9ybWF0Q29udGVudDogKG5hbWUsIGFsdCkgPT4gZm9ybWF0X2RlZmF1bHQobmFtZSlcbiAgfSxcbiAgc2Q6IHtcbiAgICBuYW1lOiAnU2Nob29sIERpc3RyaWN0cycsXG4gICAgc3FsOiBgU0VMRUNUICogRlJPTSBhbGxfYm91bmRzIFdIRVJFIGlkID0gJ3NkJ2AsXG4gICAgdGV4dENvbG9yOiAnI2VkZWQxMicsXG4gICAgbGluZUNvbG9yOiAnI2VkZWQxMicsXG4gICAgaGFsb0ZpbGw6ICcjMDAwJyxcbiAgICBoYWxvUmFkaXVzOiAwLjgsXG4gICAgaWNvbjogJ3N0YXRpYy9OWUNDb19mb29kX2FwcGxlXzAxLmpwZycsXG4gICAgZm9ybWF0Q29udGVudDogKG5hbWUsIGFsdCkgPT4gZm9ybWF0X2RlZmF1bHQobmFtZSlcbiAgfSxcbiAgaGM6IHtcbiAgICBuYW1lOiAnSGVhbHRoIENlbnRlciBEaXN0cmljdHMnLFxuICAgIHNxbDogYFNFTEVDVCAqIEZST00gYWxsX2JvdW5kcyBXSEVSRSBpZCA9ICdoYydgLFxuICAgIHRleHRDb2xvcjogJyNlZGJkMTInLFxuICAgIGxpbmVDb2xvcjogJyNlZGJkMTInLFxuICAgIGljb246ICdzdGF0aWMvTllDQ29fam9ic19kb2N0b3JfMDEuanBnJyxcbiAgICBmb3JtYXRDb250ZW50OiAobmFtZSwgYWx0KSA9PiBmb3JtYXRfZGVmYXVsdChuYW1lKVxuICB9LFxuICBjYzoge1xuICAgIG5hbWU6ICdDaXR5IENvdW5jaWwgRGlzdHJpY3RzJyxcbiAgICBzcWw6IGBTRUxFQ1QgKiBGUk9NIGFsbF9ib3VuZHMgV0hFUkUgaWQgPSAnY2MnYCxcbiAgICB0ZXh0Q29sb3I6ICcjZWQ3ZDEyJyxcbiAgICBsaW5lQ29sb3I6ICcjZWQ3ZDEyJyxcbiAgICBpY29uOiAnc3RhdGljL05ZQ0NvX2dvdmVybm1lbnRfY2l0eWhhbGxfMDEuanBnJyxcbiAgICBmb3JtYXRDb250ZW50OiAobmFtZSwgYWx0KSA9PlxuICAgICAgZm9ybWF0X2RlZmF1bHQobmFtZSwgYGh0dHBzOi8vY291bmNpbC5ueWMuZ292L2Rpc3RyaWN0LSR7bmFtZX1gKVxuICB9LFxuICBueWNvbmdyZXNzOiB7XG4gICAgbmFtZTogJ0NvbmdyZXNzaW9uYWwgRGlzdHJpY3RzJyxcbiAgICBzcWw6IGBTRUxFQ1QgKiBGUk9NIGFsbF9ib3VuZHMgV0hFUkUgaWQgPSAnbnljb25ncmVzcydgLFxuICAgIHRleHRDb2xvcjogJyNlZDEyMTInLFxuICAgIGxpbmVDb2xvcjogJyNlZDEyMTInLFxuICAgIGljb246ICdzdGF0aWMvTllDQ29fZG9tZXN0aWNfYV8wMS5qcGcnLFxuICAgIGZvcm1hdENvbnRlbnQ6IChuYW1lLCBhbHQpID0+XG4gICAgICBmb3JtYXRfZGVmYXVsdChcbiAgICAgICAgbmFtZSxcbiAgICAgICAgYGh0dHBzOi8vd3d3LmdvdnRyYWNrLnVzL2NvbmdyZXNzL21lbWJlcnMvTlkvJHtuYW1lfWBcbiAgICAgIClcbiAgfSxcbiAgc2E6IHtcbiAgICBuYW1lOiAnU3RhdGUgQXNzZW1ibHkgRGlzdHJpY3RzJyxcbiAgICBzcWw6IGBTRUxFQ1QgKiBGUk9NIGFsbF9ib3VuZHMgV0hFUkUgaWQgPSAnc2EnYCxcbiAgICB0ZXh0Q29sb3I6ICcjZWQxMjk0JyxcbiAgICBsaW5lQ29sb3I6ICcjZWQxMjk0JyxcbiAgICBpY29uOiAnc3RhdGljL05ZQ0NvX2dvdmVybmVtZW50X2xhd18wMS5qcGcnLFxuICAgIGZvcm1hdENvbnRlbnQ6IChuYW1lLCBhbHQpID0+IGZvcm1hdF9kZWZhdWx0KG5hbWUpXG4gIH0sXG4gIHNzOiB7XG4gICAgbmFtZTogJ1N0YXRlIFNlbmF0ZSBEaXN0cmljdHMnLFxuICAgIHNxbDogYFNFTEVDVCAqIEZST00gYWxsX2JvdW5kcyBXSEVSRSBpZCA9ICdzcydgLFxuICAgIHRleHRDb2xvcjogJyM5OTEyZWQnLFxuICAgIGxpbmVDb2xvcjogJyM5OTEyZWQnLFxuICAgIGljb246ICdzdGF0aWMvTllDQ29fZ292ZXJubWVudF9qdXN0aWNlXzAxLmpwZycsXG4gICAgZm9ybWF0Q29udGVudDogKG5hbWUsIGFsdCkgPT5cbiAgICAgIGZvcm1hdF9kZWZhdWx0KG5hbWUsIGBodHRwczovL3d3dy5ueXNlbmF0ZS5nb3YvZGlzdHJpY3QvJHtuYW1lfWApXG4gIH0sXG4gIG50YToge1xuICAgIG5hbWU6ICdOZWlnaGJvcmhvb2QgVGFidWxhdGlvbiBBcmVhJyxcbiAgICBzcWw6IGBTRUxFQ1QgKiBGUk9NIGFsbF9ib3VuZHMgV0hFUkUgaWQgPSAnbnRhJ2AsXG4gICAgdGV4dENvbG9yOiAnIzEyMTJlZCcsXG4gICAgbGluZUNvbG9yOiAnIzEyMTJlZCcsXG4gICAgaWNvbjogJ3N0YXRpYy9OWUNDb19leHBsb3JlXzAxLmpwZycsXG4gICAgZm9ybWF0Q29udGVudDogKG5hbWUsIGFsdCkgPT4gZm9ybWF0X2RlZmF1bHQobmFtZSlcbiAgfSxcbiAgYmlkOiB7XG4gICAgbmFtZTogJ0J1c2luZXNzIEltcHJvdmVtZW50IERpc3RyaWN0JyxcbiAgICBzcWw6IGBTRUxFQ1QgKiBGUk9NIGFsbF9ib3VuZHMgV0hFUkUgaWQgPSAnYmlkJ2AsXG4gICAgdGV4dENvbG9yOiAnIzEyOWRlZCcsXG4gICAgbGluZUNvbG9yOiAnIzEyOWRlZCcsXG4gICAgaWNvbjogJ3N0YXRpYy9OWUNDb19qb2JzX2FfMDEuanBnJyxcbiAgICBmb3JtYXRDb250ZW50OiAobmFtZSwgYWx0KSA9PiBmb3JtYXRfZGVmYXVsdChuYW1lKVxuICB9XG59O1xuXG5mdW5jdGlvbiBnZW5lcmF0ZUluZm9Cb3hGcm9tUXVlcnkocm93cywgbGFiZWwpIHtcbiAgLy9jcmVhdGUgY29udGVudCBmb3IgZWFjaCBsYXllclxuICBjb25zdCBsYXllcnNDb250ZW50ID0gT2JqZWN0LmVudHJpZXMobGF5ZXJzKVxuICAgIC5tYXAoKFtpZCwgdmFsdWVzXSkgPT4ge1xuICAgICAgbGV0IGNvbnRlbnQgPSBgPGltZyBjbGFzcz1cImNpdHlfaWNvbnNcIiBzcmM9XCIke3ZhbHVlcy5pY29ufVwiLz48aDUgY2xhc3M9IFwiXCI+JHt2YWx1ZXMubmFtZX08L2g1PmA7XG4gICAgICBjb25zdCBsYXllclJvd3MgPSByb3dzLmZpbHRlcihyb3cgPT4gcm93LmlkID09PSBpZCk7XG4gICAgICAvL2ZvciBlYWNoIHJvdyBnZW5lcmF0ZSBzcGFuXG4gICAgICBjb250ZW50ICs9IGxheWVyUm93c1xuICAgICAgICAubWFwKHJvdyA9PiB2YWx1ZXMuZm9ybWF0Q29udGVudChyb3cubmFtZWNvbCwgcm93Lm5hbWVhbHQpKVxuICAgICAgICAuam9pbignPHNwYW4gY2xhc3M9IFwibGlnaHRlclwiPiwgPC9zcGFuPicpO1xuICAgICAgcmV0dXJuIGA8ZGl2IGlkPVwiZHNfaW5mb1wiIGNsYXNzPVwiY2xlYXJmaXhcIj4ke2NvbnRlbnR9PC9kaXY+YDtcbiAgICB9KVxuICAgIC5qb2luKCcnKTtcblxuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcbiAgICAnaW5mb19ib3gnXG4gICkuaW5uZXJIVE1MID0gYDxkaXYgaWQ9XCJpbmZvXCI+PGgzIGNsYXNzID0gXCJib2xkXCI+JHtsYWJlbH0gPC9oMz48ZGl2IGNsYXNzPVwic2VwYXJhdG9yXCI+PC9kaXY+PC9kaXY+JHtsYXllcnNDb250ZW50fWA7XG4gIHNob3dfaW5mb19ib3goKTtcbn1cblxuZnVuY3Rpb24gc2V0X2FkZHJlc3MoKSB7XG4gIC8vVXNlIHRoZSBDaXR5J3MgR2VvY2xpZW50IEFQSSB0byBzZWFyY2ggZm9yIGFuIGFkZHJlc3NcbiAgdmFyIHNlbGVjdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdib3JvJyk7XG4gIHZhciBib3JvID0gc2VsZWN0Lm9wdGlvbnNbc2VsZWN0LnNlbGVjdGVkSW5kZXhdLnZhbHVlO1xuICB2YXIgYWRyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FkZHJlc3MnKS52YWx1ZTtcblxuICAvL3F1ZXJ5IHRoZSBDaXR5J3MgZ2VvY2xpZW50IEFQSVxuICB2YXIgdXJsID0gYGh0dHBzOi8vYXBpLmNpdHlvZm5ld3lvcmsudXMvZ2VvY2xpZW50L3YxL3NlYXJjaC5qc29uP2lucHV0PSR7YWRyfSAke2Jvcm99JmFwcF9pZD1kZDM3ZjY2MyZhcHBfa2V5PWM5OTY2M2M1ZThiMTEzMTUyNzlmOGQyOGVmMjQ1ZGFiYDtcblxuICBmZXRjaChwcm94eXVybCArIHVybCwgeyBtb2RlOiAnY29ycycgfSlcbiAgICAudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgcmV0dXJuIHJlc3BvbnNlLmpzb24oKTtcbiAgICB9KVxuICAgIC50aGVuKGFkZHJlc3MgPT4ge1xuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ25vX3Jlc3VsdHMnKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhZGRyZXNzLnJlc3VsdHNbMF0ucmVzcG9uc2U7XG4gICAgICBjb25zdCB7IGxhdGl0dWRlLCBsb25naXR1ZGUgfSA9IHJlc3BvbnNlO1xuICAgICAgLy9zZXQgbWFwIHZpZXcgdG8gdGhlIHJlc3VsdGluZyBsYXQsIGxvbiBhbmQgem9vbSB0byAxOFxuICAgICAgbWFwLnNldFZpZXcoW2xhdGl0dWRlLCBsb25naXR1ZGVdLCAxNSk7XG4gICAgICBpZiAobWFya2VyKSB7XG4gICAgICAgIG1hcmtlci5yZW1vdmUoKTtcbiAgICAgIH1cbiAgICAgIG1hcmtlciA9IEwubWFya2VyKFtsYXRpdHVkZSwgbG9uZ2l0dWRlXSkuYWRkVG8obWFwKTtcblxuICAgICAgY29uc3QgaW50ZXJzZWN0c1VybCA9IGBodHRwczovL2JldGFueWMuY2FydG8uY29tL2FwaS92Mi9zcWwvP3E9U0VMRUNUICogRlJPTSBhbGxfYm91bmRzIFdIRVJFIFNUX0ludGVyc2VjdHMoU1RfU2V0U1JJRChTVF9NYWtlUG9pbnQoJHtsb25naXR1ZGV9LCAke2xhdGl0dWRlfSksIDQzMjYpLHRoZV9nZW9tKSAmYXBpX2tleT0ke2FwaV9rZXl9YDtcbiAgICAgIGZldGNoKGludGVyc2VjdHNVcmwpXG4gICAgICAgIC50aGVuKHJlcyA9PiByZXMuanNvbigpKVxuICAgICAgICAudGhlbigoeyByb3dzIH0pID0+IGdlbmVyYXRlSW5mb0JveEZyb21RdWVyeShyb3dzLCBgJHthZHJ9ICR7Ym9yb31gKSk7XG4gICAgfSlcblxuICAgIC5jYXRjaChmdW5jdGlvbihlcnJvcikge1xuICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgICAgLy9pZiBub3RoaW5nIGdldHMgcmV0dXJuZWQsIGRpc3BsYXkgbm8gcmVzdWx0c1xuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ25vX3Jlc3VsdHMnKS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICB9KTtcbn1cblxuLy9Ub2dnbGUgTGF5ZXJzIGFuZCBWaXNpYmlsaXR5XG5mdW5jdGlvbiB0b2dnbGVfbGF5ZXIoaWQpIHtcbiAgaWYgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKS5jaGVja2VkKSB7XG4gICAgbGF5ZXJzW2lkXS5sYXllci5zaG93KCk7XG4gIH0gZWxzZSB7XG4gICAgbGF5ZXJzW2lkXS5sYXllci5oaWRlKCk7XG4gIH1cbn1cblxuLy9UdXJuIG9uIHRoZSBzZWxlY3RlZCBsYXllciBhbmQgdHVybiBvZmYgYWxsIG90aGVyIGxheWVyc1xuZnVuY3Rpb24gaGlkZV9hbGxfdW5zZWxlY3RlZF9kaXN0cmljdHMoaWQpIHtcbiAgdmFyIGRpc3RyaWN0cyA9IE9iamVjdC5rZXlzKGxheWVycyk7XG4gIGlmICghZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpLmNoZWNrZWQpIHtcbiAgICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcbiAgICBlbGVtZW50LmNoZWNrZWQgPSB0cnVlO1xuICAgIHZhciBldmVudCA9IG5ldyBFdmVudCgnY2hhbmdlJyk7XG4gICAgZWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcbiAgfVxuICBmb3IgKGxldCBpID0gMDsgaSA8IGRpc3RyaWN0cy5sZW5ndGg7IGkrKykge1xuICAgIGlmIChkaXN0cmljdHNbaV0gPT0gaWQpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZGlzdHJpY3RzW2ldKS5jaGVja2VkKSB7XG4gICAgICAgIHZhciBlbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZGlzdHJpY3RzW2ldKTtcbiAgICAgICAgZWxlbWVudC5jaGVja2VkID0gZmFsc2U7XG4gICAgICAgIHZhciBldmVudCA9IG5ldyBFdmVudCgnY2hhbmdlJyk7XG4gICAgICAgIGVsZW1lbnQuZGlzcGF0Y2hFdmVudChldmVudCk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbi8vRGlzcGxheXNcbmZ1bmN0aW9uIHRvZ2dsZV92aXNpYmlsaXR5KGlkKSB7XG4gIC8vdG9nZ2xlIHRoZSB2aXNpYmlsaXR5IG9mIGEgc2VsZWN0ZWQgZWxlbWVudFxuICB2YXIgZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcbiAgaWYgKGUuc3R5bGUuZGlzcGxheSA9PSAnYmxvY2snKSBlLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gIGVsc2UgZS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbn1cblxuZnVuY3Rpb24gc2hvd19pbmZvX2JveCgpIHtcbiAgaWYgKChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaW5mb19ib3gnKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnKSlcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaW5mb19ib3gnKS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbn1cblxuZnVuY3Rpb24gcXVlcnlfZGlzdHJpY3QobGF5ZXJfaWQpIHtcbiAgY29uc3QgcXVlcnlEaXN0cmljdHMgPSBgaHR0cHM6Ly9iZXRhbnljLmNhcnRvLmNvbS9hcGkvdjIvc3FsLz9xPVNFTEVDVCBuYW1lY29sIEZST00gYWxsX2JvdW5kcyBXSEVSRSBpZCA9ICcke2xheWVyX2lkfScgJmFwaV9rZXk9JHthcGlfa2V5fWA7XG5cbiAgaGlkZV9hbGxfdW5zZWxlY3RlZF9kaXN0cmljdHMobGF5ZXJfaWQpO1xuXG4gIGZldGNoKHF1ZXJ5RGlzdHJpY3RzKVxuICAgIC50aGVuKHJlcyA9PiByZXMuanNvbigpKVxuICAgIC50aGVuKCh7IHJvd3MgfSkgPT4ge1xuICAgICAgY29uc3Qgb3B0aW9ucyA9IHJvd3NcbiAgICAgICAgLm1hcChyb3cgPT4gcm93Lm5hbWVjb2wpXG4gICAgICAgIC5zb3J0KChhLCBiKSA9PiBhLmxvY2FsZUNvbXBhcmUoYiwgJ2VuLVVTJywgeyBudW1lcmljOiAndHJ1ZScgfSkpXG4gICAgICAgIC5tYXAobmFtZSA9PiBgPG9wdGlvbiB2YWx1ZT1cIiR7bmFtZX1cIj4ke25hbWV9PC9vcHRpb24+YClcbiAgICAgICAgLmpvaW4oJycpO1xuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NlbGVjdGVkX2Rpc3RyaWN0JykuaW5uZXJIVE1MID0gYFxuXHRcdFx0PHNlbGVjdCBpZD1cImRpc3RyaWN0XCI+JHtvcHRpb25zfTwvc2VsZWN0PlxuXHRcdFx0XHQ8ZGl2IGNsYXNzPVwic2VsZWN0X2Fycm93XCI+PC9kaXY+XG5cdFx0XHQ8aW5wdXQgdHlwZT1cInN1Ym1pdFwiIHZhbHVlPVwiU2VsZWN0XCIgb25jbGljaz1cImxpc3Rfb3ZlcmxhcHMoJyR7bGF5ZXJfaWR9JylcIj5cblx0XHRgO1xuICAgIH0pXG4gICAgLmNhdGNoKGVyciA9PiBjb25zb2xlLmxvZyhlcnIpKTtcbn1cblxuZnVuY3Rpb24gbGlzdF9vdmVybGFwcyhsYXllcl9pZCkge1xuICBjb25zdCBzZWxlY3RfZGlzdHJpY3RfaWQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGlzdHJpY3QnKTtcbiAgY29uc3QgZGlzdHJpY3RfaWQgPVxuICAgIHNlbGVjdF9kaXN0cmljdF9pZC5vcHRpb25zW3NlbGVjdF9kaXN0cmljdF9pZC5zZWxlY3RlZEluZGV4XS52YWx1ZTtcbiAgY29uc3QgcXVlcnkgPSBgU0VMRUNUIERJU1RJTkNUIGlkLCBuYW1lY29sLCBuYW1lYWx0IEZST00gYWxsX2JvdW5kcywgKFNFTEVDVCB0aGVfZ2VvbSBGUk9NIGFsbF9ib3VuZHMgV0hFUkUgaWQgPSAnJHtsYXllcl9pZH0nIEFORCBuYW1lY29sID0gJyR7ZGlzdHJpY3RfaWR9JykgYXMgbSBXSEVSRSBTVF9JbnRlcnNlY3RzKGFsbF9ib3VuZHMudGhlX2dlb20sIG0udGhlX2dlb20pIEFORCAoc3RfYXJlYShzdF9pbnRlcnNlY3Rpb24oYWxsX2JvdW5kcy50aGVfZ2VvbSwgbS50aGVfZ2VvbSkpL3N0X2FyZWEoYWxsX2JvdW5kcy50aGVfZ2VvbSkpID4gLjAwMDI1YDtcbiAgY29uc3QgaW50ZXJzZWN0c1VybCA9IGBodHRwczovL2JldGFueWMuY2FydG8uY29tL2FwaS92Mi9zcWwvP3E9JHtxdWVyeX0mYXBpX2tleT0ke2FwaV9rZXl9YDtcblxuICBmZXRjaChpbnRlcnNlY3RzVXJsKVxuICAgIC50aGVuKHJlcyA9PiByZXMuanNvbigpKVxuICAgIC50aGVuKCh7IHJvd3MgfSkgPT4ge1xuICAgICAgLy9jcmVhdGUgY29udGVudCBmb3IgZWFjaCBib3VuZFxuICAgICAgY29uc3QgYm91bmRzQ29udGVudCA9IE9iamVjdC5lbnRyaWVzKGxheWVycylcbiAgICAgICAgLm1hcCgoW2lkLCB2YWx1ZXNdKSA9PiB7XG4gICAgICAgICAgbGV0IGNvbnRlbnQgPSBgPGltZyBjbGFzcz1cImNpdHlfaWNvbnNcIiBzcmM9XCIke3ZhbHVlcy5pY29ufVwiLz48aDUgY2xhc3M9IFwiXCI+JHt2YWx1ZXMubmFtZX08L2g1PmA7XG4gICAgICAgICAgY29uc3QgYm91bmRSb3dzID0gcm93c1xuICAgICAgICAgICAgLmZpbHRlcihyb3cgPT4gcm93LmlkID09PSBpZClcbiAgICAgICAgICAgIC5maWx0ZXIocm93ID0+ICFyb3cubmFtZWNvbC5pbmNsdWRlcygncGFyay1jZW1ldGVyeS1ldGMnKSk7XG4gICAgICAgICAgY29udGVudCArPSBib3VuZFJvd3NcbiAgICAgICAgICAgIC5tYXAocm93ID0+IHZhbHVlcy5mb3JtYXRDb250ZW50KHJvdy5uYW1lY29sLCByb3cubmFtZWFsdCkpXG4gICAgICAgICAgICAuam9pbignPHNwYW4gY2xhc3M9IFwibGlnaHRlclwiPiwgPC9zcGFuPicpO1xuICAgICAgICAgIHJldHVybiBgPGRpdiBpZD1cImRzX2luZm9cIiBjbGFzcz1cImNsZWFyZml4XCI+JHtjb250ZW50fTwvZGl2PmA7XG4gICAgICAgIH0pXG4gICAgICAgIC5qb2luKCcnKTtcblxuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXG4gICAgICAgICdpbmZvX2JveCdcbiAgICAgICkuaW5uZXJIVE1MID0gYDxkaXYgaWQ9XCJpbmZvXCI+PGgzIGNsYXNzID0gXCJib2xkXCI+JHtsYXllcnNbbGF5ZXJfaWRdLm5hbWV9IC0gJHtkaXN0cmljdF9pZH0gPC9oMz48ZGl2IGNsYXNzPVwic2VwYXJhdG9yXCI+PC9kaXY+PC9kaXY+JHtib3VuZHNDb250ZW50fWA7XG4gICAgICBzaG93X2luZm9fYm94KCk7XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIHJlc2V0X21hcCgpIHtcbiAgbWFwLnNldFZpZXcoWzQwLjczLCAtNzRdLCAxMSk7XG4gIGlmIChtYXJrZXIpIHtcbiAgICBtYXJrZXIucmVtb3ZlKCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gaW5pdCgpIHtcbiAgLy9zZXQgbWFwIHZpZXdcbiAgbWFwID0gTC5tYXAoJ21hcCcpLnNldFZpZXcoWzQwLjczLCAtNzRdLCAxMSk7XG4gIG1hcC5zY3JvbGxXaGVlbFpvb20uZGlzYWJsZSgpO1xuXG4gIC8vc2V0IGJhc2VtYXBcbiAgTC50aWxlTGF5ZXIoXG4gICAgJ2h0dHBzOi8vY2FydG9kYi1iYXNlbWFwcy17c30uZ2xvYmFsLnNzbC5mYXN0bHkubmV0L2xpZ2h0X25vbGFiZWxzL3t6fS97eH0ve3l9e3J9LnBuZycsXG4gICAge1xuICAgICAgbWF4Wm9vbTogMThcbiAgICB9XG4gICkuYWRkVG8obWFwKTtcblxuICAvL2Nvbm5lY3QgdG8gQ2FydG9cbiAgY29uc3QgY2xpZW50ID0gbmV3IGNhcnRvLkNsaWVudCh7XG4gICAgYXBpS2V5OiBhcGlfa2V5LFxuICAgIHVzZXJuYW1lOiAnYmV0YW55YydcbiAgfSk7XG5cbiAgT2JqZWN0LmVudHJpZXMobGF5ZXJzKS5mb3JFYWNoKChbaWQsIHZhbHVlc10pID0+IHtcbiAgICB2YWx1ZXMuc291cmNlID0gbmV3IGNhcnRvLnNvdXJjZS5TUUwodmFsdWVzLnNxbCk7XG4gICAgLy8gT3V0bGluZSB0aGUgZ2VvbWV0cmllcyBmb3IgZWFjaCBkYXRhc2V0LlxuICAgIC8vIENvbG9ycyBiYXNlZCBvbiBEQ1AgUGxhbm5pbmcgTGFicyBzdGFuZGFyZCBjb2xvcnNcbiAgICAvLyBodHRwczovL21lZGl1bS5jb20vbnljcGxhbm5pbmdsYWJzL2V4cGVyaW1lbnRpbmctd2l0aC1wbGFubmluZy1jb2xvci1zdGFuZGFyZHMtMTViNTkxZDJhOTBjXG4gICAgY29uc3QgaGFsbyA9IHZhbHVlcy5oYWxvRmlsbFxuICAgICAgPyBgXG5cdFx0XHRcdHRleHQtaGFsby1maWxsOiAke3ZhbHVlcy5oYWxvRmlsbH07XG5cdFx0XHRcdHRleHQtaGFsby1yYWRpdXM6ICR7dmFsdWVzLmhhbG9SYWRpdXN9O1xuXHRcdFx0YFxuICAgICAgOiAnJztcblxuICAgIHZhbHVlcy5zdHlsZSA9IG5ldyBjYXJ0by5zdHlsZS5DYXJ0b0NTUyhgXG5cdFx0XHQjbGF5ZXIge1xuXHRcdFx0cG9seWdvbi1maWxsOiAke3ZhbHVlcy50ZXh0Q29sb3J9O1xuXHRcdFx0cG9seWdvbi1vcGFjaXR5OiAwO1xuXHRcdFx0dGV4dC1uYW1lOiBbbmFtZWNvbF07XG5cdFx0XHR0ZXh0LWZhY2UtbmFtZTogJ09wZW4gU2FucyBSZWd1bGFyJztcblx0XHRcdHRleHQtZmlsbDogJHt2YWx1ZXMudGV4dENvbG9yfTtcblx0XHRcdHRleHQtc2l6ZTogMTQ7XG5cdFx0XHQke2hhbG99XG5cdFx0XHR9XG5cdFx0XHQjbGF5ZXI6Om91dGxpbmUge1xuXHRcdFx0bGluZS13aWR0aDogMi41O1xuXHRcdFx0bGluZS1jb2xvcjogJHt2YWx1ZXMubGluZUNvbG9yfTtcblx0XHRcdGxpbmUtb3BhY2l0eTogMTtcblx0XHRcdH1cblx0XHRcdCNsYXllclt6b29tIDw9IDEwXXtcblx0XHRcdFx0dGV4dC1zaXplOiAxMDtcblx0XHRcdH1cblx0XHRcdCNsYXllcjo6b3V0bGluZSBbem9vbSA8PSAxMF17XG5cdFx0XHRcdG1hcmtlci13aWR0aDogMS41O1xuXHRcdFx0fVxuXHRcdGApO1xuXG4gICAgY29uc3QgZXh0cmFDb2x1bW5zID0gJ2V4dHJhQ29sdW1ucycgaW4gdmFsdWVzID8gdmFsdWVzLmV4dHJhQ29sdW1ucyA6IFtdO1xuICAgIGNvbnN0IGZlYXR1cmVDbGlja0NvbHVtbnMgPSBbdmFsdWVzLnRleHROYW1lLCAuLi5leHRyYUNvbHVtbnNdO1xuXG4gICAgdmFsdWVzLmxheWVyID0gbmV3IGNhcnRvLmxheWVyLkxheWVyKFxuICAgICAgdmFsdWVzLnNvdXJjZSxcbiAgICAgIHZhbHVlcy5zdHlsZSxcbiAgICAgIGZlYXR1cmVDbGlja0NvbHVtbnNcbiAgICApO1xuXG4gICAgLy9hZGQgbGF5ZXIgdG8gbWFwXG4gICAgY2xpZW50LmFkZExheWVyKHZhbHVlcy5sYXllcik7XG5cbiAgICAvL3NldHVwIHN3aXRjaCBmdW5jdGlvbnNcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3dpdGNoZXMnKS5pbm5lckhUTUwgKz0gYFxuXHRcdFx0PGxpPlxuXHRcdFx0XHQ8bGFiZWwgY2xhc3M9XCJzd2l0Y2hcIj5cblx0XHRcdFx0XHQ8aW5wdXQgaWQ9XCIke2lkfVwiIHR5cGU9XCJjaGVja2JveFwiIG5hbWU9XCJzdHlsZVwiIG9uY2hhbmdlPVwidG9nZ2xlX2xheWVyKCcke2lkfScpXCIgJHtcbiAgICAgIGlkID09PSAnY2QnID8gJ2NoZWNrZWQnIDogJydcbiAgICB9PlxuXHRcdFx0XHRcdDxzcGFuIGNsYXNzPVwic2xpZGVyXCI+PC9zcGFuPlxuXHRcdFx0XHQ8L2xhYmVsPlxuXHRcdFx0XHQ8aDU+JHt2YWx1ZXMubmFtZX08L2g1PiA8aHIgY2xhc3M9XCJjb2xvcmVkX2xpbmVcIiBzdHlsZT1cImJvcmRlci10b3AtY29sb3I6JHtcbiAgICAgIHZhbHVlcy5saW5lQ29sb3JcbiAgICB9XCI+XG5cdFx0XHQ8L2xpPlxuXHRcdGA7XG4gICAgLy9oaWRlIGFsbCBsYXllcnMgYnV0IGNkXG4gICAgaWYgKGlkICE9PSAnY2QnKSB2YWx1ZXMubGF5ZXIuaGlkZSgpO1xuICB9KTtcblxuICBjbGllbnQuZ2V0TGVhZmxldExheWVyKCkuYWRkVG8obWFwKTtcblxuICBjb25zdCBwb3B1cCA9IEwucG9wdXAoeyBjbG9zZUJ1dHRvbjogZmFsc2UgfSk7XG5cbiAgLy9pbml0IFF1ZXJ5IE92ZXJsYXBwaW5nIERpc3RyaWN0cyBzZWxlY3RvcnNcbiAgY29uc3Qgb3ZlcmxhcFNlbGVjdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhZG1pbl9kaXN0cmljdCcpO1xuICBPYmplY3QuZW50cmllcyhsYXllcnMpLmZvckVhY2goKFtpZCwgdmFsdWVzXSkgPT4ge1xuICAgIGNvbnN0IG9wdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xuICAgIG9wdGlvbi50ZXh0Q29udGVudCA9IHZhbHVlcy5uYW1lO1xuICAgIG9wdGlvbi52YWx1ZSA9IGlkO1xuICAgIG92ZXJsYXBTZWxlY3QuYXBwZW5kQ2hpbGQob3B0aW9uKTtcbiAgfSk7XG4gIG92ZXJsYXBTZWxlY3QuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgZSA9PiBxdWVyeV9kaXN0cmljdChlLnRhcmdldC52YWx1ZSkpO1xuXG4gIC8vbWFwIGNsaWNrXG5cbiAgbWFwLm9uKCdjbGljaycsIGUgPT4ge1xuICAgIGNvbnN0IHsgbGF0OiBsYXRpdHVkZSwgbG5nOiBsb25naXR1ZGUgfSA9IGUubGF0bG5nO1xuICAgIGlmIChtYXJrZXIpIHtcbiAgICAgIG1hcmtlci5yZW1vdmUoKTtcbiAgICB9XG4gICAgbWFya2VyID0gTC5tYXJrZXIoW2xhdGl0dWRlLCBsb25naXR1ZGVdKS5hZGRUbyhtYXApO1xuXG4gICAgY29uc3QgaW50ZXJzZWN0c1VybCA9IGBodHRwczovL2JldGFueWMuY2FydG8uY29tL2FwaS92Mi9zcWwvP3E9U0VMRUNUICogRlJPTSBhbGxfYm91bmRzIFdIRVJFIFNUX0ludGVyc2VjdHMoU1RfU2V0U1JJRChTVF9NYWtlUG9pbnQoJHtsb25naXR1ZGV9LCAke2xhdGl0dWRlfSksIDQzMjYpLHRoZV9nZW9tKSAmYXBpX2tleT0ke2FwaV9rZXl9YDtcbiAgICBmZXRjaChpbnRlcnNlY3RzVXJsKVxuICAgICAgLnRoZW4ocmVzID0+IHJlcy5qc29uKCkpXG4gICAgICAudGhlbigoeyByb3dzIH0pID0+IGdlbmVyYXRlSW5mb0JveEZyb21RdWVyeShyb3dzLCAnQ2xpY2tlZCBwb2ludCcpKTtcbiAgfSk7XG59XG5cbmV4cG9ydCB7XG4gIHNldF9hZGRyZXNzLFxuICB0b2dnbGVfbGF5ZXIsXG4gIHRvZ2dsZV92aXNpYmlsaXR5LFxuICBzaG93X2luZm9fYm94LFxuICBsaXN0X292ZXJsYXBzLFxuICByZXNldF9tYXAsXG4gIGluaXQsXG4gIG1hcCxcbiAgbWFya2VyLFxuICBsYXllcnNcbn07XG4iXSwibmFtZXMiOlsiZm9ybWF0X2NkIiwiYm9ybyIsImNkIiwidGV4dCIsImZvcm1hdF9wcCIsInByZWNpbmN0IiwiZm9ybWF0X2RlZmF1bHQiLCJuYW1lIiwidXJsIiwicHJveHl1cmwiLCJhcGlfa2V5IiwibGF5ZXJzIiwic3FsIiwidGV4dENvbG9yIiwibGluZUNvbG9yIiwiaWNvbiIsImZvcm1hdENvbnRlbnQiLCJhbHQiLCJzdWJzdHJpbmciLCJwcCIsInNkIiwiZmIiLCJoYWxvRmlsbCIsImhhbG9SYWRpdXMiLCJnZW5lcmF0ZUluZm9Cb3hGcm9tUXVlcnkiLCJyb3dzIiwibGFiZWwiLCJsYXllcnNDb250ZW50IiwiT2JqZWN0IiwiZW50cmllcyIsIm1hcCIsImlkIiwidmFsdWVzIiwiY29udGVudCIsImxheWVyUm93cyIsImZpbHRlciIsInJvdyIsIm5hbWVjb2wiLCJuYW1lYWx0Iiwiam9pbiIsImRvY3VtZW50IiwiZ2V0RWxlbWVudEJ5SWQiLCJpbm5lckhUTUwiLCJzaG93X2luZm9fYm94Iiwic2V0X2FkZHJlc3MiLCJzZWxlY3QiLCJvcHRpb25zIiwic2VsZWN0ZWRJbmRleCIsInZhbHVlIiwiYWRyIiwiZmV0Y2giLCJtb2RlIiwidGhlbiIsInJlc3BvbnNlIiwianNvbiIsImFkZHJlc3MiLCJzdHlsZSIsImRpc3BsYXkiLCJyZXN1bHRzIiwibGF0aXR1ZGUiLCJsb25naXR1ZGUiLCJzZXRWaWV3IiwibWFya2VyIiwicmVtb3ZlIiwiTCIsImFkZFRvIiwiaW50ZXJzZWN0c1VybCIsInJlcyIsImNhdGNoIiwiZXJyb3IiLCJjb25zb2xlIiwibG9nIiwidG9nZ2xlX2xheWVyIiwiY2hlY2tlZCIsImxheWVyIiwic2hvdyIsImhpZGUiLCJoaWRlX2FsbF91bnNlbGVjdGVkX2Rpc3RyaWN0cyIsImRpc3RyaWN0cyIsImtleXMiLCJlbGVtZW50IiwiZXZlbnQiLCJFdmVudCIsImRpc3BhdGNoRXZlbnQiLCJpIiwibGVuZ3RoIiwidG9nZ2xlX3Zpc2liaWxpdHkiLCJlIiwicXVlcnlfZGlzdHJpY3QiLCJsYXllcl9pZCIsInF1ZXJ5RGlzdHJpY3RzIiwic29ydCIsImEiLCJiIiwibG9jYWxlQ29tcGFyZSIsIm51bWVyaWMiLCJlcnIiLCJsaXN0X292ZXJsYXBzIiwic2VsZWN0X2Rpc3RyaWN0X2lkIiwiZGlzdHJpY3RfaWQiLCJxdWVyeSIsImJvdW5kc0NvbnRlbnQiLCJib3VuZFJvd3MiLCJpbmNsdWRlcyIsInJlc2V0X21hcCIsImluaXQiLCJzY3JvbGxXaGVlbFpvb20iLCJkaXNhYmxlIiwidGlsZUxheWVyIiwibWF4Wm9vbSIsImNsaWVudCIsImNhcnRvIiwiQ2xpZW50IiwiYXBpS2V5IiwidXNlcm5hbWUiLCJmb3JFYWNoIiwic291cmNlIiwiU1FMIiwiaGFsbyIsIkNhcnRvQ1NTIiwiZXh0cmFDb2x1bW5zIiwiZmVhdHVyZUNsaWNrQ29sdW1ucyIsInRleHROYW1lIiwiTGF5ZXIiLCJhZGRMYXllciIsImdldExlYWZsZXRMYXllciIsInBvcHVwIiwiY2xvc2VCdXR0b24iLCJvdmVybGFwU2VsZWN0Iiwib3B0aW9uIiwiY3JlYXRlRWxlbWVudCIsInRleHRDb250ZW50IiwiYXBwZW5kQ2hpbGQiLCJhZGRFdmVudExpc3RlbmVyIiwidGFyZ2V0Iiwib24iLCJsYXRsbmciLCJsYXQiLCJsbmciXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0VBQUEsU0FBUyxXQUFXLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRTtFQUMvQixFQUFFLEtBQUssR0FBRyxLQUFLLEtBQUssQ0FBQyxHQUFHLEdBQUcsR0FBRyxFQUFFLENBQUM7RUFDakMsRUFBRSxJQUFJLFFBQVEsR0FBRyxHQUFHLENBQUMsUUFBUSxDQUFDOztFQUU5QixFQUFFLElBQUksQ0FBQyxHQUFHLElBQUksT0FBTyxRQUFRLEtBQUssV0FBVyxFQUFFLEVBQUUsT0FBTyxFQUFFOztFQUUxRCxFQUFFLElBQUksSUFBSSxHQUFHLFFBQVEsQ0FBQyxJQUFJLElBQUksUUFBUSxDQUFDLG9CQUFvQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQ3ZFLEVBQUUsSUFBSSxLQUFLLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQztFQUM5QyxFQUFFLEtBQUssQ0FBQyxJ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
