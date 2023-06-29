import { Command } from 'commander';
import { expect, it, describe } from '@jest/globals';

import buildShellCommand from './shell.js';

describe('shell command', () => {
  it('returns an instance of command', () => {
    expect(buildShellCommand()).toBeInstanceOf(Command);
  });
});
