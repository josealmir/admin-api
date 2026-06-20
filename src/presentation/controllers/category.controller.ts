import {
  executeCreate,
  executeDelete,
  executeFindAll,
  executeFindById,
  executeUpdate,
} from '@application/category-cases/category.service';
import { CreateCategoryDTO } from '@application/dtos/category.dto';
import { FastifyInstance } from 'fastify';

export async function categoryRoutes(app: FastifyInstance) {
  app.get('/categorys/:id', {
    schema: {
      security: [{ bearerAuth: [] }],
      tags: ['Category'],
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string' },
        },
      },
      response: {
        200: {
          type: 'object',
          required: ['description', 'id'],
          properties: {
            description: { type: 'string' },
            id: { type: 'string' },
          },
        },
        404: {
          type: 'object',
          properties: {
            message: { type: 'string' },
          },
        },
      },
    },
    //preHandler:[app.authenticate],
    handler: async (request, reply) => {
      const { id } = request.params as { id: string };
      const category = await executeFindById(id);
      if (!category) {
        return reply.status(404).send({ message: 'Category not found' });
      }
      return reply.status(200).send(category);
    },
  });

  app.get('/categorys', {
    schema: {
      security: [{ bearerAuth: [] }],
      tags: ['Category'],
      response: {
        200: {
          type: 'array',
          items: {
            type: 'object',
            required: ['description', 'id'],
            properties: {
              description: { type: 'string' },
              id: { type: 'string' },
            },
          },
        },
      },
    },
    preHandler: [app.authenticate],
    handler: async (request, reply) => {
      const categorys = await executeFindAll();
      return reply.status(200).send(categorys);
    },
  });

  app.post('/categorys', {
    schema: {
      security: [{ bearerAuth: [] }],
      tags: ['Category'],
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

  app.put('/categorys/:id', {
    schema: {
      security: [{ bearerAuth: [] }],
      tags: ['Category'],
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string' },
        },
      },
      body: {
        type: 'object',
        required: ['description'],
        properties: {
          description: { type: 'string' },
        },
      },
      response: {
        200: {
          type: 'object',
          required: ['description', 'id'],
          properties: {
            description: { type: 'string' },
            id: { type: 'string' },
          },
        },
        404: {
          type: 'object',
          properties: {
            message: { type: 'string' },
          },
        },
      },
    },
    //preHandler:[app.authenticate],
    handler: async (request, reply) => {
      const { id } = request.params as { id: string };
      const { description } = request.body as CreateCategoryDTO;
      const category = await executeFindById(id);
      if (!category) {
        return reply.status(404).send({ message: 'Category not found' });
      }
      const updatedCategory = await executeUpdate(id, description);
      return reply.status(200).send(updatedCategory);
    },
  });

  app.delete('/categorys/:id', {
    schema: {
      security: [{ bearerAuth: [] }],
      tags: ['Category'],
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string' },
        },
      },
      response: {
        204: {
          type: 'null',
        },
        404: {
          type: 'object',
          properties: {
            message: { type: 'string' },
          },
        },
      },
    },
    //preHandler:[app.authenticate],
    handler: async (request, reply) => {
      const { id } = request.params as { id: string };
      const category = await executeFindById(id);
      if (!category) {
        return reply.status(404).send({ message: 'Category not found' });
      }
      await executeDelete(id);
      return reply.status(204).send();
    },
  });
}
