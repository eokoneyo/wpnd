import { createRequire } from 'module';

import Listr from 'listr';
import { Command, Option } from 'commander';

import startActionHandler from './action/index.js';

const requireFn = createRequire(import.meta.url);

const nodeWhich = requireFn('which');

const buildStartCommand = () => {
  const start = new Command('start');

  start
    .description('Starts a project development environment')
    .addOption(
      new Option(
        '-d, --detached',
        'run container in standard docker compose detached mode'
      )
    )
    .hook('preAction', async (parentCommand, actionCommand) => {
      const { engine } = actionCommand.optsWithGlobals().parsedConfig;

      // TODO: handle error when specified engine is not available
      const tasks = new Listr([
        {
          title: 'Check Docker Status',
          enabled: () => engine === 'docker',
          task: () => nodeWhich('docker'),
        },
        {
          title: 'Check podman binary',
          enabled: () => engine === 'podman',
          task: (ctx, task) =>
            nodeWhich('podman-compose').catch(() => {
              ctx.podmanCompose = false;
              task.skip('podman-compose, not available');
            }),
        },
      ]);

      try {
        await tasks.run();
      } catch (e) {
        parentCommand.error(e.message);
      }
    })
    .action(startActionHandler);

  return start;
};

export default buildStartCommand;
