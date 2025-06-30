'use strict';
const { NodeTracerProvider } = require('@opentelemetry/sdk-trace-node');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');
const { SimpleSpanProcessor } = require('@opentelemetry/sdk-trace-base');

const provider = new NodeTracerProvider();

const exporter = new OTLPTraceExporter({
    url: 'http://tempo:4318/v1/traces',
});

provider.addSpanProcessor(new SimpleSpanProcessor(exporter));
provider.register();
