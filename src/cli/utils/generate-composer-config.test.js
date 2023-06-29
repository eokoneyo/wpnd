import { jest, describe, it, expect } from '@jest/globals';

const mockWriteJsonFile = jest.fn(() => Promise.resolve());
jest.unstable_mockModule('write-json-file', () => ({
  writeJsonFile: mockWriteJsonFile,
}));

const generateComposerConfig = (await import('./generate-composer-config.js'))
  .default;

describe('generateComposerConfig', () => {
  it('writes the composer config to the correct path', async () => {
    const config = {
      distDir: 'some-test-dir',
      wpackagist: {},
    };

    await generateComposerConfig(config);

    expect(mockWriteJsonFile).toHaveBeenCalledTimes(1);
    expect(mockWriteJsonFile).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        require: config.wpackagist,
      }),
      { indent: 2 }
    );
  });
});
