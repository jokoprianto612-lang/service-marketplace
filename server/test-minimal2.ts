import { FastifyInstance } from 'fastify';

const test = async (app: FastifyInstance): Promise<void> => {
  await app.register(async (fastifyInstance: FastifyInstance): Promise<void> => {
    fastifyInstance.prefix('/api/v1');
  });
};
