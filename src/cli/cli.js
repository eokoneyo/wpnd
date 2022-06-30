import * as url from 'url';
import path from 'path';
import cpy from 'cpy';
import chalk from 'chalk';
import Listr from 'listr';
import which from 'which';
import { execa } from 'execa';
import { Command } from 'commander';
import { createRequire } from 'module';

import programConfigFile from './options.js';
import exposeConfigGetterForProgram from './config/index.js';

const require = createRequire(import.meta.url);

// eslint-disable-next-line import/no-dynamic-require,no-underscore-dangle
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

// eslint-disable-next-line import/no-dynamic-require
const pkg = require(path.resolve(__dirname, '../../package.json'));

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

    await cpy(
      path.join(__dirname, '../templates/*'),
      path.join(process.cwd(), parsedConfig.distDir)
    );

    const runner = execa(
      'docker',
      [
        'compose',
        ['--project-name', parsedConfig.name],
        ['--file', path.join(process.cwd(), parsedConfig.distDir, 'stack.yml')],
        'up',
        [parsedConfig.environment.rebuildOnStart ? '--build' : null],
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
    process.on('SIGINT', () => {
      runner.cancel();
    });

    runner.stdout.pipe(process.stdout);
    runner.stderr.pipe(process.stderr);
  });

program
  .command('shell')
  .description(
    'opens up a interactive tty terminal to the currently running wpnd app'
  )
  .addOption(programConfigFile)
  .action(async (options) => {
    const parsedConfig = await extractValuesFromConfigFile(options.config);

    execa(
      'docker',
      [
        'compose',
        ['--project-name', parsedConfig.name],
        'exec',
        'wordpress',
        'bash',
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
