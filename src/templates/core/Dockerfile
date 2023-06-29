FROM wordpress:5.9.3-php8.0-apache

# include composer
COPY --from=composer/composer /usr/bin/composer /usr/bin/composer
# include generated composer file and install defined themes and plugins
ADD composer.json .
RUN composer install --no-autoloader --no-progress

# Add metadata (https://code.visualstudio.com/docs/devcontainers/containers#_inheriting-metadata) to provide hints to
# vscode if container gets attached, see https://code.visualstudio.com/docs/devcontainers/attach-container#_attached-container-configuration-reference for
# the subset of allowed options for an attached devcontainer
LABEL devcontainer.metadata='[{ \
  "extensions": [ \
    "xdebug.php-debug", \
    "bmewburn.vscode-intelephense-client", \
    "xdebug.php-pack", \
    "devsense.phptools-vscode" \
  ] \
}]'

COPY entrypoint-child.sh /usr/bin/
RUN chmod +x /usr/bin/entrypoint-child.sh
ENTRYPOINT ["entrypoint-child.sh"]
