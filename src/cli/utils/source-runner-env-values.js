const sourceRunnerEnvValues = (config) => ({
  WPND_IMAGE_PORT: String(config.environment.port),
  WPND_HOST_DIR_PATH: config.srcDir,
  DB_NAME: config.environment.db.name,
  DB_USER: config.environment.db.user,
  DB_PASSWORD: config.environment.db.password,
});

export default sourceRunnerEnvValues;
