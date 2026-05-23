import { FastifyInstance } from 'fastify';
import { authRoutes } from '../controllers/auth.controller';
import { userRoutes } from '../controllers/user.controller';

export async function routes(app: FastifyInstance) {
  app.get('/ping', async () => {
    return { message: 'pong' };
  });

  await app.register(authRoutes);
  await app.register(userRoutes);
}
