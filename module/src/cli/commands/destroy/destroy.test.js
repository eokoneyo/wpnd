import { Command } from 'commander';
import { expect, it, describe } from '@jest/globals';

import buildDestroyCommand from './destroy.js';

describe('destroy command', () => {
  it('returns an instance of command', () => {
    expect(buildDestroyCommand()).toBeInstanceOf(Command);
  });
});
