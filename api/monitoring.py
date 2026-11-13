from prometheus_flask_exporter.multiprocess import GunicornInternalPrometheusMetrics
from pythonjsonlogger import jsonlogger
import logging


def init_metrics(app):
    # Each gunicorn worker writes its counters to PROMETHEUS_MULTIPROC_DIR and /metrics adds them up;
    # otherwise each scrape would see only the one worker that answered it.
    # Labelled by Flask route ("endpoint"), not URL path, so requests for random paths can't add series.
    return GunicornInternalPrometheusMetrics(app, group_by="endpoint")


def setup_logging():
    handler = logging.StreamHandler()
    handler.setFormatter(jsonlogger.JsonFormatter("%(asctime)s %(levelname)s %(name)s %(message)s"))
    root = logging.getLogger()
    # Replace, not add to, the plain-text handler from logging.basicConfig in app.py,
    # so each record is logged once, as JSON (Loki parses it)
    root.handlers = [handler]
    root.setLevel(logging.INFO)
    return root
