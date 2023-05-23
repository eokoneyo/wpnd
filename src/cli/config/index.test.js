import * as fs from 'fs';

import { Volume } from 'memfs';
import { ufs } from 'unionfs';
import { patchFs } from 'fs-monkey';
import { jest, expect, it, describe, beforeEach } from '@jest/globals';

import exposeConfigGetterForProgram from './index.js';

describe('exposeConfigGetterForProgram', () => {
  let mergedFS;

  beforeEach(() => {
    // mock files definition
    const virtualFiles = {
      './invalid-config/wpnd.rc': JSON.stringify({}),
    };

    const vol = Volume.fromJSON(virtualFiles);

    mergedFS = ufs.use({ ...fs }).use(vol);
    patchFs(mergedFS);

    Object.entries(virtualFiles).map(([filePath, fileContents]) =>
      jest.mock(filePath, () => fileContents, { virtual: true })
    );
  });

  it('should throw an error when an supported config file is provided', () => {
    expect(
      exposeConfigGetterForProgram('./invalid-config/wpnd.rc')
    ).rejects.toThrow();
  });

  it("it should throw an error when a path to some file that doesn't exist is provided", () => {
    expect(
      exposeConfigGetterForProgram('/non/existent/path/wpnd.config.json')
    ).rejects.toThrow();
  });

  it('it should return the default config object if the config file path passed is falsy', () => {
    expect(exposeConfigGetterForProgram(null)).resolves.toMatchSnapshot();
  });
});
