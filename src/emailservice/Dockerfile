FROM python:3.7-slim as base

RUN apt-get -qq update \
    && apt-get install -y --no-install-recommends \
    g++ git \
    && rm -rf /var/lib/apt/lists/*

# Enable unbuffered logging
ENV PYTHONUNBUFFERED=1
# Enable Profiler
ENV ENABLE_PROFILER=1

RUN apt-get -qq update \
    && apt-get install -y --no-install-recommends \
    wget

# Download the grpc health probe
RUN GRPC_HEALTH_PROBE_VERSION=v0.2.0 && \
    wget -qO/bin/grpc_health_probe https://github.com/grpc-ecosystem/grpc-health-probe/releases/download/${GRPC_HEALTH_PROBE_VERSION}/grpc_health_probe-linux-amd64 && \
    chmod +x /bin/grpc_health_probe

WORKDIR /email_server
# get packages
COPY requirements.txt .
RUN pip install -r requirements.txt
# RUN pip install opentelemetry-launcher

# Add the application
COPY . .

ENV LS_SERVICE_NAME "emailservice"
ENV OTEL_EXPORTER_OTLP_TRACES_INSECURE true
ENV OTEL_EXPORTER_OTLP_TRACES_ENDPOINT "otel-collector:55680"
ENV OTEL_EXPORTER_OTLP_SPAN_ENDPOINT "otel-collector:55680"

EXPOSE 8080
ENTRYPOINT [ "opentelemetry-instrument", "python", "email_server.py" ]
