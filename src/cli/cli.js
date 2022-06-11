import path from 'path';
import cpy from 'cpy';
import chalk from 'chalk';
import Listr from 'listr';
import { execa } from 'execa';
import { Command } from 'commander';
import { createRequire } from 'module';

import { programConfigFile } from './options.js';
import { extractValuesFromConfigFile } from './config/index.js';

const require = createRequire(import.meta.url);

// eslint-disable-next-line import/no-dynamic-require
const pkg = require(path.resolve(process.cwd(), './package.json'));

const program = new Command();

const hk = extractValuesFromConfigFile(program);

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
        task: () => Promise.resolve(true),
      },
    ]);

    tasks.run().catch((err) => {
      console.error(err);
    });
  })
  .action(async (options) => {
    const _options = {
      ...options,
      config: await hk(options.config),
    };

    await cpy('src/templates/*', _options.config.distDir);

    const runner = execa(
      'docker-compose',
      [
        ['--project-name', _options.config.name],
        [
          '--file',
          path.join(process.cwd(), _options.config.distDir, 'stack.yml'),
        ],
        'up',
        [_options.config.environment.rebuildOnStart ? '--build' : null],
      ]
        .flat()
        .filter(Boolean),
      {
        env: {
          WPND_IMAGE_NAME: _options.config.name,
          WPND_IMAGE_PORT: _options.config.environment.port,
          WPND_REMOVE_DEFAULT_WP_THEMES:
            _options.config.environment.removeDefaultWPThemes,
          WPND_HOST_DIR_PATH: _options.config.srcDir,
        },
      }
    );

    // setup handler to terminate runner using CTRL+C
    process.on('SIGINT', () => {
      // process.kill(runner.pid, 'SIGINT');
      runner.cancel();
    });

    runner.stdout.pipe(process.stdout);
    runner.stderr.pipe(process.stdout);
  });

program
  .command('shell')
  .description(
    'opens up a interactive tty terminal to the currently running wpnd app'
  )
  .action(() => {
    // TODO: Figure out how to get running container ID
    const disposableRunner = execa(
      'docker',
      ['exec', ['-it'], 'bash'].flatten()
    );

    disposableRunner.stdout.pipe(process.stdout);
    disposableRunner.stderr.pipe(process.stdout);
  });

program
  .command('destroy')
  .description('removes the created image for the configuration specified')
  .addOption(programConfigFile)
  .action(() => {
    // TODO: add implementation to remove created docker image
    program.error('Not Implemented');
  });

program
  .command('disposable')
  .description('Starts a disposable development environment')
  .addOption(programConfigFile)
  .action(() => {
    program.error('Not Implemented');

    // FIXME: add appropriate config to spin up the default wordpress docker image with no modifications

    // const disposableRunner = execa('docker', ['run', 'wordpress']);
    //
    // disposableRunner.stdout.pipe(process.stdout);
    // disposableRunner.stderr.pipe(process.stdout);
  });

async function cli(args) {
  await program.parseAsync(args);
}

export default cli;
