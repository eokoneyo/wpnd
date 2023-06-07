import path from 'path';

import { Command } from 'commander';
import { execa } from 'execa';

import configOption from '../../options/config/index.js';
import sourceRunnerEnvValues from '../../utils/source-runner-env-values.js';

const buildDestroyCommand = () => {
  const destroy = new Command('destroy');

  destroy
    .description('removes the created image for the configuration specified')
    .addOption(configOption)
    .action(async ({ config: parsedConfig }) => {
      const disposableRunner = execa(
        'docker',
        [
          'compose',
          parsedConfig.name
            ? ['--project-name', parsedConfig.name]
            : [
                '--file',
                path.join(process.cwd(), parsedConfig.distDir, 'stack.yml'),
              ],
          'down',
        ].flat(),
        {
          env: sourceRunnerEnvValues(parsedConfig),
        }
      );

      disposableRunner.stdout.pipe(process.stdout);
      disposableRunner.stderr.pipe(process.stderr);
    });

  return destroy;
};

export default buildDestroyCommand;
