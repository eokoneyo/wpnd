import path from 'path';
import { createRequire } from 'module';
import fs, { constants as FSConstants } from 'fs';

import merge from 'lodash.merge';
import { validate } from 'schema-utils';
import { Option, InvalidArgumentError } from 'commander';

const require = createRequire(import.meta.url);

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

export const resolveConfigValue = (configFilePath) => {
  if (!/.json$/.test(configFilePath)) {
    throw new InvalidArgumentError('Unsupported config file extension');
  }

  const isConfigPathAbsolute = /^\//.test(configFilePath);

  const configPath = path.join.apply(
    null,
    [isConfigPathAbsolute ? null : process.cwd(), configFilePath].filter(
      Boolean
    )
  );

  try {
    fs.accessSync(configPath, FSConstants.R_OK);

    const configSchema = require('./schema.json');

    // eslint-disable-next-line import/no-dynamic-require
    const parsedConfig = require(configPath);

    validate(configSchema, parsedConfig);

    return merge(defaultConfigOptions, parsedConfig);
  } catch (e) {
    if (e.code === 'ENOENT') {
      throw new InvalidArgumentError(
        'Unable to find config file at path specified'
      );
    }

    throw new InvalidArgumentError('schema mismatch issues');
  }
};

const programConfig = new Option('-c,--config [file]', 'path to config file')
  .default(defaultConfigOptions)
  .argParser((value) => resolveConfigValue(value));

export default programConfig;
