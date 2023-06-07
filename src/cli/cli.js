import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

import chalk from 'chalk';
import { Command } from 'commander';

import buildStartCommand from './commands/start/start.js';
import buildDestroyCommand from './commands/destroy/destroy.js';
import buildShellCommand from './commands/shell/shell.js';

const require = createRequire(import.meta.url);

// eslint-disable-next-line import/no-dynamic-require
const pkg = require(path.resolve(
  fileURLToPath(new URL('../../package.json', import.meta.url).href)
));

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
