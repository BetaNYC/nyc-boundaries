#!/bin/bash
set -euo pipefail

# === Configuration ===
SSH_HOST=""
SSH_KEY=""
LOCAL_PORT=5433                 
REMOTE_DB_HOST="localhost"
REMOTE_DB_PORT=5432

DB_NAME=""
DB_USER=""
DB_PASSWORD=''

GEOJSON_FILE=""
DB_SCHEMA="staging"
DB_TABLE="all_bounds_new"

# === Open SSH tunnel ===
SOCK="/tmp/pgtunnel-$$.sock"
ssh -i "$SSH_KEY" -f -N -M -S "$SOCK" \
  -o ExitOnForwardFailure=yes \
  -L "${LOCAL_PORT}:${REMOTE_DB_HOST}:${REMOTE_DB_PORT}" \
  "$SSH_HOST"
trap 'ssh -S "$SOCK" -O exit "$SSH_HOST" 2>/dev/null' EXIT

# === Upload GeoJSON to PostGIS ===
echo "Uploading ${GEOJSON_FILE} to ${DB_SCHEMA}.${DB_TABLE}..."
ogr2ogr \
  -f "PostgreSQL" \
  "PG:host=localhost port=${LOCAL_PORT} dbname=${DB_NAME} user=${DB_USER} password=${DB_PASSWORD}" \
  "${GEOJSON_FILE}" \
  -nln "${DB_TABLE}" \
  -lco SCHEMA="${DB_SCHEMA}" \
  -nlt MULTIPOLYGON \
  -lco GEOMETRY_NAME=geom \
  -lco FID=gid \
  -overwrite

echo "Upload complete."