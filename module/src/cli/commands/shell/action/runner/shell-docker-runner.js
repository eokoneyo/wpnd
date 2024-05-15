import path from 'path';

import { execa } from 'execa';

import sourceRunnerEnvValues from '../../../../utils/source-runner-env-values.js';

const shellDockerRunner = (parsedConfig, serviceName) =>
  execa(
    'docker',
    [
      'compose',
      parsedConfig.name
        ? ['--project-name', parsedConfig.name]
        : ['--file', path.join(parsedConfig.distDir, 'stack.yml')],
      'exec',
      serviceName,
      ['bash'].concat(
        serviceName === 'db'
          ? [
              '-c',
              `mysql -u${parsedConfig.environment.db.user} -p${parsedConfig.environment.db.password}`,
            ]
          : []
      ),
    ].flat(),
    {
      env: sourceRunnerEnvValues(parsedConfig),
      stdio: 'inherit',
    }
  );

export default shellDockerRunner;
