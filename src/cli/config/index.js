import path from 'path';
import fs from 'fs/promises';
import { constants as FSConstants } from 'fs';
import { createRequire } from 'module';
import { validate } from 'schema-utils';
import merge from 'lodash.merge';

const require = createRequire(import.meta.url);

const defaultConfigOptions = {
  srcDir: 'src',
  distDir: '.wpnd', // cannot leave project directory
  environment: {
    port: 8085,
    removeDefaultWPThemes: false,
    skipDockerCheck: false,
    rebuildOnStart: false,
    db: {
      name: 'exampledb',
      user: 'exampleuser',
      password: 'examplepass',
    },
  },
};

const exposeConfigGetterForProgram =
  (program) => async (configFilePathProvided) => {
    // eslint-disable-next-line no-underscore-dangle
    let _configPath = configFilePathProvided;

    if (!/.json$/.test(_configPath)) {
      program.error('Specified Unsupported config file extension');
    }

    if (!/^\//.test(_configPath)) {
      _configPath = path.join(process.cwd(), configFilePathProvided);
    }

    try {
      await fs.access(_configPath, FSConstants.R_OK);
    } catch {
      program.error('Unable to find config file at path specified');
    }

    const configSchema = require('./config-schema.json');
    // eslint-disable-next-line import/no-dynamic-require
    const parsedConfig = require(_configPath);

    validate(configSchema, parsedConfig);

    return merge(defaultConfigOptions, parsedConfig);
  };

export default exposeConfigGetterForProgram;
