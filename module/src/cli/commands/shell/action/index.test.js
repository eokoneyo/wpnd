import { jest, describe, it, expect, afterEach } from '@jest/globals';

const mockShellDockerRunner = jest.fn();
jest.unstable_mockModule('./runner/shell-docker-runner.js', () => ({
  default: mockShellDockerRunner,
}));

const mockShellPodmanRunner = jest.fn();
jest.unstable_mockModule('./runner/shell-podman-runner.js', () => ({
  default: mockShellPodmanRunner,
}));

// Absolutely needed to import the test subject in this manner because esm,
// see https://jestjs.io/docs/26.x/ecmascript-modules#differences-between-esm-and-commonjs
const shellActionHandler = (await import('./index.js')).default;

describe('shellActionHandler', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('calls the docker shell runner when docker is the specified engine', () => {
    const shellActionHandlerDocker = shellActionHandler.bind({
      optsWithGlobals: () => ({
        parsedConfig: {
          engine: 'docker',
        },
      }),
    });

    shellActionHandlerDocker();

    expect(mockShellPodmanRunner).not.toHaveBeenCalled();
    expect(mockShellDockerRunner).toHaveBeenCalled();
  });

  it('calls the podman shell runner when podman is the specified engine', () => {
    const shellActionHandlerPodman = shellActionHandler.bind({
      optsWithGlobals: () => ({
        parsedConfig: {
          engine: 'podman',
        },
      }),
    });

    shellActionHandlerPodman();

    expect(mockShellDockerRunner).not.toHaveBeenCalled();
    expect(mockShellPodmanRunner).toHaveBeenCalled();
  });
});
