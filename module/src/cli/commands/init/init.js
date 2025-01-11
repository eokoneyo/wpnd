import { Command } from 'commander';

import provisionContainerDefinition from '../../utils/provision-container-definition.js';

export async function initializationHandler() {
  const { parsedConfig } = this.optsWithGlobals();

  await provisionContainerDefinition(parsedConfig.distDir);
}

const buildInitCommand = () => {
  const init = new Command('init');

  init
    .description(
      'Initialize container definition for local wordpress dev environment'
    )
    .action(initializationHandler);

  return init;
};

export default buildInitCommand;
