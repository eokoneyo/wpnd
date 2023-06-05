import path from 'path';
import * as url from 'url';
import { createRequire } from 'module';

import cpy from 'cpy';
import Listr from 'listr';
import { execa } from 'execa';
import { Command, Option } from 'commander';
import { writeJsonFile } from 'write-json-file';
import randomWords from 'random-words';

import generateComposerConfig from '../utils/generate-composer-config.js';

import programConfig from './options/config/index.js';
import showLogs from './options/logs.js';

const require = createRequire(import.meta.url);

const nodeWhich = require('which');

const buildStartCommand = () => {
  const start = new Command('start');

  start
    .description('Starts a project development environment')
    .addOption(programConfig)
    .addOption(showLogs)
    .addOption(
      new Option(
        '-d, --detached',
        'run container in standard docker compose detached mode'
      )
    )
    .hook('preAction', async (command) => {
      const tasks = new Listr([
        {
          title: 'Check Docker Status',
          enabled: command.opts().skipDockerCheck,
          task: () => nodeWhich('docker'),
        },
      ]);

      await tasks.run().catch((err) => {
        start.error(err.message);
      });
    })
    .action(async ({ config: parsedConfig, detached, verbose }) => {
      await Promise.allSettled([
        cpy(
          path.join(
            path.dirname(url.fileURLToPath(import.meta.url)),
            '../../templates/core/*'
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

      const runner = execa(
        'docker',
        [
          'compose',
          parsedConfig.name ? ['--project-name', parsedConfig.name] : null,
          [
            '--file',
            path.join(process.cwd(), parsedConfig.distDir, 'stack.yml'),
          ],
          'up',
          [parsedConfig.environment.rebuildOnStart ? '--build' : null],
          [detached ? '-d' : null],
          [verbose ? null : '--quiet-pull'],
        ]
          .flat()
          .filter(Boolean),
        {
          env: {
            WPND_IMAGE_NAME:
              parsedConfig.name ?? randomWords({ exactly: 3, join: '-' }),
            WPND_IMAGE_PORT: parsedConfig.environment.port,
            WPND_HOST_DIR_PATH: parsedConfig.srcDir,
            DB_NAME: parsedConfig.environment.db.name,
            DB_USER: parsedConfig.environment.db.user,
            DB_PASSWORD: parsedConfig.environment.db.password,
          },
        }
      );

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
