import { execa } from 'execa';
import { Command, Option } from 'commander';
import path from 'path';
import { programConfigFile } from '../options.js';
import exposeConfigGetterForProgram from '../config/index.js';

const buildShellCommand = () => {
  const shell = new Command('shell');

  shell
    .description(
      'opens up a interactive tty to the services the currently running wpnd app is composed of'
    )
    .addOption(programConfigFile)
    .addOption(
      new Option(
        '-s, --service <type>',
        'service for a which shell access should be created to'
      )
        .choices(['wordpress', 'db'])
        .default('wordpress')
    )
    .action(async (options) => {
      const parsedConfig = await exposeConfigGetterForProgram(
        options.config
      ).catch((error) => shell.error(error.message));

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
          options.service,
          ['bash'].concat(
            options.service === 'db'
              ? [
                  '-c',
                  `mysql -u${parsedConfig.environment.db.user} -p${parsedConfig.environment.db.password}`,
                ]
              : []
          ),
        ].flat(),
        {
          stdio: 'inherit',
        }
      );
    });

  return shell;
};

export default buildShellCommand;
