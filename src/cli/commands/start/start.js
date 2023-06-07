import path from 'path';
import * as url from 'url';
import { createRequire } from 'module';

import cpy from 'cpy';
import Listr from 'listr';
import { Command, Option } from 'commander';
import { writeJsonFile } from 'write-json-file';

import generateComposerConfig from '../../utils/generate-composer-config.js';

import startDockerRunner from './runner/start-docker-runner.js';
import startPodmanComposeRunner from './runner/start-podman-compose-runner.js';

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
    .hook('preAction', async (command, actionCommand) => {
      const { engine } = actionCommand.optsWithGlobals().config;

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
        command.error(e.message);
      }
    })
    .action(async function startActionHandler() {
      const {
        config: parsedConfig,
        detached,
        verbose,
      } = this.optsWithGlobals();

      await Promise.allSettled([
        cpy(
          path.join(
            path.dirname(url.fileURLToPath(import.meta.url)),
            '../../../templates/core/*'
          ),
          path.join(process.cwd(), parsedConfig.distDir)
        ),
        writeJsonFile(
          path.join(process.cwd(), parsedConfig.distDir, 'composer.json'),
          generateComposerConfig(parsedConfig.wpackagist),
          {
            indent: 2,
          }
        ),
      ]);

      /**
       * @type {(config: object) => import('execa').ExecaChildProcess}
       */
      let runnerFn;

      switch (parsedConfig.engine) {
        case 'podman': {
          runnerFn = startPodmanComposeRunner;
          break;
        }
        case 'docker': {
          runnerFn = startDockerRunner;
          break;
        }
        default: {
          start.error(
            `support for the engine ${parsedConfig.engine} is not implemented just yet`
          );
        }
      }

      const runner = runnerFn({
        parsedConfig,
        detached,
        verbose,
      });

      // setup handler to terminate runner using CTRL+C
      process.on(
        'SIGINT',
        () =>
          new Promise((resolve, reject) => {
            // send signal to cancel to our runner
            runner.cancel();

            runner.once('exit', () => {
              resolve(undefined);
            });

            runner.once('error', (err) => {
              reject(err);
            });
          })
      );

      runner.stdout.pipe(process.stdout);
      runner.stderr.pipe(process.stderr);
    });

  return start;
};

export default buildStartCommand;
