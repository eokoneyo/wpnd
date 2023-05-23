import path from 'path';
import * as url from 'url';
import { createRequire } from 'module';

import chalk from 'chalk';
import { Command } from 'commander';

import buildStartCommand from './commands/start.js';
import buildDestroyCommand from './commands/destroy.js';
import buildShellCommand from './commands/shell.js';

const require = createRequire(import.meta.url);

// eslint-disable-next-line import/no-dynamic-require,no-underscore-dangle
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

// eslint-disable-next-line import/no-dynamic-require
const pkg = require(path.join(__dirname, '../../package.json'));

const program = new Command();

program
  .name('wpnd')
  .description('A CLI util for provisioning local wordpress dev environment')
  .version(pkg.version)
  .configureOutput({
    outputError(str, write) {
      return write(`${chalk.red.bold('ERROR')}: ${str}`);
    },
  })
  .addCommand(buildStartCommand())
  .addCommand(buildShellCommand())
  .addCommand(buildDestroyCommand())
  .showSuggestionAfterError();

async function cli(args) {
  await program.parseAsync(args);
}

export default cli;
