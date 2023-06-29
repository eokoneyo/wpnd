import shellDockerRunner from './runner/shell-docker-runner.js';
import shellPodmanRunner from './runner/shell-podman-runner.js';

/**
 * @this {import('commander').Command}
 */
function shellActionHandler() {
  const { parsedConfig, service } = this.optsWithGlobals();

  /**
   * @type {(config: object, service: string) => import('execa').ExecaChildProcess}
   */
  let runnerFn;

  switch (parsedConfig.engine) {
    case 'podman': {
      runnerFn = shellPodmanRunner;
      break;
    }
    case 'docker': {
      runnerFn = shellDockerRunner;
      break;
    }
    default: {
      this.error(
        `support for the engine ${parsedConfig.engine} is not implemented just yet`
      );
    }
  }

  runnerFn(parsedConfig, service);
}

export default shellActionHandler;
