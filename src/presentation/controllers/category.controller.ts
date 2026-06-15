import { executeCreate } from '@application/category-cases/category.service';
import { CreateCategoryDTO } from '@application/dtos/category.dto';
import { FastifyInstance } from 'fastify';

export async function categoryRoutes(app: FastifyInstance) {
  app.post('/categorys', {
    schema: {
      body: {
        type: 'object',
        required: ['description'],
        properties: {
          description: { type: 'string' },
        },
      },
      response: {
        201: {
          type: 'object',
          required: ['description'],
          properties: {
            description: { type: 'string' },
            id: { type: 'string' },
          },
        },
      },
    },
    //preHandler:[app.authenticate],
    handler: async (request, reply) => {
      const { description } = request.body as CreateCategoryDTO;
      const category = await executeCreate({ description: description });
      return reply.status(201).send(category);
    },
  });
}
