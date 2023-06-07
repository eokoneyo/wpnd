import path from 'path';

import { execa } from 'execa';

import sourceRunnerEnvValues from '../../../utils/source-runner-env-values.js';

const startPodmanComposeRunner = ({ parsedConfig, detached, verbose }) =>
  execa(
    'podman-compose',
    [
      parsedConfig.name ? ['--project-name', parsedConfig.name] : null,
      ['--file', path.join(process.cwd(), parsedConfig.distDir, 'stack.yml')],
      'up',
      [parsedConfig.environment.rebuildOnStart ? '--build' : null],
      [detached ? '-d' : null],
      [verbose ? null : '--quiet-pull'],
    ]
      .flat()
      .filter(Boolean),
    {
      env: sourceRunnerEnvValues(parsedConfig),
    }
  );

export default startPodmanComposeRunner;
