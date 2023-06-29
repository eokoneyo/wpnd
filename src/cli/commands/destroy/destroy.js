import { Command } from 'commander';

import destroyActionHandler from './action/index.js';

const buildDestroyCommand = () => {
  const destroy = new Command('destroy');

  destroy
    .description('removes the created image for the configuration specified')
    .action(destroyActionHandler);

  return destroy;
};

export default buildDestroyCommand;
