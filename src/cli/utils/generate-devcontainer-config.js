import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

import { writeJsonFile } from 'write-json-file';

const requireFn = createRequire(import.meta.url);

const configWritePath = path.join(
  process.cwd(),
  '.devcontainer',
  'devcontainer.json'
);

const generateDevcontainerConfig = (config) => {
  const devcontainerJsonTemplate = requireFn(
    path.resolve(
      fileURLToPath(
        new URL('../../templates/devcontainer.json', import.meta.url).href
      )
    )
  );

  const updatedConfig = {
    ...devcontainerJsonTemplate,
    name: config.name,
    dockerComposeFile: path.join(
      path.relative(
        path.dirname(configWritePath),
        path.join(process.cwd(), config.distDir)
      ),
      'stack.yml'
    ),
    portAttributes: {
      [config.environment.port]: { label: 'Application Port' },
    },
  };

  return writeJsonFile(configWritePath, updatedConfig, { indent: 2 });
};

export default generateDevcontainerConfig;
