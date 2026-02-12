#!/bin/bash

# === Configuration ===
DB_HOST="your-db-host.com"
DB_PORT=5432
DB_NAME="your-db-name"
DB_USER="your-db-username"
DB_PASSWORD='your-db-password'  # properly escaped

GEOJSON_FILE='all_boundaries.geojson'
DB_TABLE="all_bounds_new"

# === Upload GeoJSON to PostGIS ===
echo "Uploading ${GEOJSON_FILE} to ${DB_TABLE}..."

ogr2ogr \
  -f "PostgreSQL" \
  "PG:host=${DB_HOST} port=${DB_PORT} dbname=${DB_NAME} user=${DB_USER} password=${DB_PASSWORD}" \
  "${GEOJSON_FILE}" \
  -nln "${DB_TABLE}" \
  -nlt MULTIPOLYGON \
  -lco GEOMETRY_NAME=geom \
  -lco FID=gid \
  -overwrite

echo "Upload complete."
