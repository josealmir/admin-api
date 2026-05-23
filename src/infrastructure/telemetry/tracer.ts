import { NodeSDK } from '@opentelemetry/sdk-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { FastifyInstrumentation } from '@opentelemetry/instrumentation-fastify';
import { env } from '@shared/constants/env';

let sdk: NodeSDK | null = null;

export function startTracer(): void {
  const traceExporter = new OTLPTraceExporter({
    url: env.OTEL_ENDPOINT,
  });

  sdk = new NodeSDK({
    serviceName: env.OTEL_SERVICE_NAME,
    traceExporter,
    instrumentations: [new HttpInstrumentation(), new FastifyInstrumentation()],
  });

  sdk.start();
}

export async function shutdownTracer(): Promise<void> {
  if (sdk) {
    await sdk.shutdown();
  }
}
