'use strict';
// const { NodeTracerProvider } = require('@opentelemetry/sdk-trace-node');
// const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');
// const { SimpleSpanProcessor } = require('@opentelemetry/sdk-trace-base');
// const Resource = require('@opentelemetry/resources').default.Resource;
// const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');
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

// axios 계측 제거 (불필요)
// const { AxiosInstrumentation } = require('@opentelemetry/instrumentation-axios');

// const provider = new NodeTracerProvider({
//     resource: new Resource({
//         [SemanticResourceAttributes.SERVICE_NAME]: 'test-app',
//     }),
// });

// const exporter = new OTLPTraceExporter({
//     url: 'http://tempo:4318/v1/traces',
// });

// provider.addSpanProcessor(new SimpleSpanProcessor(exporter));
// provider.register();

// registerInstrumentations({
//     instrumentations: [
//         new HttpInstrumentation(),         // HTTP 계층 자동 계측
//         new ExpressInstrumentation(),      // Express 라우트 자동 계측
//         // new AxiosInstrumentation(),     // 제거됨
//     ],
// });


diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);

const exporter = new OTLPTraceExporter({
    url: 'http://tempo-distributor.monitoring.svc.cluster.local:4318/v1/traces',
    // headers: {
    //   foo: 'bar'
    // },
});

const provider = new NodeTracerProvider({
    resource: resourceFromAttributes({
        [ATTR_SERVICE_NAME]: 'test-app',
    }),
    spanProcessors: [
        new SimpleSpanProcessor(exporter),
        new SimpleSpanProcessor(new ConsoleSpanExporter()),
    ]
});
provider.register();



console.log('✅ OpenTelemetry 트레이싱 초기화 완료');
