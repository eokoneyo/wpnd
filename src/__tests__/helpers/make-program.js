import { Command } from 'commander';

/**
 * @typedef makeProgramOptions
 * @property exitOverride [boolean]
 * @property suppressOutput [boolean]
 */

/**
 * @param options {makeProgramOptions}
 * @returns {import('commander').Command}
 */
export default function makeProgram(options = {}) {
  const program = new Command();

  // Configuration
  if (options?.exitOverride) {
    program.exitOverride();
  }

  if (options?.suppressOutput) {
    program.configureOutput({
      writeOut: () => {},
      writeErr: () => {},
    });
  }

  return program;
}
