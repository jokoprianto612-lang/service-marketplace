import { FastifyInstance } from 'fastify';

const test = async (app: FastifyInstance): Promise<void> => {
  await app.register(async (f: FastifyInstance): Promise<void> => {
    f.prefix('/api/v1');
  });
};
