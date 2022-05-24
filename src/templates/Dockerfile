FROM wordpress:5.9.3-php8.0-apache

# remove pre-existing themes and include our own default parent theme
RUN rm -R $(ls -1 -d /usr/src/wordpress/wp-content/themes/*)

COPY custom.ini* $PHP_INI_DIR/conf.d/
