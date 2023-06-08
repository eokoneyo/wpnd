import path from 'path';

import { execa } from 'execa';

import sourceRunnerEnvValues from '../../../../utils/source-runner-env-values.js';

const shellDockerRunner = (parsedConfig, service) =>
  execa(
    'podman-compose',
    [
      parsedConfig.name ? ['--project-name', parsedConfig.name] : null,
      ['--file', path.join(process.cwd(), parsedConfig.distDir, 'stack.yml')],
      'exec',
      service,
      ['bash'].concat(
        service === 'db'
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
