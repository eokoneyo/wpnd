import { createRequire } from 'node:module';

import { Command } from 'commander';
import { jest, expect, it, describe, afterEach } from '@jest/globals';

const require = createRequire(import.meta.url);

const which = require('which');

// Absolutely needed to import this test subject after the cjs module in this manner because esm,
// see https://jestjs.io/docs/26.x/ecmascript-modules#differences-between-esm-and-commonjs
const buildStartCommand = (await import('./start.js')).default;

await describe('start command', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns an instance of Command', () => {
    expect(buildStartCommand()).toBeInstanceOf(Command);
  });

  it('exits on invoking the "start" program argument if docker is not installed in path', async () => {
    const exitSpy = jest.spyOn(process, 'exit').mockImplementation(jest.fn());

    which.mockImplementation(() =>
      Promise.reject(new Error('docker not found'))
    );

    const program = new Command()
      .configureOutput({
        writeErr: jest.fn(),
        writeOut: jest.fn(),
      })
      .addCommand(buildStartCommand());

    await program.parseAsync(['start'], { from: 'user' });

    expect(exitSpy).toHaveBeenCalledWith(1);
    expect(which).toHaveBeenCalledWith('docker');
  });
});
