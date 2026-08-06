const test = async (app: any): Promise<void> => {
  await app.register(async (fi: any): Promise<void> => {
    fi.prefix('/api/v1');
  });
};
