-- First, load in all bounds manually to all_bounds_new using OGR2OGR via the command line to staging.all_bounds_new

SET statement_timeout = 0; 

-- Create spatial index:
CREATE INDEX IF NOT EXISTS idx_all_bounds_new_geom
ON staging.all_bounds_new
USING GIST(geom);

-- Get planner statistics
ANALYZE staging.all_bounds_new;

-- Grant select to API user role:
GRANT SELECT ON staging.all_bounds_new TO api_user;

-- Generate intersections. 0.1% overlap cutoff:
-- ~9 minutes
DROP TABLE IF EXISTS staging.all_intersections_new;

CREATE TABLE staging.all_intersections_new AS
WITH int AS(
SELECT DISTINCT l.id AS id_left, l.namecol AS namecol_left, l.namealt AS namealt_left, r.id AS id_right, r.namecol AS namecol_right, r.namealt AS namealt_right, ROUND((ST_AREA(ST_Intersection(l.geom, r.geom))/ST_AREA(l.geom)*100)::numeric,1) as intersection_pct, r.geom AS geom
FROM staging.all_bounds_new l, staging.all_bounds_new r
WHERE ST_Intersects(l.geom, r.geom) AND l.gid <> r.gid)
SELECT *
FROM int
WHERE intersection_pct>0.1;

CREATE INDEX idx_all_intersections_new_geom
ON staging.all_intersections_new
USING GIST (geom);

GRANT SELECT ON staging.all_intersections_new TO api_user;

-- Then, create simplified geometry tables for visualization.
-- 0.00001 degree is approximately one quarter of one NYC street
DROP TABLE IF EXISTS staging.all_bounds_new_simp;
CREATE TABLE staging.all_bounds_new_simp AS
SELECT gid, id, namecol, namealt, ST_SimplifyPreserveTopology(geom, 0.00001) as geom
FROM staging.all_bounds_new;

CREATE INDEX idx_all_bounds_new_simp_geom
ON staging.all_bounds_new_simp
USING GIST(geom);

CREATE INDEX idx_bounds_id_namecol ON staging.all_bounds_new_simp (id);

GRANT SELECT ON staging.all_bounds_new_simp to api_user;

-- ~ 11min
DROP TABLE IF EXISTS staging.all_intersections_new_simp;
CREATE TABLE staging.all_intersections_new_simp AS
SELECT id_left, namecol_left, namealt_left, id_right, namecol_right, namealt_right, intersection_pct, ST_SimplifyPreserveTopology(geom, 0.00001) as geom
FROM staging.all_intersections_new;

CREATE INDEX idx_all_intersections_new_simp_geom
ON staging.all_intersections_new_simp
USING GIST(geom);

CREATE INDEX idx_intersections_left_lookup
ON staging.all_intersections_new_simp (id_left, namecol_left);

GRANT SELECT ON staging.all_intersections_new_simp TO api_user;

ANALYZE staging.all_intersections_new, staging.all_bounds_new_simp, staging.all_intersections_new_simp;

-- Checks
SELECT tablename, schemaname, count(*) AS indexes
FROM pg_indexes
WHERE tablename LIKE 'all_%' AND schemaname IN ('public', 'staging')
GROUP BY tablename, schemaname ORDER BY tablename, schemaname;

SELECT view_schema, view_name, table_name
FROM information_schema.view_table_usage
WHERE table_name LIKE 'all_%';

-- Swap
ROLLBACK;

SET lock_timeout = '5s';

BEGIN;
CREATE SCHEMA old;
ALTER TABLE public.all_bounds_new             SET SCHEMA old;
ALTER TABLE public.all_intersections_new      SET SCHEMA old;
ALTER TABLE public.all_bounds_new_simp        SET SCHEMA old;
ALTER TABLE public.all_intersections_new_simp SET SCHEMA old;
ALTER TABLE staging.all_bounds_new             SET SCHEMA public;
ALTER TABLE staging.all_intersections_new      SET SCHEMA public;
ALTER TABLE staging.all_bounds_new_simp        SET SCHEMA public;
ALTER TABLE staging.all_intersections_new_simp SET SCHEMA public;
COMMIT;

-- Drop old schema once confident in changes
DROP SCHEMA old CASCADE;
DROP SCHEMA staging;