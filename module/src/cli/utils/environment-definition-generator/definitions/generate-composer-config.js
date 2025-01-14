import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

import { writeJsonFile } from 'write-json-file';

const requireFn = createRequire(import.meta.url);

/**
 *
 * @param {import('../../../global-options/config/index.js').WPNDConfig} parsedConfig
 * @returns {Promise<void>}
 */
const generateComposerConfig = (parsedConfig) => {
  const composerJsonTemplate = requireFn(
    path.resolve(
      fileURLToPath(
        new URL('../../../../templates/composer.json', import.meta.url).href
      )
    )
  );

  return writeJsonFile(
    path.join(parsedConfig.distDir, 'composer.json'),
    {
      ...composerJsonTemplate,
      require: parsedConfig.wpackagist,
    },
    { indent: 2 }
  );
};

export default generateComposerConfig;
