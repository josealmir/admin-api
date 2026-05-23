import { FastifyInstance } from 'fastify';
import { TypeORMUserRepository } from '@infrastructure/database/repositories/typeorm-user.repository';
import { CreateUserUseCase } from '@application/use-cases/create-user.usecase';
import { GetUserUseCase } from '@application/use-cases/get-user.usecase';
import { ListUsersUseCase } from '@application/use-cases/list-users.usecase';

const userRepository = new TypeORMUserRepository();
const createUserUseCase = new CreateUserUseCase(userRepository);
const getUserUseCase = new GetUserUseCase(userRepository);
const listUsersUseCase = new ListUsersUseCase(userRepository);

export async function userRoutes(app: FastifyInstance) {
  app.get('/users', {
    preHandler: [app.authenticate],
    handler: async (_request, reply) => {
      const users = await listUsersUseCase.execute();
      return reply.send(
        users.map((u) => ({
          id: u.id,
          name: u.name,
          email: u.email.toString(),
          createdAt: u.createdAt,
          updatedAt: u.updatedAt,
        })),
      );
    },
  });

  app.get('/users/:id', {
    preHandler: [app.authenticate],
    handler: async (request, reply) => {
      const { id } = request.params as { id: string };
      const user = await getUserUseCase.execute(id);
      return reply.send({
        id: user.id,
        name: user.name,
        email: user.email.toString(),
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });
    },
  });

  app.post('/users', {
    preHandler: [app.authenticate],
    handler: async (request, reply) => {
      const { name, email, password } = request.body as {
        name: string;
        email: string;
        password: string;
      };
      const user = await createUserUseCase.execute({ name, email, password });
      return reply.status(201).send({
        id: user.id,
        name: user.name,
        email: user.email.toString(),
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });
    },
  });
}
