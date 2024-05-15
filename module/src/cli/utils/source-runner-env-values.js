/**
 * @typedef WPNDRunnerEnvValues
 * @property {string} [DOCKER_DEFAULT_PLATFORM]
 * @property {string} WPND_IMAGE_PORT
 * @property {string} DB_USER
 * @property {string} DB_NAME
 * @property {string} WPND_HOST_DIR_PATH
 * @property {string} DB_PASSWORD
 */

/**
 * @param {import('../global-options/config').WPNDConfig} config
 * @returns {WPNDRunnerEnvValues}
 */
const sourceRunnerEnvValues = (config) => ({
  WPND_IMAGE_PORT: String(config.environment.port),
  WPND_HOST_DIR_PATH: config.srcDir,
  DB_NAME: config.environment.db.name,
  DB_USER: config.environment.db.user,
  DB_PASSWORD: config.environment.db.password,
  ...(process.arch === 'arm64'
    ? {
        // see https://docs.docker.com/engine/reference/commandline/cli/#environment-variables
        DOCKER_DEFAULT_PLATFORM: 'linux/arm64',
      }
    : {}),
});

export default sourceRunnerEnvValues;
