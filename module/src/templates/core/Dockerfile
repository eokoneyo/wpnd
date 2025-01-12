# only supported value is "inline-vol-mount"
ARG build_type

FROM wordpress:6.5.3-php8.1-apache AS base

COPY custom.ini* $PHP_INI_DIR/conf.d/

# include composer
COPY --from=composer/composer /usr/bin/composer /usr/bin/composer
# include generated composer file and install defined themes and plugins
ADD composer.json .

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

# passing the arg "build_type" with a value of "inline-vol-mount" provides a rudimentary hack to use this same dockerfile
# to package an image that could be outside of development
FROM base AS inline-vol-mount
COPY $WPND_HOST_DIR_PATH /usr/src/wpnd


FROM ${build_type:-base} as final

COPY entrypoint-child.sh /usr/bin/
RUN chmod +x /usr/bin/entrypoint-child.sh
ENTRYPOINT ["entrypoint-child.sh"]
