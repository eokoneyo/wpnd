import * as fs from 'fs';

import { Volume } from 'memfs';
import { ufs } from 'unionfs';
import { patchFs } from 'fs-monkey';
import { jest, expect, it, describe, beforeEach } from '@jest/globals';

import { resolveConfigValue } from './index.js';

describe('exposeConfigGetterForProgram', () => {
  let mergedFS;

  beforeEach(() => {
    // mock files definition
    const virtualFiles = {
      './invalid-config/wpnd.rc': JSON.stringify({}),
      './invalid-config/wrong-config-schema.json': JSON.stringify({
        randomProp: 'hello',
      }),
    };

    const vol = Volume.fromJSON(virtualFiles);

    mergedFS = ufs.use({ ...fs }).use(vol);
    patchFs(mergedFS);

    Object.entries(virtualFiles).map(([filePath, fileContents]) =>
      jest.mock(filePath, () => fileContents, { virtual: true })
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

  it('it should throw an error when the provided config file contains properties that are not defined in the config schema', () => {
    expect(() =>
      resolveConfigValue('./invalid-config/wrong-config-schema.json')
    ).toThrow();
  });
});
