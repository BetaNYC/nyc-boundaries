# Boundaries-Map

The NYC [Boundaries Map](https://betanyc.github.io/Boundaries-Map/) – is a tool for viewing and querying overlapping administrative boundaries in NYC. Various governmental bodies at the city, state, and federal level divide NYC's geography into a series of districts. Sometimes these districts are drawn to outline communities that will share common representation (e.g. by a community board, a council member, or a congressional member). Other times these districts are drawn to divide the work of a city agency (e.g. police precincts, fire battilions, and sanitation districts). For the most part, every governmental body divides the city in a different way, and in order to know who to collaborate with around issues in their district, those representing the districts within this governmental body need to know which districts of other governmental boundaries orverlap with their own district. For instance, community boards may want to know which council members to call when a pressing issue faces their district so need to know which council districts overlap with their community district. A council member running on a platform of school reform will need to know which school districts overlap with their council district.

Understanding how administrative boundaries overlap is also often important for interpreting open city datasets and summarizing information across multiple geographies. Sometimes, within open city datasets, values are reported at a district level. For instance, DSNY reports the monthly tonnage of waste collected _for each sanitation district_ in NYC. In order to get a sense of how much waste is collected within a community district, an analyst would need to better understand how community districts overlap with sanitation districts. In this particular example, community districts share the same boundaries as sanitation districts, so it is possible to know how much waste is collected per community district. However, when districts do not share the same boundaries, it becomes much more difficult to know how much of the value to allocate to each overlapping boundary. Boundaries Map helps users visualize this issue.

## How to Contribute

- File an issue via this [repo's issue cue](https://github.com/BetaNYC/Boundaries-Map/issues).
- Request a feature via this [repo's issue cue](https://github.com/BetaNYC/Boundaries-Map/issues).
- Comment on issues.
- Write code to fix issues or to create new features. When contributing code, please be sure to:
  - Fork this repository, modify the code (changing only one thing at a time), and then issue a pull request for each change.
  - Follow the project's coding style (using K&R-style indentation and bracketing, commenting above each feature, and using snake case for variables).
  - Test your code locally before issuing a pull request.
  - Clearly state the purpose of your change in the description field for each commit.

## How to build

- Run `npm install --dev`
- Create an .env file with your Carto API key with access to select and query from your layers. See .example.env for an example file.
- Run `npm run build` or `npm run dev`
- Serve index.html

## Key Terms

In the following section, we define the terms that will be used throughout this document.

**Administrative Boundary:** a geospatial representation of NYC divided into a series of districts in order to organize administrative work at the City, State, or Federal level
**District:** one division of an administrative boundary
**District Unique Identifier:** a number or name to uniquely identify a district

## Architecture

The NYC Boundaries Map is a landing page that displays a Carto basemap and outlines for each row of twelve shapefiles (representing an administrative boundary) stored in BetaNYC's Carto account: 1) NYC Community Districts, 2) NYC Police Precincts, 3) NYC Sanitation Districts, 4) NYC Fire Battilions, 5) NYC School Districts, 6) NYC Health Center Disticts, 7) NYC Council Districts, 8) Congressional Districts, 9) State Assembly Districts, 10) State Senate Districts, 11) Neighborhood Tabulation Areas, and 12) Business Improvement Districts. Selecting an administrative boundary from the "Query Overlapping Districts" dropdown turns off all layers except the selected layer; it then queries the dataset representing that administrative boundary in Carto to select the unique identifiers for each district within that adminstrative boundary and lists these districts in a separate doropdown. Selecting one of the unique identifiers from the resulting dropdown queries each of the eleven datasets to determent which administrative boundary districts overlap with the selected district. Searching for a NYC location queries the City's Geoclient API for the geo-coordinates that correspond to the entered address, repositions the map to this location, and then queries each of the eleven datasets to determine which geometries the geo-coordinates are located within. Datasets in Carto need to be updated as the geographic parameters change.

## Backend Services

### carto

Most of the data for Boundaries Map is stored in BetaNYC's carto account.

- `nycd`
  - Shapefile of community districts
  - [Published](https://data.cityofnewyork.us/City-Government/Community-Districts/yfnk-k7r4) on the NYC Open Data Portal
- `nypp`
  - Shapefile of police precincts
  - [Published](https://data.cityofnewyork.us/Public-Safety/Police-Precincts/78dh-3ptz) on the NYC Open Data Portal
- `dsny` and `dsny2`
  - Shapefile of sanitation districts
  - [Published](https://data.cityofnewyork.us/City-Government/DSNY-Districts/6j86-5s7z) on the NYC Open Data Portal
- `nyfb`
  - Shapefile of fire battilions
  - [Published](https://data.cityofnewyork.us/Public-Safety/Fire-Battalions/uh7r-6nya) on the NYC Open Data Portal
- `nysd`
  - Shapefile of school districts
  - [Published](https://data.cityofnewyork.us/Education/School-Districts/r8nu-ymqj) on the NYC Open Data Portal
- `nyhc`
  - Shapefile of health center districts
  - [Published](https://data.cityofnewyork.us/Health/Health-Center-Districts/b55q-34ps) on the NYC Open Data Portal
- `nycc`
  - Shapefile of city council districts
  - [Published](https://data.cityofnewyork.us/City-Government/City-Council-Districts/yusd-j4xi) on the NYC Open Data Portal
- `nycongress`
  - Shapefile of Congressional Districts
  - [Published](https://data.cityofnewyork.us/City-Government/Congressional-Districts/qd3c-zuu7) on the NYC Open Data Portal
- `nysa`
  - Shapefile of State Assembly Districts
  - [Published](https://data.cityofnewyork.us/City-Government/State-Assembly-Districts/pf5b-73bw) on the NYC Open Data Portal
- `nyss`
  - Shapefile of State Senate Districts
  - [Published](https://data.cityofnewyork.us/City-Government/State-Senate-Districts/h4i2-acfi) on the NYC Open Data Portal
- `nynta`
  - Shapefile of Neighborhood Tabulation Areas
  - [Published](https://data.cityofnewyork.us/City-Government/Neighborhood-Tabulation-Areas/cpf4-rkhq) on the NYC Open Data Portal
- `bids`

  - Shapefile of Business Improvement Districts
  - [Published](https://data.cityofnewyork.us/Business/Business-Improvement-Districts/ejxk-d93y) on the NYC Open Data Portal

### Carto.js v4

We use Carto.js to create and style map layers from data stored in the BetaNYC Carto account.

- [Source](https://libs.cartocdn.com/carto.js/v4.1.2/carto.min.js)
- [Documentation](https://carto.com/developers/carto-js/reference/)

### Leaflet.js

We use leaflet.js for additional JS-based mapping features such as re-centering the map to certain geographic coordinates on a location search.

- [Source](https://unpkg.com/leaflet@1.3.1/dist/leaflet.js)
- [Documentation](https://leafletjs.com/reference-1.3.2.html)

### NYC Geoclient API

When users enter a text address into the location search field, the system queries the Geoclient API for the lat/lon of that location. The map re-centers to this lat/lon.

- [Source](https://developer.cityofnewyork.us/api/geoclient-api)
- [Documentation](https://api.cityofnewyork.us/geoclient/v1/doc)

### Fetch API

We use the Fetch API for browser-based Web requests to the Carto SQL API and the NYC Geoclient API.

- [Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)

## Change Log

### Boundaries Map v0.8e

- [[15]](../../../../BetaNYC/Boundaries-Map/issues/13) A point is now plotted when searching for a specific address.

### Boundaries Map v0.7e

- [[13]](../../../../BetaNYC/Boundaries-Map/issues/13) The BIDs shapefile was added to Boundaries Map, along with the ability to query districts that overlap with BIDs.

### Boundaries Map v0.6e

- [[8]](../../../../BetaNYC/Boundaries-Map/issues/8) Parks were displaying on the map as community districts. These were removed by updating the Carto SQL source code to exclude all community districts with a unique identifier greater than the number of community districts in each borough.
- [[9]](../../../../BetaNYC/Boundaries-Map/issues/9) Users can query how any administrative boundary district overlaps overlaps with all other administrative boundary districts
- [[10]](../../../../BetaNYC/Boundaries-Map/issues/10) A reset map link was added beneath the location search bar so that users can set the map back to its initial zoom level after running a location search.

### Boundaries Map v0.5e

- [[2]](../../../../BetaNYC/Boundaries-Map/issues/2) On community board select, the map returns all overlapping districts in that community board.
- [[1]](../../../../BetaNYC/Boundaries-Map/issues/1) On location search, the map returns list of districts at that location.
- [[3]](../../../../BetaNYC/Boundaries-Map/issues/3) Description and Instructions were added.

## Copyrights

Please see [license](https://github.com/BetaNYC/Boundaries-Map/blob/master/LICENSE) file for details.

- Non-code, Creative Commons Attribution 4.0
- Code, GNU General Public License

## Have Questions?

Contact [Lindsay Poirier](mailto:lindsay@beta.nyc) and [Noel Hidalgo](mailto:noel@beta.nyc).
