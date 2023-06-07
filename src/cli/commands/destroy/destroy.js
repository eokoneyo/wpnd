import { Command } from 'commander';

import configOption from '../../options/config/index.js';

import destroyDockerRunner from './runner/destroy-docker-runner.js';

const buildDestroyCommand = () => {
  const destroy = new Command('destroy');

  destroy
    .description('removes the created image for the configuration specified')
    .addOption(configOption)
    .action(async ({ config: parsedConfig }) => {
      const disposableRunner = (
        parsedConfig.engine === 'docker' ? destroyDockerRunner : () => {}
      ).call(null, parsedConfig);

      disposableRunner.stdout.pipe(process.stdout);
      disposableRunner.stderr.pipe(process.stderr);
    });

  return destroy;
};

export default buildDestroyCommand;
