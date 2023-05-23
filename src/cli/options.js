import { Option } from 'commander';

const defaultConfigFile = 'wpnd.config.json';

export const programConfigFile = new Option(
  '-c,--config <file>',
  'path to config file'
).default(defaultConfigFile);

export const showLogs = new Option('-v, --verbose', 'show docker logs').default(
  false
);
