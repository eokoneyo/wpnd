import provisionContainerDefinition from './definitions/provision-container-definition.js';
import generateComposerConfig from './definitions/generate-composer-config.js';

export default async function generateEnvironmentDefinition(parsedConfig) {
  return Promise.allSettled([
    provisionContainerDefinition(parsedConfig.distDir),
    generateComposerConfig(parsedConfig),
  ]);
}
