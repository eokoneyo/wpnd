const fs = require('fs');
const path = require('path');
const { Volume } = require('memfs');
const { patchRequire } = require('fs-monkey');
const {execa} = require("execa");

const executeEntrypointChildScript = () => {
    // const entrypointChildScript = fs.read(path.resolve(__dirname, '../templates/core/entrypoint-child.sh'));

    execa(path.resolve(__dirname, '../templates/core/entrypoint-child.sh'))
}

describe('entrypoint child script', () => {
  beforeEach(() => {
    const mockedWPNDVolume = Volume.fromJSON(
      {
        'composer.json': JSON.stringify({}),
        'plugins/random-plugin/index.php': '<?php echo "hello world" ?>',
        'random-dir/one.txt': 'cowsaay',
      },
      '/usr/src/wpnd'
    );
  });

  it.todo('copies over only the defined allowed directories into the specified wordpress wp-content installation path');

  it.todo('copies over every file in the wpnd directory into the specified wordpress wp-content installation path');
});
