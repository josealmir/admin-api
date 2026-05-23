import { FastifyInstance } from 'fastify';
import { TypeORMUserRepository } from '../../infrastructure/database/repositories/typeorm-user.repository';
import { CreateUserUseCase } from '../../application/use-cases/create-user.usecase';
import { AuthLoginUseCase } from '../../application/use-cases/auth-login.usecase';

const userRepository = new TypeORMUserRepository();
const createUserUseCase = new CreateUserUseCase(userRepository);
const authLoginUseCase = new AuthLoginUseCase(userRepository);

export async function authRoutes(app: FastifyInstance) {
  app.post('/register', {
    schema: {
      body: {
        type: 'object',
        required: ['name', 'email', 'password'],
        properties: {
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 6 },
        },
      },
    },
    handler: async (request, reply) => {
      const { name, email, password } = request.body as {
        name: string;
        email: string;
        password: string;
      };

      const user = await createUserUseCase.execute({ name, email, password });
      const token = app.jwt.sign({ id: user.id, email: user.email.toString() });

      return reply.status(201).send({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email.toString(),
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      });
    },
  });

  app.post('/login', {
    schema: {
      body: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string' },
        },
      },
    },
    handler: async (request, reply) => {
      const { email, password } = request.body as {
        email: string;
        password: string;
      };

      const user = await authLoginUseCase.execute({ email, password });
      const token = app.jwt.sign({ id: user.id, email: user.email });

      return reply.send({
        token,
        user,
      });
    },
  });
}
