# only supported value is "inlinemount"
ARG build_type
ARG WPND_HOST_DIR_PATH

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

# passing the arg "build_type" with a value of "inlinemount" provides a rudimentary hack to use this same dockerfile
# to package an image that could be outside of development
FROM base AS inlinemount
COPY ${WPND_HOST_DIR_PATH:-wp-content} /usr/src/wpnd


FROM ${build_type:-base} AS final

COPY entrypoint-child.sh /usr/bin/
RUN chmod +x /usr/bin/entrypoint-child.sh
ENTRYPOINT ["entrypoint-child.sh"]
