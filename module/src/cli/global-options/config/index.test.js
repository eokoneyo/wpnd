import * as fs from 'fs';
import path from 'node:path';

import { Volume } from 'memfs';
import { ufs } from 'unionfs';
import { patchFs } from 'fs-monkey';
import { InvalidArgumentError } from 'commander';
import { jest, expect, it, describe, beforeAll } from '@jest/globals';

import { resolveConfigValue } from './index.js';

describe('resolveConfigValue', () => {
  beforeAll(() => {
    // mocked volume of files
    const mockedVol = Volume.fromJSON({
      './invalid-config/wpnd.rc': JSON.stringify({}),
      './invalid-config/wrong-config-schema.json': JSON.stringify({
        randomProp: 'hello',
      }),
      './valid-config/wpnd.config.json': JSON.stringify({
        srcDir: '../workshop',
        distDir: '../containerDefinitions',
      }),
    });

    const mergedFS = ufs.use({ ...fs }).use(mockedVol);

    patchFs(mergedFS);

    Object.entries(mockedVol.toJSON()).map(([filePath, fileContents]) =>
      jest.mock(filePath, () => JSON.parse(fileContents), { virtual: true })
    );
  });

  it('should throw an error when an supported config file is provided', () => {
    expect(() => resolveConfigValue('./invalid-config/wpnd.rc')).toThrow();
  });

  it("it should throw an error when a path to some file that doesn't exist is provided", () => {
    expect(() =>
      resolveConfigValue('/non/existent/path/wpnd.config.json')
    ).toThrow();
  });

  it('should return config that resolves srcDir and distDir relative to the config file', () => {
    expect(
      resolveConfigValue('./valid-config/wpnd.config.json')
    ).toHaveProperty('srcDir', path.join(process.cwd(), 'workshop'));
  });

  it('it should throw an error when the provided config file contains properties that are not defined in the config schema', () => {
    expect(() =>
      resolveConfigValue('./invalid-config/wrong-config-schema.json')
    ).toThrow(InvalidArgumentError);
  });
});
