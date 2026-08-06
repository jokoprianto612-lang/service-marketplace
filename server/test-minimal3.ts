import { FastifyInstance } from 'fastify';

const test = async (app: FastifyInstance): Promise<void> => {
  await app.register(async (fi: FastifyInstance): Promise<void> => {
    (fi as FastifyInstance).prefix('/api/v1');
  });
};
