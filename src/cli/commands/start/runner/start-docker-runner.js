import path from 'path';

import randomWords from 'random-words';
import { execa } from 'execa';

const startDockerRunner = ({ parsedConfig, detached, verbose }) =>
  execa(
    'docker',
    [
      'compose',
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
      env: {
        WPND_IMAGE_NAME:
          parsedConfig.name ?? randomWords({ exactly: 3, join: '-' }),
        WPND_IMAGE_PORT: parsedConfig.environment.port,
        WPND_HOST_DIR_PATH: parsedConfig.srcDir,
        DB_NAME: parsedConfig.environment.db.name,
        DB_USER: parsedConfig.environment.db.user,
        DB_PASSWORD: parsedConfig.environment.db.password,
      },
    }
  );

export default startDockerRunner;
