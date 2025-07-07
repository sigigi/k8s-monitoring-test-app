'use strict';
const { NodeTracerProvider } = require('@opentelemetry/sdk-trace-node')
const { ConsoleSpanExporter, SimpleSpanProcessor } = require('@opentelemetry/sdk-trace-base');
const { resourceFromAttributes } = require('@opentelemetry/resources');
const { ATTR_SERVICE_NAME } = require('@opentelemetry/semantic-conventions');
const {
    diag,
    trace,
    context,
    DiagConsoleLogger,
    DiagLogLevel,
} = require('@opentelemetry/api');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');
const { registerInstrumentations } = require('@opentelemetry/instrumentation');
const { ExpressInstrumentation } = require('@opentelemetry/instrumentation-express');
const { HttpInstrumentation } = require('@opentelemetry/instrumentation-http');

diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);

const exporter = new OTLPTraceExporter({
    url: 'http://tempo-distributor.monitoring.svc.cluster.local:4318/v1/traces', //http
});

const provider = new NodeTracerProvider({
    resource: resourceFromAttributes({
        [ATTR_SERVICE_NAME]: 'sub2-app',
    }),
    spanProcessors: [
        new SimpleSpanProcessor(exporter),
        new SimpleSpanProcessor(new ConsoleSpanExporter()),
    ]
});
provider.register();
registerInstrumentations({
    instrumentations: [
        new HttpInstrumentation(),         // HTTP 계층 자동 계측
        new ExpressInstrumentation(),      // Express 라우트 자동 계측
        // new AxiosInstrumentation(),     // 제거됨
    ],
});


console.log('✅ OpenTelemetry 트레이싱 초기화 완료');
