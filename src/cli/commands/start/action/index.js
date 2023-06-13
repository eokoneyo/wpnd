import path from 'path';

import { execa } from 'execa';
import pRetry from 'p-retry';

import provisionContainerDefinition from '../../../utils/provision-container-definition.js';
import generateComposerConfig from '../../../utils/generate-composer-config.js';
import generateDevcontainerConfig from '../../../utils/generate-devcontainer-config.js';
import sourceRunnerEnvValues from '../../../utils/source-runner-env-values.js';

import startDockerRunner from './runner/start-docker-runner.js';
import startPodmanComposeRunner from './runner/start-podman-compose-runner.js';

/**
 * @link https://github.com/microsoft/vscode-remote-release/issues/5278#issuecomment-1408712695
 * @param containerNameOrID
 * @param pathString
 * @returns {`vscode-remote://attached-container+${string}${string}`}
 */
const generateVSCodeAttachToContainerConnectionString = (
  containerNameOrID,
  pathString
) =>
  `vscode-remote://attached-container+${Buffer.from(containerNameOrID).toString(
    'hex'
  )}${pathString}`;

/**
 * @this {import('commander').Command}
 * @returns {Promise<void>}
 */
async function startActionHandler() {
  const { parsedConfig, detached, verbose, code } = this.optsWithGlobals();

  await Promise.allSettled(
    [
      provisionContainerDefinition(parsedConfig.distDir),
      generateComposerConfig(parsedConfig),
      code ? generateDevcontainerConfig(parsedConfig) : null,
    ].filter(Boolean)
  );

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

  runner.addListener('spawn', async () => {
    if (code) {
      await pRetry(
        async () => {
          const { stdout } = await execa(
            parsedConfig.engine === 'docker' ? 'docker' : 'podman',
            [
              parsedConfig.engine === 'docker' ? 'compose' : null,
              parsedConfig.name ? ['--project-name', parsedConfig.name] : null,
              [
                '--file',
                path.join(process.cwd(), parsedConfig.distDir, 'stack.yml'),
              ],
              'ps',
              ['--filter', 'status=running'],
              ['--format', 'json'],
            ]
              .flat()
              .filter(Boolean)
          );

          const queryResult = JSON.parse(stdout);

          if (!queryResult) {
            throw new Error('Container still starting up');
          }

          const [wordpressContainer] = queryResult.filter(
            (resultItem) => resultItem.Service === 'wordpress'
          );

          if (wordpressContainer) {
            execa(
              'code',
              [
                '--folder-uri',
                generateVSCodeAttachToContainerConnectionString(
                  wordpressContainer.Name,
                  '/var/www/html'
                ),
              ],
              {
                env: {
                  ...sourceRunnerEnvValues(parsedConfig),
                  COMPOSE_PROJECT_NAME: parsedConfig.name,
                },
              }
            );
          }
        },
        { retries: 20 }
      );
    }
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
