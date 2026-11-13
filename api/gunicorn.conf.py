# Gunicorn loads ./gunicorn.conf.py automatically; the Dockerfile's CMD still sets workers and bind.
import os
import shutil

from prometheus_flask_exporter.multiprocess import GunicornInternalPrometheusMetrics


def on_starting(server):
    # Start with an empty metrics folder: a container restart keeps /tmp, and leftover files from the
    # previous run's workers would be added into the new counts
    folder = os.environ["PROMETHEUS_MULTIPROC_DIR"]
    shutil.rmtree(folder, ignore_errors=True)
    os.makedirs(folder)


def child_exit(server, worker):
    # A replaced worker's live gauges must stop counting
    GunicornInternalPrometheusMetrics.mark_process_dead_on_child_exit(worker.pid)
