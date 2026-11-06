from prometheus_client import Counter, Histogram
from prometheus_flask_exporter import PrometheusMetrics
from pythonjsonlogger import jsonlogger
import logging
import time
from flask import request, has_request_context

# Initialize metrics
def init_metrics(app):
    try:
        metrics = PrometheusMetrics(app)
        
        # Define custom metrics
        http_requests_total = Counter(
            'http_requests_total',
            'Total HTTP requests',
            ['method', 'endpoint', 'status', 'ip']
        )

        request_latency = Histogram(
            'request_latency_seconds',
            'Request latency in seconds',
            ['endpoint']
        )

        # Add default metrics
        metrics.info('app_info', 'Application info', version='1.0.0')
        
        return metrics, http_requests_total, request_latency
    except Exception as e:
        logging.error(f"Failed to initialize metrics: {str(e)}")
        return None, None, None

# Setup logging
def setup_logging():
    try:
        logger = logging.getLogger()
        logHandler = logging.StreamHandler()
        formatter = jsonlogger.JsonFormatter(
            '%(asctime)s %(levelname)s %(name)s %(message)s'
        )
        logHandler.setFormatter(formatter)
        logger.addHandler(logHandler)
        logger.setLevel(logging.INFO)
        return logger
    except Exception as e:
        logging.error(f"Failed to setup logging: {str(e)}")
        return logging.getLogger()

# Request tracking middleware
def track_requests(app, http_requests_total, request_latency):
    if not http_requests_total or not request_latency:
        return

    @app.before_request
    def before_request():
        if has_request_context():
            request.start_time = time.time()

    @app.after_request
    def after_request(response):
        try:
            if has_request_context():
                # Get client IP
                ip = request.remote_addr or 'unknown'
                
                # Track request metrics
                http_requests_total.labels(
                    method=request.method,
                    endpoint=request.endpoint or 'unknown',
                    status=response.status_code,
                    ip=ip
                ).inc()
                
                # Track latency
                if hasattr(request, 'start_time'):
                    request_latency.labels(
                        endpoint=request.endpoint or 'unknown'
                    ).observe(time.time() - request.start_time)
        except Exception as e:
            logging.error(f"Error in request tracking: {str(e)}")
        
        return response 
