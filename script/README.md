# Boundaries Map Scripts

## Compiling boundaries

[Boundaries Map](https://boundaries.beta.nyc) uses a PostgreSQL+PostGIS database with a Flask API to serve boundary data. Various NYC boundaries are combined into into a single GeoJSON with standardized fields. This single file is then imported into the database, where the boundary intersections are pre-calculated to provide fast responses to API queries. A simplified version of the individual boundaries and their intersections is then generated and served to provide a faster loading map on the front end.

The datasets are identified in `generate_all_bounds.py`, which is a modified version of the [script](https://github.com/MODA-NYC/nyc-geography-crosswalks/blob/main/scripts/generate_all_bounds.py) orginally produced by [Nathan Storey](https://github.com/npstorey) at the Office of Technology and Innovation in his [NYC Geographic Crosswalks repository.](https://github.com/MODA-NYC/nyc-geography-crosswalks) 

The geojson includes fields formatted in order to provide a quick way to query though all the various boundaries. All fields are a string:

| id  | nameCol | nameAlt              |
| --- | ------- | -------------------- |
| cd  | 101     |                      |
| cd  | 102     |                      |
| nta | 1       | Fresh Meadows-Utopia |
| sd  | BKN09   | 309                  |

To run `generate_all_bounds.py`, you'll need to provide a Socrata API key and secret in an environment file. You can get these by creating a [Socrata developer account](https://data.cityofnewyork.us/profile/edit/developer_settings). The only dataset that requires authentication is Election Districts, with over 4,000 features. A template is provided in `env.template`. Note that not all boundaries are sourced from NYC Open Data.

The results are placed in `data/processed/`. The collated boundaries are in `all_bounds.geojson`. Each individual boundary is also processed into its own standalone geojson file, such as `cd.geojson` for Community Districts.

## Database

The `all_bounds.geojson` file is imported into a PostgreSQL+PostGIS database. One way to do this is using ogr2ogr, an example of which is included in `geom_upload_template.sh`. This creates a table called `all_bounds_new`. From here, run the commands in `db_setup.sql`. This will:
- Create a table of all boundary intersections with an overlap threshold of 0.1%
- Create simplifed versions of the boundary and boundary intersections tables
- Create indexes to speed up queries

Geometries are simplified using `ST_SimplifyPreserveTopology` with a tolerance of 0.00001˚, which is about one quarter of the width of a major city street.

## API

A simple Flask API setup is included in `app.py`. This provides endpoints to query the boundaries table and the boundary intersections table in order to pass data to the front end. The server uses Gunicorn to run the API, Nginx to provide a reverse proxy, Let's Encrypt for SSL, and systemd to manage the services. 


