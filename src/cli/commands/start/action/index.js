import path from 'path';


import provisionContainerDefinition from '../../../utils/provision-container-definition.js';
import generateComposerConfig from '../../../utils/generate-composer-config.js';

import startDockerRunner from './runner/start-docker-runner.js';
import startPodmanComposeRunner from './runner/start-podman-compose-runner.js';

/**
 * @this {import('commander').Command}
 * @returns {Promise<void>}
 */
async function startActionHandler() {
  const { parsedConfig, detached, verbose } = this.optsWithGlobals();

  await Promise.allSettled([
    provisionContainerDefinition(parsedConfig.distDir),
    generateComposerConfig(parsedConfig),
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
        runner.kill('SIGWINCH');

        runner.once('exit', () => {
          resolve(undefined);
        });

        runner.once('error', (err) => {
          reject(err);
        });
      })
  );
}

export default startActionHandler;
