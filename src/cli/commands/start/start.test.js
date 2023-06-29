import { expect, it, describe } from '@jest/globals';
import { Command } from 'commander';

import buildStartCommand from './start.js';

describe('start command', () => {
  it('returns an instance of Command', () => {
    expect(buildStartCommand()).toBeInstanceOf(Command);
  });
});
