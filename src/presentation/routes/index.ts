import { FastifyInstance } from 'fastify';
import { authRoutes } from '@presentation/controllers/auth.controller';
import { userRoutes } from '@presentation/controllers/user.controller';
import { categoryRoutes } from '@presentation/controllers/category.controller';

export async function routes(app: FastifyInstance) {
  app.get('/ping', async () => {
    return { message: 'pong' };
  });

  await app.register(authRoutes);
  await app.register(userRoutes);
  await app.register(categoryRoutes);
}
