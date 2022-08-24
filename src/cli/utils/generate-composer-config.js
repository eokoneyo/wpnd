import url from 'url';
import path from 'path';

// eslint-disable-next-line import/no-dynamic-require,no-underscore-dangle
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const generateComposerConfig = (requireFn, userDefinedPackages) => {
  // eslint-disable-next-line import/no-dynamic-require
  const composerJsonTemplate = requireFn(
    path.join(__dirname, '../../templates/composer.json')
  );

  return {
    ...composerJsonTemplate,
    require: userDefinedPackages,
  };
};

export default generateComposerConfig;
