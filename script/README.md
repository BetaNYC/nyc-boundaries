# Boundaries-Map Download and Merge Script

The NYC [Boundaries Map](https://betanyc.github.io/Boundaries-Map/) uses carto to serve tiles and run SQL queries.

This script will download all the datasets in the `data.json` file then merge them to a single feature collection called `all_bounds.geojson`

The geojson will include the fields formatted as so...

The `all_bounds.geojson` can then be used to import or sync to your carto account via the [Import API](https://carto.com/developers/import-api/reference/)

## How to run

- Add your datasets to `data.json`
- Run `npm install` then `npm run start`

## Create and update import

```bash
curl -v -F file=@/path/to/local/file "https://{account}.carto.com/api/v1/imports/?api_key={account API Key}"
```

collision_strategy=overwrite
table_name=all_bounds
