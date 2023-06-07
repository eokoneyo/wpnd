import { Command } from 'commander';

import destroyDockerRunner from './runner/destroy-docker-runner.js';
import destroyPodmanRunner from './runner/destroy-podman-runner.js';

const buildDestroyCommand = () => {
  const destroy = new Command('destroy');

  destroy
    .description('removes the created image for the configuration specified')
    .action(async function destroyActionHandler() {
      const { config: parsedConfig } = this.optsWithGlobals();
      /**
       * @type {(config: object) => import('execa').ExecaChildProcess}
       */
      let runnerFn;

      switch (parsedConfig.engine) {
        case 'podman': {
          runnerFn = destroyPodmanRunner;
          break;
        }
        case 'docker': {
          runnerFn = destroyDockerRunner;
          break;
        }
        default: {
          destroy.error(
            `support for the engine ${parsedConfig.engine} is not implemented just yet`
          );
        }
      }

      const disposableRunner = runnerFn(parsedConfig);

      disposableRunner.stdout.pipe(process.stdout);
      disposableRunner.stderr.pipe(process.stderr);
    });

  return destroy;
};

export default buildDestroyCommand;
