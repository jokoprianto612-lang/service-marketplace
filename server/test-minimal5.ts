interface FastifyInstance {
  prefix(path: string): this;
  register(plugin: any): this;
}

const test = async (app: FastifyInstance): Promise<void> => {
  await app.register(async (fi: FastifyInstance): Promise<void> => {
    fi.prefix('/api/v1');
  });
};
