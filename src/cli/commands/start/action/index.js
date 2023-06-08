import path from 'path';
import url from 'url';

import cpy from 'cpy';
import { writeJsonFile } from 'write-json-file';

import generateComposerConfig from '../../../utils/generate-composer-config.js';

import startDockerRunner from './runner/start-docker-runner.js';
import startPodmanComposeRunner from './runner/start-podman-compose-runner.js';

/**
 * @this {import('commander').Command}
 * @returns {Promise<void>}
 */
async function startActionHandler() {
  const { config: parsedConfig, detached, verbose } = this.optsWithGlobals();

  await Promise.allSettled([
    cpy(
      path.join(
        path.dirname(url.fileURLToPath(import.meta.url)),
        '../../../templates/core/*'
      ),
      path.join(process.cwd(), parsedConfig.distDir)
    ),
    writeJsonFile(
      path.join(process.cwd(), parsedConfig.distDir, 'composer.json'),
      generateComposerConfig(parsedConfig.wpackagist),
      {
        indent: 2,
      }
    ),
  ]);

  /**
   * @type {(config: object) => import('execa').ExecaChildProcess}
   */
  let runnerFn;

  switch (parsedConfig.engine) {
    case 'podman': {
      runnerFn = startPodmanComposeRunner;
      break;
    }
    case 'docker': {
      runnerFn = startDockerRunner;
      break;
    }
    default: {
      this.error(
        `support for the engine ${parsedConfig.engine} is not implemented just yet`
      );
    }
  }

  const runner = runnerFn({
    parsedConfig,
    detached,
    verbose,
  });

  // setup handler to terminate runner using CTRL+C
  process.on(
    'SIGINT',
    () =>
      new Promise((resolve, reject) => {
        // send signal to cancel to our runner
        runner.cancel();

        runner.once('exit', () => {
          resolve(undefined);
        });

        runner.once('error', (err) => {
          reject(err);
        });
      })
  );

  runner.stdout.pipe(process.stdout);
  runner.stderr.pipe(process.stderr);
}

export default startActionHandler;
