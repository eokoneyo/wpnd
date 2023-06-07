import { Command, Option } from 'commander';

import shellDockerRunner from './runner/shell-docker-runner.js';
import shellPodmanRunner from './runner/shell-podman-runner.js';

const buildShellCommand = () => {
  const shell = new Command('shell');

  shell
    .description(
      'opens up a interactive tty to the services the currently running wpnd app is composed of'
    )
    .addOption(
      new Option(
        '-s, --service <type>',
        'service for a which shell access should be created to'
      )
        .choices(['wordpress', 'db'])
        .default('wordpress')
    )
    .action(async function shellActionHandler() {
      const { config: parsedConfig, service } = this.optsWithGlobals();

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
          shell.error(
            `support for the engine ${parsedConfig.engine} is not implemented just yet`
          );
        }
      }

      runnerFn(parsedConfig, service);
    });

  return shell;
};

export default buildShellCommand;
