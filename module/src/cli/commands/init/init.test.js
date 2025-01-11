import { expect, it, describe } from '@jest/globals';
import { Command } from 'commander';

import buildInitCommand from './init.js';

describe('init command', () => {
  it('returns an instance of Command', () => {
    expect(buildInitCommand()).toBeInstanceOf(Command);
  });
});
