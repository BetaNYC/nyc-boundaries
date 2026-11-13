FROM python:3.12-slim

# Disable output buffer
ENV PYTHONUNBUFFERED=1
# Where gunicorn workers share metrics; gunicorn.conf.py empties it on start
ENV PROMETHEUS_MULTIPROC_DIR=/tmp/prometheus

# Absolute path of image filesystem
WORKDIR /app

# Create user
RUN useradd --system app

# Install deps
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy in source
COPY app.py monitoring.py gunicorn.conf.py ./

USER app
EXPOSE 8000
CMD ["gunicorn", "--workers", "3", "--bind", "0.0.0.0:8000", "app:app"]
