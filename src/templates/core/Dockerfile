FROM wordpress:5.9.3-php8.0-apache

# include composer
COPY --from=composer/composer /usr/bin/composer /usr/bin/composer
# include generated composer file and install defined themes and plugins
ADD composer.json .
RUN composer install --no-autoloader --no-progress

COPY custom.ini* $PHP_INI_DIR/conf.d/

COPY entrypoint-child.sh /usr/bin/
RUN chmod +x /usr/bin/entrypoint-child.sh
ENTRYPOINT ["entrypoint-child.sh"]
