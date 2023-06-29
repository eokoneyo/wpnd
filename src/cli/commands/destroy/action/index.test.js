import { jest, describe, it, expect, afterEach } from '@jest/globals';

const mockDestroyDockerRunner = jest.fn();
jest.unstable_mockModule('./runner/destroy-docker-runner.js', () => ({
  default: mockDestroyDockerRunner,
}));

const mockDestroyPodmanRunner = jest.fn();
jest.unstable_mockModule('./runner/destroy-podman-runner.js', () => ({
  default: mockDestroyPodmanRunner,
}));

// Absolutely needed to import the test subject in this manner because esm,
// see https://jestjs.io/docs/26.x/ecmascript-modules#differences-between-esm-and-commonjs
const destroyActionHandler = (await import('./index.js')).default;

describe('shellActionHandler', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('calls the docker shell runner when docker is the specified engine', () => {
    const shellActionHandlerDocker = destroyActionHandler.bind({
      optsWithGlobals: () => ({
        parsedConfig: {
          engine: 'docker',
        },
      }),
    });

    shellActionHandlerDocker();

    expect(mockDestroyPodmanRunner).not.toHaveBeenCalled();
    expect(mockDestroyDockerRunner).toHaveBeenCalled();
  });

  it('calls the podman shell runner when podman is the specified engine', () => {
    const shellActionHandlerPodman = destroyActionHandler.bind({
      optsWithGlobals: () => ({
        parsedConfig: {
          engine: 'podman',
        },
      }),
    });

    shellActionHandlerPodman();

    expect(mockDestroyDockerRunner).not.toHaveBeenCalled();
    expect(mockDestroyPodmanRunner).toHaveBeenCalled();
  });
});
