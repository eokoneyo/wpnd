import path from 'path';
import fs from 'fs/promises';
import { constants as FSConstants } from 'fs';
import { createRequire } from 'module';
import { validate } from 'schema-utils';
import merge from 'lodash.merge';

const require = createRequire(import.meta.url);

class ConfigResolutionError extends Error {
  constructor(message) {
    super(message); // (1)
    this.name = 'ConfigResolutionError'; // (2)
  }
}

const defaultConfigOptions = {
  srcDir: 'src',
  distDir: '.wpnd', // cannot leave project directory
  environment: {
    port: 8085,
    skipDockerCheck: false,
    rebuildOnStart: false,
    db: {
      name: 'exampledb',
      user: 'exampleuser',
      password: 'examplepass',
    },
  },
};

/**
 *
 * @param configFilePathProvided
 * @param acceptDefault
 * @returns {Promise<unknown>}
 */
const exposeConfigGetterForProgram = (
  configFilePathProvided,
  { acceptDefault } = { acceptDefault: true }
) =>
  new Promise((resolve, reject) => {
    if (!configFilePathProvided && acceptDefault) {
      resolve(defaultConfigOptions);
    }

    if (!configFilePathProvided && !acceptDefault) {
      reject(new ConfigResolutionError('Missing required config file'));
    }

    if (!/.json$/.test(configFilePathProvided)) {
      reject(new ConfigResolutionError('Unsupported config file extension'));
    }

    const isConfigPathAbsolute = /^\//.test(configFilePathProvided);

    // eslint-disable-next-line no-underscore-dangle
    const _configPath = path.join.apply(
      null,
      [
        isConfigPathAbsolute ? null : process.cwd(),
        configFilePathProvided,
      ].filter(Boolean)
    );

    fs.access(_configPath, FSConstants.R_OK)
      .then(() => {
        const configSchema = require('./config-schema.json');

        // eslint-disable-next-line import/no-dynamic-require
        const parsedConfig = require(_configPath);

        validate(configSchema, parsedConfig);

        return resolve(merge(defaultConfigOptions, parsedConfig));
      })
      .catch(() => {
        reject(
          new ConfigResolutionError(
            'Unable to find config file at path specified'
          )
        );
      });
  });

export default exposeConfigGetterForProgram;
