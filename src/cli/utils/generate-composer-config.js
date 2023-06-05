import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const requireFn = createRequire(import.meta.url);

const generateComposerConfig = (userDefinedPackages) => {
  const composerJsonTemplate = requireFn(
    path.resolve(
      fileURLToPath(
        new URL('../../templates/composer.json', import.meta.url).href
      )
    )
  );

  return {
    ...composerJsonTemplate,
    require: userDefinedPackages,
  };
};

export default generateComposerConfig;
