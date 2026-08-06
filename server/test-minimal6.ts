import { FastifyInstance } from 'fastify';

type Test = FastifyInstance extends { prefix: (path: string) => any } ? "yes" : "no";

const test = async (app: FastifyInstance): Promise<void> => {
  await app.register(async (fi: FastifyInstance): Promise<void> => {
    fi.prefix('/api/v1');
  });
};
