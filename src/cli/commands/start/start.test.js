import fs from 'fs';
import { createRequire } from 'node:module';

import {
  jest,
  expect,
  it,
  describe,
  afterEach,
  beforeEach,
} from '@jest/globals';
import { Volume } from 'memfs';
import { ufs } from 'unionfs';
import { patchFs, patchRequire } from 'fs-monkey';
import { Command } from 'commander';

import makeProgram from '../../../__tests__/helpers/make-program.js';

const require = createRequire(import.meta.url);

// mocked volume of files
const mockedVol = Volume.fromJSON({
  './test-config/wpnd.rc': JSON.stringify({}),
  './test-config/wrong-config-schema.json': JSON.stringify({
    randomProp: 'hello',
  }),
  './test-config/podman-config-schema.json': JSON.stringify({
    engine: 'podman',
  }),
});

Object.entries(mockedVol.toJSON()).map(([filePath, fileContents]) =>
  jest.mock(filePath, () => fileContents, { virtual: true })
);

const which = require('which');

// Absolutely needed to import this test subject after the cjs module in this manner because esm,
// see https://jestjs.io/docs/26.x/ecmascript-modules#differences-between-esm-and-commonjs
const buildStartCommand = (await import('./start.js')).default;

await describe('start command', () => {
  beforeEach(() => {
    const mergedFS = ufs.use({ ...fs }).use(mockedVol);

    patchFs(mergedFS);
    patchRequire(mergedFS);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns an instance of Command', () => {
    expect(buildStartCommand()).toBeInstanceOf(Command);
  });

  it.skip('exits on invoking the "start" program argument if docker is not installed in path', async () => {
    const exitSpy = jest.spyOn(process, 'exit').mockImplementation(jest.fn());

    which.mockImplementation(() =>
      Promise.reject(new Error('docker not found'))
    );

    const program = makeProgram({ suppressOutput: true }).addCommand(
      buildStartCommand()
    );

    await program.parseAsync(['start'], { from: 'user' });

    expect(exitSpy).toHaveBeenCalledWith(1);
    expect(which).toHaveBeenCalledWith('docker');

    exitSpy.mockRestore();
  });

  it.skip('tests for podman when config specifying podman is passed', async () => {
    const exitSpy = jest.spyOn(process, 'exit').mockImplementation(jest.fn());

    which.mockImplementation(() =>
      Promise.reject(new Error('podman not found'))
    );

    const program = makeProgram({ suppressOutput: true }).addCommand(
      buildStartCommand()
    );

    await program.parseAsync(
      ['start', '-c', './test-config/podman-config-schema.json'],
      { from: 'user' }
    );

    expect(exitSpy).toHaveBeenCalledWith(1);
    expect(which).toHaveBeenCalledWith('podman-compose');
  });
});
