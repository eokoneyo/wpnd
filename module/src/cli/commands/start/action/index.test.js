import { jest, describe, it, expect, afterEach } from '@jest/globals';

jest.unstable_mockModule(
  '../../../utils/environment-definition-generator/definitions/provision-container-definition.js',
  () => ({
    default: jest.fn(() => Promise.resolve()),
  })
);

jest.unstable_mockModule(
  '../../../utils/environment-definition-generator/definitions/generate-composer-config.js',
  () => ({
    default: jest.fn(() => Promise.resolve()),
  })
);

const mockSpawnedProcess = {
  on: jest.fn(),
  once: jest.fn(),
  kill: jest.fn(),
  addListener: jest.fn(),
};

const mockShellDockerRunner = jest.fn(() => mockSpawnedProcess);
jest.unstable_mockModule('./runner/start-docker-runner.js', () => ({
  default: mockShellDockerRunner,
}));

const mockShellPodmanRunner = jest.fn(() => mockSpawnedProcess);
jest.unstable_mockModule('./runner/start-podman-compose-runner.js', () => ({
  default: mockShellPodmanRunner,
}));

// Absolutely needed to import the test subject in this manner because esm,
// see https://jestjs.io/docs/26.x/ecmascript-modules#differences-between-esm-and-commonjs
const startActionHandler = (await import('./index.js')).default;

describe('startActionHandler', () => {
  const defaultParsedConfig = {
    distDir: 'test-dist-dir',
    wpackagist: {},
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('calls the docker start runner when docker is the specified engine', async () => {
    const shellActionHandlerDocker = startActionHandler.bind({
      optsWithGlobals: () => ({
        parsedConfig: {
          ...defaultParsedConfig,
          engine: 'docker',
        },
      }),
    });

    await shellActionHandlerDocker();

    expect(mockShellPodmanRunner).not.toHaveBeenCalled();
    expect(mockShellDockerRunner).toHaveBeenCalled();
  });

  it('calls the podman start runner when podman is the specified engine', async () => {
    const shellActionHandlerPodman = startActionHandler.bind({
      optsWithGlobals: () => ({
        parsedConfig: { ...defaultParsedConfig, engine: 'podman' },
      }),
    });

    await shellActionHandlerPodman();

    expect(mockShellDockerRunner).not.toHaveBeenCalled();
    expect(mockShellPodmanRunner).toHaveBeenCalled();
  });
});
