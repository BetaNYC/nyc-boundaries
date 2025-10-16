import logging
logging.basicConfig(level=logging.INFO)
from flask import Flask, request, jsonify
import psycopg2
import json
from flask_cors import CORS
from psycopg2.pool import ThreadedConnectionPool
import atexit
import os
from monitoring import init_metrics, setup_logging, track_requests

app = Flask(__name__)

# Initialize monitoring with error handling
try:
    metrics, http_requests_total, request_latency = init_metrics(app)
    logger = setup_logging()
    track_requests(app, http_requests_total, request_latency)
    logging.info("Monitoring initialized successfully")
except Exception as e:
    logging.error(f"Failed to initialize monitoring: {str(e)}")
    metrics = None
    http_requests_total = None
    request_latency = None
    logger = logging.getLogger()

# Create connection pool
pg_pool = ThreadedConnectionPool(
    1,10,
    dbname=os.environ.get("DB_NAME"),
    user=os.environ.get("DB_USER"),
    password=os.environ.get("DB_PASSWORD"),
    host=os.environ.get("DB_HOST", "localhost")
)

# Enable CORS for local dev and production domain
CORS(app, origins=["http://127.0.0.1:5173", "http://localhost:5173", "https://bm-api.beta.nyc", "https://beta.nyc", "https://boundaries.beta.nyc"])

### Fetch single boundary types
# Execute SQL and return GeoJSON
def run_query(sql, params=()):
    conn = None
    try:
        conn = pg_pool.getconn()
        with conn.cursor() as cur:
            cur.execute(sql, params)
            rows = cur.fetchall()
            if not rows:
                return ("Not found", 404)

            features = []
            for row in rows:
                feature = {
                    "type": "Feature",
                    "geometry": json.loads(row[3]),
                    "properties": {
                        "id": row[0],
                        "namecol": row[1],
                        "namealt": row[2]
                    }
                }
                features.append(feature)

        return {
            "type": "FeatureCollection",
            "features": features
        }

    except Exception as e:
        if conn:
            conn.rollback()
        return jsonify({"error": str(e)}), 500

    finally:
        if conn:
            pg_pool.putconn(conn)

@app.route("/bounds_new")
def get_bounds_new():
    id_param = request.args.get("id")

    if id_param == "cd":
        sql = """
        SELECT id, namecol, namealt, ST_AsGeoJSON(geom)
        FROM all_bounds_new_simp
        WHERE id = 'cd' AND NOT namecol IN ('164','226','227','228','355','356','480','481','482','483','484','595')
        """
        params = ()
    elif id_param == "nta":
        sql = """
        SELECT id, namecol, namealt, ST_AsGeoJSON(geom)
        FROM all_bounds_new_simp
        WHERE id = 'nta' AND namecol NOT IN ('park-cemetery-etc-Brooklyn','park-cemetery-etc-Queens', 'park-cemetery-etc-Bronx', 'park-cemetery-etc-Manhattan', 'park-cemetery-etc-Staten Island', 'Airport')
        """
        params = ()
    elif id_param == "uhf":
        sql = """
        SELECT id, namecol, namealt, ST_AsGeoJSON(geom)
        FROM all_bounds_new_simp
        WHERE id = 'uhf' AND namecol <> ''
        """
        params = ()
    else:
        sql = """
        SELECT id, namecol, namealt, ST_AsGeoJSON(geom)
        FROM all_bounds_new_simp
        WHERE id = %s
        """
        params = (id_param,)

    geojson = run_query(sql, params)
    return jsonify(geojson)

### Fetch boundaries intersecting with point
@app.route("/pt_int_new")
def pt_intersections_new():
    lat = request.args.get("p_lat")
    lon = request.args.get("p_lng")

    if not lat or not lon:
        return jsonify({"error": "lat and lon are required"}), 400

    try:
        lat = float(lat)
        lon = float(lon)
    except ValueError:
        return jsonify({"error": "lat and lon must be valid numbers"}), 400

    conn = pg_pool.getconn()
    try:
        with conn.cursor() as cur:
            cur.execute("""
            SELECT id, namecol, namealt, ST_AsGeoJSON(geom)
            FROM all_bounds_new_simp
            WHERE ST_Intersects(geom, ST_SetSRID(ST_MakePoint(%s, %s), 4326)) AND namecol <> ''
            """, (lon, lat))

            rows = cur.fetchall()
        if not rows:
            return jsonify({"error": "No boundaries found"}), 404

        features = []
        for row in rows:
                feature = {
                    "type": "Feature",
                    "geometry": json.loads(row[3]),
                    "properties": {
                        "id": row[0],
                        "namecol": row[1],
                        "namealt": row[2]
                    }
                }
                features.append(feature)

        return jsonify({
            "type": "FeatureCollection",
            "features": features
        })
    finally:
        pg_pool.putconn(conn)

### Fetch boundaries intersecting with specific district
@app.route("/district_int_new")
def district_intersections_new():
    id = request.args.get("boundid")
    namecol = request.args.get("featureid")

    if not id or not namecol:
        return jsonify({"error": "boundid and featureid are required"}), 400

    conn = pg_pool.getconn()
    try:
        with conn.cursor() as cur:
            cur.execute("""
            SELECT id_right AS id, namecol_right AS namecol, namealt_right AS namealt,intersection_pct, ST_AsGeoJSON(geom)
            FROM all_intersections_new_simp
            WHERE id_left = %s AND namecol_left = %s AND namecol_right <> ''
            """, (id, namecol))

            rows = cur.fetchall()
        if not rows:
            return jsonify({"error": "No boundaries found"}), 404

        features = []
        for row in rows:
                feature = {
                    "type": "Feature",
                    "geometry": json.loads(row[4]),
                    "properties": {
                        "id": row[0],
                        "namecol": row[1],
                        "namealt": row[2],
                        "intersection_pct": row[3]
                    }
                }
                features.append(feature)

        return jsonify({
            "type": "FeatureCollection",
            "features": features
        })
    finally:
        pg_pool.putconn(conn)

@atexit.register
def close_pool():
    if pg_pool:
        pg_pool.closeall()
