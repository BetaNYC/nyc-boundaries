(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.window = global.window || {}));
}(this, (function (exports) { 'use strict';

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
  }

  function _iterableToArrayLimit(arr, i) {
    var _i = arr && (typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]);

    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;

    var _s, _e;

    try {
      for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
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

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
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

  var css_248z = "/* Body, Headers, and Text*/\n* {\n  margin: 0;\n  padding: 0;\n}\n\nhtml {\n  box-sizing: border-box;\n  height: 100%;\n}\n\nbody {\n  background: #f2f6f9;\n  height: 100%;\n  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica,\n    Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';\n  overflow: hidden;\n  /* -webkit-touch-callout: none;\n  -webkit-user-select: none;\n  -khtml-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none; */\n}\n\nh1,\nh2,\nh3 {\n  font-size: 25px !important;\n  padding-bottom: 5px;\n  margin: 0px 0px !important;\n}\n\nh1 {\n  color: black !important;\n}\n\nh4,\nh5,\nh6 {\n  font-weight: normal !important;\n  padding-bottom: 5px;\n  margin: 0px 0px !important;\n}\n\nspan {\n  font-size: 12px;\n}\n\n/*Text Styles*/\n.bold {\n  font-weight: bold !important;\n}\n\n.lighter {\n  color: #444444;\n}\n\n/*Toolboxes and Infoboxes*/\n.separator {\n  min-height: 1px;\n  background-color: rgba(46, 60, 67, 0.08);\n  margin: 16px 0;\n}\n\n.main {\n  display: flex;\n  flex-wrap: wrap-reverse;\n  height: 100%;\n}\n\n.left {\n  flex: 1 1 300px;\n  flex-grow: 1;\n  height: 100%;\n  overflow-y: auto;\n  overflow-x: hidden;\n  background-color: #fff;\n  z-index: 2;\n}\n\n.left-controls {\n  margin: 1rem;\n}\n\n.right {\n  flex: 999 1 0;\n  min-width: 375px;\n  height: 100%;\n}\n\n.modal {\n  display: none;\n  position: fixed;\n  z-index: 1001;\n  top: 0;\n  right: 0;\n  margin: 0.8em 1em;\n  background-color: white;\n  padding: 10px;\n  width: 30%;\n  height: 80%;\n  overflow-y: auto;\n  box-shadow: 0 0px 16px rgba(0, 0, 0, 0.24);\n  border-radius: 4px;\n  overflow: auto;\n}\n\n@media all and (max-width: 674px) {\n  .left {\n    height: 50%;\n  }\n  .right {\n    height: 50%;\n  }\n  .modal {\n    width: 80%;\n    height: 65%;\n    margin: 2em auto;\n    right: 0;\n    left: 0;\n    top: 0;\n    bottom: auto;\n  }\n}\n\n#about {\n  margin-top: 20px;\n}\n\n.logo {\n  width: 50px;\n  margin: auto;\n  display: block;\n}\n\n.logo_caption {\n  font-size: 10px;\n  text-align: center;\n  margin-top: 5px;\n}\n\n.close_button,\n.reset_map {\n  font-size: 11px;\n}\n\n#footer {\n  text-align: center !important;\n}\n\n.footer_text {\n  font-size: 11px;\n}\n\n/*Icons and Legends*/\nhr {\n  margin-bottom: 10px;\n  margin-top: 10px;\n}\n\n.colored_line {\n  border: none;\n  border-top: 3px solid #000;\n  color: #fff;\n  background-color: #fff;\n  height: 1px;\n  width: 15%;\n  margin-left: 10px;\n}\n\n.legend_text {\n  font-size: 11px;\n}\n\n.switch {\n  position: relative;\n  display: inline-block;\n  width: 22px;\n  height: 14px;\n  margin-right: 5px;\n}\n\n.switch input {\n  display: none;\n}\n\n.slider {\n  position: absolute;\n  cursor: pointer;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background-color: #ccc;\n  transition: 0.4s;\n}\n\n.slider:before {\n  position: absolute;\n  content: '';\n  height: 8px;\n  width: 8px;\n  left: 3px;\n  bottom: 3px;\n  background-color: white;\n  transition: 0.4s;\n}\n\ninput:checked + .slider {\n  background-color: #6a6a6a;\n}\n\ninput:focus + .slider {\n  box-shadow: 0 0 1px #6a6a6a;\n}\n\ninput:checked + .slider:before {\n  -webkit-transform: translateX(8px);\n  transform: translateX(8px);\n}\n\n/*Map*/\n#container {\n  display: flex;\n  width: 100%;\n  height: 100%;\n}\n\n.leaflet-control-zoom-out {\n  background-color: #fff !important;\n}\n\n.leaflet-control-zoom-in {\n  background-color: #fff !important;\n}\n\n/*Search*/\n#no_results {\n  display: none;\n}\n\n.search_label {\n  font-size: 14px !important;\n}\n\ninput[type='submit'] {\n  background-color: #6a6a6a;\n  border: none;\n  color: white;\n  padding: 5px 10px;\n  text-decoration: none;\n  cursor: pointer;\n  margin-top: 5px;\n}\n\n.search_bar {\n  width: 100%;\n  padding: 5px 15px;\n  box-sizing: border-box;\n}\n\n.select_custom {\n  position: relative;\n  display: inline-block;\n  width: 100%;\n  margin-top: 5px;\n  margin-bottom: 5px;\n}\n\n.select_custom select {\n  display: inline-block;\n  width: 100%;\n  padding: 10px 15px;\n  cursor: pointer;\n  color: #7b7b7b;\n  border: 0;\n  border-radius: 0;\n  outline: 0;\n  background: #e6e6e6;\n  appearance: none;\n  -webkit-appearance: none;\n  -moz-appearance: none;\n}\n\n.select_custom select::-ms-expand {\n  display: none;\n}\n\n.select_custom select:hover,\n.select_custom select:focus {\n  color: #000;\n  background: #ccc;\n}\n\n.select_custom select:disabled {\n  pointer-events: none;\n  opacity: 0.5;\n}\n\n.select_arrow {\n  position: absolute;\n  top: 12px;\n  right: 15px;\n  width: 0;\n  height: 0;\n  pointer-events: none;\n  border-width: 8px 5px 0 5px;\n  border-style: solid;\n  border-color: #7b7b7b transparent transparent transparent;\n}\n\n.select_custom select:hover ~ .select_arrow,\n.select_custom select:focus ~ .select_arrow {\n  border-top-color: #000;\n}\n\n.select_custom select:disabled ~ .select_arrow {\n  border-top-color: #ccc;\n}\n\n.city_icons {\n  width: 50px;\n  float: left;\n  margin-right: 10px;\n}\n\n/*Clears and Margins*/\n.clearfix {\n  overflow: auto;\n  width: 100%;\n}\n\n#suggestions {\n  list-style-type: none;\n  padding: 0;\n  margin: 0;\n}\n\n#suggestions li:hover {\n  background-color: rgb(219, 219, 219);\n}\n\n.input_checkbox {\n  display: flex;\n  flex-direction: row;\n  margin-top: 1rem;\n}\n\n.input_checkbox input {\n  margin-left: 1rem;\n}\n";
  styleInject(css_248z);

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

  var addressSearch = document.getElementById('address');
  var suggestions = document.getElementById('suggestions');


  var api_key = 'undefined';
  var layers = {
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
    dsny: {
      name: 'Sanitation Districts',
      sql: "SELECT * FROM all_bounds WHERE id = 'dsny'",
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
    },
    sd: {
      name: 'School Districts',
      sql: "SELECT * FROM all_bounds WHERE id = 'sd'",
      textColor: '#eded12',
      lineColor: '#eded12',
      icon: 'static/NYCCo_food_apple_01.jpg',
      formatContent: function formatContent(name, alt) {
        return format_default(name);
      }
    },
    hc: {
      name: 'Health Center Districts',
      sql: "SELECT * FROM all_bounds WHERE id = 'hc'",
      textColor: '#edbd12',
      lineColor: '#edbd12',
      icon: 'static/NYCCo_jobs_doctor_01.jpg',
      formatContent: function formatContent(name, alt) {
        return format_default(name);
      }
    },
    cc: {
      name: 'City Council Districts',
      sql: "SELECT * FROM all_bounds WHERE id = 'cc'",
      textColor: '#ed7d12',
      lineColor: '#ed7d12',
      icon: 'static/NYCCo_government_cityhall_01.jpg',
      formatContent: function formatContent(name, alt) {
        return format_default(name, "https://council.nyc.gov/district-".concat(name));
      }
    },
    nycongress: {
      name: 'Congressional Districts',
      sql: "SELECT * FROM all_bounds WHERE id = 'nycongress'",
      textColor: '#ed1212',
      lineColor: '#ed1212',
      icon: 'static/NYCCo_domestic_a_01.jpg',
      formatContent: function formatContent(name, alt) {
        return format_default(name, "https://www.govtrack.us/congress/members/NY/".concat(name));
      }
    },
    sa: {
      name: 'State Assembly Districts',
      sql: "SELECT * FROM all_bounds WHERE id = 'sa'",
      textColor: '#ed1294',
      lineColor: '#ed1294',
      icon: 'static/NYCCo_governement_law_01.jpg',
      formatContent: function formatContent(name, alt) {
        return format_default(name);
      }
    },
    ss: {
      name: 'State Senate Districts',
      sql: "SELECT * FROM all_bounds WHERE id = 'ss'",
      textColor: '#9912ed',
      lineColor: '#9912ed',
      icon: 'static/NYCCo_government_justice_01.jpg',
      formatContent: function formatContent(name, alt) {
        return format_default(name, "https://www.nysenate.gov/district/".concat(name));
      }
    },
    nta: {
      name: 'Neighborhood Tabulation Area',
      sql: "SELECT * FROM all_bounds WHERE id = 'nta'",
      textColor: '#1212ed',
      lineColor: '#1212ed',
      icon: 'static/NYCCo_explore_01.jpg',
      textSmall: true,
      formatContent: function formatContent(name, alt) {
        return format_default(name);
      }
    },
    bid: {
      name: 'Business Improvement District',
      sql: "SELECT * FROM all_bounds WHERE id = 'bid'",
      textColor: '#129ded',
      lineColor: '#129ded',
      icon: 'static/NYCCo_jobs_a_01.jpg',
      textSmall: true,
      formatContent: function formatContent(name, alt) {
        return format_default(name);
      }
    },
    zipcode: {
      name: 'Zipcodes',
      sql: "SELECT * FROM all_bounds WHERE id = 'zipcode'",
      textColor: '#666666',
      lineColor: '#666666',
      icon: 'static/NYCCo_zip_01.jpg',
      textSmall: true,
      formatContent: function formatContent(name, alt) {
        return format_default(name);
      }
    }
  };

  function queryFromLatLng(latitude, longitude) {
    var label = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    //set map view to the resulting lat, lon
    exports.map.setView([latitude, longitude]);

    if (label === null) {
      label = "Clicked Point: ".concat(latitude.toFixed(5), ", ").concat(longitude.toFixed(5));
    }

    if (exports.marker) exports.marker.remove();
    exports.marker = L.marker([latitude, longitude]).addTo(exports.map);
    var intersectsUrl = "https://betanyc.carto.com/api/v2/sql/?q=SELECT * FROM all_bounds WHERE ST_Intersects(ST_SetSRID(ST_MakePoint(".concat(longitude, ", ").concat(latitude, "), 4326),the_geom) &api_key=").concat(api_key);
    fetch(intersectsUrl).then(function (res) {
      return res.json();
    }).then(function (_ref) {
      var rows = _ref.rows;
      return generateInfoBoxFromQuery(rows, label);
    });
  }

  function generateInfoBoxFromQuery(rows, label) {
    //create content for each layer
    var layersContent = Object.entries(layers).map(function (_ref2) {
      var _ref3 = _slicedToArray(_ref2, 2),
          id = _ref3[0],
          values = _ref3[1];

      var content = "<img class=\"city_icons\" src=\"".concat(values.icon, "\"/><h5 class= \"\">").concat(values.name, "</h5>"); //filter and remove duplicates

      var layerRows = rows.filter(function (row) {
        return row.id === id;
      }).reduce(function (unique, item) {
        var uniqueNames = unique.map(function (row) {
          return row.namecol;
        });
        return uniqueNames.includes(item.namecol) ? unique : [].concat(_toConsumableArray(unique), [item]);
      }, []); //for each row generate span

      content += layerRows.map(function (row) {
        return values.formatContent(row.namecol, row.namealt);
      }).join('<span class= "lighter">, </span>');
      return "<div id=\"ds_info\" class=\"clearfix\">".concat(content, "</div>");
    }).join('');
    document.getElementById('info_box').innerHTML = "\n    <a href=\"#\" onclick=\"toggle_visibility('info_box');if(marker){marker.remove()};\" class=\"close_button\">Close Window</a>\n    <div id=\"info\"><h3 class = \"bold\">".concat(label, " </h3><div class=\"separator\"></div></div>").concat(layersContent, "\n  ");
    show_info_box();
  }

  function set_address() {
    //Use the PlanningLab's NYC GeoSearch
    fetch("https://geosearch.planninglabs.nyc/v1/search?text=".concat(addressSearch.value)).then(function (response) {
      return response.json();
    }).then(function (_ref4) {
      var features = _ref4.features;

      if (features.length > 0) {
        var label = features[0].properties.label.replace(', New York, NY, USA', '');

        var _features$0$geometry$ = _slicedToArray(features[0].geometry.coordinates, 2),
            longitude = _features$0$geometry$[0],
            latitude = _features$0$geometry$[1];

        document.getElementById('no_results').style.display = 'none';
        queryFromLatLng(latitude, longitude, label); //clear suggestions

        while (suggestions.firstChild) {
          suggestions.removeChild(suggestions.firstChild);
        }
      } else {
        document.getElementById('no_results').style.display = 'block';
      }
    }).catch(function (error) {
      console.log(error); //if nothing gets returned, display no results

      document.getElementById('no_results').style.display = 'block';
    });
  }

  function search_address() {
    var adr = addressSearch.value;
    var url = "https://geosearch.planninglabs.nyc/v1/search?text=".concat(adr);
    fetch(url).then(function (res) {
      return res.json();
    }).then(function (_ref5) {
      var features = _ref5.features;

      //todo - clean up event listeners
      //clear suggestions
      while (suggestions.firstChild) {
        suggestions.removeChild(suggestions.firstChild);
      } //create suggestion list items


      features.forEach(function (feature) {
        var label = feature.properties.label.replace(', New York, NY, USA', '');

        var _feature$geometry$coo = _slicedToArray(feature.geometry.coordinates, 2),
            longitude = _feature$geometry$coo[0],
            latitude = _feature$geometry$coo[1];

        var li = document.createElement('li');
        var a = document.createElement('a');
        a.textContent = label;
        a.addEventListener('click', function () {
          addressSearch.value = label; //clear suggestions

          while (suggestions.firstChild) {
            suggestions.removeChild(suggestions.firstChild);
          }

          queryFromLatLng(latitude, longitude, label);
        });
        li.appendChild(a);
        suggestions.appendChild(li);
      });
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
    }).then(function (_ref6) {
      var rows = _ref6.rows;
      //get all rows, filter for unique items, sort numeric, then generate options for selected_district
      var options = rows.map(function (row) {
        return row.namecol;
      }).reduce(function (unique, item) {
        return unique.includes(item) ? unique : [].concat(_toConsumableArray(unique), [item]);
      }, []).sort(function (a, b) {
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
    if (exports.marker) exports.marker.remove();
    var select_district_id = document.getElementById('district');
    var district_id = select_district_id.options[select_district_id.selectedIndex].value;
    var query = "\n                WITH  al as (SELECT ST_MakeValid(the_geom) as the_geom, id, namecol, namealt FROM all_bounds),\n                      se as (SELECT the_geom FROM al WHERE id = '".concat(layer_id, "' AND namecol = '").concat(district_id, "'),\n                      inter as \n                        (SELECT DISTINCT al.id, al.namecol, al.namealt, \n                          ST_Area(se.the_geom) as area, ST_Area(ST_Intersection(al.the_geom, se.the_geom)) as searea\n                          FROM al, se \n                          WHERE ST_Intersects(al.the_geom, se.the_geom))\n                SELECT * FROM inter WHERE searea / area > .005\n                ");
    var intersectsUrl = "https://betanyc.carto.com/api/v2/sql/?q=".concat(query, "&api_key=").concat(api_key);
    fetch(intersectsUrl).then(function (res) {
      return res.json();
    }).then(function (_ref7) {
      var rows = _ref7.rows;
      //create content for each bound
      var boundsContent = Object.entries(layers).map(function (_ref8) {
        var _ref9 = _slicedToArray(_ref8, 2),
            id = _ref9[0],
            values = _ref9[1];

        var content = "<img class=\"city_icons\" src=\"".concat(values.icon, "\"/><h5 class= \"\">").concat(values.name, "</h5>");
        var boundRows = rows.filter(function (row) {
          return row.id === id;
        }).reduce(function (unique, item) {
          //
          var uniqueNames = unique.map(function (row) {
            return row.namecol;
          });
          return uniqueNames.includes(item.namecol) ? unique : [].concat(_toConsumableArray(unique), [item]);
        }, []).filter(function (row) {
          return !row.namecol.includes('park-cemetery-etc');
        });

        function addWarning(content, percent) {
          if (percent < 0.05) {
            return "<abbr title=\"Overlaps only ".concat((percent * 100).toFixed(1), "% of the district\">").concat(content, "*</abbr>");
          } else {
            return content;
          }
        }

        content += boundRows.map(function (row) {
          return addWarning(values.formatContent(row.namecol, row.namealt), +row.searea / +row.area);
        }).join('<span class= "lighter">, </span>');
        return "<div id=\"ds_info\" class=\"clearfix\">".concat(content, "</div>");
      }).join('');
      document.getElementById('info_box').innerHTML = "\n        <a href=\"#\" onclick=\"toggle_visibility('info_box');if(marker){marker.remove()};\" class=\"close_button\">Close Window</a>\n        <div id=\"info\"><h3 class = \"bold\">".concat(layers[layer_id].name, " - ").concat(district_id, " </h3>\n        <span class='lighter'>*Less than 5% overlap.</span>\n        <div class=\"separator\"></div></div>").concat(boundsContent);
      show_info_box();
    });
  }

  function reset_map() {
    exports.map.setView([40.70458, -73.9256], 11);
    if (exports.marker) exports.marker.remove();
  }

  function init() {
    {
      console.log('WARNING: NO API KEY, please include one in the .env file');
    } //set map view


    exports.map = L.map('map').setView([40.70458, -73.9256], 11); // map.scrollWheelZoom.disable();

    exports.map.doubleClickZoom.disable(); //set basemap

    L.tileLayer('https://api.mapbox.com/styles/v1/zhik/cke336l6w1g4n1dqv1tlv1pw3/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiemhpayIsImEiOiJjaW1pbGFpdHQwMGNidnBrZzU5MjF5MTJiIn0.N-EURex2qvfEiBsm-W9j7w', {
      maxZoom: 18
    }).addTo(exports.map); //connect to Carto

    var client = new carto.Client({
      apiKey: api_key,
      username: 'betanyc'
    });
    Object.entries(layers).forEach(function (_ref10, item_number) {
      var _ref11 = _slicedToArray(_ref10, 2),
          id = _ref11[0],
          values = _ref11[1];

      values.source = new carto.source.SQL(values.sql); // Outline the geometries for each dataset.
      // Colors based on DCP Planning Labs standard colors
      // https://medium.com/nycplanninglabs/experimenting-with-planning-color-standards-15b591d2a90c

      var textScale = values.textSmall ? "\n      #layer[zoom > 12]{\n        text-size: 11;\n      }\n      #layer[zoom <= 12]{\n        text-size: 8;\n      }" : "#layer[zoom > 11]{\n        text-size: 16;\n        text-character-spacing: 2;\n      }\n      #layer[zoom <= 11]{\n        text-size: 10;\n        text-character-spacing: 1;\n      }";
      values.style = new carto.style.CartoCSS("\n\t\t\t#layer {\n      polygon-fill: #fff;\n\t\t\tpolygon-opacity: 0;\n      text-name: [namecol];\n      text-face-name: 'Lato Bold Italic';\n      text-fill: #fff;\n      text-halo-radius: 2.5;\n      text-halo-fill: darken(".concat(values.textColor, ",20);\n      text-allow-overlap: false;\n      text-placements: \"N,E,S,W\";\n      text-dy: -1;\n      text-dx: -1;\n      text-placement-type: simple;\n      text-label-position-tolerance: 20;\n\t\t\t}\n\t\t\t#layer::outline {\n      line-width: 2;\n\t\t\tline-color: ").concat(values.lineColor, ";\n      line-opacity: 1;\n      line-rasterizer: full;\n      line-comp-op: dst-over;\n      line-dasharray: 20, 10;\n      line-dash-offset: ").concat(item_number * 3, ";\n\t\t\t}\n\t\t\t#layer::outline [zoom <= 12]{\n\t\t\t\tmarker-width: 1;\n      }\n      ").concat(textScale, "\n\t\t"));
      var extraColumns = 'extraColumns' in values ? values.extraColumns : [];
      var featureClickColumns = [values.textName].concat(_toConsumableArray(extraColumns));
      values.layer = new carto.layer.Layer(values.source, values.style, featureClickColumns); //add layer to map

      client.addLayer(values.layer); //setup switch functions

      document.getElementById('switches').innerHTML += "\n\t\t\t<li>\n\t\t\t\t<label class=\"switch\">\n\t\t\t\t\t<input id=\"".concat(id, "\" type=\"checkbox\" name=\"style\" onchange=\"toggle_layer('").concat(id, "')\" ").concat(id === 'cd' ? 'checked' : '', ">\n\t\t\t\t\t<span class=\"slider\"></span>\n\t\t\t\t</label>\n\t\t\t\t<h5>").concat(values.name, "</h5> <hr class=\"colored_line\" style=\"border-top-color:").concat(values.lineColor, "\">\n\t\t\t</li>\n\t\t"); //hide all layers but cd

      if (id !== 'cd') values.layer.hide();
    });
    client.getLeafletLayer().addTo(exports.map);
    L.popup({
      closeButton: false
    }); //init Query Overlapping Districts selectors

    var overlapSelect = document.getElementById('admin_district');
    Object.entries(layers).forEach(function (_ref12) {
      var _ref13 = _slicedToArray(_ref12, 2),
          id = _ref13[0],
          values = _ref13[1];

      var option = document.createElement('option');
      option.textContent = values.name;
      option.value = id;
      overlapSelect.appendChild(option);
    });
    overlapSelect.addEventListener('change', function (e) {
      return query_district(e.target.value);
    }); //map click search

    var mapClickedInput = document.getElementById('map_clicked');
    var isMapClickedEnabled = localStorage.getItem("map-clicked") && localStorage.getItem("map-clicked") === 'false' ? false : true;
    var mapClickEvent = toggleMapClicked(null, isMapClickedEnabled);
    mapClickedInput.addEventListener('click', function () {
      isMapClickedEnabled = !isMapClickedEnabled;
      mapClickEvent = toggleMapClicked(mapClickEvent, isMapClickedEnabled);
    });

    function toggleMapClicked(mapClickEvent, enabled) {
      if (enabled) {
        //set input to checked and enable event
        mapClickedInput.checked = true;
        localStorage.setItem('map-clicked', 'true');

        var event = function event(e) {
          var _e$latlng = e.latlng,
              lat = _e$latlng.lat,
              lng = _e$latlng.lng;
          queryFromLatLng(lat, lng);
        };

        exports.map.on('click', event);
        return event;
      } else {
        mapClickedInput.checked = false;
        localStorage.setItem('map-clicked', 'false');
        if (mapClickEvent) exports.map.off('click', mapClickEvent);
        return null;
      }
    } //prompt user for location


    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        var _position$coords = position.coords,
            latitude = _position$coords.latitude,
            longitude = _position$coords.longitude;
        queryFromLatLng(latitude, longitude);
      });
    }
  }

  exports.init = init;
  exports.layers = layers;
  exports.list_overlaps = list_overlaps;
  exports.reset_map = reset_map;
  exports.search_address = search_address;
  exports.set_address = set_address;
  exports.show_info_box = show_info_box;
  exports.toggle_layer = toggle_layer;
  exports.toggle_visibility = toggle_visibility;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlcyI6WyIuLi9ub2RlX21vZHVsZXMvc3R5bGUtaW5qZWN0L2Rpc3Qvc3R5bGUtaW5qZWN0LmVzLmpzIiwiLi4vc3JjL2pzL2Zvcm1hdC5qcyIsIi4uL3NyYy9qcy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJmdW5jdGlvbiBzdHlsZUluamVjdChjc3MsIHJlZikge1xuICBpZiAoIHJlZiA9PT0gdm9pZCAwICkgcmVmID0ge307XG4gIHZhciBpbnNlcnRBdCA9IHJlZi5pbnNlcnRBdDtcblxuICBpZiAoIWNzcyB8fCB0eXBlb2YgZG9jdW1lbnQgPT09ICd1bmRlZmluZWQnKSB7IHJldHVybjsgfVxuXG4gIHZhciBoZWFkID0gZG9jdW1lbnQuaGVhZCB8fCBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdO1xuICB2YXIgc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICBzdHlsZS50eXBlID0gJ3RleHQvY3NzJztcblxuICBpZiAoaW5zZXJ0QXQgPT09ICd0b3AnKSB7XG4gICAgaWYgKGhlYWQuZmlyc3RDaGlsZCkge1xuICAgICAgaGVhZC5pbnNlcnRCZWZvcmUoc3R5bGUsIGhlYWQuZmlyc3RDaGlsZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGhlYWQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBoZWFkLmFwcGVuZENoaWxkKHN0eWxlKTtcbiAgfVxuXG4gIGlmIChzdHlsZS5zdHlsZVNoZWV0KSB7XG4gICAgc3R5bGUuc3R5bGVTaGVldC5jc3NUZXh0ID0gY3NzO1xuICB9IGVsc2Uge1xuICAgIHN0eWxlLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzcykpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IHN0eWxlSW5qZWN0O1xuIiwiZXhwb3J0IGZ1bmN0aW9uIGZvcm1hdF9jZChib3JvLCBjZCkge1xuICBsZXQgdGV4dDtcbiAgc3dpdGNoIChib3JvKSB7XG4gICAgY2FzZSAnMSc6XG4gICAgICB0ZXh0ID0gYE1hbmhhdHRhbiAtICR7Y2R9YDtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJzInOlxuICAgICAgdGV4dCA9IGBCcm9ueCAtICR7Y2R9YDtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJzMnOlxuICAgICAgdGV4dCA9IGBCcm9va2x5biAtICR7Y2R9YDtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJzQnOlxuICAgICAgdGV4dCA9IGBRdWVlbnMgLSAke2NkfWA7XG4gICAgICBicmVhaztcbiAgICBjYXNlICc1JzpcbiAgICAgIHRleHQgPSBgU3RhdGVuIElzbGFuZCAtICR7Y2R9YDtcbiAgICAgIGJyZWFrO1xuICAgIGRlZmF1bHQ6XG4gICAgICB0ZXh0ID0gYCR7Ym9yb30gLSAke2NkfWA7XG4gIH1cbiAgcmV0dXJuIGA8c3BhbiBjbGFzcyA9IFwibGlnaHRlclwiPiR7dGV4dH08L3NwYW4+YDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZvcm1hdF9wcChwcmVjaW5jdCkge1xuICBpZiAocHJlY2luY3QgPT0gMTEgfHwgcHJlY2luY3QgPT0gMTIgfHwgcHJlY2luY3QgPT0gMTMpIHtcbiAgICByZXR1cm4gYDxzcGFuIGNsYXNzID0gXCJsaWdodGVyXCI+PGEgdGFyZ2V0PVwiX2JsYW5rXCIgaHJlZj0naHR0cHM6Ly93d3cxLm55Yy5nb3Yvc2l0ZS9ueXBkL2J1cmVhdXMvcGF0cm9sL3ByZWNpbmN0cy9taWR0b3duLXNvdXRoLXByZWNpbmN0LnBhZ2UnPiR7cHJlY2luY3R9PC9hPiA8L3NwYW4+YDtcbiAgfSBlbHNlIGlmIChwcmVjaW5jdCA9PSAxNCkge1xuICAgIHJldHVybiBgPHNwYW4gY2xhc3MgPSBcImxpZ2h0ZXJcIj48YSB0YXJnZXQ9XCJfYmxhbmtcIiBocmVmPSdodHRwczovL3d3dzEubnljLmdvdi9zaXRlL255cGQvYnVyZWF1cy9wYXRyb2wvcHJlY2luY3RzLyR7cHJlY2luY3R9dGgtcHJlY2luY3QucGFnZSc+JHtwcmVjaW5jdH08L2E+IDwvc3Bhbj5gO1xuICB9IGVsc2UgaWYgKHByZWNpbmN0ID09IDE4KSB7XG4gICAgcmV0dXJuIGA8c3BhbiBjbGFzcyA9IFwibGlnaHRlclwiPjxhIHRhcmdldD1cIl9ibGFua1wiIGhyZWY9J2h0dHBzOi8vd3d3MS5ueWMuZ292L3NpdGUvbnlwZC9idXJlYXVzL3BhdHJvbC9wcmVjaW5jdHMvbWlkdG93bi1ub3J0aC1wcmVjaW5jdC5wYWdlJz4ke3ByZWNpbmN0fTwvYT4gPC9zcGFuPmA7XG4gIH0gZWxzZSBpZiAocHJlY2luY3QgPT0gMjIpIHtcbiAgICByZXR1cm4gYDxzcGFuIGNsYXNzID0gXCJsaWdodGVyXCI+PGEgdGFyZ2V0PVwiX2JsYW5rXCIgaHJlZj0naHR0cHM6Ly93d3cxLm55Yy5nb3Yvc2l0ZS9ueXBkL2J1cmVhdXMvcGF0cm9sL3ByZWNpbmN0cy9jZW50cmFsLXBhcmstcHJlY2luY3QucGFnZSc+JHtwcmVjaW5jdH08L2E+IDwvc3Bhbj5gO1xuICB9IGVsc2UgaWYgKHByZWNpbmN0ICUgMTAgPT0gMSkge1xuICAgIHJldHVybiBgPHNwYW4gY2xhc3MgPSBcImxpZ2h0ZXJcIj48YSB0YXJnZXQ9XCJfYmxhbmtcIiBocmVmPSdodHRwczovL3d3dzEubnljLmdvdi9zaXRlL255cGQvYnVyZWF1cy9wYXRyb2wvcHJlY2luY3RzLyR7cHJlY2luY3R9c3QtcHJlY2luY3QucGFnZSc+JHtwcmVjaW5jdH08L2E+IDwvc3Bhbj5gO1xuICB9IGVsc2UgaWYgKHByZWNpbmN0ICUgMTAgPT0gMikge1xuICAgIHJldHVybiBgPHNwYW4gY2xhc3MgPSBcImxpZ2h0ZXJcIj48YSB0YXJnZXQ9XCJfYmxhbmtcIiBocmVmPSdodHRwczovL3d3dzEubnljLmdvdi9zaXRlL255cGQvYnVyZWF1cy9wYXRyb2wvcHJlY2luY3RzLyR7cHJlY2luY3R9bmQtcHJlY2luY3QucGFnZSc+JHtwcmVjaW5jdH08L2E+IDwvc3Bhbj5gO1xuICB9IGVsc2UgaWYgKHByZWNpbmN0ICUgMTAgPT0gMykge1xuICAgIHJldHVybiBgPHNwYW4gY2xhc3MgPSBcImxpZ2h0ZXJcIj48YSB0YXJnZXQ9XCJfYmxhbmtcIiBocmVmPSdodHRwczovL3d3dzEubnljLmdvdi9zaXRlL255cGQvYnVyZWF1cy9wYXRyb2wvcHJlY2luY3RzLyR7cHJlY2luY3R9cmQtcHJlY2luY3QucGFnZSc+JHtwcmVjaW5jdH08L2E+IDwvc3Bhbj5gO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBgPHNwYW4gY2xhc3MgPSBcImxpZ2h0ZXJcIj48YSB0YXJnZXQ9XCJfYmxhbmtcIiBocmVmPSdodHRwczovL3d3dzEubnljLmdvdi9zaXRlL255cGQvYnVyZWF1cy9wYXRyb2wvcHJlY2luY3RzLyR7cHJlY2luY3R9dGgtcHJlY2luY3QucGFnZSc+JHtwcmVjaW5jdH08L2E+IDwvc3Bhbj5gO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmb3JtYXRfZGVmYXVsdChuYW1lLCB1cmwgPSBudWxsKSB7XG4gIGlmICh1cmwpIHtcbiAgICByZXR1cm4gYDxzcGFuIGNsYXNzID0gXCJsaWdodGVyXCI+PGEgdGFyZ2V0PVwiX2JsYW5rXCIgaHJlZj0nJHt1cmx9Jz4ke25hbWV9PC9hPiA8L3NwYW4+YDtcbiAgfVxuICByZXR1cm4gYDxzcGFuIGNsYXNzID0gXCJsaWdodGVyXCI+JHtuYW1lfTwvc3Bhbj5gO1xufVxuIiwiaW1wb3J0ICcuLi9jc3Mvc3R5bGUuY3NzJ1xuXG5pbXBvcnQgeyBmb3JtYXRfY2QsIGZvcm1hdF9wcCwgZm9ybWF0X2RlZmF1bHQgfSBmcm9tICcuL2Zvcm1hdCdcblxuY29uc3QgYWRkcmVzc1NlYXJjaCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhZGRyZXNzJylcbmNvbnN0IHN1Z2dlc3Rpb25zID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N1Z2dlc3Rpb25zJylcblxubGV0IG1hcmtlclxubGV0IG1hcFxuY29uc3QgYXBpX2tleSA9IEFQSV9LRVlcbmNvbnN0IGxheWVycyA9IHtcbiAgY2Q6IHtcbiAgICBuYW1lOiAnQ29tbXVuaXR5IERpc3RyaWN0cycsXG4gICAgLy9yZW1vdmUgcGFya3NcbiAgICBzcWw6IGBTRUxFQ1QgKiBGUk9NIGFsbF9ib3VuZHMgV0hFUkUgaWQgPSAnY2QnIEFORCBOT1QgbmFtZWNvbCBJTiAoJzE2NCcsJzIyNicsJzIyNycsJzIyOCcsJzM1NScsJzM1NicsJzQ4MCcsJzQ4MScsJzQ4MicpYCxcbiAgICB0ZXh0Q29sb3I6ICcjMDAwMDAwJyxcbiAgICBsaW5lQ29sb3I6ICcjMDAwMDAwJyxcbiAgICBpY29uOiAnc3RhdGljL05ZQ0NvX2h1bWFuX2dyb3VwX2FfMDEuanBnJyxcbiAgICBmb3JtYXRDb250ZW50OiAobmFtZSwgYWx0KSA9PiBmb3JtYXRfY2QobmFtZVswXSwgbmFtZS5zdWJzdHJpbmcoMSwgMykpXG4gIH0sXG4gIHBwOiB7XG4gICAgbmFtZTogJ1BvbGljZSBQcmVjaW5jdHMnLFxuICAgIHNxbDogYFNFTEVDVCAqIEZST00gYWxsX2JvdW5kcyBXSEVSRSBpZCA9ICdwcCdgLFxuICAgIHRleHRDb2xvcjogJyMxMmVkZWQnLFxuICAgIGxpbmVDb2xvcjogJyMxMmVkZWQnLFxuICAgIGljb246ICdzdGF0aWMvTllDQ29fam9ic19wb2xpY2VfMDEuanBnJyxcbiAgICBmb3JtYXRDb250ZW50OiAobmFtZSwgYWx0KSA9PiBmb3JtYXRfcHAobmFtZSlcbiAgfSxcbiAgZHNueToge1xuICAgIG5hbWU6ICdTYW5pdGF0aW9uIERpc3RyaWN0cycsXG4gICAgc3FsOiBgU0VMRUNUICogRlJPTSBhbGxfYm91bmRzIFdIRVJFIGlkID0gJ2RzbnknYCxcbiAgICB0ZXh0Q29sb3I6ICcjMTJlZGE0JyxcbiAgICBsaW5lQ29sb3I6ICcjMTJlZGE0JyxcbiAgICBpY29uOiAnc3RhdGljL05ZQ0NvX3Nhbml0YXRpb25fZ2FyYmFnZV8wMS5qcGcnLFxuICAgIGZvcm1hdENvbnRlbnQ6IChuYW1lLCBhbHQpID0+IGZvcm1hdF9kZWZhdWx0KG5hbWUpXG4gIH0sXG4gIGZiOiB7XG4gICAgbmFtZTogJ0ZpcmUgQmF0dGlsaW9uJyxcbiAgICBzcWw6IGBTRUxFQ1QgKiBGUk9NIGFsbF9ib3VuZHMgV0hFUkUgaWQgPSAnZmInYCxcbiAgICB0ZXh0Q29sb3I6ICcjMTJlZDEyJyxcbiAgICBsaW5lQ29sb3I6ICcjMTJlZDEyJyxcbiAgICBpY29uOiAnc3RhdGljL05ZQ0NvX2pvYnNfZmlyZWZpZ2h0ZXJfMDEuanBnJyxcbiAgICBmb3JtYXRDb250ZW50OiAobmFtZSwgYWx0KSA9PiBmb3JtYXRfZGVmYXVsdChuYW1lKVxuICB9LFxuICBzZDoge1xuICAgIG5hbWU6ICdTY2hvb2wgRGlzdHJpY3RzJyxcbiAgICBzcWw6IGBTRUxFQ1QgKiBGUk9NIGFsbF9ib3VuZHMgV0hFUkUgaWQgPSAnc2QnYCxcbiAgICB0ZXh0Q29sb3I6ICcjZWRlZDEyJyxcbiAgICBsaW5lQ29sb3I6ICcjZWRlZDEyJyxcbiAgICBpY29uOiAnc3RhdGljL05ZQ0NvX2Zvb2RfYXBwbGVfMDEuanBnJyxcbiAgICBmb3JtYXRDb250ZW50OiAobmFtZSwgYWx0KSA9PiBmb3JtYXRfZGVmYXVsdChuYW1lKVxuICB9LFxuICBoYzoge1xuICAgIG5hbWU6ICdIZWFsdGggQ2VudGVyIERpc3RyaWN0cycsXG4gICAgc3FsOiBgU0VMRUNUICogRlJPTSBhbGxfYm91bmRzIFdIRVJFIGlkID0gJ2hjJ2AsXG4gICAgdGV4dENvbG9yOiAnI2VkYmQxMicsXG4gICAgbGluZUNvbG9yOiAnI2VkYmQxMicsXG4gICAgaWNvbjogJ3N0YXRpYy9OWUNDb19qb2JzX2RvY3Rvcl8wMS5qcGcnLFxuICAgIGZvcm1hdENvbnRlbnQ6IChuYW1lLCBhbHQpID0+IGZvcm1hdF9kZWZhdWx0KG5hbWUpXG4gIH0sXG4gIGNjOiB7XG4gICAgbmFtZTogJ0NpdHkgQ291bmNpbCBEaXN0cmljdHMnLFxuICAgIHNxbDogYFNFTEVDVCAqIEZST00gYWxsX2JvdW5kcyBXSEVSRSBpZCA9ICdjYydgLFxuICAgIHRleHRDb2xvcjogJyNlZDdkMTInLFxuICAgIGxpbmVDb2xvcjogJyNlZDdkMTInLFxuICAgIGljb246ICdzdGF0aWMvTllDQ29fZ292ZXJubWVudF9jaXR5aGFsbF8wMS5qcGcnLFxuICAgIGZvcm1hdENvbnRlbnQ6IChuYW1lLCBhbHQpID0+XG4gICAgICBmb3JtYXRfZGVmYXVsdChuYW1lLCBgaHR0cHM6Ly9jb3VuY2lsLm55Yy5nb3YvZGlzdHJpY3QtJHtuYW1lfWApXG4gIH0sXG4gIG55Y29uZ3Jlc3M6IHtcbiAgICBuYW1lOiAnQ29uZ3Jlc3Npb25hbCBEaXN0cmljdHMnLFxuICAgIHNxbDogYFNFTEVDVCAqIEZST00gYWxsX2JvdW5kcyBXSEVSRSBpZCA9ICdueWNvbmdyZXNzJ2AsXG4gICAgdGV4dENvbG9yOiAnI2VkMTIxMicsXG4gICAgbGluZUNvbG9yOiAnI2VkMTIxMicsXG4gICAgaWNvbjogJ3N0YXRpYy9OWUNDb19kb21lc3RpY19hXzAxLmpwZycsXG4gICAgZm9ybWF0Q29udGVudDogKG5hbWUsIGFsdCkgPT5cbiAgICAgIGZvcm1hdF9kZWZhdWx0KFxuICAgICAgICBuYW1lLFxuICAgICAgICBgaHR0cHM6Ly93d3cuZ292dHJhY2sudXMvY29uZ3Jlc3MvbWVtYmVycy9OWS8ke25hbWV9YFxuICAgICAgKVxuICB9LFxuICBzYToge1xuICAgIG5hbWU6ICdTdGF0ZSBBc3NlbWJseSBEaXN0cmljdHMnLFxuICAgIHNxbDogYFNFTEVDVCAqIEZST00gYWxsX2JvdW5kcyBXSEVSRSBpZCA9ICdzYSdgLFxuICAgIHRleHRDb2xvcjogJyNlZDEyOTQnLFxuICAgIGxpbmVDb2xvcjogJyNlZDEyOTQnLFxuICAgIGljb246ICdzdGF0aWMvTllDQ29fZ292ZXJuZW1lbnRfbGF3XzAxLmpwZycsXG4gICAgZm9ybWF0Q29udGVudDogKG5hbWUsIGFsdCkgPT4gZm9ybWF0X2RlZmF1bHQobmFtZSlcbiAgfSxcbiAgc3M6IHtcbiAgICBuYW1lOiAnU3RhdGUgU2VuYXRlIERpc3RyaWN0cycsXG4gICAgc3FsOiBgU0VMRUNUICogRlJPTSBhbGxfYm91bmRzIFdIRVJFIGlkID0gJ3NzJ2AsXG4gICAgdGV4dENvbG9yOiAnIzk5MTJlZCcsXG4gICAgbGluZUNvbG9yOiAnIzk5MTJlZCcsXG4gICAgaWNvbjogJ3N0YXRpYy9OWUNDb19nb3Zlcm5tZW50X2p1c3RpY2VfMDEuanBnJyxcbiAgICBmb3JtYXRDb250ZW50OiAobmFtZSwgYWx0KSA9PlxuICAgICAgZm9ybWF0X2RlZmF1bHQobmFtZSwgYGh0dHBzOi8vd3d3Lm55c2VuYXRlLmdvdi9kaXN0cmljdC8ke25hbWV9YClcbiAgfSxcbiAgbnRhOiB7XG4gICAgbmFtZTogJ05laWdoYm9yaG9vZCBUYWJ1bGF0aW9uIEFyZWEnLFxuICAgIHNxbDogYFNFTEVDVCAqIEZST00gYWxsX2JvdW5kcyBXSEVSRSBpZCA9ICdudGEnYCxcbiAgICB0ZXh0Q29sb3I6ICcjMTIxMmVkJyxcbiAgICBsaW5lQ29sb3I6ICcjMTIxMmVkJyxcbiAgICBpY29uOiAnc3RhdGljL05ZQ0NvX2V4cGxvcmVfMDEuanBnJyxcbiAgICB0ZXh0U21hbGw6IHRydWUsXG4gICAgZm9ybWF0Q29udGVudDogKG5hbWUsIGFsdCkgPT4gZm9ybWF0X2RlZmF1bHQobmFtZSlcbiAgfSxcbiAgYmlkOiB7XG4gICAgbmFtZTogJ0J1c2luZXNzIEltcHJvdmVtZW50IERpc3RyaWN0JyxcbiAgICBzcWw6IGBTRUxFQ1QgKiBGUk9NIGFsbF9ib3VuZHMgV0hFUkUgaWQgPSAnYmlkJ2AsXG4gICAgdGV4dENvbG9yOiAnIzEyOWRlZCcsXG4gICAgbGluZUNvbG9yOiAnIzEyOWRlZCcsXG4gICAgaWNvbjogJ3N0YXRpYy9OWUNDb19qb2JzX2FfMDEuanBnJyxcbiAgICB0ZXh0U21hbGw6IHRydWUsXG4gICAgZm9ybWF0Q29udGVudDogKG5hbWUsIGFsdCkgPT4gZm9ybWF0X2RlZmF1bHQobmFtZSlcbiAgfSxcbiAgemlwY29kZToge1xuICAgIG5hbWU6ICdaaXBjb2RlcycsXG4gICAgc3FsOiBgU0VMRUNUICogRlJPTSBhbGxfYm91bmRzIFdIRVJFIGlkID0gJ3ppcGNvZGUnYCxcbiAgICB0ZXh0Q29sb3I6ICcjNjY2NjY2JyxcbiAgICBsaW5lQ29sb3I6ICcjNjY2NjY2JyxcbiAgICBpY29uOiAnc3RhdGljL05ZQ0NvX3ppcF8wMS5qcGcnLFxuICAgIHRleHRTbWFsbDogdHJ1ZSxcbiAgICBmb3JtYXRDb250ZW50OiAobmFtZSwgYWx0KSA9PiBmb3JtYXRfZGVmYXVsdChuYW1lKVxuICB9XG59XG5cbmZ1bmN0aW9uIHF1ZXJ5RnJvbUxhdExuZyhsYXRpdHVkZSwgbG9uZ2l0dWRlLCBsYWJlbCA9IG51bGwpIHtcbiAgLy9zZXQgbWFwIHZpZXcgdG8gdGhlIHJlc3VsdGluZyBsYXQsIGxvblxuICBtYXAuc2V0VmlldyhbbGF0aXR1ZGUsIGxvbmdpdHVkZV0pXG5cbiAgaWYgKGxhYmVsID09PSBudWxsKSB7XG4gICAgbGFiZWwgPSBgQ2xpY2tlZCBQb2ludDogJHtsYXRpdHVkZS50b0ZpeGVkKDUpfSwgJHtsb25naXR1ZGUudG9GaXhlZCg1KX1gXG4gIH1cblxuICBpZiAobWFya2VyKSBtYXJrZXIucmVtb3ZlKClcbiAgbWFya2VyID0gTC5tYXJrZXIoW2xhdGl0dWRlLCBsb25naXR1ZGVdKS5hZGRUbyhtYXApXG5cbiAgY29uc3QgaW50ZXJzZWN0c1VybCA9IGBodHRwczovL2JldGFueWMuY2FydG8uY29tL2FwaS92Mi9zcWwvP3E9U0VMRUNUICogRlJPTSBhbGxfYm91bmRzIFdIRVJFIFNUX0ludGVyc2VjdHMoU1RfU2V0U1JJRChTVF9NYWtlUG9pbnQoJHtsb25naXR1ZGV9LCAke2xhdGl0dWRlfSksIDQzMjYpLHRoZV9nZW9tKSAmYXBpX2tleT0ke2FwaV9rZXl9YFxuICBmZXRjaChpbnRlcnNlY3RzVXJsKVxuICAgIC50aGVuKHJlcyA9PiByZXMuanNvbigpKVxuICAgIC50aGVuKCh7IHJvd3MgfSkgPT4gZ2VuZXJhdGVJbmZvQm94RnJvbVF1ZXJ5KHJvd3MsIGxhYmVsKSlcbn1cblxuZnVuY3Rpb24gZ2VuZXJhdGVJbmZvQm94RnJvbVF1ZXJ5KHJvd3MsIGxhYmVsKSB7XG4gIC8vY3JlYXRlIGNvbnRlbnQgZm9yIGVhY2ggbGF5ZXJcbiAgY29uc3QgbGF5ZXJzQ29udGVudCA9IE9iamVjdC5lbnRyaWVzKGxheWVycylcbiAgICAubWFwKChbaWQsIHZhbHVlc10pID0+IHtcbiAgICAgIGxldCBjb250ZW50ID0gYDxpbWcgY2xhc3M9XCJjaXR5X2ljb25zXCIgc3JjPVwiJHt2YWx1ZXMuaWNvbn1cIi8+PGg1IGNsYXNzPSBcIlwiPiR7dmFsdWVzLm5hbWV9PC9oNT5gXG4gICAgICAvL2ZpbHRlciBhbmQgcmVtb3ZlIGR1cGxpY2F0ZXNcbiAgICAgIGNvbnN0IGxheWVyUm93cyA9IHJvd3NcbiAgICAgICAgLmZpbHRlcihyb3cgPT4gcm93LmlkID09PSBpZClcbiAgICAgICAgLnJlZHVjZSgodW5pcXVlLCBpdGVtKSA9PiB7XG4gICAgICAgICAgY29uc3QgdW5pcXVlTmFtZXMgPSB1bmlxdWUubWFwKHJvdyA9PiByb3cubmFtZWNvbClcbiAgICAgICAgICByZXR1cm4gdW5pcXVlTmFtZXMuaW5jbHVkZXMoaXRlbS5uYW1lY29sKSA/IHVuaXF1ZSA6IFsuLi51bmlxdWUsIGl0ZW1dXG4gICAgICAgIH0sIFtdKVxuICAgICAgLy9mb3IgZWFjaCByb3cgZ2VuZXJhdGUgc3BhblxuICAgICAgY29udGVudCArPSBsYXllclJvd3NcbiAgICAgICAgLm1hcChyb3cgPT4gdmFsdWVzLmZvcm1hdENvbnRlbnQocm93Lm5hbWVjb2wsIHJvdy5uYW1lYWx0KSlcbiAgICAgICAgLmpvaW4oJzxzcGFuIGNsYXNzPSBcImxpZ2h0ZXJcIj4sIDwvc3Bhbj4nKVxuICAgICAgcmV0dXJuIGA8ZGl2IGlkPVwiZHNfaW5mb1wiIGNsYXNzPVwiY2xlYXJmaXhcIj4ke2NvbnRlbnR9PC9kaXY+YFxuICAgIH0pXG4gICAgLmpvaW4oJycpXG5cbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2luZm9fYm94JykuaW5uZXJIVE1MID0gYFxuICAgIDxhIGhyZWY9XCIjXCIgb25jbGljaz1cInRvZ2dsZV92aXNpYmlsaXR5KCdpbmZvX2JveCcpO2lmKG1hcmtlcil7bWFya2VyLnJlbW92ZSgpfTtcIiBjbGFzcz1cImNsb3NlX2J1dHRvblwiPkNsb3NlIFdpbmRvdzwvYT5cbiAgICA8ZGl2IGlkPVwiaW5mb1wiPjxoMyBjbGFzcyA9IFwiYm9sZFwiPiR7bGFiZWx9IDwvaDM+PGRpdiBjbGFzcz1cInNlcGFyYXRvclwiPjwvZGl2PjwvZGl2PiR7bGF5ZXJzQ29udGVudH1cbiAgYFxuICBzaG93X2luZm9fYm94KClcbn1cblxuZnVuY3Rpb24gc2V0X2FkZHJlc3MoKSB7XG4gIC8vVXNlIHRoZSBQbGFubmluZ0xhYidzIE5ZQyBHZW9TZWFyY2hcbiAgZmV0Y2goXG4gICAgYGh0dHBzOi8vZ2Vvc2VhcmNoLnBsYW5uaW5nbGFicy5ueWMvdjEvc2VhcmNoP3RleHQ9JHthZGRyZXNzU2VhcmNoLnZhbHVlfWBcbiAgKVxuICAgIC50aGVuKHJlc3BvbnNlID0+IHtcbiAgICAgIHJldHVybiByZXNwb25zZS5qc29uKClcbiAgICB9KVxuICAgIC50aGVuKCh7IGZlYXR1cmVzIH0pID0+IHtcbiAgICAgIGlmIChmZWF0dXJlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGNvbnN0IGxhYmVsID0gZmVhdHVyZXNbMF0ucHJvcGVydGllcy5sYWJlbC5yZXBsYWNlKFxuICAgICAgICAgICcsIE5ldyBZb3JrLCBOWSwgVVNBJyxcbiAgICAgICAgICAnJ1xuICAgICAgICApXG4gICAgICAgIGNvbnN0IFtsb25naXR1ZGUsIGxhdGl0dWRlXSA9IGZlYXR1cmVzWzBdLmdlb21ldHJ5LmNvb3JkaW5hdGVzXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdub19yZXN1bHRzJykuc3R5bGUuZGlzcGxheSA9ICdub25lJ1xuICAgICAgICBxdWVyeUZyb21MYXRMbmcobGF0aXR1ZGUsIGxvbmdpdHVkZSwgbGFiZWwpXG4gICAgICAgIC8vY2xlYXIgc3VnZ2VzdGlvbnNcbiAgICAgICAgd2hpbGUgKHN1Z2dlc3Rpb25zLmZpcnN0Q2hpbGQpIHtcbiAgICAgICAgICBzdWdnZXN0aW9ucy5yZW1vdmVDaGlsZChzdWdnZXN0aW9ucy5maXJzdENoaWxkKVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbm9fcmVzdWx0cycpLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snXG4gICAgICB9XG4gICAgfSlcbiAgICAuY2F0Y2goZXJyb3IgPT4ge1xuICAgICAgY29uc29sZS5sb2coZXJyb3IpXG4gICAgICAvL2lmIG5vdGhpbmcgZ2V0cyByZXR1cm5lZCwgZGlzcGxheSBubyByZXN1bHRzXG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbm9fcmVzdWx0cycpLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snXG4gICAgfSlcbn1cblxuZnVuY3Rpb24gc2VhcmNoX2FkZHJlc3MoKSB7XG4gIGNvbnN0IGFkciA9IGFkZHJlc3NTZWFyY2gudmFsdWVcblxuICBjb25zdCB1cmwgPSBgaHR0cHM6Ly9nZW9zZWFyY2gucGxhbm5pbmdsYWJzLm55Yy92MS9zZWFyY2g/dGV4dD0ke2Fkcn1gXG4gIGZldGNoKHVybClcbiAgICAudGhlbihyZXMgPT4gcmVzLmpzb24oKSlcbiAgICAudGhlbigoeyBmZWF0dXJlcyB9KSA9PiB7XG4gICAgICAvL3RvZG8gLSBjbGVhbiB1cCBldmVudCBsaXN0ZW5lcnNcblxuICAgICAgLy9jbGVhciBzdWdnZXN0aW9uc1xuICAgICAgd2hpbGUgKHN1Z2dlc3Rpb25zLmZpcnN0Q2hpbGQpIHtcbiAgICAgICAgc3VnZ2VzdGlvbnMucmVtb3ZlQ2hpbGQoc3VnZ2VzdGlvbnMuZmlyc3RDaGlsZClcbiAgICAgIH1cblxuICAgICAgLy9jcmVhdGUgc3VnZ2VzdGlvbiBsaXN0IGl0ZW1zXG4gICAgICBmZWF0dXJlcy5mb3JFYWNoKGZlYXR1cmUgPT4ge1xuICAgICAgICBjb25zdCBsYWJlbCA9IGZlYXR1cmUucHJvcGVydGllcy5sYWJlbC5yZXBsYWNlKFxuICAgICAgICAgICcsIE5ldyBZb3JrLCBOWSwgVVNBJyxcbiAgICAgICAgICAnJ1xuICAgICAgICApXG4gICAgICAgIGNvbnN0IFtsb25naXR1ZGUsIGxhdGl0dWRlXSA9IGZlYXR1cmUuZ2VvbWV0cnkuY29vcmRpbmF0ZXNcbiAgICAgICAgY29uc3QgbGkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpXG4gICAgICAgIGNvbnN0IGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJylcbiAgICAgICAgYS50ZXh0Q29udGVudCA9IGxhYmVsXG4gICAgICAgIGEuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgICAgYWRkcmVzc1NlYXJjaC52YWx1ZSA9IGxhYmVsXG5cbiAgICAgICAgICAvL2NsZWFyIHN1Z2dlc3Rpb25zXG4gICAgICAgICAgd2hpbGUgKHN1Z2dlc3Rpb25zLmZpcnN0Q2hpbGQpIHtcbiAgICAgICAgICAgIHN1Z2dlc3Rpb25zLnJlbW92ZUNoaWxkKHN1Z2dlc3Rpb25zLmZpcnN0Q2hpbGQpXG4gICAgICAgICAgfVxuICAgICAgICAgIHF1ZXJ5RnJvbUxhdExuZyhsYXRpdHVkZSwgbG9uZ2l0dWRlLCBsYWJlbClcbiAgICAgICAgfSlcbiAgICAgICAgbGkuYXBwZW5kQ2hpbGQoYSlcbiAgICAgICAgc3VnZ2VzdGlvbnMuYXBwZW5kQ2hpbGQobGkpXG4gICAgICB9KVxuICAgIH0pXG59XG5cbi8vVG9nZ2xlIExheWVycyBhbmQgVmlzaWJpbGl0eVxuZnVuY3Rpb24gdG9nZ2xlX2xheWVyKGlkKSB7XG4gIGlmIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCkuY2hlY2tlZCkge1xuICAgIGxheWVyc1tpZF0ubGF5ZXIuc2hvdygpXG4gIH0gZWxzZSB7XG4gICAgbGF5ZXJzW2lkXS5sYXllci5oaWRlKClcbiAgfVxufVxuXG4vL1R1cm4gb24gdGhlIHNlbGVjdGVkIGxheWVyIGFuZCB0dXJuIG9mZiBhbGwgb3RoZXIgbGF5ZXJzXG5mdW5jdGlvbiBoaWRlX2FsbF91bnNlbGVjdGVkX2Rpc3RyaWN0cyhpZCkge1xuICB2YXIgZGlzdHJpY3RzID0gT2JqZWN0LmtleXMobGF5ZXJzKVxuICBpZiAoIWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKS5jaGVja2VkKSB7XG4gICAgdmFyIGVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZClcbiAgICBlbGVtZW50LmNoZWNrZWQgPSB0cnVlXG4gICAgdmFyIGV2ZW50ID0gbmV3IEV2ZW50KCdjaGFuZ2UnKVxuICAgIGVsZW1lbnQuZGlzcGF0Y2hFdmVudChldmVudClcbiAgfVxuICBmb3IgKGxldCBpID0gMDsgaSA8IGRpc3RyaWN0cy5sZW5ndGg7IGkrKykge1xuICAgIGlmIChkaXN0cmljdHNbaV0gPT0gaWQpIHtcbiAgICAgIGNvbnRpbnVlXG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChkaXN0cmljdHNbaV0pLmNoZWNrZWQpIHtcbiAgICAgICAgdmFyIGVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChkaXN0cmljdHNbaV0pXG4gICAgICAgIGVsZW1lbnQuY2hlY2tlZCA9IGZhbHNlXG4gICAgICAgIHZhciBldmVudCA9IG5ldyBFdmVudCgnY2hhbmdlJylcbiAgICAgICAgZWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG4vL0Rpc3BsYXlzXG5mdW5jdGlvbiB0b2dnbGVfdmlzaWJpbGl0eShpZCkge1xuICAvL3RvZ2dsZSB0aGUgdmlzaWJpbGl0eSBvZiBhIHNlbGVjdGVkIGVsZW1lbnRcbiAgdmFyIGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZClcbiAgaWYgKGUuc3R5bGUuZGlzcGxheSA9PSAnYmxvY2snKSBlLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSdcbiAgZWxzZSBlLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snXG59XG5cbmZ1bmN0aW9uIHNob3dfaW5mb19ib3goKSB7XG4gIGlmICgoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2luZm9fYm94Jykuc3R5bGUuZGlzcGxheSA9ICdub25lJykpXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2luZm9fYm94Jykuc3R5bGUuZGlzcGxheSA9ICdibG9jaydcbn1cblxuZnVuY3Rpb24gcXVlcnlfZGlzdHJpY3QobGF5ZXJfaWQpIHtcbiAgY29uc3QgcXVlcnlEaXN0cmljdHMgPSBgaHR0cHM6Ly9iZXRhbnljLmNhcnRvLmNvbS9hcGkvdjIvc3FsLz9xPVNFTEVDVCBuYW1lY29sIEZST00gYWxsX2JvdW5kcyBXSEVSRSBpZCA9ICcke2xheWVyX2lkfScgJmFwaV9rZXk9JHthcGlfa2V5fWBcblxuICBoaWRlX2FsbF91bnNlbGVjdGVkX2Rpc3RyaWN0cyhsYXllcl9pZClcblxuICBmZXRjaChxdWVyeURpc3RyaWN0cylcbiAgICAudGhlbihyZXMgPT4gcmVzLmpzb24oKSlcbiAgICAudGhlbigoeyByb3dzIH0pID0+IHtcbiAgICAgIC8vZ2V0IGFsbCByb3dzLCBmaWx0ZXIgZm9yIHVuaXF1ZSBpdGVtcywgc29ydCBudW1lcmljLCB0aGVuIGdlbmVyYXRlIG9wdGlvbnMgZm9yIHNlbGVjdGVkX2Rpc3RyaWN0XG4gICAgICBjb25zdCBvcHRpb25zID0gcm93c1xuICAgICAgICAubWFwKHJvdyA9PiByb3cubmFtZWNvbClcbiAgICAgICAgLnJlZHVjZShcbiAgICAgICAgICAodW5pcXVlLCBpdGVtKSA9PlxuICAgICAgICAgICAgdW5pcXVlLmluY2x1ZGVzKGl0ZW0pID8gdW5pcXVlIDogWy4uLnVuaXF1ZSwgaXRlbV0sXG4gICAgICAgICAgW11cbiAgICAgICAgKVxuICAgICAgICAuc29ydCgoYSwgYikgPT5cbiAgICAgICAgICBhLmxvY2FsZUNvbXBhcmUoYiwgJ2VuLVVTJywge1xuICAgICAgICAgICAgbnVtZXJpYzogJ3RydWUnXG4gICAgICAgICAgfSlcbiAgICAgICAgKVxuICAgICAgICAubWFwKG5hbWUgPT4gYDxvcHRpb24gdmFsdWU9XCIke25hbWV9XCI+JHtuYW1lfTwvb3B0aW9uPmApXG4gICAgICAgIC5qb2luKCcnKVxuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NlbGVjdGVkX2Rpc3RyaWN0JykuaW5uZXJIVE1MID0gYFxuXHRcdFx0PHNlbGVjdCBpZD1cImRpc3RyaWN0XCI+JHtvcHRpb25zfTwvc2VsZWN0PlxuXHRcdFx0XHQ8ZGl2IGNsYXNzPVwic2VsZWN0X2Fycm93XCI+PC9kaXY+XG5cdFx0XHQ8aW5wdXQgdHlwZT1cInN1Ym1pdFwiIHZhbHVlPVwiU2VsZWN0XCIgb25jbGljaz1cImxpc3Rfb3ZlcmxhcHMoJyR7bGF5ZXJfaWR9JylcIj5cblx0XHRgXG4gICAgfSlcbiAgICAuY2F0Y2goZXJyID0+IGNvbnNvbGUubG9nKGVycikpXG59XG5cbmZ1bmN0aW9uIGxpc3Rfb3ZlcmxhcHMobGF5ZXJfaWQpIHtcbiAgaWYgKG1hcmtlcikgbWFya2VyLnJlbW92ZSgpXG4gIGNvbnN0IHNlbGVjdF9kaXN0cmljdF9pZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkaXN0cmljdCcpXG4gIGNvbnN0IGRpc3RyaWN0X2lkID1cbiAgICBzZWxlY3RfZGlzdHJpY3RfaWQub3B0aW9uc1tzZWxlY3RfZGlzdHJpY3RfaWQuc2VsZWN0ZWRJbmRleF0udmFsdWVcbiAgY29uc3QgcXVlcnkgPSBgXG4gICAgICAgICAgICAgICAgV0lUSCAgYWwgYXMgKFNFTEVDVCBTVF9NYWtlVmFsaWQodGhlX2dlb20pIGFzIHRoZV9nZW9tLCBpZCwgbmFtZWNvbCwgbmFtZWFsdCBGUk9NIGFsbF9ib3VuZHMpLFxuICAgICAgICAgICAgICAgICAgICAgIHNlIGFzIChTRUxFQ1QgdGhlX2dlb20gRlJPTSBhbCBXSEVSRSBpZCA9ICcke2xheWVyX2lkfScgQU5EIG5hbWVjb2wgPSAnJHtkaXN0cmljdF9pZH0nKSxcbiAgICAgICAgICAgICAgICAgICAgICBpbnRlciBhcyBcbiAgICAgICAgICAgICAgICAgICAgICAgIChTRUxFQ1QgRElTVElOQ1QgYWwuaWQsIGFsLm5hbWVjb2wsIGFsLm5hbWVhbHQsIFxuICAgICAgICAgICAgICAgICAgICAgICAgICBTVF9BcmVhKHNlLnRoZV9nZW9tKSBhcyBhcmVhLCBTVF9BcmVhKFNUX0ludGVyc2VjdGlvbihhbC50aGVfZ2VvbSwgc2UudGhlX2dlb20pKSBhcyBzZWFyZWFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgRlJPTSBhbCwgc2UgXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFdIRVJFIFNUX0ludGVyc2VjdHMoYWwudGhlX2dlb20sIHNlLnRoZV9nZW9tKSlcbiAgICAgICAgICAgICAgICBTRUxFQ1QgKiBGUk9NIGludGVyIFdIRVJFIHNlYXJlYSAvIGFyZWEgPiAuMDA1XG4gICAgICAgICAgICAgICAgYFxuICBjb25zdCBpbnRlcnNlY3RzVXJsID0gYGh0dHBzOi8vYmV0YW55Yy5jYXJ0by5jb20vYXBpL3YyL3NxbC8/cT0ke3F1ZXJ5fSZhcGlfa2V5PSR7YXBpX2tleX1gXG5cbiAgZmV0Y2goaW50ZXJzZWN0c1VybClcbiAgICAudGhlbihyZXMgPT4gcmVzLmpzb24oKSlcbiAgICAudGhlbigoeyByb3dzIH0pID0+IHtcbiAgICAgIC8vY3JlYXRlIGNvbnRlbnQgZm9yIGVhY2ggYm91bmRcbiAgICAgIGNvbnN0IGJvdW5kc0NvbnRlbnQgPSBPYmplY3QuZW50cmllcyhsYXllcnMpXG4gICAgICAgIC5tYXAoKFtpZCwgdmFsdWVzXSkgPT4ge1xuICAgICAgICAgIGxldCBjb250ZW50ID0gYDxpbWcgY2xhc3M9XCJjaXR5X2ljb25zXCIgc3JjPVwiJHt2YWx1ZXMuaWNvbn1cIi8+PGg1IGNsYXNzPSBcIlwiPiR7dmFsdWVzLm5hbWV9PC9oNT5gXG4gICAgICAgICAgY29uc3QgYm91bmRSb3dzID0gcm93c1xuICAgICAgICAgICAgLmZpbHRlcihyb3cgPT4gcm93LmlkID09PSBpZClcbiAgICAgICAgICAgIC5yZWR1Y2UoKHVuaXF1ZSwgaXRlbSkgPT4ge1xuICAgICAgICAgICAgICAvL1xuICAgICAgICAgICAgICBjb25zdCB1bmlxdWVOYW1lcyA9IHVuaXF1ZS5tYXAocm93ID0+IHJvdy5uYW1lY29sKVxuICAgICAgICAgICAgICByZXR1cm4gdW5pcXVlTmFtZXMuaW5jbHVkZXMoaXRlbS5uYW1lY29sKVxuICAgICAgICAgICAgICAgID8gdW5pcXVlXG4gICAgICAgICAgICAgICAgOiBbLi4udW5pcXVlLCBpdGVtXVxuICAgICAgICAgICAgfSwgW10pXG4gICAgICAgICAgICAuZmlsdGVyKHJvdyA9PiAhcm93Lm5hbWVjb2wuaW5jbHVkZXMoJ3BhcmstY2VtZXRlcnktZXRjJykpXG4gICAgICAgICAgZnVuY3Rpb24gYWRkV2FybmluZyhjb250ZW50LCBwZXJjZW50KXtcbiAgICAgICAgICAgIGlmKHBlcmNlbnQgPCAwLjA1KXtcbiAgICAgICAgICAgICAgICByZXR1cm4gYDxhYmJyIHRpdGxlPVwiT3ZlcmxhcHMgb25seSAkeyhwZXJjZW50ICogMTAwKS50b0ZpeGVkKDEpfSUgb2YgdGhlIGRpc3RyaWN0XCI+JHtjb250ZW50fSo8L2FiYnI+YFxuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgIHJldHVybiBjb250ZW50XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG5cbiAgICAgICAgICBjb250ZW50ICs9IGJvdW5kUm93c1xuICAgICAgICAgICAgLm1hcChyb3cgPT4gYWRkV2FybmluZyh2YWx1ZXMuZm9ybWF0Q29udGVudChyb3cubmFtZWNvbCwgcm93Lm5hbWVhbHQpLCArcm93LnNlYXJlYSAvICtyb3cuYXJlYSkpXG4gICAgICAgICAgICAuam9pbignPHNwYW4gY2xhc3M9IFwibGlnaHRlclwiPiwgPC9zcGFuPicpXG4gICAgICAgICAgcmV0dXJuIGA8ZGl2IGlkPVwiZHNfaW5mb1wiIGNsYXNzPVwiY2xlYXJmaXhcIj4ke2NvbnRlbnR9PC9kaXY+YFxuICAgICAgICB9KVxuICAgICAgICAuam9pbignJylcblxuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2luZm9fYm94JykuaW5uZXJIVE1MID0gYFxuICAgICAgICA8YSBocmVmPVwiI1wiIG9uY2xpY2s9XCJ0b2dnbGVfdmlzaWJpbGl0eSgnaW5mb19ib3gnKTtpZihtYXJrZXIpe21hcmtlci5yZW1vdmUoKX07XCIgY2xhc3M9XCJjbG9zZV9idXR0b25cIj5DbG9zZSBXaW5kb3c8L2E+XG4gICAgICAgIDxkaXYgaWQ9XCJpbmZvXCI+PGgzIGNsYXNzID0gXCJib2xkXCI+JHtsYXllcnNbbGF5ZXJfaWRdLm5hbWV9IC0gJHtkaXN0cmljdF9pZH0gPC9oMz5cbiAgICAgICAgPHNwYW4gY2xhc3M9J2xpZ2h0ZXInPipMZXNzIHRoYW4gNSUgb3ZlcmxhcC48L3NwYW4+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJzZXBhcmF0b3JcIj48L2Rpdj48L2Rpdj4ke2JvdW5kc0NvbnRlbnR9YFxuICAgICAgc2hvd19pbmZvX2JveCgpXG4gICAgfSlcbn1cblxuZnVuY3Rpb24gcmVzZXRfbWFwKCkge1xuICBtYXAuc2V0VmlldyhbNDAuNzA0NTgsIC03My45MjU2XSwgMTEpXG4gIGlmIChtYXJrZXIpIG1hcmtlci5yZW1vdmUoKVxufVxuXG5mdW5jdGlvbiBpbml0KCkge1xuICBpZiAoIWFwaV9rZXkgfHwgYXBpX2tleSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBjb25zb2xlLmxvZygnV0FSTklORzogTk8gQVBJIEtFWSwgcGxlYXNlIGluY2x1ZGUgb25lIGluIHRoZSAuZW52IGZpbGUnKVxuICB9XG5cbiAgLy9zZXQgbWFwIHZpZXdcbiAgbWFwID0gTC5tYXAoJ21hcCcpLnNldFZpZXcoWzQwLjcwNDU4LCAtNzMuOTI1Nl0sIDExKVxuICAvLyBtYXAuc2Nyb2xsV2hlZWxab29tLmRpc2FibGUoKTtcbiAgbWFwLmRvdWJsZUNsaWNrWm9vbS5kaXNhYmxlKClcblxuICAvL3NldCBiYXNlbWFwXG4gIEwudGlsZUxheWVyKFxuICAgICdodHRwczovL2FwaS5tYXBib3guY29tL3N0eWxlcy92MS96aGlrL2NrZTMzNmw2dzFnNG4xZHF2MXRsdjFwdzMvdGlsZXMvMjU2L3t6fS97eH0ve3l9QDJ4P2FjY2Vzc190b2tlbj1way5leUoxSWpvaWVtaHBheUlzSW1FaU9pSmphVzFwYkdGcGRIUXdNR05pZG5Cclp6VTVNakY1TVRKaUluMC5OLUVVUmV4MnF2ZkVpQnNtLVc5ajd3JyxcbiAgICB7XG4gICAgICBtYXhab29tOiAxOFxuICAgIH1cbiAgKS5hZGRUbyhtYXApXG5cbiAgLy9jb25uZWN0IHRvIENhcnRvXG4gIGNvbnN0IGNsaWVudCA9IG5ldyBjYXJ0by5DbGllbnQoe1xuICAgIGFwaUtleTogYXBpX2tleSxcbiAgICB1c2VybmFtZTogJ2JldGFueWMnXG4gIH0pXG5cbiAgT2JqZWN0LmVudHJpZXMobGF5ZXJzKS5mb3JFYWNoKChbaWQsIHZhbHVlc10sIGl0ZW1fbnVtYmVyKSA9PiB7XG4gICAgdmFsdWVzLnNvdXJjZSA9IG5ldyBjYXJ0by5zb3VyY2UuU1FMKHZhbHVlcy5zcWwpXG4gICAgLy8gT3V0bGluZSB0aGUgZ2VvbWV0cmllcyBmb3IgZWFjaCBkYXRhc2V0LlxuICAgIC8vIENvbG9ycyBiYXNlZCBvbiBEQ1AgUGxhbm5pbmcgTGFicyBzdGFuZGFyZCBjb2xvcnNcbiAgICAvLyBodHRwczovL21lZGl1bS5jb20vbnljcGxhbm5pbmdsYWJzL2V4cGVyaW1lbnRpbmctd2l0aC1wbGFubmluZy1jb2xvci1zdGFuZGFyZHMtMTViNTkxZDJhOTBjXG5cbiAgICBjb25zdCB0ZXh0U2NhbGUgPSB2YWx1ZXMudGV4dFNtYWxsXG4gICAgICA/IGBcbiAgICAgICNsYXllclt6b29tID4gMTJde1xuICAgICAgICB0ZXh0LXNpemU6IDExO1xuICAgICAgfVxuICAgICAgI2xheWVyW3pvb20gPD0gMTJde1xuICAgICAgICB0ZXh0LXNpemU6IDg7XG4gICAgICB9YFxuICAgICAgOiBgI2xheWVyW3pvb20gPiAxMV17XG4gICAgICAgIHRleHQtc2l6ZTogMTY7XG4gICAgICAgIHRleHQtY2hhcmFjdGVyLXNwYWNpbmc6IDI7XG4gICAgICB9XG4gICAgICAjbGF5ZXJbem9vbSA8PSAxMV17XG4gICAgICAgIHRleHQtc2l6ZTogMTA7XG4gICAgICAgIHRleHQtY2hhcmFjdGVyLXNwYWNpbmc6IDE7XG4gICAgICB9YFxuXG4gICAgdmFsdWVzLnN0eWxlID0gbmV3IGNhcnRvLnN0eWxlLkNhcnRvQ1NTKGBcblx0XHRcdCNsYXllciB7XG4gICAgICBwb2x5Z29uLWZpbGw6ICNmZmY7XG5cdFx0XHRwb2x5Z29uLW9wYWNpdHk6IDA7XG4gICAgICB0ZXh0LW5hbWU6IFtuYW1lY29sXTtcbiAgICAgIHRleHQtZmFjZS1uYW1lOiAnTGF0byBCb2xkIEl0YWxpYyc7XG4gICAgICB0ZXh0LWZpbGw6ICNmZmY7XG4gICAgICB0ZXh0LWhhbG8tcmFkaXVzOiAyLjU7XG4gICAgICB0ZXh0LWhhbG8tZmlsbDogZGFya2VuKCR7dmFsdWVzLnRleHRDb2xvcn0sMjApO1xuICAgICAgdGV4dC1hbGxvdy1vdmVybGFwOiBmYWxzZTtcbiAgICAgIHRleHQtcGxhY2VtZW50czogXCJOLEUsUyxXXCI7XG4gICAgICB0ZXh0LWR5OiAtMTtcbiAgICAgIHRleHQtZHg6IC0xO1xuICAgICAgdGV4dC1wbGFjZW1lbnQtdHlwZTogc2ltcGxlO1xuICAgICAgdGV4dC1sYWJlbC1wb3NpdGlvbi10b2xlcmFuY2U6IDIwO1xuXHRcdFx0fVxuXHRcdFx0I2xheWVyOjpvdXRsaW5lIHtcbiAgICAgIGxpbmUtd2lkdGg6IDI7XG5cdFx0XHRsaW5lLWNvbG9yOiAke3ZhbHVlcy5saW5lQ29sb3J9O1xuICAgICAgbGluZS1vcGFjaXR5OiAxO1xuICAgICAgbGluZS1yYXN0ZXJpemVyOiBmdWxsO1xuICAgICAgbGluZS1jb21wLW9wOiBkc3Qtb3ZlcjtcbiAgICAgIGxpbmUtZGFzaGFycmF5OiAyMCwgMTA7XG4gICAgICBsaW5lLWRhc2gtb2Zmc2V0OiAke2l0ZW1fbnVtYmVyICogM307XG5cdFx0XHR9XG5cdFx0XHQjbGF5ZXI6Om91dGxpbmUgW3pvb20gPD0gMTJde1xuXHRcdFx0XHRtYXJrZXItd2lkdGg6IDE7XG4gICAgICB9XG4gICAgICAke3RleHRTY2FsZX1cblx0XHRgKVxuXG4gICAgY29uc3QgZXh0cmFDb2x1bW5zID0gJ2V4dHJhQ29sdW1ucycgaW4gdmFsdWVzID8gdmFsdWVzLmV4dHJhQ29sdW1ucyA6IFtdXG4gICAgY29uc3QgZmVhdHVyZUNsaWNrQ29sdW1ucyA9IFt2YWx1ZXMudGV4dE5hbWUsIC4uLmV4dHJhQ29sdW1uc11cblxuICAgIHZhbHVlcy5sYXllciA9IG5ldyBjYXJ0by5sYXllci5MYXllcihcbiAgICAgIHZhbHVlcy5zb3VyY2UsXG4gICAgICB2YWx1ZXMuc3R5bGUsXG4gICAgICBmZWF0dXJlQ2xpY2tDb2x1bW5zXG4gICAgKVxuXG4gICAgLy9hZGQgbGF5ZXIgdG8gbWFwXG4gICAgY2xpZW50LmFkZExheWVyKHZhbHVlcy5sYXllcilcblxuICAgIC8vc2V0dXAgc3dpdGNoIGZ1bmN0aW9uc1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzd2l0Y2hlcycpLmlubmVySFRNTCArPSBgXG5cdFx0XHQ8bGk+XG5cdFx0XHRcdDxsYWJlbCBjbGFzcz1cInN3aXRjaFwiPlxuXHRcdFx0XHRcdDxpbnB1dCBpZD1cIiR7aWR9XCIgdHlwZT1cImNoZWNrYm94XCIgbmFtZT1cInN0eWxlXCIgb25jaGFuZ2U9XCJ0b2dnbGVfbGF5ZXIoJyR7aWR9JylcIiAke1xuICAgICAgaWQgPT09ICdjZCcgPyAnY2hlY2tlZCcgOiAnJ1xuICAgIH0+XG5cdFx0XHRcdFx0PHNwYW4gY2xhc3M9XCJzbGlkZXJcIj48L3NwYW4+XG5cdFx0XHRcdDwvbGFiZWw+XG5cdFx0XHRcdDxoNT4ke3ZhbHVlcy5uYW1lfTwvaDU+IDxociBjbGFzcz1cImNvbG9yZWRfbGluZVwiIHN0eWxlPVwiYm9yZGVyLXRvcC1jb2xvcjoke1xuICAgICAgdmFsdWVzLmxpbmVDb2xvclxuICAgIH1cIj5cblx0XHRcdDwvbGk+XG5cdFx0YFxuICAgIC8vaGlkZSBhbGwgbGF5ZXJzIGJ1dCBjZFxuICAgIGlmIChpZCAhPT0gJ2NkJykgdmFsdWVzLmxheWVyLmhpZGUoKVxuICB9KVxuXG4gIGNsaWVudC5nZXRMZWFmbGV0TGF5ZXIoKS5hZGRUbyhtYXApXG5cbiAgTC5wb3B1cCh7XG4gICAgY2xvc2VCdXR0b246IGZhbHNlXG4gIH0pXG5cbiAgLy9pbml0IFF1ZXJ5IE92ZXJsYXBwaW5nIERpc3RyaWN0cyBzZWxlY3RvcnNcbiAgY29uc3Qgb3ZlcmxhcFNlbGVjdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhZG1pbl9kaXN0cmljdCcpXG4gIE9iamVjdC5lbnRyaWVzKGxheWVycykuZm9yRWFjaCgoW2lkLCB2YWx1ZXNdKSA9PiB7XG4gICAgY29uc3Qgb3B0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJylcbiAgICBvcHRpb24udGV4dENvbnRlbnQgPSB2YWx1ZXMubmFtZVxuICAgIG9wdGlvbi52YWx1ZSA9IGlkXG4gICAgb3ZlcmxhcFNlbGVjdC5hcHBlbmRDaGlsZChvcHRpb24pXG4gIH0pXG4gIG92ZXJsYXBTZWxlY3QuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgZSA9PiBxdWVyeV9kaXN0cmljdChlLnRhcmdldC52YWx1ZSkpXG5cbiAgLy9tYXAgY2xpY2sgc2VhcmNoXG4gIGNvbnN0IG1hcENsaWNrZWRJbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYXBfY2xpY2tlZCcpXG4gIGxldCBpc01hcENsaWNrZWRFbmFibGVkID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJtYXAtY2xpY2tlZFwiKSAmJiBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcIm1hcC1jbGlja2VkXCIpID09PSAnZmFsc2UnID8gZmFsc2UgOiB0cnVlXG4gIGxldCBtYXBDbGlja0V2ZW50ID0gdG9nZ2xlTWFwQ2xpY2tlZChudWxsLCBpc01hcENsaWNrZWRFbmFibGVkKVxuXG4gIG1hcENsaWNrZWRJbnB1dC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpPT57XG4gICAgaXNNYXBDbGlja2VkRW5hYmxlZCA9ICFpc01hcENsaWNrZWRFbmFibGVkXG4gICAgbWFwQ2xpY2tFdmVudCA9IHRvZ2dsZU1hcENsaWNrZWQobWFwQ2xpY2tFdmVudCwgaXNNYXBDbGlja2VkRW5hYmxlZClcbiAgfSlcblxuICBmdW5jdGlvbiB0b2dnbGVNYXBDbGlja2VkKG1hcENsaWNrRXZlbnQsIGVuYWJsZWQpe1xuICAgIGlmKGVuYWJsZWQpe1xuICAgICAgLy9zZXQgaW5wdXQgdG8gY2hlY2tlZCBhbmQgZW5hYmxlIGV2ZW50XG4gICAgICBtYXBDbGlja2VkSW5wdXQuY2hlY2tlZCA9IHRydWVcbiAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdtYXAtY2xpY2tlZCcsJ3RydWUnKVxuICAgICAgXG4gICAgICBjb25zdCBldmVudCA9IGUgPT4ge1xuICAgICAgICBjb25zdCB7IGxhdCwgbG5nIH0gPSBlLmxhdGxuZ1xuICAgICAgICBxdWVyeUZyb21MYXRMbmcobGF0LCBsbmcpXG4gICAgICB9XG4gICAgXG4gICAgICBtYXAub24oJ2NsaWNrJywgZXZlbnQpXG5cbiAgICAgIHJldHVybiBldmVudFxuICAgIH1lbHNle1xuXG4gICAgICBtYXBDbGlja2VkSW5wdXQuY2hlY2tlZCA9IGZhbHNlXG4gICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnbWFwLWNsaWNrZWQnLCdmYWxzZScpXG4gICAgICBpZihtYXBDbGlja0V2ZW50KSBtYXAub2ZmKCdjbGljaycsIG1hcENsaWNrRXZlbnQpXG5cbiAgICAgIHJldHVybiBudWxsXG4gICAgfVxuICB9ICBcblxuICAvL3Byb21wdCB1c2VyIGZvciBsb2NhdGlvblxuICBpZiAobmF2aWdhdG9yLmdlb2xvY2F0aW9uKSB7XG4gICAgbmF2aWdhdG9yLmdlb2xvY2F0aW9uLmdldEN1cnJlbnRQb3NpdGlvbihwb3NpdGlvbiA9PiB7XG4gICAgICBjb25zdCB7IGxhdGl0dWRlLCBsb25naXR1ZGUgfSA9IHBvc2l0aW9uLmNvb3Jkc1xuICAgICAgcXVlcnlGcm9tTGF0TG5nKGxhdGl0dWRlLCBsb25naXR1ZGUpXG4gICAgfSlcbiAgfVxufVxuXG5leHBvcnQge1xuICBzZXRfYWRkcmVzcyxcbiAgc2VhcmNoX2FkZHJlc3MsXG4gIHRvZ2dsZV9sYXllcixcbiAgdG9nZ2xlX3Zpc2liaWxpdHksXG4gIHNob3dfaW5mb19ib3gsXG4gIGxpc3Rfb3ZlcmxhcHMsXG4gIHJlc2V0X21hcCxcbiAgaW5pdCxcbiAgbWFwLFxuICBtYXJrZXIsXG4gIGxheWVyc1xufVxuIl0sIm5hbWVzIjpbImZvcm1hdF9jZCIsImJvcm8iLCJjZCIsInRleHQiLCJmb3JtYXRfcHAiLCJwcmVjaW5jdCIsImZvcm1hdF9kZWZhdWx0IiwibmFtZSIsInVybCIsImFkZHJlc3NTZWFyY2giLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwic3VnZ2VzdGlvbnMiLCJhcGlfa2V5IiwibGF5ZXJzIiwic3FsIiwidGV4dENvbG9yIiwibGluZUNvbG9yIiwiaWNvbiIsImZvcm1hdENvbnRlbnQiLCJhbHQiLCJzdWJzdHJpbmciLCJwcCIsImRzbnkiLCJmYiIsInNkIiwiaGMiLCJjYyIsIm55Y29uZ3Jlc3MiLCJzYSIsInNzIiwibnRhIiwidGV4dFNtYWxsIiwiYmlkIiwiemlwY29kZSIsInF1ZXJ5RnJvbUxhdExuZyIsImxhdGl0dWRlIiwibG9uZ2l0dWRlIiwibGFiZWwiLCJtYXAiLCJzZXRWaWV3IiwidG9GaXhlZCIsIm1hcmtlciIsInJlbW92ZSIsIkwiLCJhZGRUbyIsImludGVyc2VjdHNVcmwiLCJmZXRjaCIsInRoZW4iLCJyZXMiLCJqc29uIiwicm93cyIsImdlbmVyYXRlSW5mb0JveEZyb21RdWVyeSIsImxheWVyc0NvbnRlbnQiLCJPYmplY3QiLCJlbnRyaWVzIiwiaWQiLCJ2YWx1ZXMiLCJjb250ZW50IiwibGF5ZXJSb3dzIiwiZmlsdGVyIiwicm93IiwicmVkdWNlIiwidW5pcXVlIiwiaXRlbSIsInVuaXF1ZU5hbWVzIiwibmFtZWNvbCIsImluY2x1ZGVzIiwibmFtZWFsdCIsImpvaW4iLCJpbm5lckhUTUwiLCJzaG93X2luZm9fYm94Iiwic2V0X2FkZHJlc3MiLCJ2YWx1ZSIsInJlc3BvbnNlIiwiZmVhdHVyZXMiLCJsZW5ndGgiLCJwcm9wZXJ0aWVzIiwicmVwbGFjZSIsImdlb21ldHJ5IiwiY29vcmRpbmF0ZXMiLCJzdHlsZSIsImRpc3BsYXkiLCJmaXJzdENoaWxkIiwicmVtb3ZlQ2hpbGQiLCJjYXRjaCIsImVycm9yIiwiY29uc29sZSIsImxvZyIsInNlYXJjaF9hZGRyZXNzIiwiYWRyIiwiZm9yRWFjaCIsImZlYXR1cmUiLCJsaSIsImNyZWF0ZUVsZW1lbnQiLCJhIiwidGV4dENvbnRlbnQiLCJhZGRFdmVudExpc3RlbmVyIiwiYXBwZW5kQ2hpbGQiLCJ0b2dnbGVfbGF5ZXIiLCJjaGVja2VkIiwibGF5ZXIiLCJzaG93IiwiaGlkZSIsImhpZGVfYWxsX3Vuc2VsZWN0ZWRfZGlzdHJpY3RzIiwiZGlzdHJpY3RzIiwia2V5cyIsImVsZW1lbnQiLCJldmVudCIsIkV2ZW50IiwiZGlzcGF0Y2hFdmVudCIsImkiLCJ0b2dnbGVfdmlzaWJpbGl0eSIsImUiLCJxdWVyeV9kaXN0cmljdCIsImxheWVyX2lkIiwicXVlcnlEaXN0cmljdHMiLCJvcHRpb25zIiwic29ydCIsImIiLCJsb2NhbGVDb21wYXJlIiwibnVtZXJpYyIsImVyciIsImxpc3Rfb3ZlcmxhcHMiLCJzZWxlY3RfZGlzdHJpY3RfaWQiLCJkaXN0cmljdF9pZCIsInNlbGVjdGVkSW5kZXgiLCJxdWVyeSIsImJvdW5kc0NvbnRlbnQiLCJib3VuZFJvd3MiLCJhZGRXYXJuaW5nIiwicGVyY2VudCIsInNlYXJlYSIsImFyZWEiLCJyZXNldF9tYXAiLCJpbml0IiwiZG91YmxlQ2xpY2tab29tIiwiZGlzYWJsZSIsInRpbGVMYXllciIsIm1heFpvb20iLCJjbGllbnQiLCJjYXJ0byIsIkNsaWVudCIsImFwaUtleSIsInVzZXJuYW1lIiwiaXRlbV9udW1iZXIiLCJzb3VyY2UiLCJTUUwiLCJ0ZXh0U2NhbGUiLCJDYXJ0b0NTUyIsImV4dHJhQ29sdW1ucyIsImZlYXR1cmVDbGlja0NvbHVtbnMiLCJ0ZXh0TmFtZSIsIkxheWVyIiwiYWRkTGF5ZXIiLCJnZXRMZWFmbGV0TGF5ZXIiLCJwb3B1cCIsImNsb3NlQnV0dG9uIiwib3ZlcmxhcFNlbGVjdCIsIm9wdGlvbiIsInRhcmdldCIsIm1hcENsaWNrZWRJbnB1dCIsImlzTWFwQ2xpY2tlZEVuYWJsZWQiLCJsb2NhbFN0b3JhZ2UiLCJnZXRJdGVtIiwibWFwQ2xpY2tFdmVudCIsInRvZ2dsZU1hcENsaWNrZWQiLCJlbmFibGVkIiwic2V0SXRlbSIsImxhdGxuZyIsImxhdCIsImxuZyIsIm9uIiwib2ZmIiwibmF2aWdhdG9yIiwiZ2VvbG9jYXRpb24iLCJnZXRDdXJyZW50UG9zaXRpb24iLCJwb3NpdGlvbiIsImNvb3JkcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0VBQUEsU0FBUyxXQUFXLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRTtFQUMvQixFQUFFLEtBQUssR0FBRyxLQUFLLEtBQUssQ0FBQyxHQUFHLEdBQUcsR0FBRyxFQUFFLENBQUM7RUFDakMsRUFBRSxJQUFJLFFBQVEsR0FBRyxHQUFHLENBQUMsUUFBUSxDQUFDO0FBQzlCO0VBQ0EsRUFBRSxJQUFJLENBQUMsR0FBRyxJQUFJLE9BQU8sUUFBUSxLQUFLLFdBQVcsRUFBRSxFQUFFLE9BQU8sRUFBRTtBQUMxRDtFQUNBLEVBQUUsSUFBSSxJQUFJLEdBQUcsUUFBUSxDQUFDLElBQUksSUFBSSxRQUFRLENBQUMsb0JBQW9CLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDdkUsRUFBRSxJQUFJLEtBQUssR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0VBQzlDLEVBQUUsS0FBSyxDQUFDLElBQUksR0FBRyxV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
