import path from 'path';

import { execa } from 'execa';

import sourceRunnerEnvValues from '../../../../utils/source-runner-env-values.js';

const destroyDockerRunner = (parsedConfig) =>
  execa(
    'podman-compose',
    [
      parsedConfig.name ? ['--project-name', parsedConfig.name] : null,
      ['--file', path.join(parsedConfig.distDir, 'stack.yml')],
      'down',
    ].flat(),
    {
      env: sourceRunnerEnvValues(parsedConfig),
      stdio: 'inherit',
    }
  );

export default destroyDockerRunner;
