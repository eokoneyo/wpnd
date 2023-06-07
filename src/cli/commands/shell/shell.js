import path from 'path';

import { execa } from 'execa';
import { Command, Option } from 'commander';

import configOption from '../../options/config/index.js';
import sourceRunnerEnvValues from '../../utils/source-runner-env-values.js';

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
      execa(
        'docker',
        [
          'compose',
          parsedConfig.name
            ? ['--project-name', parsedConfig.name]
            : [
                '--file',
                path.join(process.cwd(), parsedConfig.distDir, 'stack.yml'),
              ],
          'exec',
          service,
          ['bash'].concat(
            service === 'db'
              ? [
                  '-c',
                  `mysql -u${parsedConfig.environment.db.user} -p${parsedConfig.environment.db.password}`,
                ]
              : []
          ),
        ].flat(),
        {
          env: sourceRunnerEnvValues(parsedConfig),
          stdio: 'inherit',
        }
      );
    });

  return shell;
};

export default buildShellCommand;
