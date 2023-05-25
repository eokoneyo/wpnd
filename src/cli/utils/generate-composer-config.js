import { fileURLToPath } from 'url';
import path from 'path';

const generateComposerConfig = (requireFn, userDefinedPackages) => {
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
