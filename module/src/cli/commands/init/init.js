import { Command } from 'commander';

import generateEnvironmentDefinition from '../../utils/environment-definition-generator/generator.js';

export async function initializationHandler() {
  const { parsedConfig } = this.optsWithGlobals();

  await generateEnvironmentDefinition(parsedConfig);
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
