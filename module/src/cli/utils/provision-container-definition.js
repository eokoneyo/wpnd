import path from 'path';
import url from 'url';

import cpy from 'cpy';

/**
 *
 * @param {string} distDir
 * @returns {Promise<void>}
 */
const provisionContainerDefinition = async (distDir) => {
  await cpy(
    path.join(
      path.dirname(url.fileURLToPath(import.meta.url)),
      '../../templates/core/*'
    ),
    path.join(distDir),
    {
      flat: true,
    }
  );
};

export default provisionContainerDefinition;
