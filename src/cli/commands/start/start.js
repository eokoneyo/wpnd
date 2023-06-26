import { createRequire } from 'module';

import { Listr } from 'listr2';
import { Command, Option } from 'commander';
import { execa } from 'execa';

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
    .addOption(
      new Option(
        '--code',
        'attach vscode to running container, leveraging its dev container feature'
      ).default(false)
    )
    .hook('preAction', async (parentCommand, actionCommand) => {
      const {
        code,
        parsedConfig: { engine },
      } = actionCommand.optsWithGlobals();

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
        {
          title: 'Check Code Binary',
          enabled: () => code === true,
          task: () => nodeWhich('code'),
        },
        {
          title: 'Check for remote container extension',
          enabled: () => code === true,
          task: async (ctx, task) => {
            const { stdout: result } = await execa('code', [
              '--list-extensions',
            ]);

            if (result.indexOf('ms-vscode-remote.remote-containers') < 0) {
              ctx.remoteContainers = false;
              task.skip('remote containers extension is not installed');
            }
          },
        },
        {
          title: 'Install remote container extension',
          skip: (ctx) => ctx.remoteContainers !== false,
          enabled: () => code === true,
          task: () =>
            execa('code', [
              '--install-extension',
              'ms-vscode-remote.remote-containers',
            ]),
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
