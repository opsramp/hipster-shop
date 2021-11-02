'use strict';

const opentelemetry = require('@opentelemetry/api');
const { ConsoleLogger,  LogLevel} = require('@opentelemetry/core');
const { NodeTracerProvider } = require('@opentelemetry/node');
const { SimpleSpanProcessor } = require('@opentelemetry/tracing');
const { CollectorTraceExporter } =  require('@opentelemetry/exporter-collector');
const { B3MultiPropagator } = require('@opentelemetry/propagator-b3');

opentelemetry.propagation.setGlobalPropagator(new B3MultiPropagator())

module.exports = (serviceName) => {
  const provider = new NodeTracerProvider();

  const exporter = new CollectorTraceExporter({
    serviceName: 'currencyservice',
    logger: new ConsoleLogger(LogLevel.DEBUG),
    url: `http://otel-collector:55681/v1/trace`,
  });

  provider.addSpanProcessor(new SimpleSpanProcessor(exporter));

  // Initialize the OpenTelemetry APIs to use the NodeTracerProvider bindings
  provider.register();

  return opentelemetry.trace.getTracer('currencyservice');
};