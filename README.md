# Boundaries-Map

The NYC [Boundaries Map](https://boundaries.beta.nyc) is a tool for viewing and querying overlapping administrative boundaries in NYC.

Various governmental bodies at the city, state, and federal level divide NYC's geography into a series of districts. Sometimes these districts are drawn to outline communities that will share common representation (e.g. by a community board, a council member, or a congressional member). Other times these districts are drawn to divide the work of a city agency (e.g. police precincts, fire battilions, and sanitation districts). For the most part, every governmental body divides the city in a different way, and in order to know who to collaborate with around issues in their district, those representing the districts within this governmental body need to know which districts of other governmental boundaries orverlap with their own district. For instance, community boards may want to know which council members to call when a pressing issue faces their district so need to know which council districts overlap with their community district. A council member running on a platform of school reform will need to know which school districts overlap with their council district.

Understanding how administrative boundaries overlap is also important for interpreting city datasets and summarizing information across multiple geographies. Sometimes, within city datasets, values are reported at a district level. For instance, DSNY reports the monthly tonnage of waste collected _for each sanitation district_ in NYC. In order to get a sense of how much waste is collected within a community district, an analyst would need to better understand how community districts overlap with sanitation districts. In this particular example, community districts share the same boundaries as sanitation districts, so it is possible to know how much waste is collected per community district. However, when districts do not share the same boundaries, it becomes much more difficult to know how much of the value to allocate to each overlapping boundary. Boundaries Map helps visualize this issue.

## How to Contribute

- File an issue via this [repo's issue cue](https://github.com/BetaNYC/Boundaries-Map/issues)
- Request a feature via this [repo's issue cue](https://github.com/BetaNYC/Boundaries-Map/issues)

## How to build

- Run `npm install`
- Create an .env file with your Carto API key with access to select and query from your layers. See .example.env for an example file.
- Run `npm run dev` and visit `localhost:3000`

## How to do the deployment

- Push the changes from the local side
- Add this code:
  git subtree push --prefix public/ origin gh-pages
- GitHub Action will automatically run the deployment

## Key Terms

In the following section, we define the terms that will be used throughout this document.

**Administrative Boundary:** a geospatial representation of NYC divided into a series of districts in order to organize administrative work at the City, State, or Federal level
**District:** one division of an administrative boundary
**District Unique Identifier:** a number or name to uniquely identify a district

## Backend Services

### Carto

Most of the data for Boundaries Map is stored in BetaNYC's Carto account.

- `cd`
  - Shapefile of community districts
  - [Published](https://data.cityofnewyork.us/City-Government/Community-Districts/yfnk-k7r4) on the NYC Open Data Portal
- `pp`
  - Shapefile of police precincts
  - [Published](https://data.cityofnewyork.us/Public-Safety/Police-Precincts/78dh-3ptz) on the NYC Open Data Portal
- `dsny`
  - Shapefile of sanitation districts
  - [Published](https://data.cityofnewyork.us/City-Government/DSNY-Districts/6j86-5s7z) on the NYC Open Data Portal
- `fb`
  - Shapefile of fire battilions
  - [Published](https://data.cityofnewyork.us/Public-Safety/Fire-Battalions/uh7r-6nya) on the NYC Open Data Portal
- `sd`
  - Shapefile of school districts
  - [Published](https://data.cityofnewyork.us/Education/School-Districts/r8nu-ymqj) on the NYC Open Data Portal
- `hc`
  - Shapefile of health center districts
  - [Published](https://data.cityofnewyork.us/Health/Health-Center-Districts/b55q-34ps) on the NYC Open Data Portal
- `cc`
  - Shapefile of city council districts
  - [Published](https://data.cityofnewyork.us/City-Government/City-Council-Districts/yusd-j4xi) on the NYC Open Data Portal
- `nycongress`
  - Shapefile of Congressional Districts
  - [Published](https://data.cityofnewyork.us/City-Government/Congressional-Districts/qd3c-zuu7) on the NYC Open Data Portal
- `sa`
  - Shapefile of State Assembly Districts
  - [Published](https://data.cityofnewyork.us/City-Government/State-Assembly-Districts/pf5b-73bw) on the NYC Open Data Portal
- `ss`
  - Shapefile of State Senate Districts
  - [Published](https://data.cityofnewyork.us/City-Government/State-Senate-Districts/h4i2-acfi) on the NYC Open Data Portal
- `nta`
  - Shapefile of Neighborhood Tabulation Areas
  - [Published](https://data.cityofnewyork.us/City-Government/Neighborhood-Tabulation-Areas/cpf4-rkhq) on the NYC Open Data Portal
- `hd`
  - Shapefile of Historic Districts
  - [Published](https://data.cityofnewyork.us/Housing-Development/Historic-Districts/xbvj-gfnw) on the NYC Open Data Portal
- `bid`
  - Shapefile of Business Improvement Districts
  - [Published](https://data.cityofnewyork.us/Business/Business-Improvement-Districts/ejxk-d93y) on the NYC Open Data Portal
- `ibz`
  - Shapefile of Industrial Business Zones
  - [Published](https://edc.nyc/sites/default/files/2020-10/IBZ%20Shapefiles.zip) on EDC's website

### Carto.js v4

We use Carto.js to create and style map layers from data stored in the BetaNYC Carto account.

- [Source](https://libs.cartocdn.com/carto.js/v4.1.2/carto.min.js)
- [Documentation](https://carto.com/developers/carto-js/reference/)

### NYC Planning Lab's GeoSearch API

When users enter a text address into the location search field, the system queries GeoSearch for the lat/lon of that location. The map re-centers to this lat/lon.

- [Source](https://github.com/NYCPlanning/labs-geosearch-api)
- [Documentation](https://geosearch.planninglabs.nyc/docs)

### Fetch API

We use the Fetch API for browser-based Web requests to the Carto SQL API and the GeoSearch API.

- [Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)

## Change Log

### v1.1

- Add historic districts

### v1.0

- Application completely rewritten to use [Svelte](https://svelte.dev/), [TypeScript](https://www.typescriptlang.org/) and [Mapbox](https://www.mapbox.com/)
- Application redesigned using [Tailwind](https://tailwindcss.com/)
- Map now supports zooming with hotkeys
- Map can now be interacted with directly by clicking a district
- Map now automatically zooms to fit a selected district, address, or coordinate
- Districts for each boundary may now be filtered and selected directly from the sidebar
- URLs can now link directly to a specific district on the map (e.g. https://boundaries.beta.nyc/?map=cd&dist=101), or a specific coordinate (e.g. https://boundaries.beta.nyc/?lng=-73.972178431416&lat=40.773847961804876)
- All shapefiles updated to include 2022 redistricting

### v0.9.1e

- [[75]](../../../../BetaNYC/nyc-boundaries/pull/75) Update fonts to improve accessibility and performance

### v0.9e

- [[22]](../../../../BetaNYC/Boundaries-Map/pull/25) A script to download and aggregate all boundaries to 'all_bounds.geojson'

- [[30]](../../../../BetaNYC/Boundaries-Map/issues/30) Reverted back to scroll wheel for zooming

- [[26]](../../../../BetaNYC/Boundaries-Map/issues/26) Switched GeoClient API to Planning Lab's GeoSearch for address autocomplete

- [[29]](../../../../BetaNYC/Boundaries-Map/pull/29) Added ZipCodes layer and Refactored Code to use a single Carto dataset

### v0.8e

- [[15]](../../../../BetaNYC/Boundaries-Map/issues/13) A point is now plotted when searching for a specific address.

### v0.7e

- [[13]](../../../../BetaNYC/Boundaries-Map/issues/13) The BIDs shapefile was added to Boundaries Map, along with the ability to query districts that overlap with BIDs.

### v0.6e

- [[8]](../../../../BetaNYC/Boundaries-Map/issues/8) Parks were displaying on the map as community districts. These were removed by updating the Carto SQL source code to exclude all community districts with a unique identifier greater than the number of community districts in each borough.
- [[9]](../../../../BetaNYC/Boundaries-Map/issues/9) Users can query how any administrative boundary district overlaps overlaps with all other administrative boundary districts
- [[10]](../../../../BetaNYC/Boundaries-Map/issues/10) A reset map link was added beneath the location search bar so that users can set the map back to its initial zoom level after running a location search.

### v0.5e

- [[2]](../../../../BetaNYC/Boundaries-Map/issues/2) On community board select, the map returns all overlapping districts in that community board.
- [[1]](../../../../BetaNYC/Boundaries-Map/issues/1) On location search, the map returns list of districts at that location.
- [[3]](../../../../BetaNYC/Boundaries-Map/issues/3) Description and Instructions were added.

## Copyrights

Please see [license](https://github.com/BetaNYC/Boundaries-Map/blob/master/LICENSE) file for details.

- Non-code, Creative Commons Attribution 4.0
- Code, GNU General Public License

## Have Questions?

Contact [Zhi Keng He](mailto:zhi@beta.nyc) or [Noel Hidalgo](mailto:noel@beta.nyc).
