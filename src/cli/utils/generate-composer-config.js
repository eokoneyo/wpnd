import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

import { writeJsonFile } from 'write-json-file';

const requireFn = createRequire(import.meta.url);

const generateComposerConfig = (parsedConfig) => {
  const composerJsonTemplate = requireFn(
    path.resolve(
      fileURLToPath(
        new URL('../../templates/composer.json', import.meta.url).href
      )
    )
  );

  return writeJsonFile(
    path.join(process.cwd(), parsedConfig.distDir, 'composer.json'),
    {
      ...composerJsonTemplate,
      require: parsedConfig.wpackagist,
    },
    { indent: 2 }
  );
};

export default generateComposerConfig;
