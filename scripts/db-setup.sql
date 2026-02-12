-- First, load in all bounds manually to all_bounds_new using OGR2OGR via the command line

-- Create spatial index:
CREATE INDEX idx_all_bounds_new_geom
ON all_bounds_new
USING GIST(geom);

-- Grant select to API user role:
GRANT SELECT ON all_bounds_new TO api_user;

-- Generate intersections. 0.1% overlap cutoff:
-- ~9 minutes
DROP TABLE IF EXISTS all_intersections_new;

CREATE TABLE all_intersections_new AS
WITH int AS(
SELECT DISTINCT l.id AS id_left, l.namecol AS namecol_left, l.namealt AS namealt_left, r.id AS id_right, r.namecol AS namecol_right, r.namealt AS namealt_right, ROUND((ST_AREA(ST_Intersection(l.geom, r.geom))/ST_AREA(l.geom)*100)::numeric,1) as intersection_pct, r.geom AS geom
FROM all_bounds_new l, all_bounds_new r
WHERE ST_Intersects(l.geom, r.geom) AND l.gid <> r.gid)
SELECT *
FROM int
WHERE intersection_pct>0.1;

CREATE INDEX idx_all_intersections_new_geom
ON all_intersections_new
USING GIST (geom);

GRANT SELECT ON all_intersections_new TO api_user;

-- Then, create simplified geometry tables for visualization.
-- 0.00001 degree is approximately one quarter of one NYC street
DROP TABLE IF EXISTS all_bounds_new_simp;
CREATE TABLE all_bounds_new_simp AS
SELECT gid, id, namecol, namealt, ST_SimplifyPreserveTopology(geom, 0.00001) as geom
FROM all_bounds_new;

CREATE INDEX idx_all_bounds_new_simp_geom
ON all_bounds_new_simp
USING GIST(geom);

CREATE INDEX idx_bounds_id_namecol ON all_bounds_new_simp (id);

GRANT SELECT ON all_bounds_new_simp to api_user;

-- ~ 11min
DROP TABLE IF EXISTS all_intersections_new_simp;
CREATE TABLE all_intersections_new_simp AS
SELECT id_left, namecol_left, namealt_left, id_right, namecol_right, namealt_right, intersection_pct, ST_SimplifyPreserveTopology(geom, 0.00001) as geom
FROM all_intersections_new;

CREATE INDEX idx_all_intersections_new_simp_geom
ON all_intersections_new_simp
USING GIST(geom);

CREATE INDEX idx_intersections_left_lookup
ON all_intersections_new_simp (id_left, namecol_left);

GRANT SELECT ON all_intersections_new_simp TO api_user;