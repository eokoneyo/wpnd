import path from 'path';

import { Command } from 'commander';
import { execa } from 'execa';

import exposeConfigGetterForProgram from '../config/index.js';
import { programConfigFile } from '../options.js';

const buildDestroyCommand = () => {
  const destroy = new Command('destroy');

  destroy
    .description('removes the created image for the configuration specified')
    .addOption(programConfigFile)
    .action(async (options) => {
      const parsedConfig = await exposeConfigGetterForProgram(
        options.config
      ).catch((error) => destroy.error(error.message));

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
        ].flat()
      );

      disposableRunner.stdout.pipe(process.stdout);
      disposableRunner.stderr.pipe(process.stderr);
    });

  return destroy;
};

export default buildDestroyCommand;
