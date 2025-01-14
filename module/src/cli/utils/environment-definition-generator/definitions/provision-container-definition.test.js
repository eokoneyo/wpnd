import { jest, describe, it, expect } from '@jest/globals';

const mockCpy = jest.fn(() => Promise.resolve());
jest.unstable_mockModule('cpy', () => ({
  default: mockCpy,
}));

const provisionContainerDefinition = (
  await import('./provision-container-definition.js')
).default;

describe('provisionContainerDefinition', () => {
  it('invocation to cpy module that provisions the container definition files matches our expectation', async () => {
    const distDir = 'some-test-dir';

    await provisionContainerDefinition(distDir);

    expect(mockCpy).toHaveBeenCalledTimes(1);
    expect(mockCpy).toHaveBeenCalledWith(
      expect.stringMatching('templates/core/*'),
      expect.stringMatching(new RegExp(String.raw`${'some-test-dir'}$`)),
      { flat: true }
    );
  });
});
