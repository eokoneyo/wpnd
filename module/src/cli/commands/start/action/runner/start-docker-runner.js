import path from 'path';

import { execa } from 'execa';

import sourceRunnerEnvValues from '../../../../utils/source-runner-env-values.js';

const startDockerRunner = ({ parsedConfig, detached, verbose }) =>
  execa(
    'docker',
    [
      'compose',
      parsedConfig.name ? ['--project-name', parsedConfig.name] : null,
      ['--file', path.join(parsedConfig.distDir, 'stack.yml')],
      'up',
      [parsedConfig.environment.rebuildOnStart ? '--build' : null],
      [detached ? '--detach' : null],
      [verbose ? null : '--quiet-pull'],
    ]
      .flat()
      .filter(Boolean),
    {
      env: sourceRunnerEnvValues(parsedConfig),
      stdio: 'inherit',
    }
  );

export default startDockerRunner;
