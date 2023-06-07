import { Command, Option } from 'commander';

import configOption from '../../options/config/index.js';

import shellDockerRunner from './runner/shell-docker-runner.js';

const buildShellCommand = () => {
  const shell = new Command('shell');

  shell
    .description(
      'opens up a interactive tty to the services the currently running wpnd app is composed of'
    )
    .addOption(configOption)
    .addOption(
      new Option(
        '-s, --service <type>',
        'service for a which shell access should be created to'
      )
        .choices(['wordpress', 'db'])
        .default('wordpress')
    )
    .action(async ({ config: parsedConfig, service }) => {
      (parsedConfig.engine === 'docker' ? shellDockerRunner : () => {}).apply(
        null,
        [parsedConfig, service]
      );
    });

  return shell;
};

export default buildShellCommand;
