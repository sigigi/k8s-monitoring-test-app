'use strict';
const { NodeTracerProvider } = require('@opentelemetry/sdk-trace-node');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');
const { SimpleSpanProcessor } = require('@opentelemetry/sdk-trace-base');
const { Resource } = require('@opentelemetry/resources');
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');
const { registerInstrumentations } = require('@opentelemetry/instrumentation');
const { ExpressInstrumentation } = require('@opentelemetry/instrumentation-express');
const { HttpInstrumentation } = require('@opentelemetry/instrumentation-http');
const { AxiosInstrumentation } = require('@opentelemetry/instrumentation-axios');

// 리소스 설정 (서비스 이름은 Tempo에서 필터할 때 중요함)
const provider = new NodeTracerProvider({
    resource: new Resource({
        [SemanticResourceAttributes.SERVICE_NAME]: 'test-app',
    }),
});

// OTLP HTTP Exporter 설정
const exporter = new OTLPTraceExporter({
    url: 'http://tempo:4318/v1/traces', // Tempo OTLP endpoint
});

provider.addSpanProcessor(new SimpleSpanProcessor(exporter));
provider.register();

// 자동계측 설정
registerInstrumentations({
    instrumentations: [
        new HttpInstrumentation(),
        new ExpressInstrumentation(),
        new AxiosInstrumentation(),
    ],
});

console.log('✅ OpenTelemetry 트레이싱 초기화 완료');