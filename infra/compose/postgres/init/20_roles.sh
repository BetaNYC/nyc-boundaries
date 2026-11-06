#!/bin/bash
# Runs once, on the first start with an empty pgdata volume, after the image's 10_postgis.sh.
# Executable on purpose: Docker Desktop's file sharing reports bind-mounted files as executable, so the
# entrypoint runs this directly instead of sourcing it; +x makes that work, and Linux then behaves the same.
# A failing psql (ON_ERROR_STOP) stops the entrypoint.

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" \
  -v api_pw="$API_DB_PASSWORD" \
  -v pipeline_pw="$PIPELINE_DB_PASSWORD" \
  -v lab_pw="$LAB_DB_PASSWORD" <<'SQL'
CREATE ROLE api_user LOGIN PASSWORD :'api_pw';
CREATE ROLE pipeline LOGIN PASSWORD :'pipeline_pw';
CREATE ROLE lab LOGIN PASSWORD :'lab_pw';
GRANT pipeline TO lab;

-- pipeline restores into public, builds in staging, and swaps schemas
GRANT CREATE ON DATABASE boundariesmap TO pipeline;
ALTER SCHEMA public OWNER TO pipeline;

CREATE DATABASE dagster OWNER pipeline;
SQL
