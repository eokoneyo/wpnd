import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

import chalk from 'chalk';
import { Command } from 'commander';

import buildInitCommand from './commands/init/init.js';
import buildStartCommand from './commands/start/start.js';
import buildDestroyCommand from './commands/destroy/destroy.js';
import buildShellCommand from './commands/shell/shell.js';
import configOption, {
  resolveConfigValue,
} from './global-options/config/index.js';

const requireFn = createRequire(import.meta.url);

const pkg = requireFn(
  path.resolve(
    fileURLToPath(new URL('../../package.json', import.meta.url).href)
  )
);

const program = new Command();

program
  .name('wpnd')
  .description('A CLI util for provisioning local wordpress dev environment')
  .version(pkg.version)
  .addOption(configOption)
  .hook('preSubcommand', (thisCommand) => {
    const { config: configPath } = thisCommand.opts();
    thisCommand.setOptionValue('parsedConfig', resolveConfigValue(configPath));
  })
  .addCommand(buildInitCommand())
  .addCommand(buildStartCommand())
  .addCommand(buildShellCommand())
  .addCommand(buildDestroyCommand())
  .showSuggestionAfterError()
  .configureOutput({
    outputError(str, write) {
      return write(`${chalk.red.bold('ERROR')}: ${str}`);
    },
  });

async function cli(args) {
  await program.parseAsync(args);
}

export default cli;
