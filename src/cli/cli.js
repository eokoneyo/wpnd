import * as url from 'url';
import path from 'path';
import cpy from 'cpy';
import chalk from 'chalk';
import Listr from 'listr';
import which from 'which';
import { execa } from 'execa';
import { Command, Option } from 'commander';
import { createRequire } from 'module';
import { writeJsonFile } from 'write-json-file';

import programConfigFile from './options.js';
import generateComposerConfig from './utils/generate-composer-config.js';
import exposeConfigGetterForProgram from './config/index.js';

const require = createRequire(import.meta.url);

// eslint-disable-next-line import/no-dynamic-require,no-underscore-dangle
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

// eslint-disable-next-line import/no-dynamic-require
const pkg = require(path.join(__dirname, '../../package.json'));

const program = new Command();

const extractValuesFromConfigFile = exposeConfigGetterForProgram(program);

program
  .name('wpnd')
  .description('A CLI util for provisioning local wordpress dev environment')
  .version(pkg.version)
  .configureOutput({
    outputError(str, write) {
      return write(`${chalk.red.bold('ERROR')}: ${str}`);
    },
  })
  .showSuggestionAfterError();

program
  .command('start')
  .description('Starts a project development environment')
  .addOption(programConfigFile)
  .addOption(
    new Option(
      '-d, --detached',
      'run container in standard docker compose detached mode'
    )
  )
  .hook('preAction', (command) => {
    const tasks = new Listr([
      {
        title: 'Check Docker Status',
        enabled: command.opts().skipDockerCheck,
        task: () =>
          which('docker', (err) => {
            if (err) {
              throw new Error('Docker is not available in PATH');
            }
          }),
      },
    ]);

    tasks.run().catch((err) => {
      program.error(err.message);
    });
  })
  .action(async (options) => {
    const parsedConfig = await extractValuesFromConfigFile(options.config);

    await Promise.allSettled([
      cpy(
        path.join(__dirname, '../templates/core/*'),
        path.join(process.cwd(), parsedConfig.distDir)
      ),
      writeJsonFile(
        path.join(process.cwd(), parsedConfig.distDir, 'composer.json'),
        generateComposerConfig(require, parsedConfig.wpackagist),
        {
          indent: 2,
        }
      ),
    ]);

    const runner = execa(
      'docker',
      [
        'compose',
        ['--project-name', parsedConfig.name],
        ['--file', path.join(process.cwd(), parsedConfig.distDir, 'stack.yml')],
        'up',
        [parsedConfig.environment.rebuildOnStart ? '--build' : null],
        [options.detached ? '-d' : null],
      ]
        .flat()
        .filter(Boolean),
      {
        env: {
          WPND_IMAGE_NAME: parsedConfig.name,
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

program
  .command('shell')
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
    const parsedConfig = await extractValuesFromConfigFile(options.config);

    execa(
      'docker',
      [
        'compose',
        ['--project-name', parsedConfig.name],
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

program
  .command('destroy')
  .description('removes the created image for the configuration specified')
  .addOption(programConfigFile)
  .action(async (options) => {
    const parsedConfig = await extractValuesFromConfigFile(options.config);

    const disposableRunner = execa(
      'docker',
      ['compose', ['--project-name', parsedConfig.name], 'down'].flat()
    );

    disposableRunner.stdout.pipe(process.stdout);
    disposableRunner.stderr.pipe(process.stderr);
  });

async function cli(args) {
  await program.parseAsync(args);
}

export default cli;
