import destroyPodmanRunner from './runner/destroy-podman-runner.js';
import destroyDockerRunner from './runner/destroy-docker-runner.js';

/**
 * @this {import('commander').Command}
 */
function destroyActionHandler() {
  const { parsedConfig } = this.optsWithGlobals();

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
      this.error(
        `support for the engine ${parsedConfig.engine} is not implemented just yet`
      );
    }
  }

  runnerFn(parsedConfig);
}

export default destroyActionHandler;
