const sourceRunnerEnvValues = (parsedConfig) => ({
  WPND_IMAGE_PORT: String(parsedConfig.environment.port),
  WPND_HOST_DIR_PATH: parsedConfig.srcDir,
  DB_NAME: parsedConfig.environment.db.name,
  DB_USER: parsedConfig.environment.db.user,
  DB_PASSWORD: parsedConfig.environment.db.password,
});

export default sourceRunnerEnvValues;
