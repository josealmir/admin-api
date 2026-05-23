import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';

async function loggerPlugin(app: FastifyInstance) {
  app.addHook('onRequest', async (request) => {
    request.log.info({ req: request }, 'incoming request');
  });

  app.addHook('onResponse', async (request, reply) => {
    request.log.info(
      {
        res: reply,
        responseTime: reply.elapsedTime,
      },
      'request completed',
    );
  });
}

export default fp(loggerPlugin, { name: 'logger' });
